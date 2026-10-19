// The thank-you page's content, shared by /growth/thank-you and
// /systems/thank-you. Each landing keeps its own chrome (top bar, footer,
// dock) and its own copy; this is the part in between. Styles in
// thank-you.css, imported by both landings' main.jsx.
//
// Motion is CSS only (html.motion, set by boot.js): the seal draws itself,
// the title rises word by word, then the gold jumps from step 1 to 2 to 3
// along the line, and keeps going round. Without motion everything is simply
// there, with step 1 in gold.

/** One span per word, so each rises out of its own mask; the last `gold` words in gold. */
function Words({ text, gold }) {
  const words = text.split(' ')
  return words.map((word, index) => (
    // The space sits outside the clipped span, or it would be trimmed away.
    <span key={index}>
      <span className={index >= words.length - gold ? 'w gold' : 'w'} style={{ '--i': index }}><span>{word}</span></span>{' '}
    </span>
  ))
}

/** The ARGO symbol inside a ring, both drawn in gold: the page's "it worked". */
function Seal({ symbol }) {
  return (
    <div className="seal" aria-hidden="true">
      <svg className="seal-ring" viewBox="0 0 120 120" focusable="false">
        <circle cx="60" cy="60" r="58" pathLength="1" />
      </svg>
      <svg className="seal-mark" viewBox={`0 0 ${symbol.width} ${symbol.height}`} focusable="false">
        <path d={symbol.path} pathLength="1" />
      </svg>
    </div>
  )
}

/**
 * copy: { eyebrow, title, sub, stepsTitle, steps }
 * symbol: { path, width, height } of the landing's BrandSymbol
 * whatsapp: { url, label, icon }
 */
export default function ThankYou({ copy, symbol, whatsapp, goldWords = 2 }) {
  return (
    <main id="main" className="thanks tone-dark">
      <div className="wrap thanks-wrap">
        <header className="thanks-head">
          <Seal symbol={symbol} />
          <p className="thanks-eyebrow">{copy.eyebrow}</p>
          <h1 className="hero-title thanks-title"><Words text={copy.title} gold={goldWords} /></h1>
          <p className="thanks-sub">{copy.sub}</p>
        </header>

        <section className="thanks-next" aria-labelledby="next-title">
          <h2 id="next-title" className="thanks-label">{copy.stepsTitle}</h2>
          <ol className="journey">
            {copy.steps.map((step, index) => (
              <li key={step} style={{ '--i': index }} data-current={index === 0 ? '' : undefined}>
                <span className="journey-num" aria-hidden="true">{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="thanks-actions">
          <a className="thanks-wa" href={whatsapp.url} target="_blank" rel="noopener">
            {whatsapp.icon}
            <span>{whatsapp.label}</span>
          </a>
        </div>
      </div>
    </main>
  )
}
