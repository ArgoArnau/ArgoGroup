// Meta Conversions API relay for the /growth landing. PREPARED, SWITCHED OFF.
//
// Nothing calls this yet: src/landing/growth/tracking.js leaves CAPI_ENDPOINT
// empty. Even if something did, without META_PIXEL_ID and META_CAPI_TOKEN in
// the Netlify environment it answers 204 and contacts nobody. The browser only
// sends events here after the visitor has accepted cookies.
//
// The event_id matches the Pixel's, so Meta deduplicates the pair.

const GRAPH_VERSION = 'v21.0'
const ALLOWED_EVENTS = new Set(['PageView', 'ViewContent', 'Scroll50', 'FormStart', 'Lead', 'Contact'])

export default async (request) => {
  if (request.method !== 'POST') return new Response(null, { status: 405 })

  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) return new Response(null, { status: 204 })

  let event
  try {
    event = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!ALLOWED_EVENTS.has(event.event_name) || typeof event.event_id !== 'string') {
    return new Response(null, { status: 400 })
  }

  const userData = {
    client_ip_address: request.headers.get('x-nf-client-connection-ip') || undefined,
    client_user_agent: request.headers.get('user-agent') || undefined,
    fbc: event.user_data?.fbc || undefined,
    fbp: event.user_data?.fbp || undefined,
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: event.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.event_id,
        action_source: 'website',
        event_source_url: event.event_source_url,
        user_data: userData,
        custom_data: event.custom_data || {},
      }],
    }),
  })

  return new Response(null, { status: response.ok ? 204 : 502 })
}
