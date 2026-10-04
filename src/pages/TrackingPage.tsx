import { Link, useParams } from 'react-router-dom'
import { Check, ChefHat, Package, Bike, PackageCheck, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'
import { useStore, OrderStatus } from '../store/useStore'
import { UNIVERSITIES, CONTACT } from '../data/universities'

const STEPS: { k: OrderStatus; label: string; icon: React.ElementType; blurb: string }[] = [
  { k: 'placed', label: 'Order placed', icon: Package, blurb: "We've got your order — waiting for hotel confirmation." },
  { k: 'accepted', label: 'Accepted by hotel', icon: Check, blurb: 'Hotel confirmed and started prepping.' },
  { k: 'kitchen', label: 'Kitchen confirmed', icon: ChefHat, blurb: 'Food is being cooked fresh.' },
  { k: 'out-for-delivery', label: 'Out for delivery', icon: Bike, blurb: 'On the way to your main gate.' },
  { k: 'delivered', label: 'Delivered', icon: PackageCheck, blurb: 'Hope you enjoyed it!' },
]

export default function TrackingPage() {
  const { orderId } = useParams()
  const orders = useStore((s) => s.orders)
  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <main className="page container">
        <div className="empty-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🤔</div>
          <h2>Order not found</h2>
          <Link to="/orders" className="btn btn-primary" style={{ marginTop: 18 }}>← Back to orders</Link>
        </div>
      </main>
    )
  }

  const campus = UNIVERSITIES.find((u) => u.id === order.university)!
  const stepIdx = STEPS.findIndex((s) => s.k === order.status)
  const partnerVisible = stepIdx >= 2 // after kitchen confirmed

  return (
    <main className="page container track-page">
      <div className="track-head">
        <div>
          <div className="chip">Order {order.id}</div>
          <h1>Tracking your order</h1>
          <p className="mute">
            From <strong>{order.hotelName}</strong> · delivering to <strong>{campus.shortName} · main gate</strong>
          </p>
        </div>
        <div className="track-total">
          <div className="tt-top">Total</div>
          <div className="tt-amt">₹{order.total}</div>
        </div>
      </div>

      <div className="track-grid">
        <div className="stack gap-md">
          <div className="track-card card">
            <h3>Status</h3>
            <div className="tr-steps">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const done = i <= stepIdx
                const current = i === stepIdx
                return (
                  <div key={s.k} className={`tr-step ${done ? 'done' : ''} ${current ? 'cur' : ''}`}>
                    <div className="tr-step-icon"><Icon size={16} /></div>
                    <div className="tr-step-body">
                      <div className="tr-step-label">{s.label}</div>
                      <div className="tr-step-blurb">{s.blurb}</div>
                    </div>
                    {i < STEPS.length - 1 && <div className="tr-step-line" />}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="track-card card gate-card">
            <div className="gate-icon"><MapPin size={22} /></div>
            <div>
              <h3>Collect at your <u>main gate</u></h3>
              <p>
                <strong>Important:</strong> our delivery partner will stop at the <strong>main gate of {campus.name}</strong>.
                Please come down to the gate to collect the order. We can't enter the hostels — the main gate is where we hand over.
              </p>
              <p className="mute text-sm">
                You'll get a call when they're 5 minutes away. If you can't come down, let the partner know on the call.
              </p>
            </div>
          </div>

          {partnerVisible ? (
            <div className="track-card card partner-card">
              <h3>Your delivery partner for {campus.shortName}</h3>
              <div className="partner-row">
                <div className="partner-avatar">{campus.shortName.slice(0, 1)}</div>
                <div>
                  <div className="partner-name">Clgbytes · {campus.shortName} rider</div>
                  <div className="partner-sub">Trained for your campus · knows the gate</div>
                </div>
                <a href={`tel:${campus.deliveryPartner}`} className="btn btn-primary">
                  <Phone size={14} /> Call {campus.deliveryPartner}
                </a>
              </div>
            </div>
          ) : (
            <div className="track-card card partner-locked">
              <AlertCircle size={18} />
              <div>
                <strong>Delivery partner details will unlock once the kitchen confirms your order.</strong>
                <div className="text-sm mute" style={{ marginTop: 4 }}>
                  Hang tight — we only share rider numbers after the hotel has started cooking so you reach the right person.
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="stack gap-md">
          <div className="track-card card">
            <h3>Order details</h3>
            <div className="od-list">
              {order.lines.map((l) => (
                <div key={l.item.id} className="od-row">
                  <span className={`vn-mark ${l.item.veg ? '' : 'nonveg'}`} />
                  <span className="od-name">{l.item.name} × {l.qty}</span>
                  <span className="od-price">₹{l.item.price * l.qty}</span>
                </div>
              ))}
            </div>
            <div className="od-sep" />
            <div className="od-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="od-row"><span>Delivery</span><span>₹{order.delivery}</span></div>
            {order.discount > 0 && (
              <div className="od-row" style={{ color: 'var(--veg)' }}><span>Discount</span><span>− ₹{order.discount}</span></div>
            )}
            <div className="od-row total"><span>Total</span><span>₹{order.total}</span></div>
          </div>

          <div className="track-card card">
            <h3>Help center</h3>
            <p className="mute text-sm">Something off? Reach us — we respond fast.</p>
            <div className="help-row">
              <Mail size={16} />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            {partnerVisible && (
              <div className="help-row">
                <Phone size={16} />
                <a href={`tel:${campus.deliveryPartner}`}>Delivery partner · {campus.deliveryPartner}</a>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .track-page { padding-bottom: 120px; }
        .track-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 20px; }
        .track-head h1 { margin: 10px 0 6px; font-size: clamp(1.6rem, 3vw, 2.2rem); }
        .track-total { text-align: right; }
        .tt-top { font-size: 0.72rem; color: var(--ink-mute); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
        .tt-amt { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--brand-orange-deep); }

        .track-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start; }
        .track-card { padding: 24px 26px; }
        .track-card h3 { margin-bottom: 14px; font-size: 1.15rem; }

        /* steps */
        .tr-steps { display: flex; flex-direction: column; gap: 0; }
        .tr-step { display: grid; grid-template-columns: 36px 1fr; gap: 14px; position: relative; padding-bottom: 20px; }
        .tr-step:last-child { padding-bottom: 0; }
        .tr-step-icon {
          width: 36px; height: 36px; border-radius: 999px;
          background: var(--cream); color: var(--ink-mute);
          border: 2px solid var(--line-strong);
          display: inline-flex; align-items: center; justify-content: center;
          z-index: 1;
          transition: all .3s;
        }
        .tr-step.done .tr-step-icon { background: var(--brand-orange); border-color: var(--brand-orange-deep); color: #fff; }
        .tr-step.cur .tr-step-icon {
          box-shadow: 0 0 0 6px rgba(242,106,31,0.18);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 6px rgba(242,106,31,0.18); } 50% { box-shadow: 0 0 0 10px rgba(242,106,31,0.1); } }
        .tr-step-label { font-weight: 600; font-size: 0.95rem; }
        .tr-step-blurb { font-size: 0.82rem; color: var(--ink-mute); margin-top: 2px; }
        .tr-step-line {
          position: absolute;
          left: 17px; top: 36px; bottom: 0;
          width: 2px;
          background: var(--line-strong);
        }
        .tr-step.done .tr-step-line { background: var(--brand-orange); }

        .gate-card { display: flex; gap: 16px; align-items: flex-start; background: linear-gradient(135deg, var(--brand-orange-soft), #FFF); }
        .gate-icon {
          flex-shrink: 0;
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--brand-orange); color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .gate-card h3 u { text-decoration-color: var(--brand-orange); text-underline-offset: 4px; }
        .gate-card p { font-size: 0.92rem; line-height: 1.6; margin: 0 0 10px; }

        .partner-row {
          display: flex; align-items: center; gap: 14px;
          flex-wrap: wrap;
        }
        .partner-avatar {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--ink); color: #fff;
          font-family: var(--font-display);
          font-weight: 700; font-size: 1.2rem;
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .partner-name { font-weight: 700; }
        .partner-sub { font-size: 0.8rem; color: var(--ink-mute); }
        .partner-locked {
          display: flex; gap: 12px; align-items: flex-start;
          background: var(--cream);
        }
        .partner-locked > svg { color: var(--brand-orange); flex-shrink: 0; margin-top: 2px; }

        .od-list { display: flex; flex-direction: column; gap: 8px; }
        .od-row { display: grid; grid-template-columns: 20px 1fr auto; gap: 10px; align-items: center; font-size: 0.9rem; padding: 4px 0; }
        .od-row.total { font-weight: 700; font-size: 1rem; grid-template-columns: 1fr auto; padding-top: 10px; }
        .od-name { color: var(--ink-soft); }
        .od-sep { height: 1px; background: var(--line); margin: 10px 0; }

        .help-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px dashed var(--line); font-size: 0.9rem; }
        .help-row:first-of-type { border-top: 0; margin-top: 10px; padding-top: 0; }
        .help-row > svg { color: var(--brand-orange); }
        .help-row a { color: var(--ink); font-weight: 500; }
        .help-row a:hover { color: var(--brand-orange-deep); }

        @media (max-width: 900px) { .track-grid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  )
}
