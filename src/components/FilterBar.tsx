import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SlidersHorizontal, Check } from 'lucide-react'
import VegToggle from './VegToggle'
import { useStore, SortBy } from '../store/useStore'

const SORTS: { k: SortBy; label: string }[] = [
  { k: 'relevance', label: 'Relevance' },
  { k: 'rating', label: 'Rating (high → low)' },
  { k: 'distance', label: 'Distance (near first)' },
  { k: 'price-low', label: 'Price for two (low → high)' },
  { k: 'price-high', label: 'Price for two (high → low)' },
]

export default function FilterBar() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sortBy = useStore((s) => s.sortBy)
  const setSortBy = useStore((s) => s.setSortBy)
  const vegFilter = useStore((s) => s.vegFilter)
  const setVegFilter = useStore((s) => s.setVegFilter)

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

  // Position the portal below the trigger; follow scroll/resize
  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const el = triggerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setPos({ top: r.bottom + 8, left: r.left, width: r.width })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  const activeLabel = SORTS.find((s) => s.k === sortBy)?.label ?? 'Relevance'

  const dropdown = open && pos ? (
    <div
      ref={dropdownRef}
      className="filter-dropdown-portal"
      style={{ top: pos.top, left: pos.left, minWidth: Math.max(pos.width, 240) }}
    >
      <div className="filter-dropdown-title">Sort by</div>
      {SORTS.map((s) => (
        <button
          key={s.k}
          className={`filter-opt ${sortBy === s.k ? 'active' : ''}`}
          onClick={() => {
            setSortBy(s.k)
            setOpen(false)
          }}
        >
          <span>{s.label}</span>
          {sortBy === s.k && <Check size={14} />}
        </button>
      ))}
    </div>
  ) : null

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <button
          ref={triggerRef}
          className={`filter-btn ${open ? 'open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <SlidersHorizontal size={16} />
          <span>Filter · <strong>{activeLabel}</strong></span>
        </button>
      </div>

      <div className="filter-right">
        <button
          className={`diet-btn ${vegFilter === 'veg' ? 'on-veg' : ''}`}
          onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
          aria-pressed={vegFilter === 'veg'}
        >
          <span className="vn-mark" />
          Veg
        </button>
        <button
          className={`diet-btn ${vegFilter === 'nonveg' ? 'on-nonveg' : ''}`}
          onClick={() => setVegFilter(vegFilter === 'nonveg' ? 'all' : 'nonveg')}
          aria-pressed={vegFilter === 'nonveg'}
        >
          <span className="vn-mark nonveg" />
          Non-veg
        </button>
        <div className="filter-toggle-wrap"><VegToggle /></div>
      </div>

      {typeof document !== 'undefined' && dropdown && createPortal(dropdown, document.body)}

      <style>{`
        .filter-bar {
          display: flex; align-items: center; justify-content: flex-start;
          gap: 10px;
          margin: 14px 0 18px;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
          /* no z-index here so the bar never covers scrolling fixed elements */
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-left { flex-shrink: 0; }
        .filter-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 9px 16px;
          border-radius: 999px;
          background: var(--cream);
          border: 1px solid var(--line-strong);
          font-size: 0.9rem;
          color: var(--ink);
          font-weight: 500;
          transition: border-color .18s, background .18s;
        }
        .filter-btn:hover, .filter-btn.open { border-color: var(--ink); background: var(--paper); }
        .filter-btn strong { font-weight: 700; }

        /* Portaled dropdown — fixed-positioned, lives in <body>, immune to parent stacking */
        .filter-dropdown-portal {
          position: fixed;
          z-index: 1001;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-md);
          padding: 8px;
          max-width: calc(100vw - 24px);
          box-shadow:
            0 24px 60px -14px rgba(20,18,18,0.3),
            0 10px 22px -6px rgba(20,18,18,0.14);
          animation: fdp-fade .18s ease;
        }
        @keyframes fdp-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        .filter-dropdown-title {
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--ink-mute); padding: 8px 12px 4px; font-weight: 600;
        }
        .filter-opt {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 12px; border-radius: 10px;
          text-align: left; font-size: 0.9rem;
          transition: background .18s;
        }
        .filter-opt:hover { background: var(--brand-orange-soft); }
        .filter-opt.active { background: var(--brand-orange-soft); color: var(--brand-orange-deep); font-weight: 600; }

        .filter-right { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .diet-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--ink);
          transition: border-color .18s, background .18s;
        }
        .diet-btn:hover { border-color: var(--ink); }
        .diet-btn.on-veg { background: var(--veg-soft); border-color: var(--veg); color: #065F46; }
        .diet-btn.on-nonveg { background: var(--nonveg-soft); border-color: var(--nonveg); color: #7F1D1D; }
        .filter-toggle-wrap { display: none; }
        @media (min-width: 760px) { .filter-toggle-wrap { display: block; } }

        @media (max-width: 600px) {
          .filter-bar { gap: 8px; }
          .filter-btn { padding: 8px 12px; font-size: 0.82rem; gap: 6px; }
          .filter-right { gap: 6px; flex-wrap: nowrap; }
          .diet-btn { padding: 7px 11px; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  )
}
