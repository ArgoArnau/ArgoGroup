// Local stand-in for the Netlify runtime, so the built site can be verified end
// to end without deploying: static file resolution with pretty URLs, a real 404
// status backed by dist/404.html, and the markdown edge function running in
// front of it with the same path inclusion/exclusion rules.
//
// Usage: node scripts/serve.mjs [port]

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

const edge = await import(pathToFileURL(join(ROOT, 'netlify', 'edge-functions', 'markdown.js')).href)
const edgeHandler = edge.default
const edgeConfig = edge.config

const included = [].concat(edgeConfig.path).map((pattern) => new URLPattern({ pathname: pattern }))
const excluded = [].concat(edgeConfig.excludedPath || []).map((pattern) => new URLPattern({ pathname: pattern }))

// An absent `method` means no restriction, so the handler sees every method and
// filters them itself — the same arrangement as in production.
const runsEdgeFunction = (pathname, method) =>
  (!edgeConfig.method || edgeConfig.method.includes(method))
  && included.some((pattern) => pattern.test({ pathname }))
  && !excluded.some((pattern) => pattern.test({ pathname }))

const CONTENT_TYPES = {
  '.css': 'text/css; charset=UTF-8',
  '.html': 'text/html; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
}

const readIfFile = async (path) => {
  try {
    const info = await stat(path)
    return info.isFile() ? await readFile(path) : null
  } catch {
    return null
  }
}

const ok = (body, path) => new Response(body, {
  status: 200,
  headers: {
    'Content-Type': CONTENT_TYPES[extname(path)] || 'application/octet-stream',
    Vary: 'Accept-Encoding',
  },
})

const movedTo = (location) => new Response(null, { status: 301, headers: { Location: location } })

// Mirrors Netlify's static resolution, including the redirects its Pretty URLs
// behaviour adds — `<name>.html` is served in place at /name, while a
// `<name>/index.html` would make /name a 301 to /name/. Modelling the redirects
// rather than resolving straight through is the point: it is what catches a
// canonical URL that does not answer 200.
async function serveStatic(pathname) {
  const decoded = decodeURIComponent(pathname)
  const hadTrailingSlash = decoded.length > 1 && decoded.endsWith('/')
  const clean = decoded.replace(/\/+$/, '') || '/'

  if (clean === '/') {
    const body = await readIfFile(join(DIST, 'index.html'))
    if (body) return ok(body, 'index.html')
  } else if (join(DIST, clean).startsWith(DIST)) {
    const exact = await readIfFile(join(DIST, clean))
    if (exact) return ok(exact, clean)

    const flat = await readIfFile(join(DIST, `${clean}.html`))
    if (flat) return hadTrailingSlash ? movedTo(clean) : ok(flat, `${clean}.html`)

    const nested = await readIfFile(join(DIST, clean, 'index.html'))
    if (nested) return hadTrailingSlash ? ok(nested, 'index.html') : movedTo(`${clean}/`)
  }

  const notFound = await readIfFile(join(DIST, '404.html'))
  return new Response(notFound ?? 'Not found', {
    status: 404,
    headers: { 'Content-Type': notFound ? 'text/html; charset=UTF-8' : 'text/plain; charset=UTF-8' },
  })
}

export function createSiteServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
      const request = new Request(url, { method: req.method, headers: req.headers })
      const context = { next: () => serveStatic(url.pathname) }

      const response = runsEdgeFunction(url.pathname, req.method)
        ? await edgeHandler(request, context)
        : await serveStatic(url.pathname)

      res.writeHead(response.status, Object.fromEntries(response.headers))
      const body = response.body ? Buffer.from(await response.arrayBuffer()) : null
      res.end(req.method === 'HEAD' ? undefined : body)
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(String(error && error.stack ? error.stack : error))
    }
  })
}

// `node scripts/serve.mjs [port]` — only listen when run directly.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const port = Number(process.argv[2] || 4180)
  createSiteServer().listen(port, () => {
    console.log(`serving dist/ with the markdown edge function on http://localhost:${port}`)
  })
}
