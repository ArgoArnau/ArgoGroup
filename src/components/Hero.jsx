import { ArrowRight, TrendingUp, Zap, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import TextReveal from './animations/TextReveal'
import FadeIn from './animations/FadeIn'

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

        {/* Badge — fades in first */}
        <FadeIn delay={0} duration={600} translateY={12}>
          <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-4 py-1.5 text-gold text-xs tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            {t.hero.badge}
          </div>
        </FadeIn>

        {/* Headline — words slide up one by one */}
        {/* TextReveal needs a plain string, so we pass t.hero.headline directly.
            The existing font/size classes go on the className prop. */}
        <TextReveal
          text={t.hero.headline}
          as="h1"
          delay={200}
          stagger={80}
          duration={750}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cream leading-none mb-6 tracking-widest justify-center pl-[0.1em]"
        />

        {/* Subheading — fades in after headline words have landed */}
        <FadeIn delay={700} duration={600} translateY={16}>
          <p className="text-gray-400 text-sm md:text-base mb-3">
            {t.hero.sub}
          </p>
        </FadeIn>

        {/* Small tagline */}
        <FadeIn delay={850} duration={600} translateY={16}>
          <p className="text-gray-500 text-sm tracking-wide mb-10">
            {t.hero.sub2}
          </p>
        </FadeIn>

        {/* CTAs — appears last in the sequence */}
        <FadeIn delay={1000} duration={600} translateY={16}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact" className="btn-gold flex items-center gap-2 text-base px-8 py-4">
              {t.hero.cta1} <ArrowRight size={18} />
            </Link>
            <a href="#services" onClick={handleServicesScroll} className="btn-outline text-base px-8 py-4">
              {t.hero.cta2}
            </a>
          </div>
        </FadeIn>

        {/* Stats — staggered cascade, each card 120ms after the previous */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {t.hero.stats.map((stat, i) => (
            <FadeIn key={stat.label} className="h-full" delay={1200 + i * 120} duration={700} translateY={24}>
              <div className="flex flex-col items-center justify-center h-full p-6 border border-dark-border rounded-lg bg-dark-surface/50">
                <div className="text-gold mb-2">{statIcons[i]}</div>
                <div className="font-serif text-3xl font-bold text-cream mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm text-center">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}
