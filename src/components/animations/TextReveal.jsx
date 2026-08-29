// TextReveal.jsx
// Splits text into words (or lines) and slides each one up from behind
// an invisible clip mask — the classic editorial agency effect.
//
// HOW IT WORKS:
// Each word lives inside a div with overflow-hidden. The word itself
// starts translated down (hidden below the clip edge) and animates to
// translateY(0). Because the parent clips overflow, the word appears to
// "rise" from behind a floor — not fade in, but physically emerge.
// Stagger is driven by CSS animation-delay, one per word index.

import { useEffect, useRef, useState } from "react";

export default function TextReveal({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0,        // ms before the whole block starts
  stagger = 80,     // ms between each word
  duration = 700,   // ms per word animation
  splitBy = "words", // "words" | "chars"
  triggerOnMount = true, // false = wait for .play() call via ref
}) {
  const [visible, setVisible] = useState(false);
  const tokens = splitBy === "chars" ? [...text] : text.split(" ");

  useEffect(() => {
    if (!triggerOnMount) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, triggerOnMount]);

  return (
    // aria-label re-joins the text for screen readers so they hear
    // the full sentence, not each word announced separately
    <Tag className={`flex flex-wrap ${className}`} aria-label={text}>
      {tokens.map((token, i) => (
        <span
          key={i}
          // overflow-hidden on the wrapper is the "mask floor"
          className="overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="inline-block"
            data-reveal=""
            style={{
              // Start below the mask floor
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              // cubic-bezier: fast start, slow finish = snappy & premium
              transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration * 0.4}ms ease`,
              transitionDelay: `${i * stagger}ms`,
              // Add a hair of space between words — but not after the last one,
              // so the trailing margin doesn't shift centered text off-center.
              marginRight:
                splitBy === "words" && i < tokens.length - 1 ? "0.25em" : "0",
            }}
          >
            {token}
          </span>
        </span>
      ))}
    </Tag>
  );
}

// ─── USAGE EXAMPLES ────────────────────────────────────────────────────────
//
// Basic hero headline:
//   <TextReveal text="We build what moves." className="text-5xl font-bold text-white" />
//
// Delayed subtitle (starts after headline finishes):
//   <TextReveal text="AI automation & paid media for ambitious brands." delay={500} className="text-xl text-neutral-400" />
//
// Character-by-character (good for short words like "ARGO"):
//   <TextReveal text="ARGO" splitBy="chars" stagger={50} className="text-8xl font-black tracking-widest" />
//
// Inside a scroll-triggered section, pass triggerOnMount={false} and
// call setVisible(true) from a FadeIn ref instead:
//   <TextReveal text="..." triggerOnMount={false} ref={...} />
