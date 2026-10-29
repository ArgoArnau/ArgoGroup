// What the handlers in server/ need from the host, read from Vercel: the
// visitor's IP and country (headers Vercel sets on every request) and
// waitUntil, which keeps the function alive for work after the answer.
// Every api/*.js passes it as the handler's `context`.

import { waitUntil } from '@vercel/functions'

export function vercelContext(request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
  return {
    ip: request.headers.get('x-real-ip') || forwarded || undefined,
    geo: { country: { code: request.headers.get('x-vercel-ip-country') || undefined } },
    waitUntil,
  }
}
