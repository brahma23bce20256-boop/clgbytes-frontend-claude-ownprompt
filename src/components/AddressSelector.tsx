import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, MapPin, Check } from 'lucide-react'
import { UNIVERSITIES } from '../data/universities'
import { useStore } from '../store/useStore'

interface Props {
  variant?: 'compact' | 'full'
}

/**
 * The dropdown is portaled to document.body and positioned with position:fixed
 * so it escapes every parent stacking/overflow context (hero sections, sticky
 * header, banner carousels, etc.). This guarantees it paints on top of all
 * page content without changing document layout.
 */
export default function AddressSelector({ variant = 'full' }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selected = useStore((s) => s.selectedUniversity)
  const setUniversity = useStore((s) => s.setUniversity)
  const uni = UNIVERSITIES.find((u) => u.id === selected)!

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (dropdownRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Position the floating dropdown relative to the trigger
  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const el = triggerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setPos({ top: r.bottom + 10, left: r.left + r.width / 2 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  const dropdown = open && pos ? (
    <>
      {/* Transparent dismiss layer under the dropdown so taps outside close it on mobile */}
      <div className="addr-backdrop" onClick={() => setOpen(false)} />
      <div
        ref={dropdownRef}
        className="addr-dropdown rise"
        style={{ top: pos.top, left: pos.left }}
      >
        <div className="addr-dropdown-header">
          Delivering to campuses only
          <span className="addr-dropdown-sub">We ship to these three universities today.</span>
        </div>
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
    </>
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

      {typeof document !== 'undefined' && dropdown && createPortal(dropdown, document.body)}

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

        /* Portaled layers — positioned relative to viewport so no parent can clip/cover */
        .addr-backdrop {
          position: fixed; inset: 0;
          background: transparent;
          z-index: 1000;
        }
        .addr-dropdown {
          position: fixed;
          transform: translateX(-50%);
          width: 360px;
          max-width: calc(100vw - 24px);
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-md);
          padding: 10px;
          z-index: 1001;
          box-shadow:
            0 24px 60px -14px rgba(20,18,18,0.35),
            0 10px 22px -6px rgba(20,18,18,0.18);
        }
        .addr-dropdown-header {
          font-size: 0.8rem; font-weight: 600; color: var(--ink); padding: 10px 12px 6px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .addr-dropdown-sub { font-weight: 400; color: var(--ink-mute); font-size: 0.75rem; }
        .addr-option {
          display: flex; width: 100%; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: 12px;
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
