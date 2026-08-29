// FadeIn.jsx
// Watches when an element enters the viewport using IntersectionObserver,
// then triggers a fade + translate animation. No library needed.
//
// HOW IT WORKS:
// IntersectionObserver fires a callback whenever the ref'd element
// crosses the threshold (default: 10% visible). When it enters, we
// add "visible" state, which transitions opacity from 0→1 and
// translateY from N px → 0. The element "rises" into view.
// The observer disconnects after the first trigger so it only fires once.

import { useEffect, useRef, useState } from "react";

export default function FadeIn({
  children,
  className = "",
  delay = 0,          // ms — stagger sibling FadeIns by passing 0, 100, 200...
  duration = 700,     // ms
  translateY = 24,    // px — how far below it starts (subtle = 16–24px)
  threshold = 0.1,    // 0–1: how much of the element must be visible to trigger
  once = true,        // true = animate once; false = re-animate when re-entering
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect(); // stop watching after first trigger
        } else if (!once) {
          setVisible(false); // re-hide when scrolled back out
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── USAGE EXAMPLES ────────────────────────────────────────────────────────
//
// Single section fade:
//   <FadeIn>
//     <ServiceCard title="Paid Media" />
//   </FadeIn>
//
// Staggered grid (each card delays a bit more than the last):
//   {services.map((s, i) => (
//     <FadeIn key={s.id} delay={i * 120}>
//       <ServiceCard {...s} />
//     </FadeIn>
//   ))}
//
// Slower, more dramatic entrance:
//   <FadeIn duration={1000} translateY={48} delay={200}>
//     <HeroImage />
//   </FadeIn>
//
// Combine with TextReveal — headline reveals, then content fades in:
//   <TextReveal text="What we do." delay={0} />
//   <FadeIn delay={400}>
//     <p>We build automation that turns ad spend into revenue.</p>
//   </FadeIn>
