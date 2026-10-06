// Sends a landing lead (/growth, /systems) to LEAD_WEBHOOK_URL (n8n → CRM).
//
// The URL is read from the environment at build time (vite.config.js exposes
// LEAD_WEBHOOK_URL to the client). Until it is set the landing runs in review
// mode: nothing is sent, the console says so, and the visitor still reaches
// the thank-you page. Leads submitted in that mode are lost; see TODO.md.

export const LEAD_WEBHOOK_URL = import.meta.env.LEAD_WEBHOOK_URL || ''

/** Resolves true when the lead was delivered, false in review mode; throws on failure. */
export async function sendLead(payload) {
  if (!LEAD_WEBHOOK_URL) {
    console.warn('LEAD_WEBHOOK_URL not set')
    return false
  }
  const response = await fetch(LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Lead webhook responded ${response.status}`)
  return true
}
