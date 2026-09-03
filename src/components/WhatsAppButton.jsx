import { useLang } from '../context/LangContext'
import { WhatsAppIcon } from './icons'
import { site } from '../site.js'

export default function WhatsAppButton() {
  const { lang } = useLang()
  const text = lang === 'es'
    ? 'Hola, me interesan los servicios de ARGO'
    : "Hi, I'm interested in ARGO's services"

  return (
    <a
      className="wa-float"
      href={`${site.whatsapp}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}
