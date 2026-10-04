import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, Bike } from 'lucide-react'
import type { Hotel } from '../data/hotels'
import { useStore } from '../store/useStore'

interface Props {
  hotel: Hotel
  index?: number
}

export default function HotelCard({ hotel, index = 0 }: Props) {
  const uni = useStore((s) => s.selectedUniversity)
  const distance = hotel.distance[uni]
  const minutes = Math.max(20, Math.round(distance * 10 + 15))

  const vegMark =
    hotel.veg === 'veg' ? (
      <span className="hc-dietband veg">Pure veg</span>
    ) : hotel.veg === 'nonveg' ? (
      <span className="hc-dietband nonveg">Non-veg</span>
    ) : (
      <span className="hc-dietband both">Veg + Non-veg</span>
    )

  return (
    <Link to={`/menu/${hotel.id}`} className="hotel-card card rise" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="hc-cover">
        <img src={hotel.cover} alt={hotel.name} loading="lazy" />
        <div className="hc-cover-shade" />
        <div className="hc-ribbon">Order by 6pm · delivered by 8pm</div>
        {vegMark}
      </div>

      <div className="hc-body">
        <div className="hc-head">
          <h3 className="hc-name">{hotel.name}</h3>
          <span className="hc-rating">
            <Star size={13} fill="currentColor" strokeWidth={0} />
            {hotel.rating.toFixed(1)}
          </span>
        </div>
        <div className="hc-tag">{hotel.tagline}</div>

        <div className="hc-meta">
          <span className="hc-meta-item"><Clock size={13} /> {minutes}–{minutes + 10} min</span>
          <span className="hc-meta-dot" />
          <span className="hc-meta-item"><Bike size={13} /> ₹15 delivery</span>
          <span className="hc-meta-dot" />
          <span className="hc-meta-item">₹{hotel.priceForTwo} for two</span>
        </div>

        <div className="hc-location">
          <MapPin size={13} />
          <span>{hotel.location} · <strong>{distance} km</strong> from {uniLabel(uni)}</span>
        </div>

        <div className="hc-cats">
          {hotel.categories.slice(0, 4).map((c) => (
            <span key={c} className="hc-cat">{labelFor(c)}</span>
          ))}
        </div>
      </div>

      <style>{`
        .hotel-card { overflow: hidden; display: flex; flex-direction: column; }
        .hc-cover { position: relative; aspect-ratio: 16 / 9; background: #f0ece7; overflow: hidden; }
        .hc-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .hotel-card:hover .hc-cover img { transform: scale(1.05); }
        .hc-cover-shade {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(20,18,18,0) 55%, rgba(20,18,18,0.55) 100%);
        }
        .hc-ribbon {
          position: absolute; left: 12px; bottom: 12px;
          background: rgba(20,18,18,0.85); color: #fff;
          font-size: 0.72rem; font-weight: 600;
          padding: 6px 10px; border-radius: 999px;
          backdrop-filter: blur(6px);
        }
        .hc-dietband {
          position: absolute; top: 12px; left: 12px;
          font-size: 0.68rem; font-weight: 700;
          padding: 5px 10px; border-radius: 999px;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .hc-dietband.veg { background: var(--veg-soft); color: #065F46; }
        .hc-dietband.nonveg { background: var(--nonveg-soft); color: #7F1D1D; }
        .hc-dietband.both { background: #FFF; color: var(--ink); border: 1px solid var(--line-strong); }

        .hc-body { padding: 16px 18px 18px; }
        .hc-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .hc-name { font-size: 1.1rem; font-weight: 600; }
        .hc-rating {
          display: inline-flex; align-items: center; gap: 4px;
          background: #16A34A; color: #fff;
          padding: 3px 9px; border-radius: 999px;
          font-size: 0.78rem; font-weight: 700;
        }
        .hc-tag { font-size: 0.84rem; color: var(--ink-mute); margin-top: 4px; }
        .hc-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .hc-meta-item { display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; color: var(--ink-soft); font-weight: 500; }
        .hc-meta-dot { width: 3px; height: 3px; border-radius: 999px; background: var(--ink-faint); }
        .hc-location { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--ink-mute); margin-top: 10px; }
        .hc-location strong { color: var(--ink); font-weight: 600; }
        .hc-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line); }
        .hc-cat {
          font-size: 0.72rem; padding: 4px 10px;
          border-radius: 999px;
          background: var(--cream);
          color: var(--ink-soft);
          font-weight: 500;
        }
      `}</style>
    </Link>
  )
}

function labelFor(c: string) {
  const map: Record<string, string> = {
    biryani: 'Biryani',
    mandi: 'Mandi',
    shawarma: 'Shawarma',
    'nonveg-starters': 'Non-veg starters',
    'veg-starters': 'Veg starters',
  }
  return map[c] ?? c
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}
