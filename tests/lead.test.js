// The landings' road to the CRM: the lead each form builds (src/landing/shared/crm.js)
// and the Netlify function that forwards it (netlify/functions/lead.js), with
// a fake CRM in place of fetch. Nothing here touches the network.

import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

globalThis.window = { location: { href: 'https://www.groupargous.com/growth?utm_source=facebook&fbclid=abc' } }
const { crmPayload, CRM_FORMS } = await import('../src/landing/shared/crm.js')
const { default: lead, config } = await import('../netlify/functions/lead.js')

const context = {
  mountedAt: 1_791_547_200_000,
  eventId: '6f1c2a3b-0000-4000-8000-000000000001',
  attribution: { utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'c1', utm_content: '', utm_term: '', fbclid: 'abc', gclid: '', referrer: 'https://l.facebook.com/' },
}
const values = { name: ' Lola ', email: 'lola@argo.test ', website: 'acme.com', whatsapp: '+34 600 000 101', open_answer: ' We need more qualified leads. ' }

test('each landing sends the CRM contract, with its own service and form', () => {
  const growth = crmPayload({ landing: 'growth', values, context, ids: { fbc: 'fb.1.x.abc', fbp: '' }, consentText: 'I agree to the Privacy Policy.', variant: '1b' })
  assert.equal(growth.nombre, 'Lola')
  assert.equal(growth.email, 'lola@argo.test')
  assert.equal(growth.telefono, '+34600000101')
  assert.equal(growth.servicio, 'marketing_digital')
  assert.equal(growth.formulario, 'landing-marketing-digital')
  assert.equal(growth.consentimiento, true)
  assert.equal(growth.consentimiento_texto, 'I agree to the Privacy Policy.')
  assert.equal(growth.abierto_en, context.mountedAt)
  assert.equal(growth.id_envio, context.eventId)
  assert.equal(growth.web, '', 'the trap field goes empty')
  assert.equal(growth.utm_content, undefined, 'empty attribution is left out')
  assert.equal(growth.fbclid, 'abc')
  assert.equal(growth.variante, '1b')
  assert.equal(growth.fbp, undefined, 'no fbp without consent')
  // The website has its own field (0020); the message is the answer alone.
  assert.equal(growth.mensaje, 'We need more qualified leads.')
  assert.equal(growth.sitio_web, 'https://acme.com')

  const systems = crmPayload({ landing: 'systems', values, context, ids: {}, consentText: 'x' })
  assert.deepEqual([systems.servicio, systems.formulario], [CRM_FORMS.systems.servicio, 'landing-sistemas-ia'])
  assert.equal(systems.variante, undefined)
})

test('the lead fits the contract limits', () => {
  const payload = crmPayload({ landing: 'growth', values, context, ids: {}, consentText: 'I agree.' })
  assert.match(payload.formulario, /^[a-z0-9-]{1,100}$/)
  assert.match(payload.id_envio, /^[A-Za-z0-9-]{8,64}$/)
  assert.ok(['marketing_digital', 'sistemas_ia', 'ambos', 'otro'].includes(payload.servicio))
  assert.ok(Buffer.byteLength(JSON.stringify(payload)) < 16 * 1024)
})

// ---------- The function ----------

const ENV = ['CRM_LEADS_URL', 'CRM_ENTRADA_SECRETO', 'VERCEL_AUTOMATION_BYPASS_SECRET']
let calls
let reply
const realFetch = globalThis.fetch

beforeEach(() => {
  calls = []
  reply = () => new Response(JSON.stringify({ ok: true }), { status: 200 })
  process.env.CRM_LEADS_URL = 'https://crm.example/api/leads'
  process.env.CRM_ENTRADA_SECRETO = 'test-key'
  delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init })
    return reply()
  }
})

afterEach(() => {
  globalThis.fetch = realFetch
  for (const name of ENV) delete process.env[name]
})

const post = (body, headers = {}) => new Request('https://www.groupargous.com/api/lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://www.groupargous.com', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
})

test('it answers at /api/lead', () => {
  assert.equal(config.path, '/api/lead')
})

test('it forwards the body with the key and the visitor IP, and returns the CRM answer', async () => {
  const body = JSON.stringify({ nombre: 'Lola' })
  const response = await lead(post(body), { ip: '203.0.113.7' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://crm.example/api/leads')
  assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key')
  assert.equal(calls[0].init.headers['X-Argo-Ip-Cliente'], '203.0.113.7')
  assert.equal(calls[0].init.headers['x-vercel-protection-bypass'], undefined)
  assert.equal(calls[0].init.body, body, 'the body goes as it came')
})

test('the IP falls back to the Netlify header, and the preview bypass is added when set', async () => {
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET = 'bypass'
  await lead(post({}, { 'x-nf-client-connection-ip': '198.51.100.4' }), {})
  assert.equal(calls[0].init.headers['X-Argo-Ip-Cliente'], '198.51.100.4')
  assert.equal(calls[0].init.headers['x-vercel-protection-bypass'], 'bypass')
})

test('the CRM errors reach the page unchanged', async () => {
  reply = () => new Response(JSON.stringify({ ok: false, error: 'datos', campos: ['email'] }), { status: 400 })
  let response = await lead(post({}), {})
  assert.equal(response.status, 400)
  assert.deepEqual((await response.json()).campos, ['email'])

  reply = () => new Response(JSON.stringify({ ok: false, error: 'limite' }), { status: 429 })
  response = await lead(post({}), {})
  assert.equal(response.status, 429)
})

test('without configuration it sends nothing and answers 503', async () => {
  delete process.env.CRM_ENTRADA_SECRETO
  const response = await lead(post({}), {})
  assert.equal(response.status, 503)
  assert.equal(calls.length, 0)
})

test('it refuses other sites, other methods, other formats and big bodies', async () => {
  assert.equal((await lead(post({}, { Origin: 'https://evil.example' }), {})).status, 403)
  assert.equal((await lead(new Request('https://www.groupargous.com/api/lead'), {})).status, 405)
  assert.equal((await lead(post('x', { 'Content-Type': 'text/plain' }), {})).status, 415)
  assert.equal((await lead(post(JSON.stringify({ m: 'x'.repeat(17 * 1024) })), {})).status, 413)
  assert.equal(calls.length, 0)
})

test('a login wall or an unreachable CRM becomes 503, never a false ok', async () => {
  reply = () => new Response('<html>Vercel login</html>', { status: 401 })
  assert.equal((await lead(post({}), {})).status, 503)

  globalThis.fetch = async () => { throw new TypeError('fetch failed') }
  assert.equal((await lead(post({}), {})).status, 503)
})
