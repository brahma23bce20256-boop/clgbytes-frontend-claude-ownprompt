import { NavLink } from 'react-router-dom'
import { Home, Search, Package2, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'
import './BottomNav.css'

export default function BottomNav() {
  const cartCount = useStore((s) => s.cart.reduce((a, l) => a + l.qty, 0))

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bn-inner">
        <NavLink to="/" end className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
          <Home size={26} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
          <Search size={26} />
          <span>Search</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
          <Package2 size={26} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
          <span className="bn-icon-wrap">
            <ShoppingBag size={26} />
            {cartCount > 0 && <span className="bn-badge">{cartCount}</span>}
          </span>
          <span>Cart</span>
        </NavLink>
      </div>
    </nav>
  )
}
