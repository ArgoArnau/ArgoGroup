import ContactCard from '../components/ContactCard'
import { useLang } from '../context/LangContext'

export default function ContactPage() {
  const { t } = useLang()
  const cp = t.contactPage

  return (
    <main id="main" className="section contact">
      <div className="container">
        {/* Same panel as the homepage, but this is the page's H1. */}
        <ContactCard eyebrow={t.homeContact.eyebrow} title={cp.title} sub={cp.sub} heading="h1" />
      </div>
    </main>
  )
}
