import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

function LinkedInIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

export default function Footer({ setShowBanner }) {
  const { t } = useLang()

  return (
    <footer className="bg-[#0d0d0d] border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-widest text-gold">ARGO</span>
              <span className="text-xs text-gray-400 tracking-widest uppercase border-l border-dark-border pl-2">Group</span>
            </Link>
            <p className="text-gray-400 text-sm mt-3 mb-6 max-w-xs leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">{t.footer.navTitle}</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-gold text-sm transition-colors">{t.nav.services}</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gold text-sm transition-colors">{t.nav.contact}</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-gold text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-gold text-sm transition-colors">Terms of Service</Link></li>
              <li>
                <button
                  onClick={() => { localStorage.removeItem('argo_cookie_consent'); setShowBanner(true) }}
                  className="text-gray-400 hover:text-gold text-sm transition-colors"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">{t.footer.contactTitle}</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="mailto:info@argogroup.com" className="flex items-center gap-2 text-gray-400 hover:text-gold text-sm transition-colors">
                  <Mail size={14} /> info@argogroup.com
                </a>
              </li>
            </ul>
            <a
              href="https://linkedin.com/company/YOURCOMPANY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 border border-dark-border rounded-full text-gray-400 hover:text-gold hover:border-gold transition-colors mb-3"
              title="LinkedIn"
            >
              <LinkedInIcon size={16} />
            </a>
            <br />
            <Link to="/contact" className="btn-outline text-sm px-5 py-2">{t.nav.contact}</Link>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-8">
          <p className="text-gray-500 text-sm text-center">{t.footer.copy}</p>
        </div>
      </div>
    </footer>
  )
}
