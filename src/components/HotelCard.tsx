import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import type { Hotel } from '../data/hotels'
import { useStore } from '../store/useStore'
import './HotelCard.css'

interface Props {
  hotel: Hotel
  index?: number
}

export default function HotelCard({ hotel, index = 0 }: Props) {
  const uni = useStore((s) => s.selectedUniversity)
  const distance = hotel.distance[uni]

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
        <img src={hotel.cover} alt={hotel.name} loading="lazy" decoding="async" width={640} height={360} />
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

        <div className="hc-location">
          <MapPin size={13} />
          <span>{hotel.location} · <strong>{distance} km</strong> from {uniLabel(uni)}</span>
        </div>
      </div>
    </Link>
  )
}

function uniLabel(id: string) {
  return id === 'vit-ap' ? 'VIT-AP' : id === 'srm-ap' ? 'SRM AP' : 'Amrita AP'
}
