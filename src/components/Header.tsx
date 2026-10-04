import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, User as UserIcon, Package2 } from 'lucide-react'
import Logo from './Logo'
import AddressSelector from './AddressSelector'
import { useStore } from '../store/useStore'

export default function Header() {
  const cartCount = useStore((s) => s.cart.reduce((a, l) => a + l.qty, 0))
  const user = useStore((s) => s.user)
  const loc = useLocation()

  const isLanding = loc.pathname === '/'

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left">
          <Logo size={44} withWordmark />
        </div>

        {!isLanding && (
          <div className="header-mid">
            <AddressSelector variant="compact" />
          </div>
        )}

        <nav className="header-right">
          <NavLink to="/orders" className="hd-link" aria-label="Orders">
            <Package2 size={18} />
            <span>Orders</span>
          </NavLink>
          <Link to="/cart" className="hd-cart" aria-label="Cart">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="hd-badge">{cartCount}</span>}
          </Link>
          <Link to={user ? '/profile' : '/login'} className="hd-profile" aria-label="Profile">
            {user ? (
              <span className="hd-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            ) : (
              <UserIcon size={18} />
            )}
            <span className="hd-profile-text">{user ? user.name.split(' ')[0] : 'Sign in'}</span>
          </Link>
        </nav>
      </div>

      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 50;
          background: color-mix(in oklab, var(--cream) 85%, white 15%);
          backdrop-filter: saturate(140%) blur(12px);
          -webkit-backdrop-filter: saturate(140%) blur(12px);
          border-bottom: 1px solid var(--line);
        }
        .header-inner {
          height: var(--header-h);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
        }
        .header-left { justify-self: start; }
        .header-mid { justify-self: center; }
        .header-right { justify-self: end; display: inline-flex; align-items: center; gap: 8px; }

        .hd-link, .hd-cart, .hd-profile {
          position: relative;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--ink);
          border: 1px solid transparent;
          transition: background .18s, border-color .18s, color .18s;
        }
        .hd-link:hover { background: var(--brand-orange-soft); color: var(--brand-orange-deep); }
        .hd-cart {
          background: var(--ink); color: #fff;
        }
        .hd-cart:hover { background: #000; }
        .hd-badge {
          background: var(--brand-orange); color: #fff;
          font-size: 0.7rem; font-weight: 700;
          padding: 1px 7px; border-radius: 999px;
          margin-left: 2px;
          min-width: 18px; text-align: center;
        }
        .hd-profile {
          background: var(--paper);
          border-color: var(--line-strong);
        }
        .hd-profile:hover { border-color: var(--ink); }
        .hd-avatar {
          width: 24px; height: 24px; border-radius: 999px;
          background: var(--brand-orange); color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem;
        }
        @media (max-width: 820px) {
          .header-mid { display: none; }
          .hd-link span, .hd-cart span:not(.hd-badge), .hd-profile-text { display: none; }
          .hd-link, .hd-cart, .hd-profile { padding: 10px; }
        }
      `}</style>
    </header>
  )
}
