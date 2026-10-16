// Meta Conversions API relay for the landings (/growth, /systems), at /api/event.
//
// The page calls it only after the visitor has accepted cookies
// (src/landing/shared/tracking.js), with the same event_id the Pixel uses, so
// Meta keeps one of the pair. This function adds what only a server knows,
// the visitor's IP and user agent, and the token the browser must never see.
//
// Environment (Netlify, secrets; never in the code: this repo is public):
//   META_PIXEL_ID          the Pixel the events go to
//   META_CAPI_TOKEN        Conversions API access token from Events Manager
//   META_TEST_EVENT_CODE   optional: sends to Events Manager → Test events
//                          instead of live data (Deploy Previews only)
// Without the first two it answers 204 and contacts nobody. Logs carry no
// personal data: status codes only.

const GRAPH_VERSION = 'v21.0'
const ALLOWED_EVENTS = new Set(['PageView', 'ViewContent', 'Scroll50', 'FormStart', 'Lead', 'Contact'])
const MAX_BODY = 4 * 1024
const TIMEOUT_MS = 5_000

const done = (status) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } })

const host = (url) => {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

const shortText = (value) => (typeof value === 'string' && value !== '' && value.length <= 500 ? value : undefined)

/** Only flat, small custom data: strings and numbers. */
function cleanCustomData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return Object.fromEntries(Object.entries(data)
    .filter(([key, value]) => /^[a-z_]{1,40}$/.test(key) && (typeof value === 'number' || shortText(value)))
    .slice(0, 10))
}

export default async (request, context) => {
  if (request.method !== 'POST') return done(405)

  // Only this site's own pages send events here.
  const ownHost = host(request.url)
  const origin = request.headers.get('origin')
  if (origin && host(origin) !== ownHost) return done(403)

  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) return done(204)

  const raw = await request.text()
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY) return done(413)
  let event
  try {
    event = JSON.parse(raw)
  } catch {
    return done(400)
  }
  if (!event || !ALLOWED_EVENTS.has(event.event_name)
    || typeof event.event_id !== 'string' || !/^[A-Za-z0-9-]{8,64}$/.test(event.event_id)
    || host(event.event_source_url) !== ownHost) {
    return done(400)
  }

  const body = {
    data: [{
      event_name: event.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event.event_id,
      action_source: 'website',
      event_source_url: event.event_source_url,
      user_data: {
        client_ip_address: context?.ip || request.headers.get('x-nf-client-connection-ip') || undefined,
        client_user_agent: shortText(request.headers.get('user-agent')),
        fbc: shortText(event.user_data?.fbc),
        fbp: shortText(event.user_data?.fbp),
      },
      custom_data: cleanCustomData(event.custom_data),
    }],
    // In the body, not the URL, so it never shows up in request logs.
    access_token: token,
  }
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) console.warn(`[event] Meta said ${response.status} for ${event.event_name}`)
    return done(response.ok ? 204 : 502)
  } catch (error) {
    console.warn(`[event] could not reach Meta: ${error?.name ?? 'error'}`)
    return done(502)
  }
}

export const config = { path: '/api/event' }
