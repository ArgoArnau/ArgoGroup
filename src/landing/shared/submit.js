// Sends a landing lead (/growth, /systems) to the CRM, through this site's own
// /api/lead (netlify/functions/lead.js), which adds the key the browser must
// never see. The body is the CRM's contract (crm.js).
//
// Review mode: under `vite dev` and in the standalone review copy opened from
// disk there is no /api/lead, so nothing is sent, the console says so, and
// the visitor still reaches the thank-you page.

export const LEAD_ENDPOINT = '/api/lead'

export const reviewMode = () => import.meta.env.DEV || window.location.protocol === 'file:'

/** Resolves true when the CRM took the lead, false in review mode; throws on failure. */
export async function sendLead(payload) {
  if (reviewMode()) {
    console.warn('Review mode: the lead is not sent')
    return false
  }
  const response = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Lead endpoint responded ${response.status}`)
  return true
}
