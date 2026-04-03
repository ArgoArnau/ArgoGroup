import { useLang } from '../context/LangContext'

export default function WhyArgo() {
  const { t } = useLang()

  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">{t.whyArgo.title}</h2>
          <div className="gold-line" />
        </div>

        {/* Intro paragraphs */}
        <div className="flex flex-col gap-4 mb-16 max-w-3xl mx-auto">
          {t.whyArgo.intro.map((para, i) => (
            <p key={i} className="text-gray-400 text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.whyArgo.items.map((item) => (
            <div
              key={item.title}
              className="group relative p-8 bg-dark-surface border border-dark-border rounded-xl hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]"
            >
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t" />
              <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
