// /api/geo on Vercel: the handler in server/geo.js.

import handler from '../server/geo.js'
import { vercelContext } from '../server/vercel.js'

export default {
  fetch: (request) => handler(request, vercelContext(request)),
}
