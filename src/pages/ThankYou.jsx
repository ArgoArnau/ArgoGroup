import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function ThankYou() {
  const { t } = useLang()

  return (
    <section className="min-h-screen flex items-center justify-center py-24 bg-dark">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full border-2 border-gold/50 flex items-center justify-center bg-dark-surface">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-gold"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
          {t.thankYou.headline}
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          {t.thankYou.sub}
        </p>

        <Link to="/" className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-base">
          <ArrowLeft size={18} /> {t.thankYou.cta}
        </Link>
      </div>
    </section>
  )
}
