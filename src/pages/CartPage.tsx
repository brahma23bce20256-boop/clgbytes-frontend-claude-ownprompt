import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, Clock, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { UNIVERSITIES } from '../data/universities'
import './CartPage.css'

export default function CartPage() {
  const nav = useNavigate()
  const cart = useStore((s) => s.cart)
  const user = useStore((s) => s.user)
  const uni = useStore((s) => s.selectedUniversity)
  const addToCart = useStore((s) => s.addToCart)
  const decrement = useStore((s) => s.decrement)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const clearCart = useStore((s) => s.clearCart)
  const placeOrder = useStore((s) => s.placeOrder)
  const campus = UNIVERSITIES.find((u) => u.id === uni)!

  useEffect(() => {
    if (!user) nav('/login', { state: { from: '/cart' } })
  }, [user, nav])

  if (!user) return null

  const subtotal = cart.reduce((a, l) => a + l.item.price * l.qty, 0)
  const delivery = cart.length === 0 ? 0 : subtotal >= 299 ? 15 : 25
  const discount = subtotal >= 499 ? 40 : 0
  const total = subtotal + delivery - discount

  function handlePlace() {
    const o = placeOrder()
    if (o) nav(`/track/${o.id}`)
  }

  if (cart.length === 0) {
    return (
      <main className="page container">
        <div className="empty-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🛒</div>
          <h2 style={{ marginTop: 10 }}>Your cart is empty</h2>
          <p className="mute">Pick a hotel, add a few things — we'll handle the rest.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 18 }}>Browse hotels</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page container cart-page">
      <div className="section-title"><h2>Your cart <small>{cart[0].hotelName} · delivering to {campus.shortName}</small></h2></div>

      <div className="cart-grid">
        <div className="cart-left">
          <div className="cart-card card">
            <div className="cart-head">
              <div className="cart-head-title">Items from <strong>{cart[0].hotelName}</strong></div>
              <button className="btn-link" onClick={clearCart}>Clear all</button>
            </div>

            {cart.map((l) => (
              <div key={l.item.id} className="cart-line">
                <span className={`vn-mark ${l.item.veg ? '' : 'nonveg'}`} />
                <div className="cl-info">
                  <div className="cl-name">{l.item.name}</div>
                  <div className="cl-price mute">₹{l.item.price} × {l.qty}</div>
                </div>
                <div className="cl-qty">
                  <button type="button" onClick={() => decrement(l.item.id)} aria-label="Decrease quantity">
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span>{l.qty}</span>
                  <button type="button" onClick={() => addToCart(l.item, l.hotelId, l.hotelName)} aria-label="Increase quantity">
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="cl-total">₹{l.qty * l.item.price}</div>
                <button className="cl-remove" onClick={() => removeFromCart(l.item.id)} aria-label="remove">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <Link to={`/menu/${cart[0].hotelId}`} className="btn-link cl-add">+ Add more items</Link>
          </div>

          <div className="cart-info card">
            <div className="ci-item">
              <Clock size={16} />
              <div>
                <div className="ci-top">Delivery timing</div>
                <div className="ci-sub">
                  <strong>Order before 6 pm</strong> for same-day delivery. We hand over by 8 pm.
                </div>
              </div>
            </div>
            <div className="ci-item">
              <MapPin size={16} />
              <div>
                <div className="ci-top">Pickup at your main gate</div>
                <div className="ci-sub">
                  Our delivery partner for <strong>{campus.shortName}</strong> waits at the main gate.
                  You'll come down to collect — details appear once the order is accepted.
                </div>
              </div>
            </div>
            <div className="ci-item">
              <ShieldCheck size={16} />
              <div>
                <div className="ci-top">Signed in as</div>
                <div className="ci-sub">
                  <strong>{user.name}</strong> · +91 {user.phone} · {campus.shortName}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="cart-summary card">
          <h3>Bill summary</h3>
          <div className="bill-row"><span>Item subtotal</span><span>₹{subtotal}</span></div>
          <div className="bill-row"><span>Delivery fee</span><span>₹{delivery}</span></div>
          {discount > 0 && (
            <div className="bill-row discount"><span>Clgbytes discount</span><span>− ₹{discount}</span></div>
          )}
          <div className="bill-sep" />
          <div className="bill-row total"><span>Total</span><span>₹{total}</span></div>

          {discount === 0 && subtotal < 499 && (
            <div className="bill-nudge">Add ₹{499 - subtotal} more to unlock ₹40 off ✨</div>
          )}

          <button className="btn btn-primary pay-cta" onClick={handlePlace}>
            Place order · ₹{total} <ArrowRight size={16} />
          </button>
          <p className="mute text-xs" style={{ marginTop: 10, textAlign: 'center' }}>
            Pay at the gate — UPI or cash. No prepay for now.
          </p>
        </aside>
      </div>
    </main>
  )
}
