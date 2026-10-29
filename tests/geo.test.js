// The visitor's country (server/geo.js, /api/geo) and the cookie
// rule the landings draw from it (src/landing/shared/region.js).

import assert from 'node:assert/strict'
import { test } from 'node:test'
import geo from '../server/geo.js'
import { OPT_IN_COUNTRIES, ruleFor } from '../src/landing/shared/region.js'

const ask = (context) => geo(new Request('https://www.groupargous.com/api/geo'), context)

test('/api/geo answers the two-letter country the host gives it, never cached', async () => {
  const response = await ask({ geo: { country: { code: 'US', name: 'United States' } } })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { country: 'US' })
  assert.match(response.headers.get('cache-control'), /no-store/)
  assert.deepEqual(await (await ask({ geo: { country: { code: 'es' } } })).json(), { country: 'ES' })
})

test('/api/geo answers "unknown" without a usable country', async () => {
  for (const context of [undefined, {}, { geo: {} }, { geo: { country: { code: '' } } }, { geo: { country: { code: 'XYZ' } } }]) {
    assert.deepEqual(await (await ask(context)).json(), { country: 'unknown' })
  }
})

test('opt-in: the 27 EU states, Iceland, Liechtenstein, Norway, the UK and Switzerland', () => {
  assert.equal(OPT_IN_COUNTRIES.size, 27 + 3 + 2)
  for (const code of ['ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'IE', 'GR', 'IS', 'LI', 'NO', 'GB', 'CH']) {
    assert.equal(ruleFor(code), 'opt-in', code)
  }
})

test('opt-out everywhere else; unknown or malformed is opt-in', () => {
  for (const code of ['US', 'us', 'MX', 'CO', 'AR', 'CA', 'BR', 'AU']) assert.equal(ruleFor(code), 'opt-out', code)
  for (const code of ['unknown', '', null, undefined, 'XX1']) assert.equal(ruleFor(code), 'opt-in', String(code))
})
