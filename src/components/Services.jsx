import { TrendingUp, Zap, Palette } from 'lucide-react'
import { useLang } from '../context/LangContext'

const icons = [<TrendingUp size={32} />, <Zap size={32} />, <Palette size={32} />]

export default function Services() {
  const { t } = useLang()

  return (
    <section id="services" className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.services.title}</h2>
          <div className="gold-line" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {t.services.items.map((service, idx) => (
            <div
              key={service.title}
              className="group relative p-8 bg-dark-surface border border-dark-border rounded-xl hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]"
            >
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t" />
              <div className="text-gold mb-4">{icons[idx]}</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 italic mb-6 text-sm leading-relaxed">{service.subtitle}</p>
              <div className={`grid grid-cols-1 gap-6 ${service.sections.length === 4 ? 'sm:grid-cols-4' : service.sections.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {service.sections.map((section) => (
                  <div key={section.heading}>
                    {section.heading ? (
                      <h4 className="text-gold text-xs font-semibold tracking-widest uppercase mb-3 border-b border-dark-border pb-2">
                        {section.heading}
                      </h4>
                    ) : (
                      <div className="text-xs mb-3 border-b border-transparent pb-2 invisible select-none">
                        &nbsp;
                      </div>
                    )}
                    {section.headline && (
                      <p className="text-white text-sm font-semibold mb-3 leading-snug">{section.headline}</p>
                    )}
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed">
                          <span className="text-gold mt-1.5 flex-shrink-0 text-xs">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
