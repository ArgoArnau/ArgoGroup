import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function Testimonials() {
  const { t } = useLang()
  const items = t.testimonials.items
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="py-24 bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div className="gold-line" />
        </div>

        <div className="relative">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 md:p-12">
            <Quote size={40} className="text-gold/30 mb-6" />

            <p className="text-white text-lg md:text-xl leading-relaxed font-serif italic mb-8">
              "{items[current].quote}"
            </p>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-lg flex-shrink-0">
                {items[current].initials}
              </div>
              <div>
                <div className="text-white font-semibold">{items[current].name}</div>
                <div className="text-gray-400 text-sm">{items[current].role}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={prev} className="p-2 border border-dark-border rounded-full text-gray-400 hover:text-gold hover:border-gold transition-colors">
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-dark-border'}`}
                />
              ))}
            </div>

            <button onClick={next} className="p-2 border border-dark-border rounded-full text-gray-400 hover:text-gold hover:border-gold transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
