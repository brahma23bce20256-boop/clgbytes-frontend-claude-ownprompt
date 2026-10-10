import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Phone, LogOut, MapPin, HelpCircle, Receipt, X, PiggyBank, Package } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { UNIVERSITIES, CONTACT } from '../data/universities'
import './ProfilePage.css'

export default function ProfilePage() {
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const orders = useStore((s) => s.orders)
  const nav = useNavigate()

  const [modal, setModal] = useState<null | 'items' | 'address' | 'help'>(null)

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalItems = orders.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.qty, 0), 0)
    const totalPaid = orders.reduce((a, o) => a + o.total, 0)
    const totalSaved = orders.reduce((a, o) => a + o.discount, 0)
    const itemCounts: Record<string, number> = {}
    orders.forEach((o) =>
      o.lines.forEach((l) => {
        itemCounts[l.item.name] = (itemCounts[l.item.name] ?? 0) + l.qty
      })
    )
    return { totalOrders, totalItems, totalPaid, totalSaved, itemCounts }
  }, [orders])

  if (!user) {
    return (
      <main className="page container">
        <div className="empty-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>👤</div>
          <h2>Sign in to see your profile</h2>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => nav('/login')}>Sign in</button>
        </div>
      </main>
    )
  }

  const campus = UNIVERSITIES.find((u) => u.id === user.university)!

  return (
    <main className="page container profile-page">
      <div className="profile-hero card">
        <div className="ph-left">
          <div className="ph-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <div className="chip" style={{ background: 'var(--brand-orange-soft)', color: 'var(--brand-orange-deep)', borderColor: 'transparent' }}>
              Clgbytes member
            </div>
            <h1>{user.name}</h1>
            <div className="ph-sub">
              <span><Phone size={13} /> +91 {user.phone}</span>
              <span><Mail size={13} /> Not added</span>
              <span><MapPin size={13} /> {campus.shortName}</span>
            </div>
          </div>
        </div>
        <div className="ph-right">
          <button className="btn btn-ghost" onClick={() => { setUser(null); nav('/') }}><LogOut size={14} /> Sign out</button>
        </div>
      </div>

      <section className="profile-stats">
        <div className="stat-card">
          <div className="sc-top"><Receipt size={16} /> Orders placed</div>
          <div className="sc-num">{stats.totalOrders}</div>
          <div className="sc-note mute">Across all three campuses</div>
        </div>
        <button className="stat-card clickable" onClick={() => setModal('items')}>
          <div className="sc-top"><Package size={16} /> Total items</div>
          <div className="sc-num">{stats.totalItems}</div>
          <div className="sc-note mute">Tap to see each item breakdown →</div>
        </button>
        <div className="stat-card">
          <div className="sc-top">💳 Amount paid</div>
          <div className="sc-num">₹{stats.totalPaid}</div>
          <div className="sc-note mute">Lifetime spend on Clgbytes</div>
        </div>
        <div className="stat-card">
          <div className="sc-top"><PiggyBank size={16} /> Saved via discounts</div>
          <div className="sc-num" style={{ color: 'var(--veg)' }}>₹{stats.totalSaved}</div>
          <div className="sc-note mute">Every rupee we gave back</div>
        </div>
      </section>

      <section className="profile-row">
        <button className="pr-tile" onClick={() => setModal('address')}>
          <div className="pr-icon"><MapPin size={18} /></div>
          <div>
            <div className="pr-top">Address</div>
            <div className="pr-sub mute">{campus.shortName} · main gate</div>
          </div>
        </button>
        <button className="pr-tile" onClick={() => setModal('help')}>
          <div className="pr-icon"><HelpCircle size={18} /></div>
          <div>
            <div className="pr-top">Help center</div>
            <div className="pr-sub mute">Reach us — email or call</div>
          </div>
        </button>
        <Link to="/orders" className="pr-tile">
          <div className="pr-icon"><Receipt size={18} /></div>
          <div>
            <div className="pr-top">My orders</div>
            <div className="pr-sub mute">{stats.totalOrders} order{stats.totalOrders === 1 ? '' : 's'}</div>
          </div>
        </Link>
        <Link to="/about" className="pr-tile">
          <div className="pr-icon"><UserIcon size={18} /></div>
          <div>
            <div className="pr-top">About us</div>
            <div className="pr-sub mute">Where Clgbytes came from</div>
          </div>
        </Link>
      </section>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div
              className="modal-card card"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.98 }}
            >
              <button className="modal-close" onClick={() => setModal(null)}><X size={18} /></button>

              {modal === 'items' && (
                <>
                  <h2>What you've ordered so far</h2>
                  <p className="mute">Each item, counted across every order.</p>
                  {Object.keys(stats.itemCounts).length === 0 ? (
                    <p className="mute" style={{ marginTop: 10 }}>Nothing yet — your first item will show up here.</p>
                  ) : (
                    <ul className="items-list">
                      {Object.entries(stats.itemCounts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([name, qty]) => (
                          <li key={name}>
                            <span>{name}</span>
                            <span className="il-qty">×{qty}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </>
              )}

              {modal === 'address' && (
                <>
                  <h2>Your delivery address</h2>
                  <p className="mute">We deliver to one spot per campus — the main gate.</p>
                  <div className="addr-detail">
                    <div className="ad-name">{campus.name}</div>
                    <div className="ad-city">{campus.city}</div>
                    <div className="ad-note">Hand-off at the <strong>main gate</strong>. Come down when the rider calls.</div>
                  </div>
                </>
              )}

              {modal === 'help' && (
                <>
                  <h2>Help center</h2>
                  <p className="mute">We respond fast. Really.</p>
                  <div className="help-list">
                    <a href={`mailto:${CONTACT.email}`} className="help-item">
                      <Mail size={16} /> <strong>{CONTACT.email}</strong>
                    </a>
                    <a href={`tel:${CONTACT.phone}`} className="help-item">
                      <Phone size={16} /> <strong>+91 {CONTACT.phone}</strong>
                    </a>
                  </div>
                  <div className="help-note">
                    For live delivery issues on an active order, open the tracking page — your campus rider number is unlocked once the kitchen confirms.
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
