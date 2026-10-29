// Which cookie rule applies to this visitor on the landings (/growth, /systems).
//
// 'opt-in': the EU/EEA, the UK and Switzerland, and any visitor whose country
// we cannot tell. The Meta Pixel waits for Accept on the banner, as it always
// has. 'opt-out': everywhere else. The Pixel loads at once, the banner only
// informs (OK / Reject), and Reject stops it for this visit and the next ones.
//
// The country comes from /api/geo (server/geo.js). Until it
// answers, the rule is unknown and nothing is sent; if it fails or is slow,
// the visitor gets the opt-in rule.

import { CONSENT_KEY, getConsent } from '../../lib/consent.js'

export const GEO_ENDPOINT = '/api/geo'
const GEO_TIMEOUT_MS = 2500
const EVENT = 'argo:region'

// EU member states, then the other EEA states (Iceland, Liechtenstein,
// Norway), the United Kingdom and Switzerland. ISO 3166-1 alpha-2; Greece is GR.
export const OPT_IN_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO',
  'GB', 'CH',
])

/** The rule for a country code from /api/geo; anything unrecognised is opt-in. */
export function ruleFor(country) {
  const code = String(country ?? '').toUpperCase()
  return /^[A-Z]{2}$/.test(code) && !OPT_IN_COUNTRIES.has(code) ? 'opt-out' : 'opt-in'
}

let region = null
let pending = null

/** 'opt-in', 'opt-out', or null while /api/geo has not answered yet. */
export const getRegion = () => region

/** Calls `callback(rule)` once the rule is known. */
export function onRegionChange(callback) {
  const handler = (event) => callback(event.detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

/**
 * True when the Meta Pixel may run for this visitor: they accepted, or they
 * are in an opt-out country and have not rejected. 'acknowledged' is the OK
 * of the informative banner, which only counts outside the opt-in countries.
 */
export function metaAllowed() {
  const choice = getConsent()
  if (choice === 'accepted') return true
  return region === 'opt-out' && choice !== 'rejected'
}

// Testing outside production: ?geo=US (or any code) on localhost or a Deploy
// Preview stands in for the visitor's country. Ignored on groupargous.com.
function testCountry() {
  if (/(^|\.)groupargous\.com$/.test(window.location.hostname)) return null
  return new URLSearchParams(window.location.search).get('geo')
}

async function lookUp() {
  const forced = testCountry()
  if (forced) return ruleFor(forced)
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), GEO_TIMEOUT_MS)
  try {
    const response = await fetch(GEO_ENDPOINT, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) return 'opt-in'
    const { country } = await response.json()
    return ruleFor(country)
  } catch {
    // No answer (vite dev has no /api/geo, or the network failed): be safe.
    return 'opt-in'
  } finally {
    window.clearTimeout(timer)
  }
}

/** Asks /api/geo once per page; resolves with the rule. */
export function resolveRegion() {
  if (!pending) {
    pending = lookUp().then((rule) => {
      region = rule
      // An OK given on the informative banner abroad is not consent here:
      // forget it, so this visitor gets the banner that asks.
      if (rule === 'opt-in' && getConsent() === 'acknowledged') {
        try { window.localStorage.removeItem(CONSENT_KEY) } catch { /* nothing stored */ }
        document.documentElement.removeAttribute('data-consent')
      }
      window.dispatchEvent(new CustomEvent(EVENT, { detail: rule }))
      return rule
    })
  }
  return pending
}
