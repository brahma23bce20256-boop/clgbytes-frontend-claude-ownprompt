import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SlidersHorizontal, Check } from 'lucide-react'
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

  const isFiltered = sortBy !== 'relevance'

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
    <>
      <button
        ref={triggerRef}
        className={`filter-btn ${open ? 'open' : ''} ${isFiltered ? 'is-filtered' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="filter-icon-wrap">
          <SlidersHorizontal size={16} />
          {isFiltered && <span className="filter-dot" aria-hidden />}
        </span>
        <span>Filter</span>
      </button>
      {typeof document !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
    </>
  )
}
