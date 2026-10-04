import { useStore, VegFilter } from '../store/useStore'

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

      <style>{`
        .veg-toggle {
          position: relative;
          display: inline-flex;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 4px;
          box-shadow: var(--shadow-sm);
        }
        .vt-opt {
          position: relative; z-index: 2;
          padding: 7px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink-mute);
          display: inline-flex; align-items: center; gap: 7px;
          border-radius: 999px;
          transition: color .18s;
        }
        .vt-opt.on { color: var(--ink); }
        .vt-opt:first-of-type.on { color: var(--ink); }
        .vt-opt.on .vt-dot.veg { background: var(--veg); }
        .vt-opt.on .vt-dot.nonveg { background: var(--nonveg); }
        .vt-dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: var(--ink-faint);
          box-shadow: 0 0 0 2px var(--paper), 0 0 0 3px var(--line-strong);
        }
        .vt-dot.all { background: var(--ink-faint); }
        .vt-dot.veg { background: var(--veg); }
        .vt-dot.nonveg { background: var(--nonveg); }
        .vt-indicator {
          position: absolute;
          top: 4px; bottom: 4px;
          width: calc((100% - 8px) / 3);
          background: var(--brand-orange-soft);
          border-radius: 999px;
          transition: transform .3s cubic-bezier(.4,.0,.2,1);
          z-index: 1;
        }
        .vt-indicator[data-pos="all"] { transform: translateX(4px); }
        .vt-indicator[data-pos="veg"] { transform: translateX(calc(100% + 4px)); }
        .vt-indicator[data-pos="nonveg"] { transform: translateX(calc(200% + 4px)); }
      `}</style>
    </div>
  )
}
