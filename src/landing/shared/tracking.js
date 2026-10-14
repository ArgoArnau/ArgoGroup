// Meta Pixel + Conversions API for the paid landings (/growth, /systems).
//
// Nothing runs until the visitor presses Accept on the cookie banner: every
// event checks consent first and is dropped, not queued, without it. The
// server half is netlify/functions/meta-capi.js (/api/event); without
// META_PIXEL_ID and META_CAPI_TOKEN in Netlify it sends nothing to Meta.
//
// Pixel and CAPI receive the same event_id for each event, so Meta keeps one.
//
// Events: PageView and ViewContent on load, Scroll50 once at half the page,
// FormStart when someone first clicks into the form, Lead on a
// successful send, Contact on any WhatsApp link.

import { hasConsent, onConsentChange } from '../../lib/consent.js'
import { newEventId } from './attribution.js'

// The same Pixel as the main site (src/lib/pixel.js): one per domain.
export const PIXEL_ID = '3872072809596261'
export const CAPI_ENDPOINT = '/api/event'

const STANDARD = new Set(['PageView', 'ViewContent', 'Lead', 'Contact'])

let loaded = false
let context = { fbc: '', fbp: '' }

const enabled = () => PIXEL_ID !== '' && hasConsent()

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
  sendCapi(name, eventId, params)
  return eventId
}

/** Click identifiers CAPI needs to match the visitor (from attribution.js). */
export function setTrackingContext(ids) {
  context = ids
}

/**
 * Load-time events. Sent now if consent already exists, or the moment the
 * visitor accepts; revoked if they later reject. Returns a cleanup.
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

  const stopConsent = onConsentChange((choice) => {
    if (choice === 'accepted') onLoad()
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
