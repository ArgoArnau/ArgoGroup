import Hero from '../components/Hero'
import Services from '../components/Services'
import Methodology from '../components/Methodology'
import WhyArgo from '../components/WhyArgo'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'
import { useLang } from '../context/LangContext'

export default function Home() {
  const { t } = useLang()

  return (
    <>
      <Hero />
      <Services />
      <Methodology />
      <WhyArgo />
      <FAQ />

      {/* Inline contact section */}
      <section className="py-24 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.homeContact.title}</h2>
            <div className="gold-line" />
            <p className="text-gray-400">{t.homeContact.sub}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
