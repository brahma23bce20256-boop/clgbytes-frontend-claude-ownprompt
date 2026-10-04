import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Phone, LogOut, MapPin, HelpCircle, Receipt, X, PiggyBank, Package } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { UNIVERSITIES, CONTACT } from '../data/universities'

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

      <style>{`
        .profile-page { padding-bottom: 100px; }
        .profile-hero {
          display: flex; justify-content: space-between; align-items: center;
          padding: 30px 32px; gap: 20px; flex-wrap: wrap;
        }
        .ph-left { display: flex; align-items: center; gap: 20px; }
        .ph-avatar {
          width: 72px; height: 72px; border-radius: 20px;
          background: var(--brand-orange); color: #fff;
          font-family: var(--font-display);
          font-weight: 700; font-size: 2.2rem;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 28px -12px rgba(242,106,31,0.6);
        }
        .profile-hero h1 { margin: 8px 0 6px; font-size: 1.6rem; }
        .ph-sub { display: flex; gap: 18px; flex-wrap: wrap; font-size: 0.85rem; color: var(--ink-mute); }
        .ph-sub span { display: inline-flex; align-items: center; gap: 5px; }

        .profile-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-top: 20px;
        }
        .stat-card {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          text-align: left;
          transition: transform .18s, box-shadow .18s, border-color .18s;
        }
        .stat-card.clickable:hover { transform: translateY(-3px); border-color: var(--brand-orange); box-shadow: var(--shadow-md); }
        .sc-top { font-size: 0.78rem; color: var(--ink-mute); display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
        .sc-num { font-family: var(--font-display); font-size: 2.2rem; font-weight: 700; color: var(--ink); margin-top: 8px; line-height: 1; }
        .sc-note { font-size: 0.72rem; margin-top: 8px; }

        .profile-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-top: 20px;
        }
        .pr-tile {
          display: flex; gap: 14px; align-items: center;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          text-align: left;
          transition: all .18s;
        }
        .pr-tile:hover { transform: translateY(-2px); border-color: var(--brand-orange); box-shadow: var(--shadow-md); }
        .pr-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--brand-orange-soft); color: var(--brand-orange-deep);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pr-top { font-weight: 700; font-size: 0.95rem; }
        .pr-sub { font-size: 0.78rem; margin-top: 2px; }

        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(20,18,18,0.5);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal-card {
          position: relative;
          background: var(--paper);
          border-radius: var(--radius-md);
          padding: 32px;
          max-width: 480px; width: 100%;
          max-height: 80vh; overflow-y: auto;
        }
        .modal-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 999px;
          background: var(--cream); color: var(--ink);
          display: inline-flex; align-items: center; justify-content: center;
          transition: background .18s;
        }
        .modal-close:hover { background: var(--line-strong); }
        .modal-card h2 { font-size: 1.4rem; margin-bottom: 6px; }

        .items-list { list-style: none; padding: 0; margin: 20px 0 0; display: flex; flex-direction: column; gap: 8px; }
        .items-list li {
          display: flex; justify-content: space-between;
          padding: 10px 14px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 500;
        }
        .il-qty { font-weight: 700; color: var(--brand-orange-deep); }

        .addr-detail {
          margin-top: 20px;
          padding: 18px;
          background: var(--brand-orange-soft);
          border-radius: var(--radius-sm);
        }
        .ad-name { font-weight: 700; font-size: 1.05rem; }
        .ad-city { font-size: 0.85rem; color: var(--ink-mute); margin-top: 2px; }
        .ad-note { font-size: 0.85rem; margin-top: 12px; line-height: 1.5; }

        .help-list { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
        .help-item {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 0.95rem;
          color: var(--ink);
          transition: background .18s;
        }
        .help-item:hover { background: var(--brand-orange-soft); color: var(--brand-orange-deep); }
        .help-item > svg { color: var(--brand-orange); }
        .help-note { font-size: 0.82rem; color: var(--ink-mute); line-height: 1.5; margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--line); }

        @media (max-width: 760px) {
          .profile-stats { grid-template-columns: 1fr 1fr; }
          .profile-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </main>
  )
}
