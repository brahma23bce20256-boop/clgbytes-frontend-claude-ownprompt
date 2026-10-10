import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Sparkles, Zap, Shield, ArrowRight, PartyPopper } from 'lucide-react'
import AddressSelector from '../components/AddressSelector'
import BannerCarousel from '../components/BannerCarousel'
import FilterBar from '../components/FilterBar'
import HotelCard from '../components/HotelCard'
import { CATEGORIES } from '../data/categories'
import { HOTELS } from '../data/hotels'
import { useStore } from '../store/useStore'
import './LandingPage.css'

export default function LandingPage() {
  const nav = useNavigate()
  const query = useStore((s) => s.query)
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
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'distance') list.sort((a, b) => a.distance[uni] - b.distance[uni])
    if (sortBy === 'price-low') list.sort((a, b) => a.priceForTwo - b.priceForTwo)
    if (sortBy === 'price-high') list.sort((a, b) => b.priceForTwo - a.priceForTwo)
    return list
  }, [category, vegFilter, sortBy, uni])

  return (
    <main className="landing">
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

          <button
            type="button"
            className="hero-search rise"
            onClick={() => nav('/search')}
            aria-label="Open search"
          >
            <span className="hs-icon"><Search size={18} /></span>
            <span className="hs-placeholder">
              {query ? query : 'Search biryani, mandi, shawarma, or a hotel…'}
            </span>
            <span className="hs-cta">Search</span>
          </button>

          <div className="hero-trust rise">
            <span><Shield size={14} /> Hostel-tested</span>
            <span><Zap size={14} /> ~45 min · door-to-gate</span>
            <span><PartyPopper size={14} /> ₹30 off above ₹499</span>
          </div>
        </div>

        <div className="hero-decor" aria-hidden />
      </section>

      <div className="container">
        <BannerCarousel />
      </div>

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
    </main>
  )
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}
