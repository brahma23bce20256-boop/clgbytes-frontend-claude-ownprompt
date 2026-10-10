import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bike } from 'lucide-react'
import { useStore } from '../store/useStore'
import './LiveOrdersPill.css'

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
        <div className="lo-pill-wrap">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
