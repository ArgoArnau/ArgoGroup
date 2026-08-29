// Markdown content negotiation for agents (acceptmarkdown.com).
//
// Every HTML route has a `.md` twin built by scripts/prerender.mjs. This edge
// function serves that twin when the client asks for `Accept: text/markdown`,
// and — just as importantly — makes every negotiated response advertise
// `Vary: Accept` so a CDN can never hand the HTML variant to an agent that
// asked for markdown, or vice versa.
//
// `.md`, `.txt`, `.xml` and static assets are excluded below, so the internal
// fetch for the markdown body does not re-enter this function.

import { markdownPathFor, canonicalFor, site } from '../../src/site.js'
import { MARKDOWN_CONTENT_TYPE, VARY, negotiate } from '../../src/shared/negotiate.js'

const NOT_FOUND_MARKDOWN_PATH = '/404.md'

const withNegotiationHeaders = (headers, { markdownPath, canonical }) => {
  headers.set('Vary', VARY)
  const links = []
  if (markdownPath) links.push(`<${site.origin}${markdownPath}>; rel="alternate"; type="text/markdown"`)
  if (canonical) links.push(`<${canonical}>; rel="canonical"`)
  if (links.length) headers.set('Link', links.join(', '))
  return headers
}

async function readMarkdown(request, path) {
  const response = await fetch(new URL(path, request.url), {
    headers: { accept: 'text/plain' },
    redirect: 'follow',
  })
  return response.ok ? await response.text() : null
}

const markdownResponse = (body, status, request, links) =>
  new Response(request.method === 'HEAD' ? null : body, {
    status,
    headers: withNegotiationHeaders(
      new Headers({
        'Content-Type': MARKDOWN_CONTENT_TYPE,
        'Cache-Control': 'public, max-age=0, must-revalidate',
      }),
      links,
    ),
  })

export default async function handler(request, context) {
  const { pathname } = new URL(request.url)
  const accept = request.headers.get('accept')
  const { serveMarkdown, markdownPath, notAcceptable } = negotiate(accept, pathname, markdownPathFor)
  const canonical = markdownPath ? canonicalFor(pathname === '/' ? '/' : pathname.replace(/\/+$/, '')) : null

  const response = await context.next()

  // The common case: HTML for a browser or a crawler that did not ask for
  // markdown. Pass the origin response through, annotated so caches key on
  // Accept and so agents can discover the markdown twin.
  if (!serveMarkdown) {
    const passthrough = new Response(response.body, response)
    withNegotiationHeaders(passthrough.headers, { markdownPath, canonical })
    return passthrough
  }

  // The path does not exist: answer the 404 in the format that was asked for.
  if (response.status === 404) {
    const body = await readMarkdown(request, NOT_FOUND_MARKDOWN_PATH)
    if (body === null) {
      const fallback = new Response(response.body, response)
      withNegotiationHeaders(fallback.headers, { markdownPath: null, canonical: null })
      return fallback
    }
    return markdownResponse(body, 404, request, { markdownPath: null, canonical: null })
  }

  if (markdownPath) {
    const body = await readMarkdown(request, markdownPath)
    if (body !== null) {
      return markdownResponse(body, response.status, request, { markdownPath, canonical })
    }
  }

  // Asked for markdown, refuses HTML, and there is no markdown for this path.
  if (notAcceptable) {
    const body = [
      '# 406 Not Acceptable',
      '',
      `> No markdown representation exists for this path on ${site.origin}.`,
      '',
      `- [/llms.txt](${site.origin}/llms.txt) lists every page that does have one.`,
      `- [/sitemap.xml](${site.origin}/sitemap.xml) lists every indexable URL.`,
      '',
    ].join('\n')
    return markdownResponse(body, 406, request, { markdownPath: null, canonical: null })
  }

  const passthrough = new Response(response.body, response)
  withNegotiationHeaders(passthrough.headers, { markdownPath, canonical })
  return passthrough
}

export const config = {
  path: '/*',
  excludedPath: [
    '/assets/*',
    '/*.md',
    '/*.txt',
    '/*.xml',
    '/*.json',
    '/*.js',
    '/*.css',
    '/*.svg',
    '/*.jpg',
    '/*.jpeg',
    '/*.png',
    '/*.webp',
    '/*.gif',
    '/*.ico',
    '/*.webmanifest',
  ],
  method: ['GET', 'HEAD'],
  // If anything in here throws, serve the plain origin response instead of an
  // error page: agent readiness must never cost the site its availability.
  onError: 'bypass',
}
