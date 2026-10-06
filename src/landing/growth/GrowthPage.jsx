import { CtaButton, Dock, Footer, TopBar, WhatsAppLink } from './chrome.jsx'
import { about, finalCta, hero, method, thankYou, WHATSAPP_URL, work } from './copy.js'
import FormPanel from './FormPanel.jsx'
import Ticker from './Ticker.jsx'
import WorkList from './WorkList.jsx'
import { useCookieBanner } from '../shared/useCookieBanner.js'
import { useFormPanel } from '../shared/useFormPanel.js'
import { useReveal } from '../shared/useReveal.js'

const pad = (n) => String(n).padStart(2, '0')

/**
 * One span per word, so each can rise out of its own mask (growth.css, .w).
 * Words from `goldFrom` on are set in gold.
 */
function Words({ text, goldFrom = Infinity }) {
  return text.split(' ').map((word, index) => (
    // The space sits outside the clipped span, or it would be trimmed away.
    <span key={index}>
      <span className={index >= goldFrom ? 'w gold' : 'w'} style={{ '--i': index }}><span>{word}</span></span>{' '}
    </span>
  ))
}

/** Gold from `count` words before the end. */
const lastWords = (text, count) => text.split(' ').length - count

/** The hero headline per variant; the sentence after the last full stop is gold. */
function Headline({ options }) {
  return options.map(([keys, text]) => {
    const lastStop = text.lastIndexOf('. ')
    const goldFrom = lastStop > 0 ? text.slice(0, lastStop + 1).split(' ').length : Infinity
    return (
      <span key={keys} className="vx" data-show={keys}>
        <Words text={text} goldFrom={goldFrom} />
      </span>
    )
  })
}

/**
 * /growth, the Meta Ads landing. Conversion-only: no menu, and the only ways
 * out are WhatsApp, email, Privacy, Terms and Cookies. Every text is the
 * client's own (copy.js).
 *
 *   1. Hero + form     the ad's headline, three differentiators, the form
 *   2. What we work on five areas, a line on each
 *   3. Method          decide first, four steps, the clinic as proof
 *   4. Who we are      how we work, Barcelona · Miami
 *   5. Close           final CTA, direct contact, legal
 *
 * On wide screens the form is docked on the right for the whole page; on
 * phones it follows the hero and a bottom bar reopens it as a sheet.
 */
export function GrowthPage() {
  const cookies = useCookieBanner()
  const { sheetOpen, openForm, closeForm } = useFormPanel()
  useReveal()

  return (
    <>
      {/* Thin gold line that fills as the page is read (CSS scroll timeline). */}
      <div className="progress" aria-hidden="true" />
      <TopBar />
      <main id="main" className="page">
        {/* 1 · Hero */}
        <section id="hero" className="hero tone-dark">
          <div className="wrap content">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="hero-title"><Headline options={hero.headlines} /></h1>
            <p className="hero-sub">{hero.subtitle}</p>
            <ul className="points">
              {hero.points.map(([title, line], index) => (
                <li key={title} style={{ '--i': index }}>
                  <strong>{title}</strong> {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FormPanel sheetOpen={sheetOpen} onClose={closeForm} />

        <Ticker items={work.items.map(([title]) => title)} />

        {/* 2 · What we work on */}
        <section className="section tone-light" aria-labelledby="work-title">
          <div className="wrap content">
            <p className="bridge" data-reveal="">{work.bridge}</p>
            <h2 id="work-title" className="section-title" data-reveal="words"><Words text={work.title} goldFrom={lastWords(work.title, 2)} /></h2>
            <WorkList items={work.items} />
          </div>
        </section>

        {/* 3 · Method */}
        <section className="section tone-dark plate" aria-labelledby="method-title" data-reveal="plate">
          <div className="wrap content">
            <h2 id="method-title" className="section-title" data-reveal="words"><Words text={method.title} goldFrom={lastWords(method.title, 6)} /></h2>
            <p className="lead" data-reveal="">{method.intro}</p>
            <ol className="steps">
              {method.steps.map(([title, text], index) => (
                <li key={title} data-reveal="card" style={{ '--i': index }}>
                  <span className="num" aria-hidden="true">{pad(index + 1)}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <blockquote className="proof" data-reveal="draw">
              <p className="proof-title">{method.proof.title}</p>
              <p>{method.proof.body}</p>
            </blockquote>
            <div className="meaning" data-reveal="clip">
              <h3 className="meaning-title">{method.meaningTitle}</h3>
              <p className="meaning-line">{method.meaning}</p>
            </div>
          </div>
        </section>

        {/* 4 · Who we are */}
        <section className="section tone-light" aria-labelledby="about-title">
          <div className="wrap content">
            <h2 id="about-title" className="section-title" data-reveal="words"><Words text={about.title} goldFrom={lastWords(about.title, 3)} /></h2>
            <p className="lead" data-reveal="">{about.intro}</p>
            <ul className="rows">
              {about.rows.map(([title, text], index) => (
                <li key={title} data-reveal="left" style={{ '--i': index }}><strong>{title}</strong> {text}</li>
              ))}
            </ul>
            <p className="about-closing" data-reveal="clip">{about.closing}</p>
            <p className="cities-line">{about.cities}</p>
          </div>
        </section>

        {/* 5 · Close */}
        <section className="section tone-dark final plate" aria-labelledby="final-title" data-reveal="plate">
          <div className="wrap content">
            <h2 id="final-title" className="section-title" data-reveal="words"><Words text={finalCta.title} goldFrom={lastWords(finalCta.title, 2)} /></h2>
            <p className="lead" data-reveal="">{finalCta.sub}</p>
            <CtaButton className="final-cta btn-boom" onOpen={openForm}>{finalCta.button}</CtaButton>
            <p className="contact">
              {finalCta.contactLead}{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener">{finalCta.whatsapp}</a>
              {' · '}
              <a href={`mailto:${finalCta.email}`}>{finalCta.email}</a>
            </p>
            <p className="cities-line">{finalCta.cities}</p>
          </div>
        </section>
      </main>
      <Footer onCookies={cookies.reopen} />
      <Dock cookies={cookies} onOpenForm={openForm} sheetOpen={sheetOpen} />
    </>
  )
}

/** /growth/thank-you. Same bar and style, no navigation, no calendar. */
export function GrowthThankYou() {
  const cookies = useCookieBanner()

  return (
    <>
      <TopBar />
      <main id="main" className="thanks tone-light">
        <div className="wrap narrow">
          <h1 className="hero-title">{thankYou.title}</h1>
          <p className="hero-sub">{thankYou.sub}</p>

          <h2 className="thanks-h">{thankYou.stepsTitle}</h2>
          <ol className="timeline compact">
            {thankYou.steps.map((step, index) => (
              <li key={step}>
                <span className="num" aria-hidden="true">{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          <div className="ready">
            <h2 className="thanks-h">{thankYou.readyTitle}</h2>
            <p>{thankYou.ready}</p>
          </div>

          <WhatsAppLink />
        </div>
      </main>
      <div className="tone-dark">
        <Footer onCookies={cookies.reopen} />
      </div>
      <Dock cookies={cookies} />
    </>
  )
}
