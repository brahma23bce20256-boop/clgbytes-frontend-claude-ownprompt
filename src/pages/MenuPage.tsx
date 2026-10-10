import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus, Search } from 'lucide-react'
import { hotelById } from '../data/hotels'
import { useStore } from '../store/useStore'
import VegToggle from '../components/VegToggle'
import './MenuPage.css'

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
