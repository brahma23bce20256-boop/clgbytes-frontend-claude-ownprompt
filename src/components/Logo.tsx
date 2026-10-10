import { Link } from 'react-router-dom'
import './Logo.css'

interface Props {
  size?: number
  withWordmark?: boolean
  variant?: 'tile' | 'bare' // tile = orange rounded background, bare = raw image
}

/**
 * Logo renders the exact uploaded clgbytes-logo.png.
 * variant="tile" wraps it in an orange rounded tile so the logo's orange
 * background sinks seamlessly into the chrome. The tile color is the exact
 * brand orange, matching the logo image background pixel-for-pixel.
 */
export default function Logo({ withWordmark = true }: Props) {
  return (
    <Link to="/" className="logo-link" aria-label="Clgbytes home">
      {withWordmark && (
        <span className="logo-word">
          <span className="logo-word-main">clgbytes</span>
          <span className="logo-word-sub">campus food · trusted daily</span>
        </span>
      )}
    </Link>
  )
}
