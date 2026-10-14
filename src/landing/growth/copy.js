// Copy for the /growth landing (Meta Ads, cold traffic from Reels).
// Every string is the client's text, verbatim; do not reword, trim or combine
// it. The page: hero + form, what we work on, method, who we are, close.
// Where the layout needed text the brief does not give (form labels, a few
// errors, the sheet's Close), it is grouped under `added` keys so it is easy
// to review before publishing.

export const WHATSAPP_URL =
  'https://wa.me/34685162838?text=Hi%2C%20I%20saw%20your%20ad%20about%20the%20free%20diagnosis%20call.'
export const PRIVACY_URL = 'https://www.groupargous.com/privacy-policy'
export const TERMS_URL = 'https://www.groupargous.com/terms-of-service'

// The one call to action: form button, phone bar and final CTA.
export const CTA = "Let's work together"
export const WHATSAPP_LINK = 'Prefer WhatsApp? Message us →'

// Variant keys: `${v}${h}`, or just `${v}` where the variant has one headline.
// The inline boot script (boot.js) resolves which one is live before paint.
export const VARIANT_KEYS = ['1a', '1b', '1c', '1d', '2', '3', '4a', '4b']

export const hero = {
  eyebrow: 'ARGO · YOUR GROWTH PARTNER FOR DIGITAL MARKETING',
  // The headline follows the ad; the default (no parameters) is 1b.
  // [variant keys it shows for, text]
  headlines: [
    ['1a', "Your digital marketing, run by one team. Decided before it's built."],
    ['1b', 'One partner for your digital marketing. Not three suppliers and a gap between them.'],
    ['1c', "Find out what's holding your growth back. You'll know in two days."],
    ['1d', 'How long does a straight answer take at your agency?'],
    ['2', 'Your agency runs the campaigns. Who decides where the budget goes?'],
    ['3', 'Before you spend more on marketing, find out what should come first.'],
    ['4a', 'Cheaper leads are easy. Cheaper customers are the job.'],
    ['4b', 'More leads, or leads that actually buy?'],
  ],
  // The same subtitle for every variant.
  subtitle: "Your brand, your ads, your website and your CRM, finally working as one. We're the team behind all of it: strategy, branding and creative, paid media, SEO, content and email. Measured in customers, not leads.",
  // Three differentiators, each with a gold mark: [title, line].
  points: [
    ['Built for you.', 'No packages. No templates.'],
    ['Direct access.', 'Talk to the team. Meet when it matters.'],
    ['Measured in revenue.', 'Customers, not clicks.'],
  ],
}

// Section 2 · What we work on.
export const work = {
  bridge: 'Growth usually gets lost in the gaps between suppliers. We take care of all of it.',
  title: 'Everything your digital marketing needs. One team.',
  // [area, what it covers]. Lines 1–4 are the client's service descriptions
  // from the first brief (TikTok Ads added at their request); line 5 is the
  // client's own wording, in English.
  items: [
    ['Strategy and direction.', 'Goals, positioning, offer, and which channels deserve the budget this quarter. And what to stop doing.'],
    ['Paid media.', 'Meta, Google, LinkedIn and TikTok Ads, measured on what each customer costs, not each lead.'],
    ['Website and SEO.', 'Websites and landing pages built to convert, and search visibility that brings people in without paying for every click.'],
    ['Brand, content and social.', 'The brand foundations, the creative for your ads, and the content and social media that keep you visible between campaigns.'],
    ['Systems, methodology, CRM and follow-up.', "We create or improve your internal ways of working. Any system or need that's unique to your business, we can build it."],
  ],
}

// Section 3 · Method and approach.
export const method = {
  title: 'Decide first. Then build what the decision needs.',
  intro: 'Most digital marketing is sold as execution: a number of posts, campaigns and reports every month. Results come from direction: someone deciding what matters, in what order.',
  steps: [
    ['Diagnose.', 'Your goals first. Then your offer, your funnel, your tracking, and where the money is actually leaking.'],
    ['Decide.', 'Which channels deserve the budget, whether the problem is the traffic or the page, and what to stop doing.'],
    ['Build.', 'Campaigns, website, content and the systems underneath, in the order the decision calls for.'],
    ['Measure in customers.', 'Every lead tracked to the sale, and the sales fed back into the campaigns.'],
  ],
  proof: {
    title: "Sometimes the answer isn't ads.",
    body: 'A clinic came to us wanting campaigns. Two services, two names on the door, nothing clear to put in an ad yet. We told them to settle the name and the offer first. It cost us a quarter of fees. It would have cost them the year.',
  },
  meaningTitle: 'What that means for you.',
  meaning: 'Your agency sees your ads. We see your business.',
}

// Section 4 · Who we are.
export const about = {
  title: 'A growth partner, not an agency.',
  intro: 'ARGO works with companies that want their digital marketing run as one piece, not spread across suppliers. We operate between Barcelona and Miami, with clients across Europe and the US.',
  rows: [
    ['A plan built for you.', 'No packages. Every proposal starts from your goals, your numbers and your market.'],
    ['A direct line.', 'You talk to the people doing the work, on WhatsApp, email or Slack. No account managers, no ticket queues.'],
    ['Straight answers.', "Clear, honest and fast, including when the answer is that something isn't worth doing."],
    ['Nothing hidden.', 'You see every number we see: spend, cost per customer, revenue.'],
  ],
  closing: 'We grow with you. As your business changes, the plan changes with it.',
  cities: 'Barcelona · Miami',
}

// Close.
export const finalCta = {
  title: 'Find out what to fix first.',
  sub: "Tell us about your business. We'll get back to you",
  button: CTA,
  contactLead: 'Prefer to talk first?',
  whatsapp: 'WhatsApp +34 685 162 838',
  email: 'info@groupargous.com',
  cities: 'Barcelona · Miami',
}

export const form = {
  title: 'Tell us where growth is stuck.',
  sub: "Within two working days you'll know what to fix first, and whether we're the right people for it.",
  button: CTA,
  // The open question changes with the variant.
  openQuestion: {
    '1a': 'What does your business do, and where has growth stalled?',
    '1b': 'What does your business do, and where has growth stalled?',
    '1c': 'What are you running today?',
    '1d': "What's the question you sent your agency last week?",
    2: 'Where did the budget go last quarter, and who decided?',
    3: 'What are you planning to launch next?',
    '4a': 'What happens to a lead after they fill in a form?',
    '4b': 'What happens to a lead after they fill in a form?',
  },
  placeholder: 'e.g. B2B clinic, Meta Ads €3k/month, leads go to a shared inbox, no CRM.',
  help: {
    email: "Where we'll contact you.",
    website: 'We look at it before we reply.',
  },
  consent: ['I have read the ', 'Privacy Policy', ' and agree to be contacted about my request.'],
  errors: {
    detail: 'Please add a bit more detail.',
    email: "That email doesn't look right.",
  },
  sending: 'Sending…',
  failed: ['Something went wrong. Try again, or ', 'message us on WhatsApp', '.'],
  // Not in the brief: needed UI text, pending review before publishing.
  added: {
    name: 'Name',
    email: 'Email',
    website: 'Company website',
    whatsapp: 'WhatsApp',
    optional: '(optional)',
    phName: 'Your name',
    phEmail: 'you@company.com',
    phWebsite: 'company.com',
    phWhatsapp: '+31 6 1234 5678',
    errName: 'Please add your name.',
    errWebsite: "That website doesn't look right.",
    errWhatsapp: 'Please add your WhatsApp number.',
    errConsent: 'Please accept the Privacy Policy to continue.',
  },
}

export const chrome = {
  logo: 'ARGO',
  cities: 'BARCELONA · MIAMI',
  cookie: 'We use the Meta Pixel to measure which ads bring people here. Nothing is set unless you accept.',
  cookiePrivacy: 'Privacy policy',
  accept: 'Accept',
  reject: 'Reject',
  footer: { copyright: '© 2026 ARGO Group', privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookies' },
  whatsappLabel: 'WhatsApp',
  added: { close: 'Close' },
}

export const thankYou = {
  title: "We've got your details.",
  sub: "The person who replies is the person who'll look at your business.",
  stepsTitle: 'What happens now:',
  steps: [
    'We review your answers and your website.',
    'We get in touch to set up your free discovery call, within two working days.',
    'If it makes sense to work together, we design your proposal, with phases and budget.',
  ],
  readyTitle: 'Useful to have ready:',
  ready: "What you've spent on marketing in the last three months, how many leads came in, and how many became customers. If you don't know the last number, that's usually the first finding.",
}

// Tab titles are not in the brief (pending review); the descriptions are.
export const meta = {
  landing: {
    title: 'ARGO · Your growth partner for digital marketing',
    description: hero.subtitle,
  },
  thankYou: {
    title: "ARGO · We've got your details",
    description: thankYou.sub,
  },
}
