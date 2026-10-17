import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { OLD_ANCHORS } from '../sections.js'

/**
 * A new route starts at the top — unless the URL names a section, in which case
 * it starts there. AnchorLink navigates to `/#<id>` from other routes, so this
 * is what makes those links land in the right place.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // An old Spanish anchor (#servicios) goes to its section, and the address
    // bar shows the current one.
    const asked = decodeURIComponent(hash.slice(1))
    const id = OLD_ANCHORS[asked] ?? asked
    if (id !== asked) window.history.replaceState(window.history.state, '', `${pathname}#${id}`)

    // The section has to exist before it can be scrolled to; on a fresh page
    // load that is one frame after the route mounts.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
