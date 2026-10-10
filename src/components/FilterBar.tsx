import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SlidersHorizontal, Check } from 'lucide-react'
import VegToggle from './VegToggle'
import { useStore, SortBy } from '../store/useStore'
import './FilterBar.css'

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
    </div>
  )
}
