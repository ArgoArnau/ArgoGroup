import { useEffect, useState, useSyncExternalStore } from 'react'
import { getConsent, onConsentChange, setConsent } from '../../lib/consent.js'
import { getRegion, onRegionChange, resolveRegion } from './region.js'

const subscribe = (callback) => {
  const stopConsent = onConsentChange(callback)
  const stopRegion = onRegionChange(callback)
  return () => { stopConsent(); stopRegion() }
}

/**
 * The cookie choice, read from storage. The server renders the banner (no
 * choice yet); boot.js hides it before paint for returning visitors, and React
 * takes over once hydrated. It waits for the visitor's country (region.js):
 * `informative` is the opt-out version (OK / Reject) for visitors outside
 * the EU/EEA, the UK and Switzerland, whose Pixel is already running.
 */
export function useCookieBanner() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => null)
  const region = useSyncExternalStore(subscribe, getRegion, () => null)
  const [reopened, setReopened] = useState(false)
  useEffect(() => { resolveRegion() }, [])
  return {
    visible: region !== null && (reopened || !consent),
    informative: region === 'opt-out',
    reopened,
    reopen: () => setReopened(true),
    choose: (choice) => {
      setConsent(choice)
      setReopened(false)
    },
  }
}
