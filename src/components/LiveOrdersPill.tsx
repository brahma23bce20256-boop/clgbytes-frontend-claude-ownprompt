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
          <Link
            to="/orders"
            className="lo-inner"
            aria-label={`View ${live.length} active order${live.length > 1 ? 's' : ''}`}
          >
            <span className="lo-icon">
              <Bike size={16} />
              <span className="lo-dot" />
            </span>
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
              display: inline-flex; align-items: center; justify-content: center;
              background: var(--paper);
              padding: 10px 14px 10px 12px;
              /* flush-left: no left radius so it looks attached to the border */
              border-radius: 0 999px 999px 0;
              border: 1px solid var(--line-strong);
              border-left: 0;
              box-shadow:
                0 18px 40px -12px rgba(20,18,18,0.25),
                0 6px 16px -4px rgba(242,106,31,0.22);
              transition: transform .18s;
            }
            .lo-inner:hover { transform: translateX(2px); }
            .lo-icon {
              position: relative;
              display: inline-flex; align-items: center; justify-content: center;
              color: var(--ink);
              flex-shrink: 0;
            }
            .lo-dot {
              position: absolute; top: -4px; right: -5px;
              width: 9px; height: 9px; border-radius: 999px;
              background: #22C55E;
              border: 2px solid var(--paper);
              animation: lo-pulse 1.4s ease-in-out infinite;
            }
            @keyframes lo-pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
              50%      { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
