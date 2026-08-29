import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  MARKDOWN_CONTENT_TYPE,
  VARY,
  htmlQuality,
  markdownQuality,
  markdownTargetFor,
  negotiate,
  parseAccept,
  prefersMarkdown,
  rejectsHtml,
} from '../src/shared/negotiate.js'
import { markdownPathFor } from '../src/site.js'

test('parseAccept reads q-values and orders by preference', () => {
  assert.deepEqual(parseAccept('text/html;q=0.8, text/markdown;q=0.9'), [
    { type: 'text/markdown', quality: 0.9 },
    { type: 'text/html', quality: 0.8 },
  ])
})

test('parseAccept defaults missing q to 1 and skips malformed entries', () => {
  assert.deepEqual(parseAccept('text/markdown, , garbage, text/html;q=bad'), [
    { type: 'text/markdown', quality: 1 },
    { type: 'text/html', quality: 1 },
  ])
})

test('parseAccept clamps q-values into the 0..1 range', () => {
  assert.deepEqual(parseAccept('text/markdown;q=5'), [{ type: 'text/markdown', quality: 1 }])
  assert.deepEqual(parseAccept('text/markdown;q=-2'), [{ type: 'text/markdown', quality: 0 }])
})

test('parseAccept handles a missing header', () => {
  assert.deepEqual(parseAccept(null), [])
  assert.deepEqual(parseAccept(''), [])
})

test('markdown is served when it is asked for by name', () => {
  assert.equal(prefersMarkdown('text/markdown'), true)
  assert.equal(prefersMarkdown('text/x-markdown'), true)
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.5'), true)
  assert.equal(prefersMarkdown('text/html;q=0.5, text/markdown'), true)
})

test('markdown ties with HTML are resolved in markdown favour', () => {
  // An agent that lists both equally has opted in to markdown by naming it.
  assert.equal(prefersMarkdown('text/html, text/markdown'), true)
})

test('browsers keep getting HTML', () => {
  const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
  assert.equal(prefersMarkdown(chrome), false)
  assert.equal(prefersMarkdown('*/*'), false)
  assert.equal(prefersMarkdown('text/*'), false)
  assert.equal(prefersMarkdown(null), false)
})

test('an explicit q=0 on markdown opts out', () => {
  assert.equal(prefersMarkdown('text/markdown;q=0, text/html'), false)
  assert.equal(markdownQuality('text/markdown;q=0'), 0)
})

test('a lower-ranked markdown entry loses to HTML', () => {
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.9'), false)
})

test('htmlQuality counts wildcards, markdownQuality does not', () => {
  assert.equal(htmlQuality('*/*;q=0.8'), 0.8)
  assert.equal(htmlQuality('text/*'), 1)
  assert.equal(markdownQuality('*/*'), 0)
  assert.equal(markdownQuality('text/*'), 0)
})

test('rejectsHtml only fires when HTML is genuinely unacceptable', () => {
  assert.equal(rejectsHtml('text/markdown'), true)
  assert.equal(rejectsHtml('text/markdown, */*;q=0.1'), false)
  assert.equal(rejectsHtml(null), false)
})

test('markdownTargetFor maps every route, ignoring trailing slashes', () => {
  assert.equal(markdownTargetFor('/', markdownPathFor), '/index.md')
  assert.equal(markdownTargetFor('/contact', markdownPathFor), '/contact.md')
  assert.equal(markdownTargetFor('/contact/', markdownPathFor), '/contact.md')
  assert.equal(markdownTargetFor('/thank-you', markdownPathFor), '/thank-you.md')
  assert.equal(markdownTargetFor('/privacy-policy', markdownPathFor), '/privacy-policy.md')
  assert.equal(markdownTargetFor('/terms-of-service', markdownPathFor), '/terms-of-service.md')
  assert.equal(markdownTargetFor('/nope', markdownPathFor), null)
})

test('negotiate describes the whole decision for a request', () => {
  assert.deepEqual(negotiate('text/markdown', '/contact', markdownPathFor), {
    serveMarkdown: true,
    markdownPath: '/contact.md',
    notAcceptable: false,
  })

  assert.deepEqual(negotiate('text/html', '/contact', markdownPathFor), {
    serveMarkdown: false,
    markdownPath: '/contact.md',
    notAcceptable: false,
  })

  // Markdown-only client, path with no markdown twin: nothing acceptable exists.
  assert.deepEqual(negotiate('text/markdown', '/nope', markdownPathFor), {
    serveMarkdown: true,
    markdownPath: null,
    notAcceptable: true,
  })
})

test('the constants match the acceptmarkdown.com contract', () => {
  assert.equal(MARKDOWN_CONTENT_TYPE, 'text/markdown; charset=utf-8')
  assert.equal(VARY, 'Accept, Accept-Encoding')
})
