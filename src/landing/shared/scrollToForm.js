import { DOCKED_FORM } from './useFormPanel.js'

/**
 * onClick for the hero's link to #form (the review button, on every screen).
 * Wide screens: the form is docked beside the hero, so the cursor goes into
 * its first field. Phones and portrait tablets: the window scrolls so the
 * form card starts at the top of the screen, past what sits above it in the
 * slot (the gold sentence and the points). The link alone should get there,
 * but on these pages Chrome cuts the smooth scroll of `#form` (and of
 * scrollIntoView) short after a few pixels, while window.scrollTo arrives
 * every time. Without a behaviour of its own it follows the page's CSS:
 * smooth, or instant with reduced motion. Without JavaScript the href still
 * does the job.
 */
export function scrollToForm(event) {
  if (window.matchMedia(DOCKED_FORM).matches) {
    const field = document.getElementById('f-name')
    if (!field) return
    event.preventDefault()
    field.focus()
    return
  }
  const target = document.querySelector('#form .form-card') || document.getElementById('form')
  if (!target) return
  event.preventDefault()
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - padding })
}
