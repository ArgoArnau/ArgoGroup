// The Cloudflare Worker in front of groupargous.com (wrangler.jsonc).
//
// The canonical address is https://www.groupargous.com: the bare domain and
// plain http answer with a 301 there, path and query kept, and every https
// response carries HSTS (as Netlify did).
//
// The built site (dist/) is the Worker's static assets. Hashed bundles and
// fonts never reach this code (run_worker_first excludes them; public/_headers
// gives them their cache headers). Everything else comes through here:
//   /api/lead, /api/event, /api/geo  the handlers in server/, with the IP, the
//                                    country and waitUntil from Cloudflare
//   pages                            markdown negotiation (server/markdown.js),
//                                    then the site's own headers
//
// The secrets (CRM_*, META_*) reach the handlers as process.env: with
// nodejs_compat and a compatibility date from 2025-04-01 on, Cloudflare fills
// it from the Worker's variables and secrets.

import event from './meta-capi.js'
import geo from './geo.js'
import lead from './lead.js'
import markdown, { config as markdownPaths } from './markdown.js'
import { SITE_ORIGIN } from '../src/site.js'

const API = { '/api/lead': lead, '/api/event': event, '/api/geo': geo }

const passThrough = markdownPaths.excludedPath.map((pathname) => new URLPattern({ pathname }))

const CONTENT_TYPES = {
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

const CANONICAL = new URL(SITE_ORIGIN)
const BARE_DOMAIN = CANONICAL.hostname.replace(/^www\./, '')
const HSTS = 'max-age=31536000'

/** The 301 to the canonical address, or null when the request is already on it. */
export function canonicalRedirect(url) {
  const onSite = url.hostname === CANONICAL.hostname || url.hostname === BARE_DOMAIN
  if (!onSite || (url.hostname === CANONICAL.hostname && url.protocol === 'https:')) return null
  const target = new URL(url.pathname + url.search, CANONICAL)
  return new Response(null, { status: 301, headers: { Location: target.href, 'Strict-Transport-Security': HSTS } })
}

// The paid landings and their thank-you pages: never a search result (the
// pages also carry the meta tag).
const LANDING = /^\/(growth|systems)(\/|\.|$)/

/** What the handlers in server/ need from the host. */
export function contextFor(request, ctx) {
  return {
    ip: request.headers.get('cf-connecting-ip') || undefined,
    geo: { country: { code: request.cf?.country } },
    waitUntil: (job) => ctx.waitUntil(job),
  }
}

function withSiteHeaders(response, pathname) {
  const out = new Response(response.body, response)
  out.headers.set('X-Content-Type-Options', 'nosniff')
  out.headers.set('Strict-Transport-Security', HSTS)
  if (!out.headers.has('Vary')) out.headers.set('Vary', 'Accept, Accept-Encoding')
  if (LANDING.test(pathname)) out.headers.set('X-Robots-Tag', 'noindex, nofollow')
  const type = CONTENT_TYPES[pathname.match(/\.[a-z]+$/)?.[0]]
  if (type && out.ok) out.headers.set('Content-Type', type)
  return out
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const redirect = canonicalRedirect(url)
    if (redirect) return redirect
    const { pathname } = url
    const api = API[pathname]
    if (api) return api(request, contextFor(request, ctx))

    const origin = () => env.ASSETS.fetch(request)
    if (passThrough.some((pattern) => pattern.test({ pathname }))) {
      return withSiteHeaders(await origin(), pathname)
    }

    let response
    try {
      response = await markdown(request, {
        next: origin,
        asset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url), { headers: { accept: 'text/plain' } })),
      })
    } catch {
      // Agent readiness must never cost the site its availability.
      response = await origin()
    }
    return withSiteHeaders(response, pathname)
  },
}
