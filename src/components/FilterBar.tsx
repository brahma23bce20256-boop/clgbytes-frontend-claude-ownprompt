import { useEffect, useRef, useState } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const sortBy = useStore((s) => s.sortBy)
  const setSortBy = useStore((s) => s.setSortBy)
  const vegFilter = useStore((s) => s.vegFilter)
  const setVegFilter = useStore((s) => s.setVegFilter)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const activeLabel = SORTS.find((s) => s.k === sortBy)?.label ?? 'Relevance'

  return (
    <div className="filter-bar">
      <div className="filter-left" ref={ref}>
        <button className={`filter-btn ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)}>
          <SlidersHorizontal size={16} />
          <span>Filter · <strong>{activeLabel}</strong></span>
        </button>
        {open && (
          <div className="filter-dropdown rise">
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
        )}
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

      <style>{`
        .filter-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px;
          padding: 14px 18px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          margin: 18px 0 22px;
          flex-wrap: wrap;
          position: relative;
        }
        .filter-left { position: relative; }
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
        .filter-dropdown {
          position: absolute;
          top: calc(100% + 10px); left: 0;
          min-width: 280px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-md);
          padding: 8px;
          z-index: 50;
        }
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
          .filter-bar {
            padding: 10px 12px;
            margin: 14px 0 18px;
            border-radius: var(--radius-sm);
            gap: 8px;
          }
          .filter-btn { padding: 8px 12px; font-size: 0.82rem; gap: 6px; }
          .filter-right { gap: 6px; width: 100%; justify-content: flex-start; }
          .diet-btn { padding: 7px 11px; font-size: 0.8rem; }
          .filter-dropdown {
            left: 0; right: auto;
            min-width: 240px;
            max-width: 86vw;
          }
        }
      `}</style>
    </div>
  )
}
