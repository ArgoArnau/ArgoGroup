// Checks for the /systems Meta Ads landing: the copy is the brief's, the
// built pages (self-hosted fonts, no exits, kept out of search) and how they
// are served. Requires a build first; `npm test` runs one via `pretest`.

import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { after, before, test } from 'node:test'
import vm from 'node:vm'

import { createSiteServer } from '../scripts/serve.mjs'
import { CRM_FORMS } from '../src/landing/shared/crm.js'
import { about, finalCta, form, hero, method, work } from '../src/landing/systems/copy.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8')

// ── Boot script (inlined in <head>) ────────────────────────────────────────

test('boot.js turns motion on, and remembers a cookie choice before paint', () => {
  const BOOT = read('src', 'landing', 'systems', 'boot.js')
  const run = (reduced, consent) => {
    const attributes = {}
    const classes = new Set()
    vm.runInNewContext(BOOT, {
      window: {
        matchMedia: () => ({ matches: reduced }),
        localStorage: { getItem: () => consent },
        setTimeout: () => {},
      },
      document: {
        documentElement: {
          setAttribute: (name, value) => { attributes[name] = value },
          classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) },
        },
      },
    })
    return { attributes, classes }
  }
  assert.ok(run(false, null).classes.has('motion'))
  assert.ok(!run(true, null).classes.has('motion'), 'reduced motion: no animations')
  assert.equal(run(false, 'accepted').attributes['data-consent'], 'accepted')
  assert.equal(run(false, null).attributes['data-consent'], undefined)
})

// ── Built pages ────────────────────────────────────────────────────────────

const built = {
  '/systems': read('dist', 'systems.html'),
  '/systems/thank-you': read('dist', 'systems', 'thank-you.html'),
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'", nbsp: ' ' }
const textOf = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, name) => ENTITIES[name] ?? match)
  .replace(/\s+/g, ' ')
  .trim()

test('both pages are prerendered, noindex, with the boot script in <head>', () => {
  for (const [path, html] of Object.entries(built)) {
    assert.match(html, /<meta name="robots" content="noindex, nofollow" \/>/, `${path} noindex`)
    const head = html.slice(0, html.indexOf('</head>'))
    assert.ok(head.includes("classList.add('motion')"), `${path} boot script inlined in <head>`)
    assert.ok(head.includes('<style>'), `${path} stylesheet inlined`)
    assert.match(html, /<h1[\s>]/, `${path} H1`)
  }
})

test("every line of the brief is on the page, word for word", () => {
  const text = textOf(built['/systems'])
  const lines = [
    hero.eyebrow, hero.headline, hero.subtitle,
    ...hero.points.flat(),
    work.bridge, work.title, work.mock.company, ...work.mock.menu,
    ...work.items.flat(), work.closing,
    method.title, method.intro, ...method.steps.flat(), method.meaningTitle, ...method.meaning.flat(),
    about.title, about.intro, ...about.rows.flat(), about.closing, about.cities,
    finalCta.title, finalCta.sub, finalCta.button, finalCta.contactLead, finalCta.whatsapp, finalCta.email,
    '© 2026 ARGO Group', 'Privacy Policy', 'Terms of Service', 'Cookies',
  ]
  for (const line of lines) assert.ok(text.includes(line), `missing: ${line}`)

  // Each headline word sits in its own span (it rises on its own); the last
  // sentence is the gold one.
  assert.ok(built['/systems'].includes('class="w gold"'))
})

test('the illustrative interface carries no figures', () => {
  const html = built['/systems']
  const start = html.indexOf('class="mock"')
  const mock = html.slice(start, html.indexOf('</figure>', start))
  assert.ok(mock.length > 0)
  assert.ok(!/\d/.test(textOf(mock)), 'no digits in the mock')
})

test('fonts are self-hosted: nothing is loaded from Google Fonts', () => {
  const assets = readdirSync(join(ROOT, 'dist', 'assets')).filter((file) => file.startsWith('systems-'))
  for (const source of [...Object.values(built), ...assets.map((file) => read('dist', 'assets', file))]) {
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(source))
  }
  assert.match(built['/systems'], /\/fonts\/cormorant-garamond-latin-600-normal\.woff2/)
  assert.match(built['/systems'], /\/fonts\/dm-sans-latin-wght-normal\.woff2/)
})

test('the only ways out are the form, WhatsApp, email, Privacy and Terms', () => {
  const allowed = [
    /^#form$/,
    /^https:\/\/wa\.me\/34685162838\?text=/,
    /^mailto:info@groupargous\.com$/,
    /^https:\/\/www\.groupargous\.com\/(privacy-policy|terms-of-service)$/,
  ]
  for (const [path, html] of Object.entries(built)) {
    const body = html.slice(html.indexOf('<body'))
    const hrefs = [...body.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((match) => match[1].replace(/&amp;/g, '&'))
    assert.ok(hrefs.length > 0, path)
    for (const href of hrefs) assert.ok(allowed.some((pattern) => pattern.test(href)), `${path} links to ${href}`)
    assert.ok(!/<nav[\s>]/.test(body), `${path} has no menu`)
  }
})

test('the page follows the five-part structure, with the form straight after the hero', () => {
  const html = built['/systems']
  const order = ['id="hero"', 'id="form"', 'id="work-title"', 'class="mock"', 'id="method-title"', 'id="about-title"', 'id="final-title"']
  const positions = order.map((marker) => html.indexOf(marker))
  assert.ok(positions.every((at) => at > 0), `all sections present: ${positions}`)
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'sections in order')

  assert.equal(hero.points.length, 3)
  assert.equal(work.items.length, 4)
  assert.equal(work.mock.menu.length, 5)
  assert.equal(method.steps.length, 4)
  assert.equal(method.meaning.length, 4)
  assert.equal(about.rows.length, 3)
  assert.equal(form.button, finalCta.button)
  assert.equal(html.match(/<form\b/g).length, 1, 'one form on the page')
  // The form posts as this landing, so the CRM can tell the two apart.
  assert.match(read('src', 'landing', 'systems', 'LeadForm.jsx'), /crmPayload\(\{\s*landing: 'systems'/, 'the form sends as /systems')
  assert.deepEqual(CRM_FORMS.systems, { servicio: 'sistemas_ia', formulario: 'landing-sistemas-ia' })
})

test('the landing stays out of the sitemap and llms.txt', () => {
  assert.ok(!read('dist', 'sitemap.xml').includes('/systems'))
  assert.ok(!read('dist', 'llms.txt').includes('/systems'))
})

test('nothing from the /growth brief leaks into /systems', () => {
  const growthOnly = ['digital marketing, run by one team', 'Not three suppliers', 'Decide first', 'A clinic came to us', 'Your agency sees your ads']
  const text = textOf(built['/systems'])
  for (const phrase of growthOnly) assert.ok(!text.includes(phrase), `found "${phrase}"`)
})

// ── Served like Netlify serves it ──────────────────────────────────────────

let server
let origin

before(async () => {
  server = createSiteServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  origin = `http://127.0.0.1:${server.address().port}`
})

after(() => new Promise((done) => server.close(done)))

test('/systems and /systems/thank-you answer 200 directly, with no redirect', async () => {
  for (const path of ['/systems', '/systems?utm_content=s1-methodology', '/systems/thank-you']) {
    const response = await fetch(`${origin}${path}`, { redirect: 'manual', headers: { accept: 'text/html' } })
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), /^text\/html/, path)
  }
})
