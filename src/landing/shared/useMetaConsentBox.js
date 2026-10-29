import { useState, useSyncExternalStore } from 'react'
import { hasConsent, onConsentChange, setConsent } from '../../lib/consent.js'
import { getRegion, metaAllowed, onRegionChange } from './region.js'

const subscribe = (callback) => {
  const stopConsent = onConsentChange(callback)
  const stopRegion = onRegionChange(callback)
  return () => { stopConsent(); stopRegion() }
}
// Hidden until the visitor's country is known, so it never shows and then
// vanishes for a visitor whose Pixel may already run.
const noBoxNeeded = () => getRegion() === null || metaAllowed()

/**
 * The optional, unticked box under the form's consent checkbox: a second
 * chance to accept Meta's cookies for a visitor who ignored or declined the
 * banner, at the moment they send the form. Ticking it is the same choice as
 * Accept on the banner (it is stored the same way and can be changed under
 * "Cookies"); leaving it empty changes nothing.
 *
 * Hidden on the server, for anyone who already accepted, and for visitors
 * outside the EU/EEA, the UK and Switzerland who have not rejected (region.js):
 * their Pixel already runs, so their lead goes to Meta. Once ticked it
 * stays on screen, so the form does not jump while it sends.
 */
export function useMetaConsentBox() {
  const accepted = useSyncExternalStore(subscribe, noBoxNeeded, () => true)
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
      return checked || metaAllowed()
    },
  }
}
