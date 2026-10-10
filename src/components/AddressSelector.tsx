import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, MapPin, Check, X } from 'lucide-react'
import { UNIVERSITIES } from '../data/universities'
import { useStore } from '../store/useStore'
import './AddressSelector.css'

interface Props {
  variant?: 'compact' | 'full'
}

/**
 * The picker is portaled to document.body and centered on the viewport
 * via position:fixed. Escapes every parent stacking/overflow context, and
 * reads as a focused modal rather than a floating dropdown.
 */
export default function AddressSelector({ variant = 'full' }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const selected = useStore((s) => s.selectedUniversity)
  const setUniversity = useStore((s) => s.setUniversity)
  const uni = UNIVERSITIES.find((u) => u.id === selected)!

  // Close on Escape; lock body scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const modal = open ? (
    <div className="addr-modal-root" role="dialog" aria-modal="true" aria-label="Choose delivery campus">
      <div className="addr-backdrop" onClick={() => setOpen(false)} />
      <div ref={panelRef} className="addr-panel">
        <div className="addr-panel-head">
          <div>
            <div className="addr-panel-title">Delivering to campuses only</div>
            <div className="addr-panel-sub">We ship to these three universities today.</div>
          </div>
          <button className="addr-close" onClick={() => setOpen(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="addr-panel-body">
          {UNIVERSITIES.map((u) => {
            const active = u.id === selected
            return (
              <button
                key={u.id}
                className={`addr-option ${active ? 'active' : ''}`}
                onClick={() => {
                  setUniversity(u.id)
                  setOpen(false)
                }}
              >
                <div className="addr-option-left">
                  <span className="addr-option-ring" />
                  <div>
                    <div className="addr-option-name">{u.name}</div>
                    <div className="addr-option-city">{u.city}</div>
                  </div>
                </div>
                {active && <Check size={16} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  ) : null

  return (
    <div className={`addr-root ${variant}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className="addr-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="addr-pin"><MapPin size={16} /></span>
        <span className="addr-text">
          <span className="addr-label">Deliver to</span>
          <span className="addr-value">
            {uni.shortName} <span className="addr-dot">·</span>{' '}
            <span className="addr-city">{uni.city}</span>
          </span>
        </span>
        <ChevronDown size={16} className={`addr-chev ${open ? 'open' : ''}`} />
      </button>

      {typeof document !== 'undefined' && modal && createPortal(modal, document.body)}
    </div>
  )
}
