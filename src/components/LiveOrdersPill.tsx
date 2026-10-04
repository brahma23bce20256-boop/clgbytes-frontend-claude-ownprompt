import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bike } from 'lucide-react'
import { useStore } from '../store/useStore'

/**
 * Fixed, flush-left floating pill. Appears when the user has one or more
 * orders in the pipeline (not yet 'delivered'). Click → /orders.
 * Hidden on /orders itself and on /login.
 */
export default function LiveOrdersPill() {
  const orders = useStore((s) => s.orders)
  const loc = useLocation()
  const live = orders.filter((o) => o.status !== 'delivered')
  const hideRoutes = ['/orders', '/login']
  const show = live.length > 0 && !hideRoutes.includes(loc.pathname)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="lo-pill"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <Link to="/orders" className="lo-inner" aria-label={`View ${live.length} active order${live.length > 1 ? 's' : ''}`}>
            <span className="lo-icon">
              <Bike size={16} />
              <span className="lo-dot" />
            </span>
            <span className="lo-text">View orders</span>
          </Link>

          <style>{`
            .lo-pill {
              position: fixed;
              left: 0;
              /* sits just above the cart popup (which lives at bottom: 20px with ~60px height) */
              bottom: 92px;
              z-index: 65;
            }
            .lo-inner {
              display: inline-flex; align-items: center; gap: 10px;
              background: var(--ink); color: #fff;
              padding: 10px 18px 10px 14px;
              /* flush-left: no left radius so it looks attached to the border */
              border-radius: 0 999px 999px 0;
              box-shadow:
                0 18px 40px -12px rgba(20,18,18,0.45),
                0 6px 16px -4px rgba(242,106,31,0.3);
              font-weight: 600;
              font-size: 0.88rem;
              transition: transform .18s, background .18s;
            }
            .lo-inner:hover { background: #000; transform: translateX(2px); }
            .lo-icon {
              position: relative;
              width: 28px; height: 28px; border-radius: 999px;
              background: var(--brand-orange); color: #fff;
              display: inline-flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            }
            .lo-dot {
              position: absolute; top: -2px; right: -2px;
              width: 10px; height: 10px; border-radius: 999px;
              background: #22C55E;
              border: 2px solid var(--ink);
              animation: lo-pulse 1.4s ease-in-out infinite;
            }
            @keyframes lo-pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
              50%      { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
            }
            .lo-text { white-space: nowrap; }

            @media (max-width: 420px) {
              .lo-inner { padding: 9px 16px 9px 12px; font-size: 0.82rem; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
