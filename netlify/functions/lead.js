// The landings' lead form → the CRM (argo-planning, POST /api/leads).
//
// The browser posts here, on the site's own domain. This function adds what
// the browser must never hold, the CRM key, plus the visitor's IP (the CRM
// keeps it only as a salted hash, to cap submissions per person), and
// forwards the body unchanged. The CRM validates every field again and
// decides; its answer goes back to the page as it came, so the form reacts
// to 400 and 429 as the contract says.
//
// Contract: 01-captacion/plataforma/cambios/crm-entrada-web/contrato-formulario.md
// in the ARGO Universe.
//
// Environment (Netlify → Site configuration → Environment variables, marked
// secret; never in the code: this repo is public):
//   CRM_LEADS_URL                     the CRM route, production or a preview's
//   CRM_ENTRADA_SECRETO               the same key as in argo-planning's Vercel
//   VERCEL_AUTOMATION_BYPASS_SECRET   only to reach a protected Vercel preview
// Without the first two it answers 503 and sends nothing. Logs carry no
// personal data: status codes and error names only.

const MAX_BODY = 16 * 1024
const TIMEOUT_MS = 10_000

const answer = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
})

const unavailable = () => answer(503, { ok: false, error: 'no_disponible' })

/** Same host as this function, or no Origin at all (not a browser). */
function sameSite(origin, requestUrl) {
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(requestUrl).host
  } catch {
    return false
  }
}

export default async (request, context) => {
  if (request.method !== 'POST') return answer(405, { ok: false, error: 'metodo' })

  // Only this site's own pages post here.
  if (!sameSite(request.headers.get('origin'), request.url)) {
    return answer(403, { ok: false, error: 'no_autorizado' })
  }

  const url = process.env.CRM_LEADS_URL
  const key = process.env.CRM_ENTRADA_SECRETO
  if (!url || !key) {
    console.warn('[lead] not configured: CRM_LEADS_URL or CRM_ENTRADA_SECRETO missing')
    return unavailable()
  }

  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return answer(415, { ok: false, error: 'formato' })
  }
  const body = await request.text()
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY) {
    return answer(413, { ok: false, error: 'demasiado_grande' })
  }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }
  // Without it every lead would share one submission cap in the CRM.
  const ip = context?.ip || request.headers.get('x-nf-client-connection-ip')
  if (ip) headers['X-Argo-Ip-Cliente'] = ip
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  if (bypass) headers['x-vercel-protection-bypass'] = bypass

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    let result = null
    try {
      result = JSON.parse(await response.text())
    } catch {
      // Not the CRM answering (a login wall, a proxy error page): handled below.
    }
    if (!result || typeof result.ok !== 'boolean') {
      console.warn(`[lead] unexpected answer from the CRM: ${response.status}`)
      return unavailable()
    }
    if (!result.ok) console.warn(`[lead] CRM said ${response.status} ${result.error ?? ''}`)
    return answer(response.status, result)
  } catch (error) {
    console.warn(`[lead] could not reach the CRM: ${error?.name ?? 'error'}`)
    return unavailable()
  }
}

export const config = { path: '/api/lead' }
