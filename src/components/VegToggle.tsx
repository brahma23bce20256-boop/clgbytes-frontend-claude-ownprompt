import { useStore, VegFilter } from '../store/useStore'
import './VegToggle.css'

export default function VegToggle() {
  const vegFilter = useStore((s) => s.vegFilter)
  const setVegFilter = useStore((s) => s.setVegFilter)

  const options: { k: VegFilter; label: string }[] = [
    { k: 'all', label: 'All' },
    { k: 'veg', label: 'Veg' },
    { k: 'nonveg', label: 'Non-veg' },
  ]

  return (
    <div className="veg-toggle" role="radiogroup" aria-label="Diet filter">
      <div className="vt-indicator" data-pos={vegFilter} aria-hidden />
      {options.map((o) => (
        <button
          key={o.k}
          role="radio"
          aria-checked={vegFilter === o.k}
          className={`vt-opt ${vegFilter === o.k ? 'on' : ''}`}
          onClick={() => setVegFilter(o.k)}
        >
          <span className={`vt-dot ${o.k}`} />
          {o.label}
        </button>
      ))}
    </div>
  )
}
