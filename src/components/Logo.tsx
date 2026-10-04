import { Link } from 'react-router-dom'

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
      <style>{`
        .logo-link { display: inline-flex; align-items: center; gap: 10px; }
        .logo-mark {
          display: inline-flex; align-items: center; justify-content: center;
          overflow: hidden;
          background: #F26A1F; /* exact logo bg so edges blend */
        }
        .logo-tile .logo-mark {
          box-shadow: 0 6px 18px -8px rgba(242,106,31,0.55), inset 0 0 0 1px rgba(0,0,0,0.04);
        }
        .logo-mark img {
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
        }
        .logo-word { display: inline-flex; flex-direction: column; line-height: 1; }
        .logo-word-main {
          font-family: 'Clash Display', 'Instrument Serif', serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--ink);
          letter-spacing: -0.03em;
        }
        .logo-word-sub {
          font-size: 0.68rem;
          color: var(--ink-mute);
          margin-top: 4px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .logo-word-sub { display: none; }
        }
      `}</style>
    </Link>
  )
}
