import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import { useStore, Order } from '../store/useStore'

const STATUS_LABELS: Record<Order['status'], string> = {
  placed: 'Order placed',
  accepted: 'Accepted by hotel',
  kitchen: 'In the kitchen',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
}

function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (sameDay) return `Today, ${timeStr}`
  const dateStr = d.toLocaleDateString([], { day: 'numeric', month: 'short' })
  return `${dateStr}, ${timeStr}`
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
        {orders.map((o) => {
          const itemsText =
            o.lines.slice(0, 3).map((l) => `${l.qty}× ${l.item.name}`).join(' · ') +
            (o.lines.length > 3 ? ` +${o.lines.length - 3} more` : '')
          return (
            <Link key={o.id} to={`/track/${o.id}`} className="order-card">
              <div className="oc-head">
                <div className="oc-token">{o.id}</div>
                <span className={`oc-status s-${o.status}`}>{STATUS_LABELS[o.status]}</span>
                <div className="oc-total">₹{o.total}</div>
                <ChevronRight size={16} className="oc-arrow" />
              </div>
              <div className="oc-items">{itemsText}</div>
              <div className="oc-time">
                <Clock size={11} /> {formatTime(o.createdAt)}
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        .orders-list { display: flex; flex-direction: column; gap: 10px; }
        .order-card {
          display: flex; flex-direction: column;
          gap: 6px;
          padding: 12px 14px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 12px;
          color: var(--ink);
          transition: border-color .18s, transform .18s;
        }
        .order-card:hover { border-color: var(--brand-orange); transform: translateX(2px); }

        .oc-head {
          display: flex; align-items: center;
          gap: 10px;
        }
        .oc-token {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          color: var(--ink);
          flex-shrink: 0;
        }
        .oc-status {
          margin-left: auto;
          font-size: 0.66rem;
          padding: 3px 9px; border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .s-placed { background: #FEF3C7; color: #92400E; }
        .s-accepted { background: var(--brand-orange-soft); color: var(--brand-orange-deep); }
        .s-kitchen { background: #DBEAFE; color: #1E40AF; }
        .s-out-for-delivery { background: #E0E7FF; color: #3730A3; }
        .s-delivered { background: var(--veg-soft); color: #065F46; }
        .oc-total {
          font-weight: 700; font-size: 0.95rem;
          min-width: 56px; text-align: right;
          flex-shrink: 0;
        }
        .oc-arrow { color: var(--ink-faint); flex-shrink: 0; }

        .oc-items {
          font-size: 0.83rem;
          color: var(--ink-soft);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .oc-time {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem;
          color: var(--ink-faint);
          font-weight: 500;
        }

        @media (max-width: 420px) {
          .order-card { padding: 11px 12px; }
          .oc-head { gap: 8px; }
          .oc-token { font-size: 0.88rem; }
          .oc-status { font-size: 0.6rem; padding: 2px 7px; }
          .oc-total { font-size: 0.9rem; min-width: 48px; }
          .oc-arrow { display: none; }
          .oc-items { font-size: 0.8rem; }
        }
      `}</style>
    </main>
  )
}
