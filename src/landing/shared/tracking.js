// Meta Pixel + Conversions API for the paid landings (/growth, /systems).
//
// Whether anything runs depends on the visitor's country (region.js): in the
// EU/EEA, the UK and Switzerland nothing runs until they press Accept on the
// cookie banner; elsewhere it runs from the start unless they press Reject.
// Every event checks first and is dropped, not queued, when it may not run. The
// server half is server/meta-capi.js (/api/event); without
// META_PIXEL_ID and META_CAPI_TOKEN in Vercel it sends nothing to Meta.
//
// Pixel and CAPI receive the same event_id for each event, so Meta keeps one.
//
// Events: PageView and ViewContent on load, Scroll50 once at half the page,
// FormStart when someone first clicks into the form, Lead on a
// successful send, Contact on any WhatsApp link. PageView, ViewContent, Lead
// and Contact are Meta's standard events (the campaign optimises for Lead);
// Scroll50 and FormStart are custom, the "C" in Meta Pixel Helper.
//
// The Lead's server half is not sent from here: server/lead.js
// sends it once the CRM has taken the request (SERVER_SENT below).

import { onConsentChange } from '../../lib/consent.js'
import { newEventId } from './attribution.js'
import { metaAllowed, resolveRegion } from './region.js'

// The same Pixel as the main site (src/lib/pixel.js): one per domain.
export const PIXEL_ID = '3872072809596261'
export const CAPI_ENDPOINT = '/api/event'

const STANDARD = new Set(['PageView', 'ViewContent', 'Lead', 'Contact'])
// Events whose Conversions API half the server sends itself (/api/lead).
const SERVER_SENT = new Set(['Lead'])

let loaded = false
let context = { fbc: '', fbp: '' }

const enabled = () => PIXEL_ID !== '' && metaAllowed()

/** True when events are actually leaving the page. */
export const trackingActive = enabled

function loadPixel() {
  if (loaded) return
  loaded = true
  // Meta's base code, minus the unconditional init/PageView.
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('consent', 'grant')
  window.fbq('init', PIXEL_ID)
}

function sendCapi(name, eventId, params) {
  if (!CAPI_ENDPOINT) return
  fetch(CAPI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: name,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: params,
      user_data: context,
    }),
  }).catch(() => {
    // Measurement must never get in the visitor's way.
  })
}

/**
 * Sends one event to Pixel and CAPI with a shared event_id. Returns the id so
 * callers (the form) can store it. A no-op while tracking is off or the
 * visitor has not accepted cookies.
 */
export function track(name, params = {}, eventId = newEventId()) {
  if (!enabled()) return eventId
  loadPixel()
  window.fbq(STANDARD.has(name) ? 'track' : 'trackCustom', name, params, { eventID: eventId })
  if (!SERVER_SENT.has(name)) sendCapi(name, eventId, params)
  return eventId
}

/** Click identifiers CAPI needs to match the visitor (from attribution.js). */
export function setTrackingContext(ids) {
  context = ids
}

/**
 * Load-time events. Sent once the visitor's country is known if the Pixel may
 * run (region.js), or the moment they accept; revoked if they later reject.
 * Returns a cleanup.
 */
export function startPageTracking({ contentName, category }) {
  let sent = false
  const onLoad = () => {
    if (sent || !enabled()) return
    sent = true
    track('PageView')
    track('ViewContent', { content_category: category, content_name: contentName })
  }
  onLoad()
  resolveRegion().then(onLoad)

  const stopConsent = onConsentChange(() => {
    if (enabled()) onLoad()
    else if (loaded) window.fbq('consent', 'revoke')
  })

  let scrolled = false
  const onScroll = () => {
    if (scrolled) return
    const doc = document.documentElement
    if ((window.scrollY + window.innerHeight) / doc.scrollHeight < 0.5) return
    scrolled = true
    track('Scroll50')
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // Every WhatsApp link, wherever it sits, counts as Contact.
  const onClick = (event) => {
    if (event.target.closest?.('a[href^="https://wa.me/"]')) track('Contact', { content_category: category })
  }
  document.addEventListener('click', onClick)

  return () => {
    stopConsent()
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('click', onClick)
  }
}
