// Server entry used by scripts/prerender.mjs to turn every route into static
// HTML (and, for the legal pages, into markdown). Mirrors main.jsx exactly, so
// the markup it produces is what the client hydrates.

import { StrictMode } from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppLayout } from './App.jsx'
import { LangProvider } from './context/LangContext.jsx'
import About from './pages/About.jsx'
import ContactPage from './pages/ContactPage.jsx'
import Home from './pages/Home.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import ThankYou from './pages/ThankYou.jsx'

const noop = () => {}

const PAGES = {
  '/': Home,
  '/about': About,
  '/contact': ContactPage,
  '/thank-you': ThankYou,
  '/privacy-policy': PrivacyPolicy,
  '/terms-of-service': TermsOfService,
}

/**
 * Render a route the same way the browser will on first paint: the cookie
 * banner starts hidden (App only shows it after reading localStorage), so the
 * server output and the client's first render agree.
 */
export function renderRoute(url) {
  const helmetContext = {}
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <LangProvider>
          <StaticRouter location={url}>
            <AppLayout showBanner={false} setShowBanner={noop} />
          </StaticRouter>
        </LangProvider>
      </HelmetProvider>
    </StrictMode>,
  )
  return { html, helmet: helmetContext.helmet }
}

/** Just the page body, with no chrome — the input for HTML-to-markdown. */
export function renderPageBody(url) {
  const Page = PAGES[url]
  if (!Page) throw new Error(`No page component for ${url}`)
  return renderToStaticMarkup(
    <HelmetProvider context={{}}>
      <LangProvider>
        <StaticRouter location={url}>
          <Page />
        </StaticRouter>
      </LangProvider>
    </HelmetProvider>,
  )
}
