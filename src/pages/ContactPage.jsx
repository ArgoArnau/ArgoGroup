import ContactCard from '../components/ContactCard'
import { useLang } from '../context/LangContext'

export default function ContactPage() {
  const { t } = useLang()
  const cp = t.contactPage

  return (
    <main id="main" className="section contact">
      <div className="container">
        {/* Same panel as the homepage, but this is the page's H1 — and with no
            eyebrow, which on this route would just repeat the heading. */}
        <ContactCard title={cp.title} sub={cp.sub} heading="h1" />
      </div>
    </main>
  )
}
