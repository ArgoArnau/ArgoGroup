// /api/event on Vercel: the handler in server/meta-capi.js.

import handler from '../server/meta-capi.js'
import { vercelContext } from '../server/vercel.js'

export default {
  fetch: (request) => handler(request, vercelContext(request)),
}
