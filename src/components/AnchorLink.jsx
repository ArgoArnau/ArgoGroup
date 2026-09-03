import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Link to a section of the homepage from anywhere on the site.
 *
 * On `/` it scrolls smoothly without touching the router. From another route it
 * navigates to `/#<id>`; Home reads the hash on mount and scrolls there, so the
 * link works the same either way and the URL stays shareable.
 */
export default function AnchorLink({ id, className, children, onNavigate, ...rest }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleClick = (event) => {
    onNavigate?.()

    if (pathname !== '/') {
      event.preventDefault()
      navigate(`/#${id}`)
      return
    }

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <a href={`/#${id}`} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
