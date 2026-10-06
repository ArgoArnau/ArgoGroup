import Reveal from './Reveal'
import SplitText from './SplitText'

/**
 * Section heading in the house style: small gold eyebrow, then a display-serif
 * title whose accent word is set in gold by `.section-title em`, its letters
 * rising into place as the section scrolls in (see SplitText).
 *
 * The accent is stored beside the title in i18n rather than as markup, so the
 * markdown twins and JSON-LD keep a clean plain-text title (see
 * src/content/markdown.js).
 */
export default function SectionTitle({ eyebrow, title, accent, sub, center = false, id }) {
  return (
    <Reveal className={center ? 'section-head center' : 'section-head'}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" id={id} aria-label={title}>
        <SplitText title={title} accent={accent} />
      </h2>
      {sub && <p className="section-sub">{sub}</p>}
    </Reveal>
  )
}
