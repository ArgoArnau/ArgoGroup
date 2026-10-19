// Clean-up of what people type into a landing form, before it is sent.

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.nl', 'hotmail.no', 'hotmail.co.uk',
  'outlook.com', 'outlook.nl', 'live.com', 'live.nl', 'live.no', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'ymail.com', 'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'gmx.net', 'gmx.de',
  'mail.com', 'zoho.com', 'yandex.com', 'ziggo.nl', 'kpnmail.nl', 'planet.nl',
  'home.nl', 'online.no', 'live.co.uk',
])

/** 'work' or 'free', sent as the email_type hidden field. */
export function emailType(email) {
  const domain = email.trim().toLowerCase().split('@')[1] || ''
  return FREE_DOMAINS.has(domain) ? 'free' : 'work'
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** "acme.nl" → "https://acme.nl"; null when it cannot be a website. */
export function normaliseWebsite(raw) {
  const value = raw.trim()
  if (!value) return null
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withScheme)
    return url.hostname.includes('.') && !url.hostname.endsWith('.') ? url.href.replace(/\/$/, '') : null
  } catch {
    return null
  }
}

// The CRM's limit for `empresa` (argo-planning, lib/crm-web.ts).
const MAX_COMPANY = 200

/**
 * The "Company or website" field: a website when it looks like one ("acme.com",
 * "https://acme.com"), else a company name ("Acme Clinic"). They go to different
 * CRM fields, because `sitio_web` must be an http(s) URL or the CRM answers 400.
 */
export function companyOrWebsite(raw) {
  const website = normaliseWebsite(raw)
  if (website) return { website, company: null }
  const company = raw.trim().slice(0, MAX_COMPANY)
  return { website: null, company: company || null }
}

/** Keeps digits and a leading +, so the CRM gets "+31612345678". */
export function cleanPhone(raw) {
  const value = raw.trim()
  return value ? value.replace(/(?!^\+)[^\d]/g, '') : ''
}
