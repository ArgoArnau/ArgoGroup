import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import FadeIn from '../components/animations/FadeIn'

export default function About() {
  const { t } = useLang()
  const a = t.about

  return (
    <section className="min-h-screen py-32 bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <FadeIn duration={700} translateY={20}>
          <div className="text-center mb-12">
            <h1 className="section-title text-4xl md:text-5xl">{a.title}</h1>
            <div className="gold-line" />
            <p className="text-gray-400 text-lg">{a.sub}</p>
          </div>
        </FadeIn>

        {/* Intro paragraphs — staggered one by one */}
        <div className="flex flex-col gap-4 mb-16">
          {a.intro.map((para, i) => (
            <FadeIn key={i} delay={i * 100} duration={600} translateY={16}>
              <p className="text-gray-400 text-sm leading-relaxed">{para}</p>
            </FadeIn>
          ))}
        </div>

        {/* Detail cards — same treatment as the Why ARGO grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {a.sections.map((section, i) => (
            <FadeIn key={section.title} delay={i * 120} duration={700} translateY={28}>
              <div className="group relative p-8 bg-dark-surface border border-dark-border rounded-xl hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] h-full">
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t" />
                <h2 className="font-serif text-xl font-bold text-white mb-3">{section.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{section.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* At a glance */}
        <FadeIn duration={700} translateY={24}>
          <div className="border border-dark-border rounded-xl bg-dark-surface p-8 mb-16">
            <h2 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">{a.factsTitle}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {a.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col border-b border-dark-border pb-3">
                  <dt className="text-gold text-xs font-semibold tracking-widest uppercase mb-1">{fact.label}</dt>
                  <dd className="text-gray-400 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>

        {/* Closing CTA */}
        <FadeIn delay={100} duration={700} translateY={24}>
          <div className="text-center border-t border-dark-border pt-12">
            <h2 className="font-serif text-2xl font-bold text-white mb-3">{a.ctaTitle}</h2>
            <p className="text-gray-400 text-sm mb-6">{a.ctaSub}</p>
            <Link to="/contact" className="btn-gold inline-block text-base px-8 py-4">{a.cta}</Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
