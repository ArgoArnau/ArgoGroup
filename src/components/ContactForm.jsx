import { useState } from 'react'
import { Send } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const FORMSPREE_ID = 'mlgoojlw'

export default function ContactForm() {
  const navigate = useNavigate()
  const { t } = useLang()
  const f = t.contactForm
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        navigate('/thank-you')
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-surface border border-dark-border rounded-2xl p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label={f.name}    name="name"    type="text"  value={form.name}    onChange={handleChange} required placeholder={f.ph_name} />
        <Field label={f.email}   name="email"   type="email" value={form.email}   onChange={handleChange} required placeholder={f.ph_email} />
        <Field label={f.phone}   name="phone"   type="tel"   value={form.phone}   onChange={handleChange} placeholder={f.ph_phone} />
        <Field label={f.company} name="company" type="text"  value={form.company} onChange={handleChange} placeholder={f.ph_company} />
      </div>

      <Field label={f.subject} name="subject" type="text" value={form.subject} onChange={handleChange} required placeholder={f.ph_subject} />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {f.message} <span className="text-gold">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={f.ph_message}
          className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors resize-y placeholder-gray-600"
        />
      </div>

      {/* Consent checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          required
          className="mt-0.5 w-4 h-4 accent-gold flex-shrink-0 cursor-pointer"
        />
        <span className="text-gray-400 text-sm">
          {f.consent}{' '}
          <Link to="/privacy-policy" className="text-gold hover:underline">{f.privacyLink}</Link>
          {' '}{f.andText}{' '}
          <Link to="/terms-of-service" className="text-gold hover:underline">{f.termsLink}</Link>
        </span>
      </label>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send size={18} /> {loading ? 'Sending…' : f.send}
      </button>
    </form>
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
