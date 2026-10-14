import { useState, useSyncExternalStore } from 'react'
import { getConsent, onConsentChange, setConsent } from '../../lib/consent.js'

const subscribeConsent = (callback) => onConsentChange(callback)

/**
 * The cookie choice, read from storage. The server renders the banner (no
 * choice yet); boot.js hides it before paint for returning visitors, and React
 * takes over once hydrated.
 */
export function useCookieBanner() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null)
  const [reopened, setReopened] = useState(false)
  return {
    visible: reopened || !consent,
    reopened,
    reopen: () => setReopened(true),
    choose: (choice) => {
      setConsent(choice)
      setReopened(false)
    },
  }
}
