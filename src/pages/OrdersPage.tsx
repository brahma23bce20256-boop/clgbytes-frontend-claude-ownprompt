import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Clock, ReceiptText } from 'lucide-react'
import { useStore, Order } from '../store/useStore'

const STATUS_LABELS: Record<Order['status'], string> = {
  placed: 'Order placed',
  accepted: 'Accepted by hotel',
  kitchen: 'In the kitchen',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
}

export default function OrdersPage() {
  const orders = useStore((s) => s.orders)
  const user = useStore((s) => s.user)
  const nav = useNavigate()

  if (!user) {
    return (
      <main className="page container">
        <div className="empty-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🔐</div>
          <h2 style={{ marginTop: 10 }}>Sign in to see your orders</h2>
          <p className="mute">We save every order against your phone number.</p>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => nav('/login')}>Sign in</button>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="page container">
        <div className="empty-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🧾</div>
          <h2 style={{ marginTop: 10 }}>No orders yet</h2>
          <p className="mute">Your first order will show up here.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 18 }}>Browse hotels</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page container">
      <div className="section-title"><h2>Your orders <small>{orders.length} total · tap one to track</small></h2></div>

      <div className="orders-list">
        {orders.map((o) => (
          <Link key={o.id} to={`/track/${o.id}`} className="order-card card">
            <div className="oc-left">
              <div className="oc-icon">
                <ReceiptText size={20} />
              </div>
              <div>
                <div className="oc-top">
                  <strong>{o.hotelName}</strong>
                  <span className="chip">{o.id}</span>
                </div>
                <div className="oc-items">
                  {o.lines.slice(0, 3).map((l) => `${l.qty}× ${l.item.name}`).join(' · ')}
                  {o.lines.length > 3 && ` +${o.lines.length - 3} more`}
                </div>
                <div className="oc-time">
                  <Clock size={12} /> {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="oc-right">
              <span className={`oc-status s-${o.status}`}>{STATUS_LABELS[o.status]}</span>
              <div className="oc-total">₹{o.total}</div>
              <ChevronRight size={18} className="oc-arrow" />
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .orders-list { display: flex; flex-direction: column; gap: 14px; }
        .order-card {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 22px;
          gap: 16px;
        }
        .oc-left { display: flex; gap: 14px; align-items: flex-start; min-width: 0; }
        .oc-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--brand-orange-soft); color: var(--brand-orange-deep);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .oc-top { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .oc-top strong { font-weight: 700; }
        .oc-items { font-size: 0.86rem; color: var(--ink-mute); margin-top: 4px; }
        .oc-time { font-size: 0.72rem; color: var(--ink-faint); margin-top: 6px; display: inline-flex; align-items: center; gap: 4px; }
        .oc-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .oc-status {
          font-size: 0.72rem;
          padding: 4px 10px; border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .s-placed { background: #FEF3C7; color: #92400E; }
        .s-accepted { background: var(--brand-orange-soft); color: var(--brand-orange-deep); }
        .s-kitchen { background: #DBEAFE; color: #1E40AF; }
        .s-out-for-delivery { background: #E0E7FF; color: #3730A3; }
        .s-delivered { background: var(--veg-soft); color: #065F46; }
        .oc-total { font-weight: 700; font-size: 1rem; }
        .oc-arrow { color: var(--ink-mute); }
        @media (max-width: 640px) {
          .oc-right { flex-direction: column; align-items: flex-end; gap: 6px; }
          .oc-arrow { display: none; }
        }
      `}</style>
    </main>
  )
}
