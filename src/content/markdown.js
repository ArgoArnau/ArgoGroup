// Markdown representations of every route, served through Accept negotiation
// and as `.md` files. Home / contact / thank-you are composed from src/i18n.js
// so the markdown can never drift from the rendered page; the legal pages keep
// their copy in JSX, so their markdown is converted from the SSR output.

import { site, canonicalFor, markdownPathFor, routes } from '../site.js'
import { translations } from '../i18n.js'
import { htmlToMarkdown } from './htmlToMarkdown.js'

const joinBlocks = (blocks) => blocks.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'

function frontMatter(path, meta) {
  return [
    `# ${meta.title.replace(' | ', ' — ')}`,
    '',
    `> ${meta.description}`,
    '',
    `- Canonical URL: ${canonicalFor(path)}`,
    `- HTML: ${canonicalFor(path)}`,
    `- Markdown: ${site.origin}${markdownPathFor(path)}`,
    `- Organization: ${site.name} (${site.alternateNames.join(', ')})`,
    `- Contact: ${site.email} · ${site.telephoneDisplay} · ${canonicalFor('/contact')}`,
    `- Offices: Barcelona (Spain) and Miami (Florida, USA) — clients served worldwide`,
    `- Languages: English, Spanish`,
  ].join('\n')
}

function homeBody(t) {
  const blocks = []

  blocks.push('## Overview')
  blocks.push(`${t.hero.sub}. ${t.hero.sub2}. Offices in Barcelona and Miami.`)
  blocks.push(t.hero.stats.map((s) => `- **${s.value}** — ${s.label}`).join('\n'))

  blocks.push(`## ${t.services.title}`)
  for (const service of t.services.items) {
    blocks.push(`### ${service.title}`)
    blocks.push(`_${service.subtitle}_`)
    for (const section of service.sections) {
      if (section.heading) blocks.push(`#### ${section.heading}`)
      if (section.headline) blocks.push(`${section.headline}`)
      blocks.push(section.items.map((item) => `- ${item}`).join('\n'))
    }
  }

  blocks.push(`## ${t.methodology.title}`)
  blocks.push(t.methodology.items.map((item) => `### ${item.number}. ${item.title}\n\n${item.desc}`).join('\n\n'))

  blocks.push(`## ${t.whyArgo.title}`)
  blocks.push(t.whyArgo.intro.join('\n\n'))
  blocks.push(t.whyArgo.items.map((item) => `### ${item.title}\n\n${item.desc}`).join('\n\n'))

  blocks.push(`## ${t.faq.title}`)
  blocks.push(t.faq.items.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n'))

  blocks.push(`## ${t.homeContact.title}`)
  blocks.push(t.homeContact.sub)
  blocks.push([
    `- Contact form: ${canonicalFor('/contact')}`,
    `- Email: ${site.email}`,
    `- WhatsApp: ${site.whatsapp}`,
    ...site.sameAs.map((url) => `- Social: ${url}`),
  ].join('\n'))

  return blocks
}

function contactBody(t) {
  const f = t.contactForm
  return [
    `## ${t.contactPage.title}`,
    t.contactPage.sub,
    '### Direct channels',
    [
      `- Email: ${site.email}`,
      `- WhatsApp: ${site.whatsapp}`,
      ...site.sameAs.map((url) => `- Social: ${url}`),
      `- Hours: Monday to Friday, 09:00-18:00 (Spain and Miami)`,
      `- Response time: within 24 hours`,
    ].join('\n'),
    '### Contact form fields',
    [
      `- ${f.name} (required)`,
      `- ${f.email} (required)`,
      `- ${f.phone}`,
      `- ${f.company}`,
      `- ${f.subject} (required)`,
      `- ${f.message} (required)`,
      `- Consent to the [${f.privacyLink}](${canonicalFor('/privacy-policy')}) and [${f.termsLink}](${canonicalFor('/terms-of-service')}) (required)`,
    ].join('\n'),
  ]
}

function thankYouBody(t) {
  return [
    `## ${t.thankYou.headline}`,
    t.thankYou.sub,
    `- Back to home: ${canonicalFor('/')}`,
    `- Email: ${site.email}`,
  ]
}

const BUILDERS = {
  '/': homeBody,
  '/contact': contactBody,
  '/thank-you': thankYouBody,
}

/**
 * Markdown for a route.
 * @param {string} path             route path
 * @param {object} options
 * @param {string} [options.lang]   'en' (default) or 'es'
 * @param {string} [options.html]   SSR HTML of the route body, required for
 *                                  routes whose copy lives in JSX
 */
export function markdownFor(path, { lang = 'en', html = '' } = {}) {
  const t = translations[lang] || translations.en
  const meta = t.meta.pages[path]
  if (!meta) throw new Error(`No metadata for route ${path}`)

  const builder = BUILDERS[path]
  const body = builder
    ? builder(t)
    : [htmlToMarkdown(html).replace(/^# .*\n+/, '')]

  return joinBlocks([frontMatter(path, meta), ...body])
}

export function llmsTxt(lang = 'en') {
  const t = translations[lang] || translations.en
  const listed = routes.filter((r) => r.sitemap)
  return [
    `# ${site.name}`,
    '',
    `> ${t.meta.description}`,
    '',
    `${site.name} is a performance marketing and AI automation agency with offices in Barcelona (Spain) and Miami (Florida, USA), serving clients worldwide in English and Spanish. Services: performance marketing and paid media, AI process automation and CRM integration, and creative and brand assets.`,
    '',
    '## Pages',
    '',
    ...listed.map((r) => `- [${t.meta.pages[r.path].title}](${site.origin}${markdownPathFor(r.path)}): ${t.meta.pages[r.path].description}`),
    '',
    '## Machine-readable',
    '',
    `- [Sitemap](${site.origin}/sitemap.xml): every indexable URL`,
    `- [Full text](${site.origin}/llms-full.txt): the whole site as one markdown document`,
    `- [robots.txt](${site.origin}/robots.txt): crawler policy`,
    '',
    '## Contact',
    '',
    `- [Contact form](${canonicalFor('/contact')}): reply within 24 hours`,
    `- [Email](mailto:${site.email}): ${site.email}`,
    `- [WhatsApp](${site.whatsapp}): ${site.telephoneDisplay}`,
    ...site.sameAs.map((url) => `- [${url.includes('linkedin') ? 'LinkedIn' : 'Instagram'}](${url})`),
    '',
  ].join('\n')
}

export function llmsFullTxt(documents) {
  const header = [
    `# ${site.name} — full site content`,
    '',
    `> Every page of ${site.origin} as a single markdown document. Generated at build time.`,
    '',
  ].join('\n')
  return header + documents.map(({ path, markdown }) => `\n---\n\n<!-- ${canonicalFor(path)} -->\n\n${markdown}`).join('\n')
}
