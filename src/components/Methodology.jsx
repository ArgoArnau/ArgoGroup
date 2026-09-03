import { useLang } from '../context/LangContext'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Methodology() {
  const { t } = useLang()

  return (
    <section className="section method" id="proceso">
      <div className="container">
        <SectionTitle
          center
          eyebrow={t.methodology.eyebrow}
          title={t.methodology.title}
          accent={t.methodology.accent}
        />

        <div className="method-list">
          {t.methodology.items.map((item) => (
            <Reveal className="method-item" key={item.number}>
              <div className="method-num" aria-hidden="true">{item.number}</div>
              <div className="method-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
