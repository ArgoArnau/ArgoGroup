// How the site runs on Cloudflare: server/worker.js routes /api/* to the
// handlers in server/ with Cloudflare's IP, country and waitUntil, runs the
// markdown negotiation in front of the pages, and adds the site's headers.
// The assets are a fake here; nothing touches the network.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import worker, { contextFor } from '../server/worker.js'

const SITE = 'https://www.groupargous.com'
const ctx = { waitUntil: () => {} }

/** Fake static assets: a few pages and their markdown twins. */
function assets(files = {}) {
  const seen = []
  return {
    seen,
    ASSETS: {
      fetch: async (request) => {
        const { pathname } = new URL(request.url)
        seen.push(pathname)
        if (pathname in files) return new Response(files[pathname], { status: 200, headers: { 'Content-Type': 'text/html' } })
        return new Response('<h1>404</h1>', { status: 404, headers: { 'Content-Type': 'text/html' } })
      },
    },
  }
}

test('the context: IP from cf-connecting-ip, country from request.cf, waitUntil from the Worker', () => {
  const jobs = []
  const request = new Request(SITE, { headers: { 'cf-connecting-ip': '203.0.113.7' } })
  Object.defineProperty(request, 'cf', { value: { country: 'ES' } })
  const context = contextFor(request, { waitUntil: (job) => jobs.push(job) })
  assert.equal(context.ip, '203.0.113.7')
  assert.equal(context.geo.country.code, 'ES')
  context.waitUntil('job')
  assert.deepEqual(jobs, ['job'])
  const bare = contextFor(new Request(SITE), ctx)
  assert.equal(bare.ip, undefined)
  assert.equal(bare.geo.country.code, undefined)
})

test('/api/geo is answered by the Worker, not the assets', async () => {
  const env = assets()
  const request = new Request(`${SITE}/api/geo`)
  Object.defineProperty(request, 'cf', { value: { country: 'MX' } })
  const response = await worker.fetch(request, env, ctx)
  assert.deepEqual(await response.json(), { country: 'MX' })
  assert.deepEqual(env.seen, [])
})

test('pages get the site headers; only the landings are noindex', async () => {
  const env = assets({ '/about': '<h1>About</h1>', '/growth': '<h1>Growth</h1>', '/growth/thank-you': '<h1>Thanks</h1>' })
  const about = await worker.fetch(new Request(`${SITE}/about`, { headers: { accept: 'text/html' } }), env, ctx)
  assert.equal(about.status, 200)
  assert.equal(about.headers.get('x-content-type-options'), 'nosniff')
  assert.match(about.headers.get('vary'), /Accept/)
  assert.match(about.headers.get('link'), /\/about\.md>; rel="alternate"/)
  assert.equal(about.headers.get('x-robots-tag'), null)
  for (const path of ['/growth', '/growth/thank-you']) {
    const landing = await worker.fetch(new Request(`${SITE}${path}`), env, ctx)
    assert.equal(landing.headers.get('x-robots-tag'), 'noindex, nofollow', path)
  }
})

test('a markdown request gets the twin, read from the assets (no fetch of its own domain)', async () => {
  const env = assets({ '/about': '<h1>About</h1>', '/about.md': '# About' })
  const realFetch = globalThis.fetch
  globalThis.fetch = () => assert.fail('the Worker must not fetch its own domain')
  try {
    const response = await worker.fetch(new Request(`${SITE}/about`, { headers: { accept: 'text/markdown' } }), env, ctx)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8')
    assert.equal(await response.text(), '# About')
  } finally {
    globalThis.fetch = realFetch
  }
})

test('files the negotiation skips go straight to the assets, with their content type', async () => {
  const env = assets({ '/llms.txt': 'pages', '/about.md': '# About' })
  const txt = await worker.fetch(new Request(`${SITE}/llms.txt`), env, ctx)
  assert.equal(txt.headers.get('content-type'), 'text/plain; charset=utf-8')
  const md = await worker.fetch(new Request(`${SITE}/about.md`), env, ctx)
  assert.equal(md.headers.get('content-type'), 'text/markdown; charset=utf-8')
  const missing = await worker.fetch(new Request(`${SITE}/api/nope`), env, ctx)
  assert.equal(missing.status, 404)
})

test('wrangler.jsonc: the Worker, its assets, nodejs_compat and process.env', () => {
  const config = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8').replace(/^\s*\/\/.*$/gm, ''))
  assert.equal(config.main, 'server/worker.js')
  assert.ok(config.compatibility_flags.includes('nodejs_compat'))
  assert.ok(config.compatibility_date >= '2025-04-01', 'process.env is filled from secrets from this date on')
  assert.equal(config.assets.directory, './dist')
  assert.equal(config.assets.binding, 'ASSETS')
  assert.equal(config.assets.not_found_handling, '404-page')
  assert.deepEqual(config.assets.run_worker_first, ['/*', '!/assets/*', '!/fonts/*'])
  const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  assert.match(headers, /\/assets\/\*\n {2}Cache-Control: public, max-age=31536000, immutable/)
})
