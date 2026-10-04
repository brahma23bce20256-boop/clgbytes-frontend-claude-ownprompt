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

          <style>{`
            .cart-pop-wrap {
              position: fixed;
              left: 50%;
              bottom: 20px;
              transform: translateX(-50%);
              z-index: 70;
              width: min(520px, 92vw);
              pointer-events: none;
            }
            .cart-pop { pointer-events: auto; }
            .cp-inner {
              display: flex; align-items: center; justify-content: space-between;
              background: var(--paper);
              color: var(--ink);
              padding: 10px 10px 10px 14px;
              border-radius: 999px;
              border: 1px solid var(--line-strong);
              box-shadow:
                0 24px 60px -16px rgba(20,18,18,0.3),
                0 8px 20px -6px rgba(242,106,31,0.22);
              gap: 14px;
            }
            .cp-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
            .cp-icon {
              position: relative;
              display: inline-flex; align-items: center; justify-content: center;
              color: var(--ink);
              flex-shrink: 0;
            }
            .cp-badge {
              position: absolute; top: -8px; right: -10px;
              background: var(--brand-orange); color: #fff;
              font-size: 0.68rem; font-weight: 800;
              padding: 1px 6px; border-radius: 999px;
              min-width: 16px; text-align: center;
              border: 2px solid var(--paper);
            }
            .cp-text { min-width: 0; }
            .cp-top {
              font-size: 0.9rem; font-weight: 600;
              color: var(--ink);
              white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50vw;
            }
            .cp-top strong { color: var(--brand-orange-deep); font-weight: 700; }
            .cp-sub { font-size: 0.76rem; color: var(--ink-mute); margin-top: 2px; }
            .cp-right {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 0.88rem; font-weight: 700;
              background: transparent;
              color: var(--ink);
              padding: 10px 14px;
              flex-shrink: 0;
              letter-spacing: 0.01em;
              transition: color .18s;
            }
            .cp-inner:hover .cp-right { color: var(--brand-orange-deep); }
            @media (max-width: 420px) {
              .cp-right { padding: 9px 10px; font-size: 0.82rem; }
              .cp-top { max-width: 40vw; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
