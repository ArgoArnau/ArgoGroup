/**
 * A slow gold band of the four things we build, turning under the hero.
 * The list is read once; the three copies after it fill wide screens and
 * close the loop, and are hidden from assistive tech. Static (wrapped, no
 * movement) for visitors who prefer less motion.
 */
export default function Ticker({ items }) {
  const row = (hidden) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
  return (
    <div className="ticker">
      <div className="ticker-mask">
        <div className="ticker-track">
          {row(false)}
          {row(true)}
          {row(true)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
