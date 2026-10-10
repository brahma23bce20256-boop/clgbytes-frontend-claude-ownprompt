import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import { useStore, Order } from '../store/useStore'
import './OrdersPage.css'

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
    </main>
  )
}
