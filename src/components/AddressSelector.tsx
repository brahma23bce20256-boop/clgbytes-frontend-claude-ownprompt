import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MapPin, Check } from 'lucide-react'
import { UNIVERSITIES } from '../data/universities'
import { useStore } from '../store/useStore'

interface Props {
  variant?: 'compact' | 'full'
}

export default function AddressSelector({ variant = 'full' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = useStore((s) => s.selectedUniversity)
  const setUniversity = useStore((s) => s.setUniversity)
  const uni = UNIVERSITIES.find((u) => u.id === selected)!

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className={`addr-root ${variant}`} ref={ref}>
      <button className="addr-trigger" onClick={() => setOpen((o) => !o)}>
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

      {open && (
        <div className="addr-dropdown rise">
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
      )}

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

        .addr-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          max-width: 92vw;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-md);
          padding: 10px;
          z-index: 60;
          box-shadow: var(--shadow-lg);
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
