import { useState } from 'react'
import { useLang } from '../context/LangContext'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'
import { PlusIcon } from './icons'

export default function FAQ() {
  const { t } = useLang()
  // One open at a time; null means all closed.
  const [open, setOpen] = useState(null)

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <SectionTitle
          center
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          accent={t.faq.accent}
        />

        <div className="faq-list">
          {t.faq.items.map((item, index) => {
            const isOpen = open === index
            return (
              <Reveal
                className={isOpen ? 'faq-item open' : 'faq-item'}
                delay={index * 60}
                key={item.q}
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faqA${index}`}
                    id={`faqQ${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true"><PlusIcon /></span>
                  </button>
                </h3>
                {/* The answer stays in the DOM whether open or closed: it is
                    page copy, and the FAQPage JSON-LD claims it is there. */}
                <div className="faq-a" id={`faqA${index}`} role="region" aria-labelledby={`faqQ${index}`}>
                  <div className="faq-a-inner"><p>{item.a}</p></div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
