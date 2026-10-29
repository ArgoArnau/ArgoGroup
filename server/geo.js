// The visitor's country for the landings (/growth, /systems), at /api/geo.
//
// The landings ask before loading the Meta Pixel: in the EU/EEA, the UK and
// Switzerland it waits for Accept on the cookie banner; elsewhere it loads
// at once and the banner only offers to reject it (src/landing/shared/region.js
// decides which). Cloudflare knows the country from the visitor's IP
// (request.cf.country, passed in by server/worker.js); this answers
// its two-letter ISO code, or "unknown" when there is none, and stores nothing.
// Served at /api/geo by server/worker.js.

const COUNTRY = /^[A-Z]{2}$/

export default async function geo(request, context) {
  const code = String(context?.geo?.country?.code ?? '').toUpperCase()
  return Response.json(
    { country: COUNTRY.test(code) ? code : 'unknown' },
    // Per visitor: never cached by the CDN or shared between people.
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}

