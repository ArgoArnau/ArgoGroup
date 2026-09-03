import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { WhatsAppIcon } from './icons'
import { site } from '../site.js'

// While one of these is on screen the floating button steps aside. It used to
// sit on top of the form fields and the footer's own links, and both of these
// already offer WhatsApp in the page itself.
const YIELDS_TO = '.contact-card, .footer'

export default function WhatsAppButton() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll(YIELDS_TO)
    if (!targets.length) return

    const showing = new Set()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) showing.add(entry.target)
        else showing.delete(entry.target)
      }
      setHidden(showing.size > 0)
    })

    for (const target of targets) observer.observe(target)
    return () => {
      observer.disconnect()
      setHidden(false)
    }
  }, [pathname])

  const text = lang === 'es'
    ? 'Hola, me interesan los servicios de ARGO'
    : "Hi, I'm interested in ARGO's services"

  return (
    <a
      className={hidden ? 'wa-float is-hidden' : 'wa-float'}
      href={`${site.whatsapp}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
    >
      <WhatsAppIcon />
    </a>
  )
}
