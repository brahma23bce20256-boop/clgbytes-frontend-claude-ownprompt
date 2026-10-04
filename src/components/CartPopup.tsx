import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'

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
                  <ShoppingBag size={20} />
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

          <style>{`
            .cart-pop-wrap {
              position: fixed;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              z-index: 70;
              width: min(520px, 92vw);
              pointer-events: none;
            }
            .cart-pop { pointer-events: auto; }
            .cp-inner {
              display: flex; align-items: center; justify-content: space-between;
              background: var(--ink); color: #fff;
              padding: 12px 16px;
              border-radius: 999px;
              box-shadow:
                0 32px 80px -18px rgba(20,18,18,0.55),
                0 10px 30px -8px rgba(242,106,31,0.35);
              gap: 14px;
            }
            .cp-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
            .cp-icon {
              position: relative;
              width: 42px; height: 42px; border-radius: 999px;
              background: var(--brand-orange);
              display: inline-flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            }
            .cp-badge {
              position: absolute; top: -4px; right: -4px;
              background: #fff; color: var(--brand-orange-deep);
              font-size: 0.7rem; font-weight: 800;
              padding: 1px 6px; border-radius: 999px;
              min-width: 18px; text-align: center;
            }
            .cp-text { min-width: 0; }
            .cp-top { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 56vw; }
            .cp-top strong { color: var(--brand-orange-glow); }
            .cp-sub { font-size: 0.76rem; color: #cbc6c3; margin-top: 2px; }
            .cp-right {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 0.88rem; font-weight: 600;
              background: var(--brand-orange); color: #fff;
              padding: 9px 16px; border-radius: 999px;
              flex-shrink: 0;
            }
            @media (max-width: 420px) {
              .cp-right { padding: 8px 12px; font-size: 0.8rem; }
              .cp-top { max-width: 44vw; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
