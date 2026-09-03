import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n'

const LangContext = createContext()

const STORAGE_KEY = 'argo-lang'

export function LangProvider({ children }) {
  // Always 'en' on the first render: the prerendered HTML is English, and
  // reading storage during render would make the client disagree with it.
  // A stored preference is applied just after hydration instead.
  const [lang, setLang] = useState('en')

  // Applying the stored preference is exactly the case the rule warns about,
  // and exactly the case it cannot cover: reading storage during render would
  // make the client disagree with the prerendered English HTML it hydrates.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && translations[saved]) setLang(saved)
    } catch {
      // Storage blocked: English it is.
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Nothing to do; the choice just will not survive the visit.
    }
  }, [lang])

  const t = translations[lang]
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
