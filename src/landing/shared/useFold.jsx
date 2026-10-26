import { useState } from 'react'

/**
 * Phones (<768px): the long parts of some sections are folded, so the page
 * under the form stays short (the landing's stylesheet, "Folded sections").
 * `fold(key)` gives a section its attributes; `seeMore(key)` is the button
 * that unfolds it, hidden on wider screens, where everything shows as always.
 */
export function useFold(labels) {
  const [open, setOpen] = useState({})
  return {
    fold: (key) => ({ 'data-fold': '', 'data-open': open[key] ? '' : undefined }),
    seeMore: (key) => (
      <button
        type="button"
        className="see-more linklike"
        aria-expanded={Boolean(open[key])}
        onClick={() => setOpen((current) => ({ ...current, [key]: !current[key] }))}
      >
        {open[key] ? labels.seeLess : labels.seeMore}
      </button>
    ),
  }
}
