import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Phone, User as UserIcon, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react'
import { UNIVERSITIES, UniversityId } from '../data/universities'
import { useStore } from '../store/useStore'

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
    // Return to the page they came from (cart etc.), else home
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

      <style>{`
        .login-wrap { max-width: 1100px; }
        .login-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 30px; align-items: start; }
        .login-card { padding: 40px; }
        .login-head h1 { margin: 16px 0 8px; font-size: 2rem; }
        .login-form { margin-top: 24px; display: flex; flex-direction: column; gap: 18px; }

        .field { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-size: 0.8rem; color: var(--ink-mute); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .input {
          background: var(--cream);
          border: 1px solid var(--line-strong);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 1rem;
          color: var(--ink);
          outline: 0;
          transition: border-color .18s, background .18s;
        }
        .input:focus-within, .input:focus { border-color: var(--brand-orange); background: var(--paper); }
        .input-row { display: flex; align-items: center; padding: 0 16px; gap: 10px; }
        .input-row input { border: 0; outline: 0; background: transparent; padding: 14px 0; width: 100%; font-size: 1rem; }
        .input-prefix { font-weight: 600; color: var(--ink-soft); }
        .field-err { font-size: 0.75rem; color: var(--nonveg); }

        .uni-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .uni-pick {
          padding: 14px;
          background: var(--cream);
          border: 1.5px solid var(--line);
          border-radius: 12px;
          text-align: left;
          transition: all .18s;
        }
        .uni-pick:hover { border-color: var(--ink-mute); }
        .uni-pick.on {
          background: var(--brand-orange);
          color: #fff;
          border-color: var(--brand-orange-deep);
          box-shadow: 0 10px 28px -14px rgba(242,106,31,0.6);
        }
        .uni-pick-name { font-weight: 700; font-size: 0.92rem; }
        .uni-pick-city { font-size: 0.72rem; color: var(--ink-mute); margin-top: 4px; }
        .uni-pick.on .uni-pick-city { color: rgba(255,255,255,0.85); }

        .login-cta { align-self: flex-start; margin-top: 6px; }
        .login-note { font-size: 0.8rem; line-height: 1.5; margin-top: 6px; }

        .login-aside { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 100px; }
        .aside-card { background: var(--ink); color: #d7d2cf; border-radius: var(--radius-md); padding: 24px; }
        .aside-card h3 { color: #fff; margin-bottom: 10px; }
        .aside-card ul { padding-left: 18px; margin: 0; line-height: 1.7; font-size: 0.92rem; }
        .aside-note {
          background: var(--brand-orange-soft);
          color: var(--brand-orange-deep);
          border-radius: var(--radius-md);
          padding: 16px;
          font-size: 0.85rem;
        }
        @media (max-width: 820px) {
          .login-grid { grid-template-columns: 1fr; }
          .login-aside { position: static; }
          .uni-grid { grid-template-columns: 1fr; }
          .login-card { padding: 28px; }
        }
      `}</style>
    </main>
  )
}
