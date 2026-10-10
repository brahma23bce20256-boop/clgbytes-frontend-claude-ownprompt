import { useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'
import './HotelSwitchModal.css'

export default function HotelSwitchModal() {
  const pending = useStore((s) => s.pendingSwitch)
  const confirmSwitch = useStore((s) => s.confirmSwitch)
  const cancelSwitch = useStore((s) => s.cancelSwitch)

  useEffect(() => {
    if (!pending) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelSwitch()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [pending, cancelSwitch])

  if (!pending) return null

  return (
    <div className="hs-overlay" onClick={cancelSwitch} role="dialog" aria-modal="true">
      <div className="hs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hs-icon">
          <ShoppingBag size={28} />
        </div>
        <h3 className="hs-title">Start a new order?</h3>
        <p className="hs-body">
          Your cart has items from <strong>{pending.existingHotelName}</strong>. Adding
          <strong> {pending.item.name}</strong> from <strong>{pending.hotelName}</strong> will
          clear your current cart.
        </p>
        <div className="hs-actions">
          <button type="button" className="hs-btn hs-btn-ghost" onClick={cancelSwitch}>
            Keep current cart
          </button>
          <button type="button" className="hs-btn hs-btn-primary" onClick={confirmSwitch}>
            Clear & add new
          </button>
        </div>
      </div>
    </div>
  )
}
