import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LangContext'
import SectionTitle from './SectionTitle'
import { ChevronLeft, ChevronRight } from './icons'

const AUTOPLAY_MS = 6000
const SWIPE_PX = 48

export default function Testimonials() {
  const { t } = useLang()
  const items = t.testimonials.items

  // Two cards per page on desktop, one on narrow screens. Starts at 1 so the
  // server and the first client render agree; the effect corrects it on mount.
  const [perView, setPerView] = useState(1)
  const [requestedPage, setRequestedPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const pointerStart = useRef(null)

  const pages = Math.ceil(items.length / perView)
  // A narrowing viewport can leave the carousel parked past the last page.
  const page = Math.min(requestedPage, pages - 1)

  useEffect(() => {
    const measure = () => setPerView(window.innerWidth > 860 ? 2 : 1)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const go = useCallback((direction) => {
    setRequestedPage((current) => (Math.min(current, pages - 1) + direction + pages) % pages)
  }, [pages])

  useEffect(() => {
    if (paused || pages < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => go(1), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [go, paused, pages, page])

  const onPointerDown = (event) => { pointerStart.current = event.clientX }
  const onPointerUp = (event) => {
    if (pointerStart.current === null) return
    const dx = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1)
  }

  return (
    <section className="section testimonials" id="testimonios">
      <div className="container">
        <SectionTitle
          center
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
          accent={t.testimonials.accent}
        />

        <div className="t-carousel">
          <div
            className="t-viewport"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="t-track" style={{ transform: `translateX(-${page * 100}%)` }}>
              {items.map((item) => (
                <div className="t-slide" key={item.name}>
                  <figure className="t-card">
                    <div className="t-quote-mark" aria-hidden="true">&ldquo;</div>
                    <blockquote>{item.quote}</blockquote>
                    <figcaption className="t-person">
                      <div className="t-avatar" aria-hidden="true">{item.initials}</div>
                      <div>
                        <div className="name">{item.name}</div>
                        <div className="role">{item.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="t-controls">
            <button className="t-arrow" onClick={() => go(-1)} aria-label={`${t.testimonials.title} —`}>
              <ChevronLeft />
            </button>
            <div className="t-dots">
              {Array.from({ length: pages }).map((_, index) => (
                <button
                  key={index}
                  className={index === page ? 't-dot active' : 't-dot'}
                  onClick={() => setRequestedPage(index)}
                  aria-label={`${index + 1} / ${pages}`}
                  aria-current={index === page}
                />
              ))}
            </div>
            <button className="t-arrow" onClick={() => go(1)} aria-label={`${t.testimonials.title} +`}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
