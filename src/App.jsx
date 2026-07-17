import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SEO from './components/SEO'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import ContactPage from './pages/ContactPage'
import ThankYou from './pages/ThankYou'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

const STORAGE_KEY = 'argo_cookie_consent'

function AppLayout({ showBanner, setShowBanner }) {
  const location = useLocation()
  const isThankYou = location.pathname === '/thank-you'

  return (
    <div className="min-h-screen bg-dark text-white">
      <SEO />
      <ScrollToTop />
      {!isThankYou && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
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
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setShowBanner(true)
  }, [])

  return (
    <BrowserRouter>
      <AppLayout showBanner={showBanner} setShowBanner={setShowBanner} />
    </BrowserRouter>
  )
}
