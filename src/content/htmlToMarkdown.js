// Minimal HTML -> Markdown converter for the server-rendered output of the
// legal pages, whose copy lives in JSX rather than in src/i18n.js. It walks the
// tag stream React produced (always well-formed, no comments, no CDATA) instead
// of trying to be a general-purpose parser.

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

// Content we never want in a text representation of the page.
const DROPPED_TAGS = new Set(['script', 'style', 'svg', 'button', 'noscript'])

const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'div', 'footer', 'form', 'header', 'main',
  'nav', 'p', 'section', 'table', 'tr',
])

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
}

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(ENTITIES, name)) return ENTITIES[name]
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X'
        ? parseInt(name.slice(2), 16)
        : parseInt(name.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return match
  })
}

function attr(rawAttrs, name) {
  const key = ` ${name}="`
  const start = rawAttrs.toLowerCase().indexOf(key)
  if (start === -1) return null
  const from = start + key.length
  const end = rawAttrs.indexOf('"', from)
  return end === -1 ? null : decodeEntities(rawAttrs.slice(from, end))
}

// Escape the characters that would otherwise be read as Markdown syntax.
const MARKDOWN_SPECIALS = new Set(['\\', '`', '*', '_', '[', ']'])

function escapeText(text) {
  let out = ''
  for (const char of text) out += MARKDOWN_SPECIALS.has(char) ? `\\${char}` : char
  return out
}

export function htmlToMarkdown(html) {
  const tokens = []
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)\/?>/g
  let cursor = 0
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    if (match.index > cursor) tokens.push({ type: 'text', value: html.slice(cursor, match.index) })
    tokens.push({
      type: 'tag',
      name: match[1].toLowerCase(),
      closing: match[0][1] === '/',
      attrs: match[2] || '',
    })
    cursor = match.index + match[0].length
  }
  if (cursor < html.length) tokens.push({ type: 'text', value: html.slice(cursor) })

  const lines = ['']
  const listStack = []
  let dropDepth = 0
  let dropTag = null
  let pendingLinkHref = null
  let inHeading = 0

  const current = () => lines[lines.length - 1]
  const write = (chunk) => { lines[lines.length - 1] += chunk }
  const endLine = () => { if (current().trim() !== '') lines.push('') }
  const endBlock = () => {
    endLine()
    if (lines.length > 1 && lines[lines.length - 2] !== '') lines.push('')
  }

  for (const token of tokens) {
    if (token.type === 'text') {
      if (dropDepth > 0) continue
      const text = decodeEntities(token.value).replace(/\s+/g, ' ')
      if (!text.trim()) {
        if (text === ' ' && current() !== '' && !current().endsWith(' ')) write(' ')
        continue
      }
      write(inHeading ? text : escapeText(text))
      continue
    }

    const { name, closing } = token

    if (DROPPED_TAGS.has(name)) {
      if (closing) {
        if (dropTag === name && dropDepth > 0) dropDepth -= 1
        if (dropDepth === 0) dropTag = null
      } else if (!VOID_TAGS.has(name)) {
        dropDepth += 1
        dropTag = name
      }
      continue
    }
    if (dropDepth > 0) continue

    if (name === 'br') { lines.push(''); continue }
    if (name === 'hr') { endBlock(); lines.push('---', ''); continue }

    if (/^h[1-6]$/.test(name)) {
      if (closing) { inHeading = 0; endBlock() } else {
        endBlock()
        inHeading = Number(name[1])
        write(`${'#'.repeat(inHeading)} `)
      }
      continue
    }

    if (name === 'ul' || name === 'ol') {
      if (closing) { listStack.pop(); endBlock() } else { endBlock(); listStack.push({ type: name, index: 0 }) }
      continue
    }

    if (name === 'li') {
      if (closing) { endLine(); continue }
      endLine()
      const list = listStack[listStack.length - 1]
      const indent = '  '.repeat(Math.max(0, listStack.length - 1))
      if (list && list.type === 'ol') {
        list.index += 1
        write(`${indent}${list.index}. `)
      } else {
        write(`${indent}- `)
      }
      continue
    }

    if (name === 'a') {
      if (closing) {
        if (pendingLinkHref) { write(`](${pendingLinkHref})`); pendingLinkHref = null }
      } else {
        const href = attr(token.attrs, 'href')
        if (href) { pendingLinkHref = href; write('[') }
      }
      continue
    }

    if (name === 'strong' || name === 'b') { write('**'); continue }
    if (name === 'em' || name === 'i') { write('_'); continue }
    if (name === 'code') { write('`'); continue }

    if (BLOCK_TAGS.has(name)) { endBlock(); continue }
  }

  return lines
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
