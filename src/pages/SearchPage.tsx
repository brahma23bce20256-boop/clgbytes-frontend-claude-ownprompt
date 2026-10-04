import { useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Plus, Minus, Star } from 'lucide-react'
import { HOTELS, MenuItem } from '../data/hotels'
import { useStore } from '../store/useStore'

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
      {/* ===== Sticky search bar ===== */}
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
        {/* ===== Empty state: suggestions ===== */}
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
            <div className="se-hint">
              Looking for a hotel by name works too — try “Bawarchi” or “Shawarma Street”.
            </div>
          </div>
        )}

        {/* ===== No results ===== */}
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

        {/* ===== Dishes section ===== */}
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

        {/* ===== Restaurants section ===== */}
        {hotelsMatch.length > 0 && (
          <section className="search-section">
            <div className="search-section-head">
              <h2>Restaurants</h2>
              <span className="mute text-sm">{hotelsMatch.length} match{hotelsMatch.length === 1 ? '' : 'es'}</span>
            </div>
            <div className="hotel-list">
              {hotelsMatch.map((h) => (
                <Link key={h.id} to={`/menu/${h.id}`} className="hotel-row">
                  <img src={h.cover} alt="" className="hr-thumb" loading="lazy" />
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

      <style>{`
        .search-page { padding-bottom: 120px; }

        .search-top {
          position: sticky;
          top: var(--header-h);
          z-index: 40;
          background: color-mix(in oklab, var(--cream) 92%, white 8%);
          backdrop-filter: saturate(140%) blur(10px);
          -webkit-backdrop-filter: saturate(140%) blur(10px);
          border-bottom: 1px solid var(--line);
          padding: 14px 0;
        }
        .search-top-inner { display: flex; align-items: center; gap: 10px; }
        .search-back {
          flex-shrink: 0;
          width: 42px; height: 42px; border-radius: 999px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          display: inline-flex; align-items: center; justify-content: center;
          transition: border-color .18s, background .18s;
        }
        .search-back:hover { border-color: var(--ink); background: var(--cream); }

        .search-input {
          flex: 1;
          display: flex; align-items: center; gap: 10px;
          background: var(--paper);
          border: 1.5px solid var(--brand-orange);
          border-radius: 999px;
          padding: 10px 16px;
          box-shadow: 0 8px 24px -14px rgba(242,106,31,0.5);
        }
        .search-input input {
          flex: 1;
          border: 0; outline: 0; background: transparent;
          font-size: 1rem;
          color: var(--ink);
          padding: 2px 0;
        }
        .search-input input::placeholder { color: var(--ink-faint); }
        .si-icon { color: var(--brand-orange); flex-shrink: 0; }
        .si-clear {
          width: 24px; height: 24px; border-radius: 999px;
          background: var(--line-strong); color: var(--ink);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .18s;
        }
        .si-clear:hover { background: var(--ink); color: #fff; }

        .search-body { padding-top: 20px; }

        /* Empty state */
        .search-empty { padding: 20px 0 40px; }
        .se-title { font-size: 0.8rem; color: var(--ink-mute); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; }
        .se-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .se-chip {
          padding: 9px 16px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          font-weight: 600; font-size: 0.9rem;
          color: var(--ink);
          transition: all .18s;
        }
        .se-chip:hover { background: var(--brand-orange); color: #fff; border-color: var(--brand-orange-deep); }
        .se-hint { font-size: 0.85rem; color: var(--ink-mute); margin-top: 24px; }

        .search-noresults { text-align: center; padding: 50px 20px; }
        .snr-emoji { font-size: 42px; margin-bottom: 10px; }
        .search-noresults h3 { font-size: 1.15rem; margin-bottom: 6px; }

        /* Sections */
        .search-section { margin-bottom: 32px; }
        .search-section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
        .search-section-head h2 { font-size: 1.2rem; }

        /* Dish rows */
        .dish-list {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .dish-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px;
          border-bottom: 1px dashed var(--line);
          gap: 14px;
        }
        .dish-row:last-child { border-bottom: 0; }
        .dr-left { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
        .dr-info { min-width: 0; }
        .dr-name { font-weight: 600; font-size: 0.96rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .dr-tag { font-size: 0.66rem; background: var(--brand-orange-soft); color: var(--brand-orange-deep); padding: 2px 7px; border-radius: 4px; font-weight: 700; }
        .dr-hotel {
          display: inline-block; margin-top: 4px;
          font-size: 0.78rem; color: var(--brand-orange-deep);
          font-weight: 500;
        }
        .dr-hotel:hover { text-decoration: underline; }
        .dr-price { font-size: 0.9rem; color: var(--ink-soft); margin-top: 4px; font-weight: 500; }
        .dr-right { flex-shrink: 0; }
        .dr-add {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff;
          border: 1.5px solid var(--brand-orange);
          color: var(--brand-orange-deep);
          padding: 6px 14px; border-radius: 10px;
          font-weight: 700; font-size: 0.78rem; letter-spacing: 0.04em;
          transition: all .18s;
        }
        .dr-add:hover { background: var(--brand-orange); color: #fff; }
        .dr-qty {
          display: inline-flex; align-items: center;
          background: var(--brand-orange); color: #fff;
          border-radius: 10px; overflow: hidden;
        }
        .dr-qty button { padding: 6px 9px; color: #fff; }
        .dr-qty button:hover { background: var(--brand-orange-deep); }
        .dr-qty span { padding: 0 8px; font-weight: 700; min-width: 20px; text-align: center; font-size: 0.85rem; }

        /* Hotel rows */
        .hotel-list { display: flex; flex-direction: column; gap: 10px; }
        .hotel-row {
          display: flex; gap: 14px; align-items: center;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          box-shadow: var(--shadow-sm);
          color: var(--ink);
          transition: transform .18s, box-shadow .18s, border-color .18s;
        }
        .hotel-row:hover { transform: translateY(-2px); border-color: var(--brand-orange); box-shadow: var(--shadow-md); }
        .hr-thumb {
          width: 68px; height: 68px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--cream);
        }
        .hr-body { flex: 1; min-width: 0; }
        .hr-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .hr-name { font-weight: 700; font-size: 0.98rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hr-rating {
          display: inline-flex; align-items: center; gap: 3px;
          background: var(--veg); color: #fff;
          padding: 2px 7px; border-radius: 6px;
          font-size: 0.72rem; font-weight: 700;
          flex-shrink: 0;
        }
        .hr-tag { font-size: 0.8rem; margin-top: 3px; }
        .hr-meta { font-size: 0.74rem; margin-top: 3px; }
        .hr-meta strong { color: var(--ink); font-weight: 600; }

        @media (max-width: 600px) {
          .search-top { padding: 10px 0; }
          .search-input { padding: 9px 14px; }
          .search-input input { font-size: 0.95rem; }
          .dish-row { padding: 12px 14px; }
          .dr-name { font-size: 0.92rem; }
        }
      `}</style>
    </main>
  )
}
