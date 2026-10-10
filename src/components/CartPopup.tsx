import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import './CartPopup.css'

/**
 * Cart indicator pinned to the center of the viewport.
 *
 * Positioning uses an outer non-animated wrapper so framer-motion's internal
 * transform (scale/opacity) doesn't fight CSS translate(-50%, -50%) centering.
 */
export default function CartPopup() {
  const cart = useStore((s) => s.cart)
  const loc = useLocation()
  const hide = ['/cart', '/login'].includes(loc.pathname)
  const count = cart.reduce((a, l) => a + l.qty, 0)
  const subtotal = cart.reduce((a, l) => a + l.qty * l.item.price, 0)

  const show = !hide && count > 0

  return (
    <AnimatePresence>
      {show && (
        <div className="cart-pop-wrap">
          <motion.div
            className="cart-pop"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <Link to="/cart" className="cp-inner">
              <div className="cp-left">
                <span className="cp-icon">
                  <ShoppingBag size={28} strokeWidth={2.1} />
                  <span className="cp-badge">{count}</span>
                </span>
                <div className="cp-text">
                  <div className="cp-top">{count} item{count > 1 ? 's' : ''} from <strong>{cart[0].hotelName}</strong></div>
                  <div className="cp-sub">Subtotal ₹{subtotal} · Review & checkout</div>
                </div>
              </div>
              <div className="cp-right">
                View cart <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
