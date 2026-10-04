import { Fragment } from 'react'

/**
 * Masked letter rise for headings: every word clips its own line
 * (.split-word) and each letter climbs into it in turn (.split-char, staggered
 * by --i). The motion lives in argo.css and keys off the `.visible` class the
 * surrounding <Reveal> adds.
 *
 * The letters are aria-hidden so screen readers do not spell the title out;
 * the heading that renders this must carry the plain title as aria-label. The
 * text itself is untouched, so the prerendered HTML and the markdown twins
 * still read the same words.
 */
export default function SplitText({ title, accent }) {
  return (
    <span className="split" aria-hidden="true">
      {splitTitle(title, accent).map((segment, s) => {
        const words = segment.words.map((word, w) =>
          word.chars ? (
            <span className="split-word" key={w}>
              {word.chars.map((char) => (
                <span className="split-char" style={{ '--i': char.index }} key={char.index}>
                  {char.value}
                </span>
              ))}
            </span>
          ) : (
            word.space
          ),
        )
        return segment.accent ? <em key={s}>{words}</em> : <Fragment key={s}>{words}</Fragment>
      })}
    </span>
  )
}

/**
 * Same masked rise, one word at a time, for running text that is not a
 * heading. Words stay readable as words, so no aria juggling is needed.
 */
export function SplitWords({ text }) {
  return text.split(/(\s+)/).map((word, index) =>
    /^\s*$/.test(word) ? (
      word
    ) : (
      <span className="split-word" key={index}>
        <span className="split-char" style={{ '--i': index / 2 }}>{word}</span>
      </span>
    ),
  )
}

// Title + accent word -> segments of words -> letters, each letter numbered
// across the whole title so the stagger runs left to right through the accent.
function splitTitle(title, accent) {
  const at = accent ? title.indexOf(accent) : -1
  const parts =
    at === -1
      ? [{ text: title, accent: false }]
      : [
          { text: title.slice(0, at), accent: false },
          { text: accent, accent: true },
          { text: title.slice(at + accent.length), accent: false },
        ].filter((part) => part.text)

  let index = 0
  return parts.map((part) => ({
    accent: part.accent,
    words: part.text.split(/(\s+)/).filter(Boolean).map((word) =>
      /^\s+$/.test(word)
        ? { space: word }
        : { chars: [...word].map((value) => ({ value, index: index++ })) },
    ),
  }))
}
