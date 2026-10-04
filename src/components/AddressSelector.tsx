import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, MapPin, Check, X } from 'lucide-react'
import { UNIVERSITIES } from '../data/universities'
import { useStore } from '../store/useStore'

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

      <style>{`
        .addr-root { position: relative; display: inline-block; }
        .addr-trigger {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 10px 14px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          box-shadow: var(--shadow-sm);
          transition: border-color .18s, box-shadow .18s, transform .18s;
          max-width: min(520px, 92vw);
        }
        .addr-trigger:hover { border-color: var(--ink); box-shadow: var(--shadow-md); }
        .addr-pin {
          width: 28px; height: 28px; border-radius: 999px;
          background: var(--brand-orange); color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .addr-text { display: inline-flex; flex-direction: column; align-items: flex-start; line-height: 1.1; min-width: 0; }
        .addr-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-mute); font-weight: 600; }
        .addr-value { font-size: 0.95rem; font-weight: 600; color: var(--ink); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .addr-dot { color: var(--ink-faint); margin: 0 4px; }
        .addr-city { color: var(--ink-mute); font-weight: 500; }
        .addr-chev { color: var(--ink-mute); transition: transform .18s; }
        .addr-chev.open { transform: rotate(180deg); }

        /* Centered modal — portaled to <body>, lives above every stacking context */
        .addr-modal-root {
          position: fixed; inset: 0;
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: addr-fade .2s ease;
        }
        @keyframes addr-fade { from { opacity: 0; } to { opacity: 1; } }
        .addr-backdrop {
          position: absolute; inset: 0;
          background: rgba(20,18,18,0.52);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .addr-panel {
          position: relative;
          width: 380px;
          max-width: 100%;
          max-height: calc(100vh - 48px);
          background: var(--paper);
          border-radius: var(--radius-lg);
          box-shadow:
            0 40px 80px -20px rgba(0,0,0,0.5),
            0 12px 28px -6px rgba(0,0,0,0.2);
          overflow: hidden;
          display: flex; flex-direction: column;
          animation: addr-pop .25s cubic-bezier(.2,.9,.3,1.2);
        }
        @keyframes addr-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .addr-panel-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 20px 22px 14px;
          border-bottom: 1px solid var(--line);
          gap: 12px;
        }
        .addr-panel-title { font-weight: 700; font-size: 1rem; color: var(--ink); }
        .addr-panel-sub { font-size: 0.82rem; color: var(--ink-mute); margin-top: 4px; }
        .addr-close {
          width: 32px; height: 32px; border-radius: 999px;
          background: var(--cream);
          color: var(--ink);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .18s;
        }
        .addr-close:hover { background: var(--line-strong); }

        .addr-panel-body { padding: 10px; overflow-y: auto; }
        .addr-option {
          display: flex; width: 100%; align-items: center; justify-content: space-between;
          padding: 12px 14px; border-radius: 12px;
          text-align: left;
          transition: background .18s;
        }
        .addr-option:hover { background: var(--brand-orange-soft); }
        .addr-option.active { background: var(--brand-orange-soft); color: var(--brand-orange-deep); }
        .addr-option-left { display: flex; gap: 10px; align-items: flex-start; }
        .addr-option-ring {
          width: 10px; height: 10px; border-radius: 999px; margin-top: 6px;
          background: var(--brand-orange); flex-shrink: 0;
        }
        .addr-option-name { font-weight: 600; font-size: 0.95rem; }
        .addr-option-city { font-size: 0.78rem; color: var(--ink-mute); margin-top: 2px; }

        .compact .addr-trigger { padding: 8px 12px; }
        .compact .addr-label { display: none; }
      `}</style>
    </div>
  )
}
