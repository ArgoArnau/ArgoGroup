import { translations } from '../i18n.js'

// Unknown paths fall back to the homepage entry so a route we do not know about
// still ships a valid title, description, canonical URL and JSON-LD graph.
export function resolvePath(pathname) {
  return pathname in translations.en.meta.pages ? pathname : '/'
}

export function metaFor(pathname, lang = 'en') {
  const t = translations[lang] || translations.en
  return t.meta.pages[resolvePath(pathname)]
}
