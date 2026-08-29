import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { site, canonicalFor, markdownPathFor } from '../site.js'
import { buildJsonLd, serializeJsonLd } from '../seo/jsonld.js'
import { metaFor, resolvePath } from '../seo/meta.js'

export default function SEO() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const path = resolvePath(pathname)
  const meta = metaFor(path, lang)
  const canonical = canonicalFor(path)
  const markdownUrl = `${site.origin}${markdownPathFor(path)}`

  return (
    <Helmet>
      <html lang={lang} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" type="text/markdown" href={markdownUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={site.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={site.image} />
      <script type="application/ld+json">
        {serializeJsonLd(buildJsonLd(path, meta, lang))}
      </script>
    </Helmet>
  )
}
