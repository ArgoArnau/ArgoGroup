import { useLang } from '../context/LangContext'
import FadeIn from './animations/FadeIn'

export default function Methodology() {
  const { t } = useLang()

  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <FadeIn duration={700} translateY={20}>
          <div className="text-center mb-16">
            <h2 className="section-title">{t.methodology.title}</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>

        {/* 4 step cards — cascade left to right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.methodology.items.map((item, i) => (
            <FadeIn key={item.number} delay={i * 120} duration={700} translateY={32}>
              <div className="group p-8 bg-dark-surface border border-dark-border rounded-xl hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] h-full">
                <h3 className="font-serif text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
