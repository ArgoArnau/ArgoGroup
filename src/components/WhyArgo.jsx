import { useLang } from '../context/LangContext'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'
import { icons } from './iconSet'

// Positional, like SERVICE_ICONS in Services.jsx: presentation, not copy.
const WHY_ICONS = ['zap', 'bulb', 'eye', 'building']

export default function WhyArgo() {
  const { t } = useLang()

  return (
    <section className="section why" id="por-que-argo">
      <div className="container">
        <div className="why-grid">
          <div>
            <SectionTitle
              eyebrow={t.whyArgo.eyebrow}
              title={t.whyArgo.title}
              accent={t.whyArgo.accent}
            />
            <div className="why-intro">
              {t.whyArgo.intro.map((paragraph) => (
                <Reveal as="p" key={paragraph}>{paragraph}</Reveal>
              ))}
            </div>
          </div>

          <div className="why-cards">
            {t.whyArgo.items.map((item, index) => (
              <Reveal className="why-card" delay={index * 90} key={item.title}>
                <div className="feature-icon">{icons[WHY_ICONS[index]] ?? icons.zap}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
