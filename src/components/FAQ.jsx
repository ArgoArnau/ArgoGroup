import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLang } from '../context/LangContext'

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-dark-border rounded-xl bg-dark-surface overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-dark-border/30 transition-colors duration-200"
      >
        <span className="text-white font-medium text-sm md:text-base">{item.q}</span>
        <ChevronDown
          size={18}
          className={`text-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-6 pt-4 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  const left = t.faq.items.slice(0, 3)
  const right = t.faq.items.slice(3, 6)

  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.faq.title}</h2>
          <div className="gold-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {left.map((item, i) => (
              <FAQItem key={i} item={item} isOpen={openIndex === i} onToggle={() => toggle(i)} />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((item, i) => (
              <FAQItem key={i + 3} item={item} isOpen={openIndex === i + 3} onToggle={() => toggle(i + 3)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
