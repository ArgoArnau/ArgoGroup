import { useLang } from '../context/LangContext'
import FadeIn from './animations/FadeIn'

const clients = [
  { name: 'TechScale EU', abbr: 'TS' },
  { name: 'GrowthCo', abbr: 'GC' },
  { name: 'Barcelona Ventures', abbr: 'BV' },
  { name: 'ScaleUp Miami', abbr: 'SM' },
  { name: 'Impulse Digital', abbr: 'ID' },
  { name: 'Nova Marketing', abbr: 'NM' },
]

export default function Clients() {
  const { t } = useLang()

  return (
    <section className="py-20 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <FadeIn duration={700} translateY={20}>
          <div className="text-center mb-12">
            <h2 className="section-title">{t.clients.title}</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>

        {/* Logo grid — each card staggers in */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {clients.map((client, i) => (
            <FadeIn key={client.name} delay={i * 80} duration={600} translateY={20}>
              <div className="group flex flex-col items-center justify-center p-6 bg-dark-surface border border-dark-border rounded-xl hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5 aspect-square">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif font-bold mb-3 group-hover:bg-gold/20 transition-colors">
                  {client.abbr}
                </div>
                <span className="text-gray-500 text-xs text-center leading-tight group-hover:text-gray-300 transition-colors">
                  {client.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
