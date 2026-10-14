// Runs inline in <head> of the /growth pages, before anything paints
// (scripts/prerender.mjs inlines this file; main.jsx imports it too so
// `vite dev` behaves the same). It decides which ad variant is live and writes
// it to <html data-variant>, which the CSS uses to show the matching headline,
// subtitle and button with no flicker. Plain script on purpose: it is not bundled.
//
// Order: ?v=&h= → ?utm_content= → this session's earlier choice → V1 h=b.
;(function () {
  var DEFAULT = '1b'
  var HEADLINES = { 1: 'abcd', 2: '', 3: '', 4: 'ab' }
  var DEFAULT_H = { 1: 'b', 4: 'b' }
  var BY_AD = {
    'g1-order': '1c',
    'g2-direction': '2',
    'g3-gaps': '1b',
    'g4-straight-answer': '1d',
    'g6-clinic': '3',
    'g7-leads-that-buy': '4b',
    'g8-cost-per-customer': '4a',
  }
  var KEY = 'argo_growth_variant'
  var root = document.documentElement

  function fromParams(params) {
    var v = (params.get('v') || '').toLowerCase().replace(/^v/, '')
    if (!Object.prototype.hasOwnProperty.call(HEADLINES, v)) return null
    var options = HEADLINES[v]
    if (!options) return v
    var h = (params.get('h') || '').toLowerCase()
    return v + (h.length === 1 && options.indexOf(h) !== -1 ? h : DEFAULT_H[v])
  }

  function valid(key) {
    return typeof key === 'string' && /^(1[abcd]|2|3|4[ab])$/.test(key)
  }

  var params = new URLSearchParams(window.location.search)
  var stored = null
  try { stored = window.sessionStorage.getItem(KEY) } catch { /* storage blocked */ }

  var ad = (params.get('utm_content') || '').toLowerCase()
  var key = fromParams(params)
    || (Object.prototype.hasOwnProperty.call(BY_AD, ad) ? BY_AD[ad] : null)
    || (valid(stored) ? stored : null)
    || DEFAULT

  root.setAttribute('data-variant', key)
  try { window.sessionStorage.setItem(KEY, key) } catch { /* storage blocked */ }

  // Scroll animations (growth.css, "Motion"), unless the visitor asked for
  // less motion. They start hidden, so if the page script never runs, show
  // everything after 4 seconds rather than leave it blank.
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
