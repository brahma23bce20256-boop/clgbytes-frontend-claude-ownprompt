import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus, Search } from 'lucide-react'
import { hotelById } from '../data/hotels'
import { useStore } from '../store/useStore'
import VegToggle from '../components/VegToggle'

export default function MenuPage() {
  const { hotelId } = useParams()
  const nav = useNavigate()
  const hotel = hotelId ? hotelById(hotelId) : null
  const uni = useStore((s) => s.selectedUniversity)
  const cart = useStore((s) => s.cart)
  const vegFilter = useStore((s) => s.vegFilter)
  const addToCart = useStore((s) => s.addToCart)
  const decrement = useStore((s) => s.decrement)
  const [search, setSearch] = useState('')

  const qtyOf = (id: string) => cart.find((l) => l.item.id === id)?.qty ?? 0

  const filtered = useMemo(() => {
    if (!hotel) return []
    let list = hotel.menu
    if (vegFilter === 'veg') list = list.filter((m) => m.veg)
    if (vegFilter === 'nonveg') list = list.filter((m) => !m.veg)
    if (search.trim()) list = list.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [hotel, vegFilter, search])

  if (!hotel) {
    return (
      <main className="page container">
        <h2>Hotel not found</h2>
        <Link to="/" className="btn btn-ghost" style={{ marginTop: 14 }}>← Back home</Link>
      </main>
    )
  }

  const distance = hotel.distance[uni]

  const grouped = filtered.reduce<Record<string, typeof hotel.menu>>((acc, m) => {
    (acc[m.category] = acc[m.category] || []).push(m)
    return acc
  }, {})

  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-bg">
          <img src={hotel.cover} alt="" />
          <div className="menu-hero-shade" />
        </div>
        <div className="container menu-hero-inner">
          <button className="menu-back" onClick={() => nav(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </section>

      <section className="container menu-head-wrap">
        <div className="menu-head card">
          <div className="menu-head-top">
            <div>
              <div className="menu-cuisines">{hotel.tagline}</div>
              <h1 className="menu-name">{hotel.name}</h1>
              <div className="menu-location">
                <MapPin size={14} /> {hotel.location} · <strong>{distance} km</strong> from {uniLabel(uni)}
              </div>
            </div>
            <div className="menu-rating">
              <div className="mr-pill">
                <Star size={14} fill="currentColor" strokeWidth={0} /> {hotel.rating.toFixed(1)}
              </div>
              <div className="mr-sub">{hotel.reviews.toLocaleString()}+ ratings</div>
            </div>
          </div>

          <div className="menu-info-row">
            <div className="mi-line">
              <Clock size={14} />
              <span><strong>Order by 6 pm</strong> · delivered by <strong>8 pm</strong></span>
            </div>
            <div className="mi-line">
              <MapPin size={14} />
              <span>Hand-over at your <strong>main gate</strong>, {uniLabel(uni)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container menu-body">
        <div className="menu-controls">
          <div className="menu-search">
            <Search size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search this menu…" />
          </div>
          <VegToggle />
        </div>

        {Object.entries(grouped).length === 0 ? (
          <div className="empty-card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>🍽️</div>
            <p className="mute">No items match these filters.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="menu-section">
              <div className="menu-section-head">
                <h2>{labelFor(cat)}</h2>
                <span className="mute text-sm">{items.length} items</span>
              </div>
              <div className="menu-items">
                {items.map((item) => {
                  const q = qtyOf(item.id)
                  return (
                    <div key={item.id} className="menu-item">
                      <div className="mi-left">
                        <span className={`vn-mark ${item.veg ? '' : 'nonveg'}`} />
                        <div className="mi-info">
                          <div className="mi-name">
                            {item.name}
                            {item.bestseller && <span className="mi-tag">★ Bestseller</span>}
                          </div>
                          <div className="mi-price">₹{item.price}</div>
                        </div>
                      </div>
                      <div className="mi-right">
                        {q === 0 ? (
                          <button
                            className="mi-add"
                            onClick={() => addToCart(item, hotel.id, hotel.name)}
                          >
                            <Plus size={16} /> ADD
                          </button>
                        ) : (
                          <div className="mi-qty">
                            <button onClick={() => decrement(item.id)}><Minus size={14} /></button>
                            <span>{q}</span>
                            <button onClick={() => addToCart(item, hotel.id, hotel.name)}><Plus size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        <div className="hotel-desc">
          <h3>About {hotel.name}</h3>
          <p>{hotel.description}</p>
          <div className="hotel-desc-foot">
            <span className="chip">Open today</span>
            <span className="chip">Trusted by Clgbytes</span>
            <span className="chip">Hand-off at main gate</span>
          </div>
        </div>
      </section>

      <style>{`
        .menu-page { padding-bottom: 120px; }
        .menu-hero { position: relative; height: 220px; overflow: hidden; }
        .menu-hero-bg { position: absolute; inset: 0; }
        .menu-hero-bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05); }
        .menu-hero-shade {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(20,18,18,0.25) 0%, rgba(255,248,241,1) 95%);
        }
        .menu-hero-inner { position: relative; height: 100%; display: flex; align-items: flex-start; padding-top: 20px; }
        .menu-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          padding: 8px 14px; border-radius: 999px;
          font-weight: 600; font-size: 0.85rem;
          box-shadow: var(--shadow-md);
        }

        .menu-head-wrap { margin-top: -70px; position: relative; z-index: 2; }
        .menu-head { padding: 24px 28px; }
        .menu-head-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .menu-cuisines { font-size: 0.82rem; color: var(--ink-mute); margin-bottom: 6px; font-weight: 500; }
        .menu-name { font-size: clamp(1.6rem, 3vw, 2.2rem); font-family: var(--font-display); }
        .menu-location { font-size: 0.88rem; color: var(--ink-mute); margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; }
        .menu-location strong { color: var(--ink); }
        .menu-rating { text-align: right; flex-shrink: 0; }
        .mr-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--veg); color: #fff;
          padding: 6px 12px; border-radius: 10px;
          font-weight: 700; font-size: 0.95rem;
        }
        .mr-sub { font-size: 0.72rem; color: var(--ink-mute); margin-top: 6px; }

        .menu-info-row {
          display: flex; flex-direction: column; gap: 6px;
          margin-top: 14px; padding-top: 14px;
          border-top: 1px dashed var(--line);
        }
        .mi-line {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.86rem;
          color: var(--ink-soft);
          line-height: 1.4;
        }
        .mi-line > svg { color: var(--brand-orange); flex-shrink: 0; }
        .mi-line strong { color: var(--ink); font-weight: 600; }

        .menu-body { margin-top: 30px; }
        .menu-controls {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px; gap: 12px; flex-wrap: wrap;
        }
        .menu-search {
          flex: 1; min-width: 220px;
          display: flex; align-items: center; gap: 10px;
          background: var(--paper); border: 1px solid var(--line-strong);
          border-radius: 999px; padding: 10px 18px;
        }
        .menu-search input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 0.95rem; }

        .menu-section { margin-bottom: 36px; }
        .menu-section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .menu-section-head h2 { font-size: 1.3rem; }
        .menu-items {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .menu-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 22px;
          border-bottom: 1px dashed var(--line);
          gap: 14px;
        }
        .menu-item:last-child { border-bottom: 0; }
        .menu-item:hover { background: var(--brand-orange-soft); }
        .mi-left { display: flex; gap: 12px; align-items: flex-start; }
        .mi-info { }
        .mi-name { font-weight: 600; font-size: 0.98rem; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .mi-tag { font-size: 0.68rem; background: var(--brand-orange-soft); color: var(--brand-orange-deep); padding: 2px 7px; border-radius: 4px; font-weight: 700; letter-spacing: 0.02em; }
        .mi-price { font-size: 0.92rem; color: var(--ink-soft); margin-top: 4px; font-weight: 500; }
        .mi-right { flex-shrink: 0; }
        .mi-add {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff;
          border: 1.5px solid var(--brand-orange);
          color: var(--brand-orange-deep);
          padding: 7px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          transition: all .18s;
        }
        .mi-add:hover { background: var(--brand-orange); color: #fff; transform: translateY(-1px); }
        .mi-qty {
          display: inline-flex; align-items: center;
          background: var(--brand-orange); color: #fff;
          border-radius: 10px;
          overflow: hidden;
        }
        .mi-qty button { padding: 7px 10px; color: #fff; transition: background .18s; }
        .mi-qty button:hover { background: var(--brand-orange-deep); }
        .mi-qty span { padding: 0 10px; font-weight: 700; min-width: 20px; text-align: center; }

        .hotel-desc {
          margin-top: 40px;
          padding: 28px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
        }
        .hotel-desc h3 { margin-bottom: 12px; font-size: 1.3rem; }
        .hotel-desc p { color: var(--ink-mute); line-height: 1.6; margin: 0; }
        .hotel-desc-foot { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }

        @media (max-width: 760px) {
          .menu-head { padding: 20px 20px; }
          .mi-line { font-size: 0.82rem; }
        }
      `}</style>
    </main>
  )
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}

function labelFor(c: string) {
  const map: Record<string, string> = {
    biryani: 'Biryani',
    mandi: 'Mandis',
    shawarma: 'Shawarmas',
    'nonveg-starters': 'Non-veg starters',
    'veg-starters': 'Veg starters',
  }
  return map[c] ?? c
}
