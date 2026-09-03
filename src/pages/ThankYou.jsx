import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { BigCheckIcon } from '../components/icons'

export default function ThankYou() {
  const { t } = useLang()

  return (
    <main id="main" className="container thanks-page">
      <div className="success-check" aria-hidden="true"><BigCheckIcon /></div>
      <h1>{t.thankYou.headline}</h1>
      <p>{t.thankYou.sub}</p>
      <Link className="btn btn-gold" to="/">{t.thankYou.cta}</Link>
    </main>
  )
}
