import { useCallback, useState } from 'react'

// Where the docked form stops being a sheet and sits beside the content.
export const DOCKED_FORM = '(min-width: 1024px)'

/**
 * Opening "the form". On wide screens it is always on screen beside the
 * content, so opening it just puts the cursor in the first field. On phones
 * and tablets it opens as a bottom sheet over the page.
 */
export function useFormPanel() {
  const [sheetOpen, setSheetOpen] = useState(false)

  const openForm = useCallback(() => {
    if (window.matchMedia(DOCKED_FORM).matches) {
      document.getElementById('f-name')?.focus()
      return
    }
    setSheetOpen(true)
  }, [])

  const closeForm = useCallback(() => setSheetOpen(false), [])

  return { sheetOpen, openForm, closeForm }
}
