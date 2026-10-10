import { Link, useParams } from 'react-router-dom'
import { Check, ChefHat, Package, Bike, PackageCheck, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'
import { useStore, OrderStatus } from '../store/useStore'
import { UNIVERSITIES, CONTACT } from '../data/universities'
import './TrackingPage.css'

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
  const partnerVisible = stepIdx >= 2

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
    </main>
  )
}
