import { useEffect } from 'react'

/**
 * Scroll reveal: marks each [data-reveal] element with data-in the first time
 * it comes on screen; the landing's stylesheet animates the change. Runs after hydration,
 * so the server markup and the first client render stay identical. Without
 * the `motion` class (reduced motion, or boot.js gave up) everything is
 * already visible and this only records that the script ran.
 */
export function useReveal() {
  useEffect(() => {
    window.__landingReady = true
    const root = document.documentElement
    const items = [...document.querySelectorAll('[data-reveal]')]
    if (!root.classList.contains('motion') || !('IntersectionObserver' in window)) {
      root.classList.remove('motion')
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-in', '')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [])
}
