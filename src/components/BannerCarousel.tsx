import { useEffect, useRef, useState, useCallback } from 'react'
import { Clock, ChevronLeft, ChevronRight, PartyPopper, Bike, HandCoins, Sparkles } from 'lucide-react'

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

      <style>{`
        .bc-wrap {
          position: relative;
          margin: 18px 0 6px;
        }
        .bc-scroller {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0 14px;
          /* edge peek on mobile */
          scroll-padding-inline: 0;
        }
        .bc-scroller::-webkit-scrollbar { display: none; }

        .bc-slide {
          flex: 0 0 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 24px 24px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          color: #fff;
          min-height: 180px;
          box-shadow: var(--shadow-md);
        }
        .bc-body { position: relative; z-index: 1; flex: 1; min-width: 0; }
        .bc-art  { position: relative; z-index: 1; flex-shrink: 0; }
        .bc-shade {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 100% 0%, rgba(255,255,255,0.22), transparent 42%),
            radial-gradient(circle at 0% 110%, rgba(0,0,0,0.16), transparent 50%);
          pointer-events: none;
        }

        .bc-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-bottom: 10px;
        }
        .bc-chip-dark  { background: rgba(0,0,0,0.25); color: #fff; }
        .bc-chip-light { background: rgba(255,255,255,0.9); color: var(--ink); }

        .bc-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 4.8vw, 2.1rem);
          line-height: 1.08;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .bc-title strong {
          background: rgba(0,0,0,0.25);
          padding: 0 8px;
          border-radius: 7px;
          font-weight: 700;
        }
        .bc-sub {
          font-size: 0.9rem;
          opacity: 0.92;
          margin: 0;
          line-height: 1.45;
          max-width: 36ch;
        }

        /* Slide themes */
        .bc-cutoff   { background: linear-gradient(135deg, var(--brand-orange) 0%, #FF8842 100%); }
        .bc-discount { background: linear-gradient(135deg, #D9550F 0%, #F26A1F 100%); }
        .bc-delivery { background: linear-gradient(135deg, #141212 0%, #3b2f2c 100%); }
        .bc-gate     { background: linear-gradient(135deg, #0F766E 0%, #0D9488 100%); }
        .bc-daily    { background: linear-gradient(135deg, #7C2D12 0%, #D9550F 100%); }

        /* The clock art on the cutoff slide */
        .bc-clock {
          position: relative;
          width: 120px; height: 120px; border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 2px dashed rgba(255,255,255,0.4);
        }
        .bc-clock-mark {
          position: absolute;
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          padding: 3px 9px;
          background: var(--ink);
          border-radius: 9px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
        }
        .bc-mark-6 { top: 4px;  left: 50%; transform: translateX(-50%); }
        .bc-mark-8 { bottom: 4px; left: 50%; transform: translateX(-50%); }
        .bc-clock-core {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          font-size: 0.78rem; opacity: 0.9; letter-spacing: 0.1em; text-transform: uppercase; color: #fff;
        }

        .bc-art-emoji {
          font-size: 3.2rem;
          line-height: 1;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.25));
        }

        /* Dots */
        .bc-dots {
          display: flex; justify-content: center; gap: 7px;
          margin-top: 6px;
        }
        .bc-dot {
          width: 7px; height: 7px; border-radius: 999px;
          background: rgba(20,18,18,0.18);
          transition: width .25s, background .25s;
        }
        .bc-dot.on {
          width: 22px;
          background: var(--brand-orange);
        }

        /* Arrows — hidden on mobile */
        .bc-arrow {
          display: none;
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 36px; height: 36px; border-radius: 999px;
          background: #fff; color: var(--ink);
          box-shadow: var(--shadow-md);
          align-items: center; justify-content: center;
          z-index: 2;
          transition: transform .18s, background .18s;
        }
        .bc-arrow:hover { background: var(--brand-orange); color: #fff; transform: translateY(-50%) scale(1.06); }
        .bc-prev { left: -12px; }
        .bc-next { right: -12px; }

        @media (min-width: 820px) {
          .bc-arrow { display: inline-flex; }
          .bc-slide { padding: 32px 36px; min-height: 220px; }
          .bc-title { font-size: clamp(1.6rem, 2.6vw, 2.4rem); }
          .bc-art-emoji { font-size: 4.2rem; }
          .bc-clock { width: 140px; height: 140px; }
        }
      `}</style>
    </section>
  )
}
