import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { useLang } from '../context/LangContext'
import FadeIn from './animations/FadeIn'

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true) }

  return (
    <section id="contact" className="py-24 bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <FadeIn duration={700} translateY={20}>
          <div className="text-center mb-12">
            <h2 className="section-title">{c.title}</h2>
            <div className="gold-line" />
            <p className="text-gray-400">{c.sub}</p>
          </div>
        </FadeIn>

        {/* Form or success state */}
        <FadeIn delay={150} duration={700} translateY={28}>
          {submitted ? (
            <div className="text-center p-12 bg-dark-surface border border-gold/30 rounded-2xl">
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <p className="text-white text-lg font-serif">{c.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-dark-surface border border-dark-border rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label={c.name} name="name" type="text" value={form.name} onChange={handleChange} required placeholder="John Doe" />
                <Field label={c.email} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" />
                <Field label={c.phone} name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                <Field label={c.company} name="company" type="text" value={form.company} onChange={handleChange} placeholder="Your Company" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{c.service}</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="" disabled>{c.service}</option>
                  {c.services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{c.message}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project..."
                  className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors resize-y"
                />
              </div>
              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base">
                <Send size={18} /> {c.send}
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  )
}

function Field({ label, name, type, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder-gray-600"
      />
    </div>
  )
}
