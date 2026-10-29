// Vercel Routing Middleware: markdown content negotiation in front of every
// page (server/markdown.js has the rules and the why).
//
// Most requests are a browser or crawler asking for HTML: they go straight
// on, with the Vary and Link headers added. Only a client that prefers
// markdown runs the full handler, whose context.next() is a fetch of the same
// URL as HTML; that fetch comes back through here and simply goes on.
//
// If anything throws, the page is served as if this file did not exist: agent
// readiness must never cost the site its availability.

import { next } from '@vercel/functions'
import handler, { negotiationFor, withNegotiationHeaders } from './server/markdown.js'

const asHtml = (request) => fetch(request.url, {
  method: request.method,
  // The cookie lets the fetch through a protected Vercel preview.
  headers: { accept: 'text/html', cookie: request.headers.get('cookie') ?? '' },
  redirect: 'manual',
})

export default async function middleware(request) {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next()
    const { serveMarkdown, markdownPath, canonical } = negotiationFor(request)
    if (!serveMarkdown) {
      return next({ headers: withNegotiationHeaders(new Headers(), { markdownPath, canonical }) })
    }
    return await handler(request, { next: () => asHtml(request) })
  } catch {
    return next()
  }
}

// The same paths as server/markdown.js `config` (written out: Vercel reads
// this literally at build time).
export const config = {
  matcher: ['/((?!api/|assets/|fonts/|.*\\.(?:md|txt|xml|json|js|css|svg|jpg|jpeg|png|webp|gif|ico|webmanifest|woff2)$).*)'],
}
