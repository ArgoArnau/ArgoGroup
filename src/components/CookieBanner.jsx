import { Link } from 'react-router-dom'

const STORAGE_KEY = 'argo_cookie_consent'

export default function CookieBanner({ showBanner, setShowBanner }) {
  const handleChoice = (choice) => {
    localStorage.setItem(STORAGE_KEY, choice)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 sm:px-6 animate-slide-up">
      <div className="max-w-3xl mx-auto bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-6">
        <p className="text-white font-semibold text-sm mb-2">We use cookies</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          ARGO Group uses cookies to improve your experience, analyze site traffic, and support our marketing efforts. By clicking 'Accept', you consent to our use of cookies. You can learn more in our{' '}
          <Link to="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleChoice('accepted')}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => handleChoice('declined')}
            className="btn-outline px-6 py-2.5 text-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
