import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, User as UserIcon, Package2 } from 'lucide-react'
import Logo from './Logo'
import AddressSelector from './AddressSelector'
import { useStore } from '../store/useStore'
import './Header.css'

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
    </header>
  )
}
