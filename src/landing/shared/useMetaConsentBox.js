import { useState, useSyncExternalStore } from 'react'
import { getConsent, hasConsent, onConsentChange, setConsent } from '../../lib/consent.js'

const subscribe = (callback) => onConsentChange(callback)
const cookiesAccepted = () => getConsent() === 'accepted'

/**
 * The optional, unticked box under the form's consent checkbox: a second
 * chance to accept Meta's cookies for a visitor who ignored or declined the
 * banner, at the moment they send the form. Ticking it is the same choice as
 * Accept on the banner (it is stored the same way and can be changed under
 * "Cookies"); leaving it empty changes nothing.
 *
 * Hidden on the server and for anyone who already accepted. Once ticked it
 * stays on screen, so the form does not jump while it sends.
 */
export function useMetaConsentBox() {
  const accepted = useSyncExternalStore(subscribe, cookiesAccepted, () => true)
  const [checked, setChecked] = useState(false)

  return {
    visible: !accepted || checked,
    checked,
    setChecked,
    /**
     * Call right before sending. Applies the box if ticked (the Pixel starts
     * loading while the lead is on its way) and says whether Meta may hear
     * about this lead.
     */
    commit: () => {
      if (checked && !hasConsent()) setConsent('accepted')
      // `checked` too: with storage blocked the choice cannot be saved, but it was made.
      return checked || hasConsent()
    },
  }
}
