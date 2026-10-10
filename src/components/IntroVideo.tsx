import { useEffect, useRef, useState } from 'react'
import './IntroVideo.css'

const STORAGE_KEY = 'clgbytes:lastVisit'
const SHOW_AFTER_MS = 6 * 60 * 60 * 1000
const MAX_INTRO_DURATION_MS = 5000

export function shouldShowIntro(): boolean {
  try {
    const last = localStorage.getItem(STORAGE_KEY)
    if (!last) return true
    return Date.now() - Number(last) > SHOW_AFTER_MS
  } catch {
    return true
  }
}

export default function IntroVideo({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hiding, setHiding] = useState(false)
  const [ready, setReady] = useState(false)
  const finishedRef = useRef(false)

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())) } catch {}
    setHiding(true)
    setTimeout(onDone, 320)
  }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(finish, MAX_INTRO_DURATION_MS)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => finish())
    }
  }, [])

  return (
    <div
      className={`intro-video ${hiding ? 'hiding' : ''} ${ready ? 'ready' : ''}`}
      aria-hidden={hiding}
    >
      <video
        ref={videoRef}
        className="intro-video-el"
        src="/intro.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        // @ts-expect-error — fetchpriority not yet in React's HTMLVideoAttributes
        fetchpriority="high"
        onCanPlay={() => setReady(true)}
        onPlaying={() => setReady(true)}
        onEnded={finish}
        onError={finish}
      />
      <button type="button" className="intro-skip" onClick={finish} aria-label="Skip intro">
        Skip
      </button>
    </div>
  )
}
