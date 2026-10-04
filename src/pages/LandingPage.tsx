import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles, Zap, Shield, ArrowRight, PartyPopper } from 'lucide-react'
import AddressSelector from '../components/AddressSelector'
import BannerCarousel from '../components/BannerCarousel'
import FilterBar from '../components/FilterBar'
import HotelCard from '../components/HotelCard'
import { CATEGORIES } from '../data/categories'
import { HOTELS } from '../data/hotels'
import { useStore } from '../store/useStore'

export default function LandingPage() {
  const query = useStore((s) => s.query)
  const setQuery = useStore((s) => s.setQuery)
  const category = useStore((s) => s.category)
  const setCategory = useStore((s) => s.setCategory)
  const vegFilter = useStore((s) => s.vegFilter)
  const sortBy = useStore((s) => s.sortBy)
  const uni = useStore((s) => s.selectedUniversity)

  const filteredHotels = useMemo(() => {
    let list = [...HOTELS]
    if (category) list = list.filter((h) => h.categories.includes(category))
    if (vegFilter === 'veg') list = list.filter((h) => h.veg === 'veg' || h.veg === 'both')
    if (vegFilter === 'nonveg') list = list.filter((h) => h.veg === 'nonveg' || h.veg === 'both')
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.tagline.toLowerCase().includes(q) ||
          h.menu.some((m) => m.name.toLowerCase().includes(q))
      )
    }
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'distance') list.sort((a, b) => a.distance[uni] - b.distance[uni])
    if (sortBy === 'price-low') list.sort((a, b) => a.priceForTwo - b.priceForTwo)
    if (sortBy === 'price-high') list.sort((a, b) => b.priceForTwo - a.priceForTwo)
    return list
  }, [category, vegFilter, query, sortBy, uni])

  return (
    <main className="landing">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badges rise">
            <span className="hb"><Sparkles size={14} /> We're back · daily orders, no breaks</span>
          </div>
          <h1 className="hero-title rise">
            Campus food, <em>trusted daily</em>.<br />
            Order by <span className="pill-6pm">6 pm</span>, we're at your <span className="pill-gate">main gate by 8 pm</span>.
          </h1>
          <p className="hero-sub rise">
            One tap from menu → main gate. No surge, no gimmicks — menu prices + a flat delivery fee.
            Built by VIT-AP students for VIT-AP, SRM AP and Amrita AP.
          </p>

          <div className="hero-address rise">
            <AddressSelector />
          </div>

          <div className="hero-search rise">
            <div className="hs-icon"><Search size={18} /></div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search biryani, mandi, shawarma, or a hotel…"
            />
            <button className="hs-cta" onClick={() => document.getElementById('hotels-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Find food
            </button>
          </div>

          <div className="hero-trust rise">
            <span><Shield size={14} /> Hostel-tested</span>
            <span><Zap size={14} /> ~45 min · door-to-gate</span>
            <span><PartyPopper size={14} /> ₹30 off above ₹499</span>
          </div>
        </div>

        {/* decorative fork hint — nod to the logo */}
        <div className="hero-decor" aria-hidden />
      </section>

      {/* ============ OFFER CAROUSEL ============ */}
      <div className="container">
        <BannerCarousel />
      </div>

      {/* ============ CATEGORIES — horizontal swipe rail ============ */}
      <section className="container cats-section">
        <div className="section-title">
          <h2>What are we eating today?</h2>
        </div>
        <div className="cat-rail" role="tablist" aria-label="Food categories">
          <button
            role="tab"
            aria-selected={category === null}
            className={`cat-chip ${category === null ? 'active' : ''}`}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={category === c.id}
              className={`cat-chip ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(category === c.id ? null : c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* ============ FILTER + HOTELS ============ */}
      <section className="container" id="hotels-grid">
        <FilterBar />
        <div className="section-title">
          <h2>
            Hotels around <em>{uniLabel(uni)}</em>
            <small>{filteredHotels.length} place{filteredHotels.length === 1 ? '' : 's'} match your filters</small>
          </h2>
        </div>

        {filteredHotels.length === 0 ? (
          <div className="empty-card">
            <div style={{ fontSize: 44 }}>🍽️</div>
            <h3 style={{ marginTop: 8 }}>No hotels match these filters.</h3>
            <p className="mute">Clear a filter and try again — we promise there's good food here.</p>
          </div>
        ) : (
          <div className="hotels-grid">
            {filteredHotels.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
          </div>
        )}
      </section>

      {/* ============ ABOUT PREVIEW — minimal ============ */}
      <section className="container about-mini">
        <h2>About us</h2>
        <p>
          We're <strong>Clgbytes</strong> — a crew of VIT-AP students who got tired of the hostel-food premium,
          so we built this. Menu prices, a tiny delivery fee, and one honest run every evening. We stumbled last
          time; this time we're back daily — no breaks, only trust.
        </p>
        <Link to="/about" className="btn btn-dark about-mini-cta">
          Read our full story <ArrowRight size={16} />
        </Link>
      </section>

      <style>{`
        .landing { padding-top: 20px; }

        /* --- HERO --- */
        .hero {
          position: relative;
          padding: 32px 0 20px;
          overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(circle at 85% 0%, rgba(242,106,31,0.14), transparent 40%),
            radial-gradient(circle at 5% 80%, rgba(242,106,31,0.08), transparent 50%);
          pointer-events: none;
        }
        .hero-inner { position: relative; }
        .hero-badges { display: inline-flex; gap: 8px; margin-bottom: 20px; }
        .hb {
          display: inline-flex; align-items: center; gap: 6px;
          background: #141212; color: #fff;
          padding: 7px 14px; border-radius: 999px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.02em;
        }
        .hb svg { color: var(--brand-orange-glow); }
        .hero-title {
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-family: var(--font-display);
          line-height: 1.03;
          letter-spacing: -0.025em;
          max-width: 920px;
        }
        .hero-title em { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--brand-orange-deep); font-weight: 500; }
        .pill-6pm, .pill-gate {
          display: inline-block;
          padding: 0 10px;
          border-radius: 10px;
          background: var(--brand-orange);
          color: #fff;
          box-shadow: 0 8px 20px -10px rgba(242,106,31,0.7);
        }
        .pill-gate { background: var(--ink); }

        .hero-sub {
          font-size: 1.05rem;
          max-width: 640px;
          color: var(--ink-mute);
          margin: 18px 0 26px;
          line-height: 1.55;
        }
        .hero-address { margin-bottom: 20px; }

        .hero-search {
          display: flex; align-items: center;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 6px 6px 6px 20px;
          box-shadow: var(--shadow-md);
          max-width: 640px;
          gap: 10px;
          transition: border-color .2s, transform .2s;
        }
        .hero-search:focus-within { border-color: var(--brand-orange); transform: translateY(-1px); }
        .hs-icon { color: var(--ink-mute); display: inline-flex; }
        .hero-search input {
          flex: 1;
          border: 0; outline: 0; background: transparent;
          padding: 14px 0; font-size: 1rem;
          color: var(--ink);
        }
        .hs-cta {
          background: var(--brand-orange); color: #fff;
          font-weight: 600;
          padding: 12px 22px; border-radius: 999px;
          font-size: 0.95rem;
          transition: background .2s, transform .2s;
        }
        .hs-cta:hover { background: var(--brand-orange-deep); transform: translateY(-1px); }

        .hero-trust {
          display: flex; gap: 20px; flex-wrap: wrap;
          margin-top: 20px;
          color: var(--ink-mute); font-size: 0.85rem;
        }
        .hero-trust span { display: inline-flex; align-items: center; gap: 6px; }

        .hero-decor {
          position: absolute; right: -40px; top: 20px; width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(242,106,31,0.18), transparent 60%);
          filter: blur(10px);
          pointer-events: none;
        }

        /* --- BANNERS --- */
        .banners { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; }
        .banner-primary {
          position: relative;
          display: flex; justify-content: space-between; align-items: center;
          background: linear-gradient(135deg, var(--brand-orange) 0%, #FF8842 100%);
          color: #fff;
          border-radius: var(--radius-lg);
          padding: 28px 32px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .banner-primary::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(circle at 95% 50%, rgba(255,255,255,0.18), transparent 40%),
            radial-gradient(circle at 10% 110%, rgba(0,0,0,0.14), transparent 50%);
        }
        .banner-text { position: relative; z-index: 1; }
        .banner-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.2);
          padding: 6px 12px; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
        }
        .banner-text h2 { font-size: clamp(1.4rem, 2.6vw, 2rem); color: #fff; max-width: 640px; }
        .banner-text h2 strong { background: rgba(0,0,0,0.25); padding: 0 10px; border-radius: 8px; }
        .banner-text p { margin: 8px 0 0; opacity: 0.9; font-size: 0.95rem; max-width: 560px; }

        .banner-clock { position: relative; z-index: 1; flex-shrink: 0; margin-left: 16px; }
        .clock-ring {
          width: 128px; height: 128px; border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 2px dashed rgba(255,255,255,0.4);
          position: relative;
        }
        .clock-mark {
          position: absolute;
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          padding: 4px 10px;
          background: var(--ink);
          border-radius: 10px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
        }
        .m-6pm { top: 6px; left: 50%; transform: translateX(-50%); }
        .m-8pm { bottom: 6px; left: 50%; transform: translateX(-50%); }
        .clock-core {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          font-size: 0.9rem; opacity: 0.9; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .banner-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .banner-mini {
          display: flex; align-items: center; gap: 14px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          box-shadow: var(--shadow-sm);
          transition: transform .18s, box-shadow .18s;
        }
        .banner-mini:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .bm-emoji { font-size: 2rem; }
        .banner-mini h3 { font-family: var(--font-sans); font-weight: 700; font-size: 1rem; }
        .banner-mini p { margin: 2px 0 0; font-size: 0.82rem; }

        /* --- CATEGORIES: horizontal swipe rail, text-only --- */
        .cats-section .section-title { margin-bottom: 12px; }
        .cat-rail {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0 8px;
          /* bleed to screen edges so chips can scroll flush */
          margin-left: calc(-1 * clamp(16px, 3vw, 32px));
          margin-right: calc(-1 * clamp(16px, 3vw, 32px));
          padding-left: clamp(16px, 3vw, 32px);
          padding-right: clamp(16px, 3vw, 32px);
          mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
        }
        .cat-rail::-webkit-scrollbar { display: none; }
        .cat-chip {
          flex-shrink: 0;
          scroll-snap-align: start;
          padding: 9px 18px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--ink-soft);
          white-space: nowrap;
          transition: all .18s;
        }
        .cat-chip:hover { border-color: var(--ink); color: var(--ink); }
        .cat-chip.active {
          background: var(--brand-orange);
          color: #fff;
          border-color: var(--brand-orange-deep);
          box-shadow: 0 8px 20px -10px rgba(242,106,31,0.6);
        }
        @media (max-width: 600px) {
          .cat-chip { padding: 8px 14px; font-size: 0.85rem; }
        }

        /* --- HOTELS --- */
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .empty-card {
          text-align: center;
          padding: 50px 20px;
          background: var(--paper);
          border: 1px dashed var(--line-strong);
          border-radius: var(--radius-md);
        }

        /* --- ABOUT PREVIEW: minimal, borderless --- */
        .about-mini {
          margin-top: 54px;
          max-width: 680px;
        }
        .about-mini h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          margin-bottom: 14px;
        }
        .about-mini p {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--ink-soft);
          margin: 0 0 20px;
        }
        .about-mini p strong { color: var(--ink); font-weight: 600; }
        .about-mini-cta { }
        @media (max-width: 600px) {
          .about-mini { margin-top: 36px; }
          .about-mini p { font-size: 0.95rem; }
        }

        @media (max-width: 600px) {
          .hero { padding: 20px 0 10px; }
          .hero-badges { margin-bottom: 14px; }
          .hero-title { font-size: clamp(1.9rem, 8vw, 2.6rem); }
          .hero-sub { font-size: 0.95rem; margin: 14px 0 20px; }
          .hero-search { padding: 5px 5px 5px 16px; }
          .hero-search input { font-size: 0.95rem; padding: 12px 0; }
          .hs-cta { padding: 10px 16px; font-size: 0.85rem; }
          .hero-trust { gap: 14px; font-size: 0.78rem; margin-top: 16px; }
          .section-title h2 { font-size: 1.3rem; }
          .section-title h2 small { font-size: 0.78rem; }
          .hotels-grid { gap: 14px; }
        }
      `}</style>
    </main>
  )
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}
