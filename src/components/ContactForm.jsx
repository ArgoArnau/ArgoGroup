import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { SendIcon } from './icons'

const FORMSPREE_ID = 'mlgoojlw'

// Required fields, in the order the form reads. Kept in step with the field
// list published to agents in src/content/markdown.js.
const REQUIRED = ['name', 'email', 'subject', 'message']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = { name: '', email: '', phone: '', company: '', subject: '', message: '' }

export default function ContactForm() {
  const navigate = useNavigate()
  const { t } = useLang()
  const f = t.contactForm

  const [values, setValues] = useState(EMPTY)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errorFor = (name, value = values[name], consent = agreed) => {
    if (name === 'consent') return consent ? null : f.err_consent
    if (REQUIRED.includes(name) && !value.trim()) return f.err_required
    if (name === 'email' && value.trim() && !EMAIL.test(value.trim())) return f.err_email
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    // Only re-check a field that is already showing an error, so typing never
    // raises one mid-word.
    setErrors((previous) => (previous[name] ? { ...previous, [name]: errorFor(name, value) } : previous))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setErrors((previous) => ({ ...previous, [name]: errorFor(name, value) }))
  }

  const handleConsent = (event) => {
    setAgreed(event.target.checked)
    setErrors((previous) => (previous.consent ? { ...previous, consent: errorFor('consent', null, event.target.checked) } : previous))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const found = {}
    for (const name of [...Object.keys(EMPTY), 'consent']) {
      const message = errorFor(name)
      if (message) found[name] = message
    }
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.querySelector('.form-field.has-error input, .form-field.has-error textarea')?.focus()
      return
    }

    setLoading(true)
    setSubmitError(null)
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead')
      navigate('/thank-you')
    } catch {
      setSubmitError(f.err_generic)
    } finally {
      setLoading(false)
    }
  }

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    placeholder: f[`ph_${name}`],
  })

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <Field label={f.name} type="text" autoComplete="name" required {...fieldProps('name')} />
      <Field label={f.email} type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
      <Field label={f.phone} type="tel" autoComplete="tel" inputMode="tel" {...fieldProps('phone')} />
      <Field label={f.company} type="text" autoComplete="organization" {...fieldProps('company')} />
      <Field label={f.subject} type="text" full required {...fieldProps('subject')} />
      <Field label={f.message} textarea full required {...fieldProps('message')} />

      <div className={errors.consent ? 'form-consent has-error' : 'form-consent'}>
        <input id="f-consent" name="consent" type="checkbox" checked={agreed} onChange={handleConsent} />
        <label htmlFor="f-consent">
          {f.consent}{' '}
          <Link to="/privacy-policy">{f.privacyLink}</Link>{' '}
          {f.andText}{' '}
          <Link to="/terms-of-service">{f.termsLink}</Link>
        </label>
        <span className="field-error" role="alert">{errors.consent}</span>
      </div>

      <div className="form-submit">
        {submitError && <p className="field-error" role="alert" style={{ marginBottom: '0.75rem' }}>{submitError}</p>}
        <button className="btn btn-gold" type="submit" disabled={loading}>
          <span>{f.send}</span>
          <SendIcon />
        </button>
      </div>
    </form>
  )
}

function Field({ label, name, error, full, required, textarea, ...rest }) {
  const id = `f-${name}`
  const className = ['form-field', full && 'full', error && 'has-error'].filter(Boolean).join(' ')
  const control = { id, name, required, 'aria-invalid': error ? true : undefined, ...rest }

  return (
    <div className={className}>
      <label htmlFor={id}>
        <span>{label}</span>
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {textarea
        ? <textarea {...control} className={error ? 'invalid' : undefined} />
        : <input {...control} className={error ? 'invalid' : undefined} />}
      <span className="field-error" role="alert">{error}</span>
    </div>
  )
}
