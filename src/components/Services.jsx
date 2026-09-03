import { useState } from 'react'
import { useLang } from '../context/LangContext'
import SectionTitle from './SectionTitle'
import { CheckIcon } from './icons'
import { icons } from './iconSet'

// Icons per service, per section, positionally. They live here rather than in
// i18n because they are presentation, not copy — and both languages share the
// same service structure.
const SERVICE_ICONS = [
  ['target', 'sliders', 'trending'],
  ['cpu', 'database', 'workflow', 'chart'],
  ['gem', 'layers', 'monitor', 'sparkles'],
]

export default function Services() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const services = t.services.items

  return (
    <section className="section services" id="servicios">
      <div className="container">
        <SectionTitle
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          accent={t.services.accent}
        />

        <div className="service-tabs" role="tablist" aria-label={t.services.title}>
          {services.map((service, index) => (
            <button
              key={service.title}
              className={index === active ? 'service-tab active' : 'service-tab'}
              role="tab"
              id={`serviceTab${index}`}
              aria-selected={index === active}
              aria-controls={`servicePane${index}`}
              onClick={() => setActive(index)}
            >
              <span className="num">0{index + 1}</span>
              <span className="name">{service.title}</span>
              <span className="desc">{service.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Every pane stays in the DOM: the inactive ones are still the page's
            copy, and crawlers that do not click tabs should read all of it. */}
        <div className="service-panel">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={index === active ? 'service-pane active' : 'service-pane'}
              role="tabpanel"
              id={`servicePane${index}`}
              aria-labelledby={`serviceTab${index}`}
            >
              <p className="service-intro">{service.subtitle}</p>
              <div className="section-grid">
                {service.sections.map((section, sectionIndex) => (
                  <FeatureCard
                    key={section.heading}
                    icon={SERVICE_ICONS[index]?.[sectionIndex]}
                    section={section}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, section }) {
  // The gold spotlight in .feature-card::before follows these two properties.
  const trackPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article className="feature-card" onPointerMove={trackPointer}>
      <div className="feature-icon">{icons[icon] ?? icons.sparkles}</div>
      <h4>{section.heading}</h4>
      <p className="tagline">{section.headline}</p>
      <ul>
        {section.items.map((item) => (
          <li key={item}><CheckIcon />{item}</li>
        ))}
      </ul>
    </article>
  )
}
