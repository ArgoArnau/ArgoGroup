import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const STORAGE_KEY = 'argo_cookie_consent'

export default function CookieBanner({ showBanner, setShowBanner }) {
  const { t, lang } = useLang()

  const choose = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Private mode or blocked storage: the banner still closes for this visit.
    }
    setShowBanner(false)
  }

  if (!showBanner) return null

  const copy = lang === 'es'
    ? {
        title: 'Usamos cookies',
        body: 'ARGO Group usa cookies para mejorar tu experiencia, analizar el tráfico del sitio y apoyar nuestras acciones de marketing. Al aceptar, consientes su uso. Más detalles en nuestra',
        accept: 'Aceptar',
        decline: 'Rechazar',
      }
    : {
        title: 'We use cookies',
        body: 'ARGO Group uses cookies to improve your experience, analyze site traffic, and support our marketing efforts. By accepting, you consent to their use. Learn more in our',
        accept: 'Accept',
        decline: 'Decline',
      }

  return (
    <div className="cookie-banner" role="dialog" aria-label={copy.title}>
      <div className="cookie-inner">
        <h2>{copy.title}</h2>
        <p>
          {copy.body}{' '}
          <Link to="/privacy-policy">{t.footer.privacy}</Link>.
        </p>
        <div className="cookie-actions">
          <button className="btn btn-gold" type="button" onClick={() => choose('accepted')}>{copy.accept}</button>
          <button className="btn btn-ghost" type="button" onClick={() => choose('declined')}>{copy.decline}</button>
        </div>
      </div>
    </div>
  )
}
