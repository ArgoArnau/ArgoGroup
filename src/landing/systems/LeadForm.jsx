import { useEffect, useRef, useState } from 'react'
import { captureAttribution, metaIds, newEventId } from '../shared/attribution.js'
import { crmPayload } from '../shared/crm.js'
import { cleanPhone, EMAIL_RE, normaliseWebsite } from '../shared/fields.js'
import { sendLead } from '../shared/submit.js'
import { setTrackingContext, track, trackingActive } from '../shared/tracking.js'
import { form as copy, PRIVACY_URL, WHATSAPP_URL } from './copy.js'

// One step, typed fields, the same shape as the /growth form so both landings
// send the same lead to the CRM (shared/crm.js; `servicio` and `formulario`
// tell them apart).
const EMPTY = { name: '', email: '', website: '', whatsapp: '', open_answer: '' }
const ORDER = ['name', 'email', 'website', 'whatsapp', 'open_answer', 'consent']
// What the progress bar counts: the fields the form cannot be sent without.
const REQUIRED = ['name', 'email', 'website', 'whatsapp', 'open_answer', 'consent']
const MIN_FILL_MS = 3000
const ATTRIBUTION_KEY = 'argo_systems_attribution'
const THANK_YOU = '/systems/thank-you'

function errorFor(name, values) {
  switch (name) {
    case 'name': return values.name.trim() ? null : copy.added.errName
    case 'email': return EMAIL_RE.test(values.email.trim()) ? null : copy.added.errEmail
    case 'website': return normaliseWebsite(values.website) ? null : copy.added.errWebsite
    case 'whatsapp': return cleanPhone(values.whatsapp).replace('+', '').length >= 8 ? null : copy.added.errWhatsapp
    case 'open_answer': return values.open_answer.trim().length >= 15 ? null : copy.added.errDetail
    case 'consent': return values.consent ? null : copy.added.errConsent
    default: return null
  }
}

function Field({ name, label, required, help, error, textarea, ...rest }) {
  const id = `f-${name}`
  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const control = {
    id,
    name,
    className: textarea ? 'input textarea' : 'input',
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    'aria-required': required ? 'true' : undefined,
    ...rest,
  }
  return (
    <div className={textarea ? 'field full' : 'field'}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required
          ? <span className="req" aria-hidden="true"> *</span>
          : <span className="optional"> {copy.added.optional}</span>}
      </label>
      {textarea ? <textarea rows={4} {...control} /> : <input {...control} />}
      {help && <p className="field-help" id={`${id}-help`}>{help}</p>}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}

export default function LeadForm() {
  const [values, setValues] = useState({ ...EMPTY, consent: false })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [context, setContext] = useState(null)
  const [honeypot, setHoneypot] = useState('')
  const [started, setStarted] = useState(false)
  const formRef = useRef(null)

  // Attribution and the lead's event_id exist only in the browser.
  useEffect(() => {
    const attribution = captureAttribution(ATTRIBUTION_KEY)
    const ids = metaIds(attribution)
    setTrackingContext(ids)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContext({ attribution, ids, eventId: newEventId(), mountedAt: Date.now() })
  }, [])

  // First touch of the form: stops the button's shine and sends FormStart.
  const markStarted = () => {
    if (started) return
    setStarted(true)
    track('FormStart', { content_category: 'systems' })
  }

  const update = (name, value) => {
    const next = { ...values, [name]: value }
    setValues(next)
    // Only re-check a field already showing an error, so typing never raises one mid-word.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: errorFor(name, next) }))
  }

  const blur = (event) => {
    const { name, value } = event.target
    if (!value.trim()) return
    setErrors((current) => ({ ...current, [name]: errorFor(name, values) }))
  }

  const fieldProps = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event) => update(name, event.target.value),
    onFocus: markStarted,
    onBlur: blur,
  })

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const found = Object.fromEntries(ORDER.map((name) => [name, errorFor(name, values)]).filter(([, message]) => message))
    setErrors(found)
    const first = ORDER.find((name) => found[name])
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }

    // Bots: fill the hidden field, or post faster than a person can type.
    if (honeypot || !context || Date.now() - context.mountedAt < MIN_FILL_MS) {
      window.location.assign(THANK_YOU)
      return
    }

    // The pixel's _fbp cookie may have appeared since load (consent given).
    const ids = metaIds(context.attribution)
    const payload = crmPayload({
      landing: 'systems',
      values,
      context,
      ids,
      consentText: copy.consent.join(''),
    })

    setStatus('sending')
    try {
      const delivered = await sendLead(payload)
      if (delivered) {
        track('Lead', { content_category: 'systems' }, context.eventId)
        // Give the pixel a moment to send before the page unloads.
        if (trackingActive()) await new Promise((resolve) => setTimeout(resolve, 300))
      }
      window.location.assign(THANK_YOU)
    } catch {
      setStatus('failed')
    }
  }

  const { added } = copy

  return (
    <form ref={formRef} className="lead-form" onSubmit={submit} noValidate data-started={started ? 'true' : undefined}>
      {/* Fills as the required fields become valid. Decorative: the fields say the rest. */}
      <div className="form-progress" aria-hidden="true">
        <span style={{ '--p': REQUIRED.filter((name) => !errorFor(name, values)).length / REQUIRED.length }} />
      </div>
      <div className="form-grid">
        <Field label={added.name} required autoComplete="name" placeholder={added.phName} {...fieldProps('name')} />
        <Field label={added.email} required type="email" inputMode="email" autoComplete="email" placeholder={added.phEmail} help={added.help.email} {...fieldProps('email')} />
        <Field label={added.website} required inputMode="url" autoComplete="url" placeholder={added.phWebsite} help={added.help.website} {...fieldProps('website')} />
        <Field label={added.whatsapp} required type="tel" inputMode="tel" autoComplete="tel" placeholder={added.phWhatsapp} {...fieldProps('whatsapp')} />
        <Field label={added.question} required textarea placeholder={added.placeholder} {...fieldProps('open_answer')} />
      </div>

      <div className="field">
        <label className="consent">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(event) => { markStarted(); update('consent', event.target.checked) }}
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? 'f-consent-error' : undefined}
          />
          <span>
            {copy.consent[0]}
            <a href={PRIVACY_URL} target="_blank" rel="noopener">{copy.consent[1]}</a>
            {copy.consent[2]}
          </span>
        </label>
        {errors.consent && <p className="field-error" id="f-consent-error">{errors.consent}</p>}
      </div>

      {/* Honeypot: invisible to people and assistive tech, irresistible to bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company_name">Company name</label>
        <input
          id="f-company_name"
          name="company_name"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-block btn-boom btn-shine" disabled={status === 'sending'}>
        <span>{status === 'sending' ? copy.sending : copy.button}</span>
        <svg className="btn-arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div aria-live="polite">
        {status === 'failed' && (
          <p className="form-failed">
            {copy.failed[0]}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener">{copy.failed[1]}</a>
            {copy.failed[2]}
          </p>
        )}
      </div>
    </form>
  )
}
