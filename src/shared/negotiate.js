// Accept-header content negotiation, per RFC 9110 §12.5.1 and the
// acceptmarkdown.com conventions. Pure functions with no runtime dependencies
// so the Netlify edge function (Deno) and the Node test suite share one
// implementation.

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8'
export const VARY = 'Accept, Accept-Encoding'

// Media types that mean "give me markdown". Wildcards are deliberately not in
// this list: a browser sending `*/*;q=0.8` is asking for anything, not markdown.
const MARKDOWN_TYPES = new Set(['text/markdown', 'text/x-markdown'])

/**
 * Parse an Accept header into `{ type, quality }` entries, most-preferred first.
 * Malformed entries are skipped rather than throwing.
 */
export function parseAccept(header) {
  if (!header) return []
  return header
    .split(',')
    .map((part) => {
      const [rawType, ...params] = part.trim().split(';')
      const type = rawType.trim().toLowerCase()
      if (!type || type.indexOf('/') === -1) return null

      let quality = 1
      for (const param of params) {
        const [key, value] = param.split('=')
        if (key && key.trim().toLowerCase() === 'q') {
          const parsed = Number.parseFloat(value)
          quality = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1
        }
      }
      return { type, quality }
    })
    .filter(Boolean)
    .sort((a, b) => b.quality - a.quality)
}

const bestQuality = (entries, matches) =>
  entries.reduce((best, entry) => (matches(entry.type) ? Math.max(best, entry.quality) : best), 0)

export function markdownQuality(header) {
  return bestQuality(parseAccept(header), (type) => MARKDOWN_TYPES.has(type))
}

export function htmlQuality(header) {
  return bestQuality(
    parseAccept(header),
    (type) => type === 'text/html' || type === 'application/xhtml+xml' || type === 'text/*' || type === '*/*',
  )
}

/**
 * True when the client would rather have markdown than HTML. Requires markdown
 * to be named explicitly and to win on q-value, so browsers — which list
 * text/html first and a low-q catch-all wildcard last — keep getting HTML.
 */
export function prefersMarkdown(header) {
  const markdown = markdownQuality(header)
  return markdown > 0 && markdown >= htmlQuality(header)
}

/** True when HTML is not an acceptable representation for this client at all. */
export function rejectsHtml(header) {
  return parseAccept(header).length > 0 && htmlQuality(header) === 0
}

const trimSlashes = (pathname) => {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/**
 * Map an HTML route to its `.md` twin. Returns null for anything that is not a
 * known page, so unknown paths fall through to the 404 handling.
 *
 * @param {string} pathname
 * @param {(path: string) => (string|null)} lookup  markdownPathFor from src/site.js
 */
export function markdownTargetFor(pathname, lookup) {
  return lookup(trimSlashes(pathname))
}

/**
 * Decide what to serve for a request, before the origin response is known.
 * @returns {{ serveMarkdown: boolean, markdownPath: string|null, notAcceptable: boolean }}
 */
export function negotiate(acceptHeader, pathname, lookup) {
  const markdownPath = markdownTargetFor(pathname, lookup)
  const serveMarkdown = prefersMarkdown(acceptHeader)
  return {
    serveMarkdown,
    markdownPath,
    // Only refuse when the client asked for markdown, refuses HTML outright, and
    // this path has no markdown twin. Anything less strict risks 406-ing a
    // crawler that would have been happy with the HTML.
    notAcceptable: serveMarkdown && !markdownPath && rejectsHtml(acceptHeader),
  }
}
