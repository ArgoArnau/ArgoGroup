import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'

function LinkedInIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t, lang, setLang } = useLang()

  const handleServicesClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold">ARGO</span>
            <span className="hidden sm:block text-xs text-gray-400 tracking-widest uppercase border-l border-dark-border pl-2">Group</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" onClick={handleServicesClick} className="text-gray-300 hover:text-gold transition-colors text-sm tracking-wide">
              {t.nav.services}
            </a>
            <Link to="/about" className="text-gray-300 hover:text-gold transition-colors text-sm tracking-wide">
              {t.nav.about}
            </Link>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/group-argo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-dark-border rounded-full flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon size={14} />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/group_argo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-dark-border rounded-full flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                title="Instagram"
              >
                <InstagramIcon size={14} />
              </a>
            </div>

            {/* Language toggle */}
            <div className="flex items-center border border-dark-border rounded-full overflow-hidden text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 transition-colors ${lang === 'en' ? 'bg-gold text-dark font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-3 py-1 transition-colors ${lang === 'es' ? 'bg-gold text-dark font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                ES
              </button>
            </div>

            <Link to="/contact" className="btn-gold text-sm">{t.nav.cta}</Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-gold" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-surface border-t border-dark-border px-4 pb-4 pt-2 space-y-3">
          <a href="#services" onClick={handleServicesClick} className="block text-gray-300 hover:text-gold py-2 text-sm">{t.nav.services}</a>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-gold py-2 text-sm">{t.nav.about}</Link>
          <a
            href="https://www.linkedin.com/company/group-argo/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-gold py-2 text-sm"
          >
            <LinkedInIcon size={14} /> LinkedIn
          </a>
          <a
            href="https://www.instagram.com/group_argo/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-gold py-2 text-sm"
          >
            <InstagramIcon size={14} /> Instagram
          </a>

          {/* Mobile language toggle */}
          <div className="flex items-center border border-dark-border rounded-full overflow-hidden text-xs w-fit">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-gold text-dark font-semibold' : 'text-gray-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-3 py-1.5 transition-colors ${lang === 'es' ? 'bg-gold text-dark font-semibold' : 'text-gray-400'}`}
            >
              ES
            </button>
          </div>

          <Link to="/contact" onClick={() => setMenuOpen(false)} className="btn-gold block text-center text-sm mt-2">{t.nav.cta}</Link>
        </div>
      )}
    </nav>
  )
}
