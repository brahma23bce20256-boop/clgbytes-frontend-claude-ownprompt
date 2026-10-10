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
export default function Logo({ size = 44, withWordmark = true, variant = 'tile' }: Props) {
  // Match the uploaded clgbytes-logo.png aspect ratio (≈1.81:1) so the dark C
  // on the left and the white B on the right both render fully without clipping.
  const LOGO_RATIO = 1.81
  const h = size
  const w = Math.round(size * LOGO_RATIO)
  return (
    <Link to="/" className={`logo-link logo-${variant}`} aria-label="Clgbytes home">
      <span
        className="logo-mark"
        style={{
          width: w,
          height: h,
          borderRadius: variant === 'tile' ? Math.round(size * 0.22) : 0,
        }}
      >
        <img src="/clgbytes-logo.png" alt="Clgbytes" width={w} height={h} />
      </span>
      {withWordmark && (
        <span className="logo-word">
          <span className="logo-word-main">clgbytes</span>
          <span className="logo-word-sub">campus food · trusted daily</span>
        </span>
      )}
    </Link>
  )
}
