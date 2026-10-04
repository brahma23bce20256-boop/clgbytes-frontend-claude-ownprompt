import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, Clock, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { UNIVERSITIES } from '../data/universities'

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

      <style>{`
        .cart-page { padding-bottom: 120px; }
        .cart-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        .cart-card { padding: 22px 26px; }
        .cart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .cart-head-title { font-weight: 600; }
        .btn-link { color: var(--brand-orange-deep); font-size: 0.82rem; font-weight: 600; }
        .btn-link:hover { text-decoration: underline; }

        .cart-line {
          display: grid;
          grid-template-columns: 20px 1fr auto auto auto;
          gap: 14px; align-items: center;
          padding: 16px 0;
          border-bottom: 1px dashed var(--line);
        }
        .cl-info { min-width: 0; }
        .cl-name { font-weight: 600; font-size: 0.95rem; }
        .cl-price { font-size: 0.8rem; margin-top: 3px; }

        /* Quantity stepper */
        .cl-qty {
          display: inline-flex; align-items: center;
          background: var(--brand-orange); color: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 14px -6px rgba(242,106,31,0.45);
          user-select: none;
        }
        .cl-qty button {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px;
          padding: 0;
          color: #fff;
          background: transparent;
          transition: background .15s;
        }
        .cl-qty button:hover,
        .cl-qty button:active { background: rgba(0,0,0,0.18); }
        .cl-qty button:focus-visible { outline: 2px solid #fff; outline-offset: -3px; }
        .cl-qty span {
          padding: 0 4px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
          font-size: 0.95rem;
          line-height: 1;
        }

        .cl-total { font-weight: 700; font-size: 0.95rem; min-width: 60px; text-align: right; }
        .cl-remove {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          color: var(--ink-mute);
          border-radius: 8px;
          transition: color .18s, background .18s;
        }
        .cl-remove:hover { color: var(--nonveg); background: var(--nonveg-soft); }

        .cl-add { display: inline-block; margin-top: 14px; }

        .cart-info { padding: 20px 24px; margin-top: 16px; display: flex; flex-direction: column; gap: 16px; }
        .ci-item { display: flex; gap: 10px; align-items: flex-start; }
        .ci-item > svg { color: var(--brand-orange); flex-shrink: 0; margin-top: 2px; }
        .ci-top { font-size: 0.72rem; color: var(--ink-mute); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .ci-sub { font-size: 0.9rem; margin-top: 3px; line-height: 1.5; }
        .ci-sub strong { color: var(--ink); }

        .cart-summary { padding: 24px 26px; position: sticky; top: 100px; }
        .cart-summary h3 { font-size: 1.1rem; margin-bottom: 16px; }
        .bill-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.92rem; }
        .bill-row.discount { color: var(--veg); font-weight: 600; }
        .bill-row.total { font-size: 1.1rem; font-weight: 700; padding-top: 14px; }
        .bill-sep { height: 1px; background: var(--line); margin: 8px 0; }
        .bill-nudge {
          background: var(--brand-orange-soft);
          color: var(--brand-orange-deep);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          margin: 10px 0 0;
        }
        .pay-cta { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; font-size: 1rem; }

        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
          .cart-summary { position: static; }

          /* Row 1: [v]  Name                       [x]
             Row 2:      [-] 2 [+]           ₹100       */
          .cart-line {
            grid-template-columns: 20px 1fr auto;
            row-gap: 10px;
          }
          .vn-mark { grid-column: 1; grid-row: 1; }
          .cl-info { grid-column: 2; grid-row: 1; }
          .cl-remove { grid-column: 3; grid-row: 1; }
          .cl-qty { grid-column: 2; grid-row: 2; justify-self: start; }
          .cl-total {
            grid-column: 3; grid-row: 2;
            justify-self: end;
            padding-left: 0;
            text-align: right;
          }
        }
      `}</style>
    </main>
  )
}
