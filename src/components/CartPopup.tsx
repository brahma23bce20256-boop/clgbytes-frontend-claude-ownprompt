import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'

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
        <motion.div
          className="cart-pop"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
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

          <style>{`
            .cart-pop {
              position: fixed;
              left: 50%; transform: translateX(-50%);
              bottom: 22px;
              z-index: 70;
              width: min(620px, 92vw);
            }
            .cp-inner {
              display: flex; align-items: center; justify-content: space-between;
              background: var(--ink); color: #fff;
              padding: 12px 16px;
              border-radius: 999px;
              box-shadow: 0 24px 60px -14px rgba(20,18,18,0.5), 0 6px 20px -4px rgba(242,106,31,0.3);
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
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
