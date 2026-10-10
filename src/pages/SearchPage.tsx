import { useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Plus, Minus, Star } from 'lucide-react'
import { HOTELS, MenuItem } from '../data/hotels'
import { useStore } from '../store/useStore'
import './SearchPage.css'

const SUGGESTIONS = ['Biryani', 'Mandi', 'Shawarma', 'Paneer', 'Chicken 65', 'Veg']

export default function SearchPage() {
  const nav = useNavigate()
  const query = useStore((s) => s.query)
  const setQuery = useStore((s) => s.setQuery)
  const vegFilter = useStore((s) => s.vegFilter)
  const uni = useStore((s) => s.selectedUniversity)
  const cart = useStore((s) => s.cart)
  const addToCart = useStore((s) => s.addToCart)
  const decrement = useStore((s) => s.decrement)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim().toLowerCase()

  const hotelsMatch = useMemo(() => {
    if (!q) return []
    return HOTELS.filter((h) => {
      if (vegFilter === 'veg' && h.veg === 'nonveg') return false
      if (vegFilter === 'nonveg' && h.veg === 'veg') return false
      return (
        h.name.toLowerCase().includes(q) ||
        h.tagline.toLowerCase().includes(q) ||
        h.categories.some((c) => c.toLowerCase().includes(q))
      )
    })
  }, [q, vegFilter])

  const itemsMatch = useMemo(() => {
    if (!q) return []
    const out: { item: MenuItem; hotelId: string; hotelName: string }[] = []
    HOTELS.forEach((h) => {
      h.menu.forEach((m) => {
        if (vegFilter === 'veg' && !m.veg) return
        if (vegFilter === 'nonveg' && m.veg) return
        if (m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
          out.push({ item: m, hotelId: h.id, hotelName: h.name })
        }
      })
    })
    return out.slice(0, 20)
  }, [q, vegFilter])

  const qtyOf = (id: string) => cart.find((l) => l.item.id === id)?.qty ?? 0
  const hasQuery = q.length > 0
  const nothingFound = hasQuery && hotelsMatch.length === 0 && itemsMatch.length === 0

  return (
    <main className="search-page">
      <div className="search-top">
        <div className="container search-top-inner">
          <button className="search-back" onClick={() => nav(-1)} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="search-input">
            <Search size={18} className="si-icon" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search biryani, mandi, shawarma…"
              autoFocus
              inputMode="search"
            />
            {query && (
              <button className="si-clear" onClick={() => setQuery('')} aria-label="Clear">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container search-body">
        {!hasQuery && (
          <div className="search-empty">
            <div className="se-title">Try searching for</div>
            <div className="se-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="se-chip" onClick={() => setQuery(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {nothingFound && (
          <div className="search-noresults">
            <div className="snr-emoji">🔎</div>
            <h3>No dishes or hotels match “{query}”</h3>
            <p className="mute">Try a shorter term, or pick a suggestion below.</p>
            <div className="se-chips" style={{ justifyContent: 'center', marginTop: 16 }}>
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button key={s} className="se-chip" onClick={() => setQuery(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {itemsMatch.length > 0 && (
          <section className="search-section">
            <div className="search-section-head">
              <h2>Dishes</h2>
              <span className="mute text-sm">{itemsMatch.length} match{itemsMatch.length === 1 ? '' : 'es'}</span>
            </div>
            <div className="dish-list">
              {itemsMatch.map(({ item, hotelId, hotelName }) => {
                const qty = qtyOf(item.id)
                return (
                  <div key={`${hotelId}-${item.id}`} className="dish-row">
                    <div className="dr-left">
                      <span className={`vn-mark ${item.veg ? '' : 'nonveg'}`} />
                      <div className="dr-info">
                        <div className="dr-name">
                          {item.name}
                          {item.bestseller && <span className="dr-tag">★ Bestseller</span>}
                        </div>
                        <Link to={`/menu/${hotelId}`} className="dr-hotel">from {hotelName} →</Link>
                        <div className="dr-price">₹{item.price}</div>
                      </div>
                    </div>
                    <div className="dr-right">
                      {qty === 0 ? (
                        <button className="dr-add" onClick={() => addToCart(item, hotelId, hotelName)}>
                          <Plus size={14} /> ADD
                        </button>
                      ) : (
                        <div className="dr-qty">
                          <button onClick={() => decrement(item.id)}><Minus size={13} /></button>
                          <span>{qty}</span>
                          <button onClick={() => addToCart(item, hotelId, hotelName)}><Plus size={13} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {hotelsMatch.length > 0 && (
          <section className="search-section">
            <div className="search-section-head">
              <h2>Restaurants</h2>
              <span className="mute text-sm">{hotelsMatch.length} match{hotelsMatch.length === 1 ? '' : 'es'}</span>
            </div>
            <div className="hotel-list">
              {hotelsMatch.map((h) => (
                <Link key={h.id} to={`/menu/${h.id}`} className="hotel-row">
                  <img src={h.cover} alt="" className="hr-thumb" loading="lazy" decoding="async" width={120} height={120} />
                  <div className="hr-body">
                    <div className="hr-top">
                      <div className="hr-name">{h.name}</div>
                      <span className="hr-rating"><Star size={11} fill="currentColor" strokeWidth={0} /> {h.rating.toFixed(1)}</span>
                    </div>
                    <div className="hr-tag mute">{h.tagline}</div>
                    <div className="hr-meta mute">
                      {h.location} · <strong>{h.distance[uni]} km</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
