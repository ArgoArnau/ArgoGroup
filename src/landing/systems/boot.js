// Runs inline in <head> of the /systems pages, before anything paints
// (scripts/prerender.mjs inlines this file; main.jsx imports it too so
// `vite dev` behaves the same). Plain script on purpose: it is not bundled.
;(function () {
  var root = document.documentElement

  // Scroll and load animations (systems.css, "Motion"), unless the visitor
  // asked for less motion. They start hidden, so if the page script never
  // runs, show everything after 4 seconds rather than leave it blank.
  if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    root.classList.add('motion')
    window.setTimeout(function () {
      if (!window.__landingReady) root.classList.remove('motion')
    }, 4000)
  }

  // A visitor who already chose on the cookie banner should not see it flash.
  try {
    var consent = window.localStorage.getItem('argo_cookie_consent')
    if (consent) root.setAttribute('data-consent', consent)
  } catch { /* storage blocked: the banner shows */ }
})()
