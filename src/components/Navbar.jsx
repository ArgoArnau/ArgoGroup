import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import AnchorLink from './AnchorLink'
import { InstagramIcon, LinkedInIcon } from './icons'
import { site } from '../site.js'
import { SECTIONS } from '../sections.js'

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleSection, setVisibleSection] = useState(null)

  // Only the homepage has sections; elsewhere nothing is underlined.
  const activeSection = pathname === '/' ? visibleSection : null

  // Solid background once the page has moved off the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(document.documentElement.scrollTop > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Underline whichever section is filling the viewport. Only the homepage has
  // sections to track.
  useEffect(() => {
    if (pathname !== '/') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setVisibleSection(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [pathname])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={scrolled ? 'nav scrolled' : 'nav'} id="nav" aria-label={site.name}>
        <div className="container nav-inner">
          <Brand onClick={closeMenu} />

          <div className="nav-links">
            {SECTIONS.map((section) => (
              <AnchorLink
                key={section.id}
                id={section.id}
                className={activeSection === section.id ? 'nav-link active' : 'nav-link'}
              >
                {t.nav[section.key]}
              </AnchorLink>
            ))}
            <Link className={pathname === '/about' ? 'nav-link active' : 'nav-link'} to="/about">
              {t.nav.about}
            </Link>
          </div>

          <div className="nav-actions">
            <a className="social-btn" href={site.sameAs[0]} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a className="social-btn" href={site.sameAs[1]} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <LangToggle lang={lang} setLang={setLang} />
            <AnchorLink id="contacto" className="btn btn-gold">
              {t.nav.cta}
            </AnchorLink>
            <button
              className="nav-burger"
              aria-label={t.nav.cta}
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={menuOpen ? 'mobile-menu open' : 'mobile-menu'} id="mobileMenu">
        {SECTIONS.map((section) => (
          <AnchorLink key={section.id} id={section.id} className="nav-link" onNavigate={closeMenu}>
            {t.nav[section.key]}
          </AnchorLink>
        ))}
        <Link className="nav-link" to="/about" onClick={closeMenu}>{t.nav.about}</Link>
        <Link className="nav-link" to="/contact" onClick={closeMenu}>{t.nav.contact}</Link>
        <div className="mobile-menu-footer">
          <LangToggle lang={lang} setLang={setLang} />
          <AnchorLink id="contacto" className="btn btn-gold" onNavigate={closeMenu}>{t.nav.cta}</AnchorLink>
        </div>
      </div>
    </>
  )
}

function Brand({ onClick }) {
  return (
    <Link className="brand" to="/" aria-label={site.name} onClick={onClick}>
      <span className="brand-name">ARGO</span>
      <span className="brand-tag">Group</span>
    </Link>
  )
}

export function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {['es', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          className={lang === code ? 'active' : undefined}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
