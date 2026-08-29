import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './context/LangContext.jsx'

const app = (
  <StrictMode>
    <HelmetProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </HelmetProvider>
  </StrictMode>
)

const container = document.getElementById('root')

// Production builds ship prerendered markup (scripts/prerender.mjs) so crawlers
// and no-JS clients get the full page; `vite dev` serves an empty shell.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
