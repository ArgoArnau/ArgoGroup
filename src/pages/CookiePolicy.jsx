import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ChevronLeft } from '../components/icons'

const EMAIL = 'info@groupargous.com'

// Everything this site stores in a visitor's browser, as checked in a browser
// on 2026-10-17 (before any choice, after Decline and after Accept). Keep this
// list in step with the code: src/lib/consent.js, src/context/LangContext.jsx,
// src/landing/growth/boot.js, src/landing/shared/attribution.js and the Meta
// Pixel (src/lib/pixel.js, src/landing/shared/tracking.js).
const ITEMS = [
  {
    name: 'argo_cookie_consent',
    kind: 'Browser storage (local)',
    by: 'Group ARGO',
    purpose: 'Remembers your choice on the cookie banner, so we do not ask again.',
    duration: 'Until you change your choice or clear your browser data',
    consent: 'No: it is needed to respect your choice',
  },
  {
    name: 'argo-lang',
    kind: 'Browser storage (local)',
    by: 'Group ARGO',
    purpose: 'Remembers the language you picked (English or Spanish).',
    duration: 'Until you clear your browser data',
    consent: 'No: it only keeps a setting you chose',
  },
  {
    name: 'argo_growth_variant',
    kind: 'Browser storage (session)',
    by: 'Group ARGO, on the /growth landing page',
    purpose: 'Keeps the version of the page that matches the ad you came from while you browse it.',
    duration: 'Until you close the tab',
    consent: 'No: it only keeps the page consistent',
  },
  {
    name: 'argo_growth_attribution, argo_systems_attribution',
    kind: 'Browser storage (session)',
    by: 'Group ARGO, on the /growth and /systems landing pages',
    purpose: 'Remembers the campaign details in the link that brought you (UTM parameters and ad click identifiers), so they reach us with the form if you send it. They are not shared with anyone else.',
    duration: 'Until you close the tab',
    consent: 'No',
  },
  {
    name: '_fbp',
    kind: 'Cookie',
    by: 'Meta, through the Meta Pixel',
    purpose: 'Tells Meta that visits and form submissions come from the same browser, so we can measure which ads work.',
    duration: '90 days',
    consent: 'Yes: only set after you accept',
  },
  {
    name: '_fbc',
    kind: 'Cookie',
    by: 'Meta, through the Meta Pixel',
    purpose: 'Keeps the identifier of the Meta ad you clicked, when you arrive from one.',
    duration: '90 days',
    consent: 'Yes: only set after you accept',
  },
]

export default function CookiePolicy() {
  const { t } = useLang()

  return (
    <main id="main">
      <div className="container legal-page">
        <Link className="legal-back" to="/">
          <ChevronLeft size={16} /> {t.thankYou.cta}
        </Link>

        {/* Header */}
        <div>
          <h1>Cookie Policy</h1>
          <div className="legal-rule" />
          <p className="legal-updated">Last updated: October 2026</p>
        </div>

        <div>

          {/* 1 */}
          <div>
            <h2>1. What This Policy Covers</h2>
            <p>
              This policy explains the cookies and similar technologies, such as browser storage, that groupargous.com and its landing pages use: what each one does, who sets it, how long it lasts and how you can choose. It complements our <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2>2. Your Choice</h2>
            <p>
              On your first visit, a banner asks whether you accept cookies. Until you accept, we set no advertising cookies and send nothing to Meta. If you decline, nothing changes: the site works the same.
            </p>
            <p>
              You can change your choice at any time with the "Cookie Settings" link at the bottom of every page ("Cookies" on our landing pages), or by clearing your browser's data for this site. Withdrawing your consent does not affect what was done before.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2>3. What We Use</h2>
            <ul>
              {ITEMS.map((item) => (
                <li key={item.name}>
                  <span className="legal-term">{item.name}</span> · {item.kind} · set by {item.by}. {item.purpose} Duration: {item.duration}. Needs your consent: {item.consent}.
                </li>
              ))}
            </ul>
            <p>
              When you accept, the Meta Pixel also tells Meta which of our pages you visit and whether you send a form, and we may send the same events to Meta from our own servers (Meta Conversions API). If you are logged in to Facebook or Instagram, Meta may also read or set its own cookies on its own domains. How Meta uses this data is described in <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener">Meta's Privacy Policy</a>.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2>4. What We Do Not Use</h2>
            <p>
              We do not use Google Analytics or any other analytics service, and the fonts on this site are served from our own domain, so loading a page does not contact any third party before you choose.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2>5. Managing Cookies in Your Browser</h2>
            <p>
              Besides the banner, every browser lets you see and delete cookies and stored site data, and block them for a site or for all sites. Look for "Cookies and site data" or "Privacy" in your browser's settings. Blocking our own storage only means we will ask for your choice again.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2>6. Changes to This Policy</h2>
            <p>
              We update this policy whenever we add, change or remove a cookie or similar technology. The "Last updated" date at the top of this page will reflect any revisions.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2>7. Contact Us</h2>
            <p>
              If you have questions about this policy, please contact us at:
            </p>
            <div className="legal-card">
              <p className="legal-term">Group ARGO</p>
              <p>Barcelona, Spain · Miami, Florida, USA</p>
              <p>
                Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
