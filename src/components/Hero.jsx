import { useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'
import AnchorLink from './AnchorLink'
import { ArrowIcon, ChevronDown } from './icons'
import HeroWaves from './HeroWaves'
import { SplitWords } from './SplitText'

export default function Hero() {
  const { t } = useLang()
  const heroRef = useRef(null)
  const canvasRef = useRef(null)

  useParticles(canvasRef)
  useWaveParallax(heroRef)
  useScrollAway(heroRef)

  return (
    <header className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true" />
      <canvas id="heroParticles" ref={canvasRef} aria-hidden="true" />
      <HeroWaves />

      <div className="container hero-content">
        <span className="hero-badge hero-in" style={{ '--hero-delay': '0ms' }}>
          {t.hero.badge}
        </span>

        {/* One-line wordmark, brandbook 04: GROUP, a gold hairline, ARGO. */}
        <h1 className="hero-title">
          <span className="hero-wm-group">Group</span>
          <span className="hero-wm-rule" aria-hidden="true" />{' '}
          <span className="hero-wm-argo">{t.hero.headline}</span>
        </h1>

        <p className="hero-sub"><SplitWords text={t.hero.sub} /></p>
        <p className="hero-sub2 hero-in" style={{ '--hero-delay': '560ms' }}>{t.hero.sub2}</p>

        <div className="hero-ctas hero-in" style={{ '--hero-delay': '680ms' }}>
          <AnchorLink id="contacto" className="btn btn-gold">
            <span>{t.hero.cta1}</span>
            <ArrowIcon />
          </AnchorLink>
          <AnchorLink id="servicios" className="btn btn-ghost">{t.hero.cta2}</AnchorLink>
        </div>

        <div className="hero-stats">
          {t.hero.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="hero-stat hero-in"
              style={{ '--hero-delay': `${800 + index * 130}ms` }}
            >
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <ChevronDown />
      </div>
    </header>
  )
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Slow drift of gold motes across the hero. Pauses when the hero scrolls away. */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    const context = canvas.getContext('2d')
    if (!context) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0
    let particles = []
    let frame = null
    let running = true

    const resize = () => {
      width = canvas.width = canvas.offsetWidth * dpr
      height = canvas.height = canvas.offsetHeight * dpr
    }

    const seed = () => {
      const count = Math.min(28, Math.floor(window.innerWidth / 46))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 1.6 + 0.5) * dpr,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        vy: -(Math.random() * 0.22 + 0.06) * dpr,
        a: Math.random() * 0.5 + 0.12,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    const tick = () => {
      if (!running) return
      context.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.02
        if (p.y < -6 || p.x < -6 || p.x > width + 6) {
          p.x = Math.random() * width
          p.y = height + 6
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw))
        context.beginPath()
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        context.fillStyle = `rgba(212, 175, 55, ${alpha})`
        context.fill()
      }
      frame = requestAnimationFrame(tick)
    }

    resize()
    seed()
    tick()

    let resizeTimer = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        seed()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    // Off-screen particles are wasted frames on a long page.
    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running) tick()
    })
    observer.observe(canvas)

    return () => {
      running = false
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [canvasRef])
}

/**
 * As the page leaves the hero, its content sinks back and fades: --hero-scroll
 * runs 0 -> 1 over the hero's height and argo.css turns it into the motion.
 */
function useScrollAway(heroRef) {
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || prefersReducedMotion()) return

    let frame = null
    const update = () => {
      frame = null
      const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
      hero.style.setProperty('--hero-scroll', progress.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [heroRef])
}

/** The silk ribbons drift a little against the pointer. Fine pointers only. */
function useWaveParallax(heroRef) {
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || prefersReducedMotion()) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const layers = hero.querySelectorAll('[data-depth]')
    if (!layers.length) return

    let frame = null

    const onMove = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect()
        const dx = (event.clientX - rect.width / 2) / rect.width
        const dy = (event.clientY - rect.height / 2) / rect.height
        for (const layer of layers) {
          const depth = Number(layer.dataset.depth || 1)
          layer.style.transform = `translate(${(dx * depth * 18).toFixed(1)}px, ${(dy * depth * 14).toFixed(1)}px)`
        }
        frame = null
      })
    }

    const onLeave = () => {
      for (const layer of layers) layer.style.transform = ''
    }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
  }, [heroRef])
}
