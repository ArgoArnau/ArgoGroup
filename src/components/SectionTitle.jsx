import Reveal from './Reveal'

/**
 * Section heading in the house style: small gold eyebrow, then a display-serif
 * title whose accent word is set in italic gold by `.section-title em`.
 *
 * The accent is stored beside the title in i18n rather than as markup, so the
 * markdown twins and JSON-LD keep a clean plain-text title (see
 * src/content/markdown.js).
 */
export default function SectionTitle({ eyebrow, title, accent, sub, center = false, id }) {
  return (
    <Reveal className={center ? 'section-head center' : 'section-head'}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" id={id}>
        <AccentedTitle title={title} accent={accent} />
      </h2>
      {sub && <p className="section-sub">{sub}</p>}
    </Reveal>
  )
}

export function AccentedTitle({ title, accent }) {
  if (!accent) return title

  const at = title.indexOf(accent)
  // A translation that no longer contains its accent word still renders, plain.
  if (at === -1) return title

  return (
    <>
      {title.slice(0, at)}
      <em>{accent}</em>
      {title.slice(at + accent.length)}
    </>
  )
}
