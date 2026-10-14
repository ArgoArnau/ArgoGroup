import { useEffect, useRef, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The four things we build, as a large list, each with a line on what it
 * covers. Every item is muted except
 * the one at the middle of the screen (or under the cursor), which lights
 * up; a gold blob with its number travels beside it. The blob is decorative:
 * the list itself carries the content.
 */
export default function WorkList({ items }) {
  const listRef = useRef(null)
  const blobRef = useRef(null)
  const [active, setActive] = useState(0)

  // Scroll-spy: the row whose centre is nearest the middle of the screen is
  // active, while the list is on screen. Checked once per frame at most.
  useEffect(() => {
    const list = listRef.current
    let frame = 0
    const pick = () => {
      frame = 0
      const box = list.getBoundingClientRect()
      if (box.bottom < 0 || box.top > window.innerHeight) return
      const middle = window.innerHeight / 2
      let best = 0
      let bestDistance = Infinity
      ;[...list.children].forEach((row, index) => {
        const r = row.getBoundingClientRect()
        const distance = Math.abs(r.top + r.height / 2 - middle)
        if (distance < bestDistance) { best = index; bestDistance = distance }
      })
      setActive(best)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(pick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Move the blob to the active row. Set on the DOM, not in state, so it
  // never re-renders the list.
  useEffect(() => {
    const place = () => {
      const row = listRef.current?.children[active]
      if (row && blobRef.current) {
        blobRef.current.style.setProperty('--blob-y', `${row.offsetTop + row.offsetHeight / 2}px`)
      }
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  return (
    <div className="work-wrap">
      <div ref={blobRef} className="work-blob" aria-hidden="true">
        <span className="work-blob-shape">
          <span key={active} className="work-blob-num">{pad(active + 1)}</span>
        </span>
      </div>
      <ol className="work" ref={listRef}>
        {items.map(([item, line], index) => (
          <li
            key={item}
            data-reveal="left"
            data-active={index === active ? 'true' : undefined}
            style={{ '--i': index }}
            onPointerEnter={() => setActive(index)}
          >
            <span className="work-text">
              <span className="work-name">{item}</span>
              <span className="work-line">{line}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
