import { Helmet } from 'react-helmet-async'
import { useLang } from '../context/LangContext'

const seoContent = {
  en: {
    title: 'Argo Group | Performance Marketing Agency in Spain & Miami',
    description:
      'We scale your business with results-driven marketing: lead generation, paid media creatives, and automation systems. Book a call.',
  },
  es: {
    title: 'Argo Group | Agencia de Performance Marketing en España y Miami',
    description:
      'Escalamos tu negocio con marketing de resultados: generación de leads, creatividades para paid media y sistemas de automatización. Consigue una llamada.',
  },
}

export default function SEO() {
  const { lang } = useLang()
  const content = seoContent[lang] || seoContent.en

  return (
    <Helmet>
      <html lang={lang} />
      <title>{content.title}</title>
      <meta name="description" content={content.description} />
      <link rel="canonical" href="https://www.groupargous.com/" />
    </Helmet>
  )
}
