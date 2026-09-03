import { useEffect, useRef, useState } from 'react'

/**
 * Reveals its children once they scroll into view, by adding the `.visible`
 * class the stylesheet animates towards.
 *
 * Every reveal carries `data-reveal`, which is what the reduced-motion rule in
 * index.css and the <noscript> rule in index.html target: anyone who will never
 * receive the observer sees the content up front, and the prerendered HTML
 * contains it either way.
 */
export default function Reveal({ scale = false, delay = 0, className = '', children, ...rest }) {
  // Not destructured as `as: Tag`: a capitalised parameter reads as unused to
  // the no-unused-vars rule, which has no JSX-aware plugin behind it here.
  const Tag = rest.as || 'div'
  delete rest.as

  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const classes = [scale ? 'reveal-scale' : 'reveal', visible && 'visible', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={classes}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
