// Where the visitor came from, for a landing form's hidden fields and for Meta.
//
// Captured once per session, under the key the landing passes: if they land
// from an ad and then reload or come back without the query string, the
// first-touch values are kept.

const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']

const cookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

export function captureAttribution(key) {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = Object.fromEntries(PARAMS.map((name) => [name, params.get(name) || '']))
  const hasAny = PARAMS.some((name) => fromUrl[name])

  let saved = null
  try {
    saved = JSON.parse(window.sessionStorage.getItem(key) || 'null')
  } catch {
    // Storage blocked or garbage: fall back to the URL alone.
  }

  const attribution = hasAny || !saved
    ? { ...fromUrl, landed_at: Date.now(), referrer: document.referrer || '' }
    : saved

  try {
    window.sessionStorage.setItem(key, JSON.stringify(attribution))
  } catch {
    // Not remembered across reloads; this page view still has it.
  }
  return attribution
}

/**
 * Meta click identifiers. `fbc` is built from fbclid in Meta's documented
 * format when the pixel has not set the _fbc cookie; `fbp` only exists once the
 * pixel has run, which requires consent.
 */
export function metaIds(attribution) {
  const fbc = cookie('_fbc')
    || (attribution.fbclid ? `fb.1.${attribution.landed_at}.${attribution.fbclid}` : '')
  return { fbc, fbp: cookie('_fbp') }
}

export function newEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  // RFC 4122 v4 from getRandomValues, for older browsers and non-secure origins.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
