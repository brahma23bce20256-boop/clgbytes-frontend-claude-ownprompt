import { useEffect, useRef, useState, useCallback } from 'react'
import { Clock, ChevronLeft, ChevronRight, PartyPopper, Bike, HandCoins, Sparkles } from 'lucide-react'
import './BannerCarousel.css'

/**
 * Mobile-first banner carousel.
 * - Horizontal scroll with CSS snap for native swipe.
 * - Dot pager reflects the current slide via scroll position.
 * - Auto-advances every 5s; pauses on user interaction/hover.
 * - Prev/next arrows on tablet+.
 */
export default function BannerCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = [
    { k: 'cutoff' },
    { k: 'discount' },
    { k: 'delivery' },
    { k: 'gate' },
    { k: 'daily' },
  ] as const

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current
    if (!el) return
    const slide = el.children[i] as HTMLElement | undefined
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }, [])

  // Track active slide via scroll position
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let frame: number
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const slides = Array.from(el.children) as HTMLElement[]
        const left = el.scrollLeft
        let closest = 0
        let best = Infinity
        slides.forEach((s, i) => {
          const d = Math.abs(s.offsetLeft - el.offsetLeft - left)
          if (d < best) { best = d; closest = i }
        })
        setIndex(closest)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])

  // Autoplay
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      const next = (index + 1) % slides.length
      scrollToIndex(next)
    }, 5000)
    return () => clearInterval(t)
  }, [index, paused, scrollToIndex, slides.length])

  return (
    <section
      className="bc-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="bc-scroller" ref={scrollerRef}>
        {/* ---------- Slide 1: 6pm → 8pm cutoff (prominent) ---------- */}
        <article className="bc-slide bc-cutoff">
          <div className="bc-shade" aria-hidden />
          <div className="bc-body">
            <span className="bc-chip bc-chip-dark"><Clock size={13} /> Daily cutoff</span>
            <h3 className="bc-title">
              Order by <strong>6 pm</strong>.<br />
              Delivered by <strong>8 pm</strong>.
            </h3>
            <p className="bc-sub">One honest run every evening — order early, we batch so you pay less.</p>
          </div>
          <div className="bc-art bc-art-clock" aria-hidden>
            <div className="bc-clock">
              <span className="bc-clock-mark bc-mark-6">6</span>
              <span className="bc-clock-mark bc-mark-8">8</span>
              <span className="bc-clock-core">pm</span>
            </div>
          </div>
        </article>

        {/* ---------- Slide 2: ₹30 off ---------- */}
        <article className="bc-slide bc-discount">
          <div className="bc-body">
            <span className="bc-chip bc-chip-light"><PartyPopper size={13} /> Student special</span>
            <h3 className="bc-title">Flat <strong>₹30 off</strong></h3>
            <p className="bc-sub">On every cart above ₹499. Automatic — no code needed.</p>
          </div>
          <div className="bc-art bc-art-emoji" aria-hidden>🎉</div>
        </article>

        {/* ---------- Slide 3: Flat ₹15 delivery ---------- */}
        <article className="bc-slide bc-delivery">
          <div className="bc-body">
            <span className="bc-chip bc-chip-light"><Bike size={13} /> Honest delivery</span>
            <h3 className="bc-title">Flat <strong>₹15</strong> delivery</h3>
            <p className="bc-sub">On orders above ₹299. No surge pricing, ever.</p>
          </div>
          <div className="bc-art bc-art-emoji" aria-hidden>🏍️</div>
        </article>

        {/* ---------- Slide 4: Pay at the gate ---------- */}
        <article className="bc-slide bc-gate">
          <div className="bc-body">
            <span className="bc-chip bc-chip-dark"><HandCoins size={13} /> Pay later</span>
            <h3 className="bc-title">Pay at your <strong>main gate</strong></h3>
            <p className="bc-sub">UPI or cash — settle when you collect. No prepay.</p>
          </div>
          <div className="bc-art bc-art-emoji" aria-hidden>🤝</div>
        </article>

        {/* ---------- Slide 5: We're back daily ---------- */}
        <article className="bc-slide bc-daily">
          <div className="bc-body">
            <span className="bc-chip bc-chip-dark"><Sparkles size={13} /> We're back</span>
            <h3 className="bc-title">Open every day. <br/><strong>No breaks.</strong></h3>
            <p className="bc-sub">New ideas drop weekly to make campus food easier to reach.</p>
          </div>
          <div className="bc-art bc-art-emoji" aria-hidden>🧡</div>
        </article>
      </div>

      {/* Prev / Next (desktop) */}
      <button
        className="bc-arrow bc-prev"
        onClick={() => scrollToIndex(Math.max(0, index - 1))}
        aria-label="Previous"
      ><ChevronLeft size={18} /></button>
      <button
        className="bc-arrow bc-next"
        onClick={() => scrollToIndex(Math.min(slides.length - 1, index + 1))}
        aria-label="Next"
      ><ChevronRight size={18} /></button>

      {/* Dots */}
      <div className="bc-dots" role="tablist" aria-label="Banner pages">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={index === i}
            className={`bc-dot ${index === i ? 'on' : ''}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}
