import { ArrowRight, TrendingUp, Zap, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const statIcons = [<TrendingUp size={20} />, <Zap size={20} />, <BarChart2 size={20} />]

export default function Hero() {
  const { t } = useLang()

  const handleServicesScroll = (e) => {
    e.preventDefault()
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-[#0d0d0d]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.05),transparent_60%)]" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-4 py-1.5 text-gold text-xs tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          {t.hero.badge}
        </div>

        {/* Headline */}
        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cream leading-none mb-6 tracking-widest">
          {t.hero.headline}
        </h1>

        {/* Subheading */}
        <p className="text-gray-400 text-sm md:text-base whitespace-nowrap mb-3">
          {t.hero.sub}
        </p>

        {/* Small tagline */}
        <p className="text-gray-500 text-sm tracking-wide mb-10">
          {t.hero.sub2}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/contact" className="btn-gold flex items-center gap-2 text-base px-8 py-4">
            {t.hero.cta1} <ArrowRight size={18} />
          </Link>
          <a href="#services" onClick={handleServicesScroll} className="btn-outline text-base px-8 py-4">
            {t.hero.cta2}
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {t.hero.stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center p-6 border border-dark-border rounded-lg bg-dark-surface/50">
              <div className="text-gold mb-2">{statIcons[i]}</div>
              <div className="font-serif text-3xl font-bold text-cream mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm text-center">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
