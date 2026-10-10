import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Phone, User as UserIcon, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react'
import { UNIVERSITIES, UniversityId } from '../data/universities'
import { useStore } from '../store/useStore'
import './LoginPage.css'

export default function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation()
  const setUser = useStore((s) => s.setUser)
  const setUniversity = useStore((s) => s.setUniversity)
  const existingUni = useStore((s) => s.selectedUniversity)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [uni, setUni] = useState<UniversityId>(existingUni)
  const [touched, setTouched] = useState(false)

  const phoneOk = /^\d{10}$/.test(phone)
  const nameOk = name.trim().length >= 2
  const canSubmit = phoneOk && nameOk && !!uni

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit) return
    setUser({ name: name.trim(), phone, university: uni })
    setUniversity(uni)
    const to = (loc.state as any)?.from ?? '/'
    nav(to, { replace: true })
  }

  return (
    <main className="page container login-wrap">
      <div className="login-grid">
        <div className="login-card card">
          <div className="login-head">
            <div className="chip" style={{ background: 'var(--brand-orange-soft)', color: 'var(--brand-orange-deep)', borderColor: 'transparent' }}>
              <ShieldCheck size={14} /> Secure sign in · no OTP needed yet
            </div>
            <h1>Sign in to order</h1>
            <p className="mute">Tell us where to deliver and how to reach you. We'll remember you next time.</p>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            <label className="field">
              <span className="field-label"><UserIcon size={14} /> Your name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun"
                autoComplete="given-name"
              />
              {touched && !nameOk && <span className="field-err">Enter at least 2 characters.</span>}
            </label>

            <label className="field">
              <span className="field-label"><Phone size={14} /> Mobile number</span>
              <div className="input input-row">
                <span className="input-prefix">+91</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  autoComplete="tel-national"
                />
              </div>
              {touched && !phoneOk && <span className="field-err">Enter a valid 10-digit number.</span>}
            </label>

            <div className="field">
              <span className="field-label"><GraduationCap size={14} /> Which campus?</span>
              <div className="uni-grid">
                {UNIVERSITIES.map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    className={`uni-pick ${uni === u.id ? 'on' : ''}`}
                    onClick={() => setUni(u.id)}
                  >
                    <div className="uni-pick-name">{u.shortName}</div>
                    <div className="uni-pick-city">{u.city}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-cta" disabled={!canSubmit && touched}>
              Continue <ArrowRight size={16} />
            </button>

            <p className="login-note mute">
              By continuing you agree to our terms. We'll never spam — your number is only used for delivery
              updates. <Link to="/about" style={{ textDecoration: 'underline' }}>Learn why we exist →</Link>
            </p>
          </form>
        </div>

        <aside className="login-aside">
          <div className="aside-card">
            <h3>Why sign in?</h3>
            <ul>
              <li>Track your order live from kitchen → gate.</li>
              <li>Save your campus so we never miss the drop-off.</li>
              <li>See your spend, savings and favourites.</li>
            </ul>
          </div>
          <div className="aside-note">
            <strong>Soon:</strong> OTP + Google sign-in. For now, we keep it simple — name, number, campus.
          </div>
        </aside>
      </div>
    </main>
  )
}
