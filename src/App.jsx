import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SEO from './components/SEO'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ScrollProgress'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CookieBanner from './components/CookieBanner'
import { useLang } from './context/LangContext'
import Home from './pages/Home'
import About from './pages/About'
import ContactPage from './pages/ContactPage'
import ThankYou from './pages/ThankYou'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

const STORAGE_KEY = 'argo_cookie_consent'

export function AppLayout({ showBanner, setShowBanner }) {
  const location = useLocation()
  const { lang } = useLang()
  const isThankYou = location.pathname === '/thank-you'

  return (
    <div className="min-h-screen">
      <SEO />
      <ScrollToTop />
      <a className="skip-link" href="#main">
        {lang === 'es' ? 'Ir al contenido' : 'Skip to content'}
      </a>
      <ScrollProgress />
      {!isThankYou && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      <Footer setShowBanner={setShowBanner} />
      <WhatsAppButton />
      <CookieBanner showBanner={showBanner} setShowBanner={setShowBanner} />
    </div>
  )
}

export default function App() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShowBanner(true)
    } catch {
      // Storage blocked: skip the banner rather than showing it every render.
    }
  }, [])

  return (
    <BrowserRouter>
      <AppLayout showBanner={showBanner} setShowBanner={setShowBanner} />
    </BrowserRouter>
  )
}
