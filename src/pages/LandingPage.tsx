import { useMemo } from 'react'
import AddressSelector from '../components/AddressSelector'
import BannerCarousel from '../components/BannerCarousel'
import FilterBar from '../components/FilterBar'
import HotelCard from '../components/HotelCard'
import { CATEGORIES } from '../data/categories'
import { HOTELS } from '../data/hotels'
import { useStore } from '../store/useStore'
import './LandingPage.css'

export default function LandingPage() {
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
          <div className="hero-address rise">
            <AddressSelector />
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
        <div className="hg-head">
          <FilterBar />
          <h2>
            Hotels around <em>{uniLabel(uni)}</em>
          </h2>
        </div>
        <div className="hg-count">{filteredHotels.length} place{filteredHotels.length === 1 ? '' : 's'} match your filters</div>

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

    </main>
  )
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}
