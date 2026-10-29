// /api/lead on Vercel: the handler in server/lead.js.

import handler from '../server/lead.js'
import { vercelContext } from '../server/vercel.js'

export default {
  fetch: (request) => handler(request, vercelContext(request)),
}
