// How the site runs on Vercel: each /api route is a thin entry over its
// handler in server/, the context those handlers get comes from Vercel's
// headers, the middleware negotiates markdown, and vercel.json keeps the
// clean URLs and the headers. Nothing here touches the network.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, test } from 'node:test'

import { vercelContext } from '../server/vercel.js'
import middleware, { config as middlewareConfig } from '../middleware.js'
import { config as markdownConfig } from '../server/markdown.js'

const SITE = 'https://www.groupargous.com'
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const realFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = realFetch })

test('each /api route is served by the handler in server/', async () => {
  for (const [route, module] of [['lead', 'lead'], ['event', 'meta-capi'], ['geo', 'geo']]) {
    const entry = (await import(`../api/${route}.js`)).default
    assert.equal(typeof entry.fetch, 'function', `api/${route}.js`)
    assert.match(readFileSync(new URL(`../api/${route}.js`, import.meta.url), 'utf8'), new RegExp(`from '../server/${module}.js'`))
  }
  const geo = (await import('../api/geo.js')).default
  const response = await geo.fetch(new Request(`${SITE}/api/geo`, { headers: { 'x-vercel-ip-country': 'MX' } }))
  assert.deepEqual(await response.json(), { country: 'MX' })
})

test('the context: IP from x-real-ip (or the first x-forwarded-for), country from x-vercel-ip-country', () => {
  const context = vercelContext(new Request(SITE, { headers: { 'x-real-ip': '203.0.113.7', 'x-vercel-ip-country': 'ES' } }))
  assert.equal(context.ip, '203.0.113.7')
  assert.equal(context.geo.country.code, 'ES')
  assert.equal(typeof context.waitUntil, 'function')
  assert.equal(vercelContext(new Request(SITE, { headers: { 'x-forwarded-for': '198.51.100.4, 10.0.0.1' } })).ip, '198.51.100.4')
  const bare = vercelContext(new Request(SITE))
  assert.equal(bare.ip, undefined)
  assert.equal(bare.geo.country.code, undefined)
})

test('middleware: HTML requests go on with Vary and Link, without a second fetch', async () => {
  globalThis.fetch = () => assert.fail('no fetch for an HTML request')
  const response = await middleware(new Request(`${SITE}/about`, { headers: { accept: 'text/html' } }))
  assert.equal(response.headers.get('x-middleware-next'), '1')
  assert.match(response.headers.get('vary'), /Accept/)
  assert.match(response.headers.get('link'), /\/about\.md>; rel="alternate"/)
  const post = await middleware(new Request(`${SITE}/`, { method: 'POST', headers: { accept: 'text/markdown' } }))
  assert.equal(post.headers.get('x-middleware-next'), '1')
})

test('middleware: a markdown request gets the .md twin', async () => {
  const fetched = []
  globalThis.fetch = async (url, init) => {
    fetched.push(init.headers.accept)
    return String(url).endsWith('.md')
      ? new Response('# About', { status: 200 })
      : new Response('<html></html>', { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
  const response = await middleware(new Request(`${SITE}/about`, { headers: { accept: 'text/markdown' } }))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8')
  assert.equal(await response.text(), '# About')
  assert.deepEqual(fetched, ['text/html', 'text/plain'])
})

test('middleware: if anything throws, the page is served as usual', async () => {
  globalThis.fetch = () => { throw new Error('down') }
  const response = await middleware(new Request(`${SITE}/about`, { headers: { accept: 'text/markdown' } }))
  assert.equal(response.headers.get('x-middleware-next'), '1')
})

test('the middleware matcher skips what server/markdown.js skips', () => {
  const [pattern] = middlewareConfig.matcher
  const matcher = new RegExp(`^${pattern}$`)
  // '/xmd': the dot before the extension is literal.
  for (const path of ['/', '/about', '/growth', '/growth/thank-you', '/cookie-policy', '/xmd']) assert.ok(matcher.test(path), path)
  for (const path of ['/api/lead', '/assets/index-abc.js', '/fonts/inter.woff2', '/about.md', '/llms.txt', '/sitemap.xml', '/argo-icon.svg']) {
    assert.ok(!matcher.test(path), path)
  }
  assert.ok(markdownConfig.excludedPath.includes('/api/*'))
})

test('vercel.json: clean URLs, no trailing slash, and the headers the site relies on', () => {
  assert.equal(vercel.cleanUrls, true)
  assert.equal(vercel.trailingSlash, false)
  assert.equal(vercel.outputDirectory, 'dist')
  const valueOf = (source, name) => vercel.headers
    .find((entry) => entry.source === source)?.headers
    .find((header) => header.key === name)?.value
  assert.equal(valueOf('/(.*)', 'X-Content-Type-Options'), 'nosniff')
  assert.match(valueOf('/(.*)', 'Vary'), /Accept/)
  assert.match(valueOf('/assets/(.*)', 'Cache-Control'), /immutable/)
  assert.equal(valueOf('/growth(.*)', 'X-Robots-Tag'), 'noindex, nofollow')
  assert.equal(valueOf('/systems(.*)', 'X-Robots-Tag'), 'noindex, nofollow')
  assert.match(valueOf('/(.*)\\.md', 'Content-Type'), /^text\/markdown/)
})
