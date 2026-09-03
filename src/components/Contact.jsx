import { useLang } from '../context/LangContext'
import ContactCard from './ContactCard'

export default function Contact() {
  const { t } = useLang()
  const c = t.homeContact

  return (
    <section className="section contact" id="contacto">
      <div className="container">
        <ContactCard eyebrow={c.eyebrow} title={c.title} accent={c.accent} sub={c.sub} />
      </div>
    </section>
  )
}
