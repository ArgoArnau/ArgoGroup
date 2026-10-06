// Meta Pixel, loaded only after cookie consent.
//
// Nothing here touches facebook.net until the visitor has accepted cookies:
// before that, `track` is a no-op and events are dropped, not queued. If they
// later decline, the pixel is told to stop via fbq('consent', 'revoke').

import { hasConsent, onConsentChange } from './consent.js'

export const PIXEL_ID = '3872072809596261'

let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true

  // Meta's standard base code, minus the unconditional init/PageView.
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

/** Sends a standard event, but only for a visitor who has accepted cookies. */
export function track(event, params) {
  if (!hasConsent()) return
  load()
  if (params) window.fbq('track', event, params)
  else window.fbq('track', event)
}

/**
 * Fires PageView once consent exists: immediately if it already does, or the
 * moment the visitor accepts. Returns a cleanup for effects.
 */
export function initPixel() {
  let sentPageView = false
  const pageView = () => {
    if (sentPageView) return
    sentPageView = true
    track('PageView')
  }

  if (hasConsent()) pageView()

  return onConsentChange((choice) => {
    if (choice === 'accepted') pageView()
    else if (loaded) window.fbq('consent', 'revoke')
  })
}
