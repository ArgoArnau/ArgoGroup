import { useEffect } from 'react'

/**
 * Endless animations (the ticker, the blob beside the work list, the /systems
 * mock) only run while they are on screen: every [data-loop] element gets
 * data-onscreen while any of it is visible, and the landing's stylesheet
 * pauses everything inside one that has not got it, from first paint. Saves
 * main-thread and paint work on slow phones; the visitor, who only sees them
 * on screen, sees no difference.
 */
export function usePauseOffscreen() {
  useEffect(() => {
    const items = [...document.querySelectorAll('[data-loop]')]
    if (!('IntersectionObserver' in window)) {
      for (const item of items) item.setAttribute('data-onscreen', '')
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.toggleAttribute('data-onscreen', entry.isIntersecting)
    })
    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [])
}
