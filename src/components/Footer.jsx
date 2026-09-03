import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import AnchorLink from './AnchorLink'
import { SECTIONS } from '../sections.js'
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from './icons'
import { site } from '../site.js'

export default function Footer({ setShowBanner }) {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label={site.name}>
              <span className="brand-name">ARGO</span>
              <span className="brand-tag">Group</span>
            </Link>
            <p className="footer-tagline">{t.footer.tagline}</p>
            <div className="footer-social">
              <a className="social-btn" href={site.sameAs[0]} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a className="social-btn" href={site.sameAs[1]} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a className="social-btn" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t.footer.navTitle}</h4>
            <ul>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <AnchorLink id={section.id}>{t.nav[section.key]}</AnchorLink>
                </li>
              ))}
              <li><Link to="/about">{t.nav.about}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.footer.contactTitle}</h4>
            <ul>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href={site.whatsapp} target="_blank" rel="noopener noreferrer">{site.telephoneDisplay}</a></li>
              <li><span className="loc">{t.hero.badge}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copy}</span>
          <div className="footer-legal">
            <Link to="/privacy-policy">{t.footer.privacy}</Link>
            <Link to="/terms-of-service">{t.footer.terms}</Link>
            {/* Consent is revocable: this reopens the banner. */}
            <button type="button" onClick={() => setShowBanner(true)}>Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
