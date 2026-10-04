import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Mail, Phone, Sparkles } from 'lucide-react'
import { CONTACT } from '../data/universities'

export default function AboutPage() {
  return (
    <main className="page container about-page">
      {/* ---- Honest apology, up top ---- */}
      <section className="apology">
        <div className="apology-chip"><AlertCircle size={14} /> A note first</div>
        <h1>
          We're sorry — <em>and we're back, daily.</em>
        </h1>
        <p className="apology-text">
          Some of you tried Clgbytes last time and we didn't show up the way we promised. There were internal
          disputes within the team, and the service didn't run to its potential. That's on us, and we're sorry.
        </p>
        <p className="apology-text">
          <strong>From now on, Clgbytes runs daily.</strong> No breaks, no silent weeks. Every evening,
          one dependable order run — with new ideas layered in to make campus food easier to reach.
          No worries, only trust. 🧡
        </p>
      </section>

      {/* ---- Story ---- */}
      <section className="story">
        <div className="story-chip"><Sparkles size={14} /> Our story</div>
        <h2>Day 1 was ₹30. Day 5 was ₹1,000.</h2>

        <div className="story-grid">
          <div className="story-text">
            <p>
              We're Clgbytes — a small crew of <strong>VIT-AP students</strong>. When we lived in hostel we were
              tired of two things: paying a hike to eat decent food, and paying delivery charges on top of
              that. The maths just didn't make sense for a student budget.
            </p>
            <p>
              So we decided to do it differently — bring food from campus hotels at <strong>menu prices</strong>,
              with a <strong>very minimal delivery charge</strong>. That's the whole idea.
            </p>
            <p>
              It started as pocket-money hustle on a WhatsApp group. People placed orders in a chat, we rode
              over, picked up, dropped off. <strong>Day 1 earnings: ₹30.</strong>
            </p>
            <p>
              We didn't quit. If one person could trust us today, why not two tomorrow? Day 2: <strong>₹180</strong>.
              Day 3: <strong>₹560</strong>. By day 5 we hit <strong>₹1,000</strong>. A milestone we thought would
              take weeks happened in five days.
            </p>
            <p>
              Then came the fall. Early success + inexperienced crew = chaos. We failed to deliver orders
              properly as demand grew. We lost motivation — doing everything manually, three people, no system
              behind us. We failed.
            </p>
            <p>
              But the failure didn't stop us. We built this <strong>website in a single night</strong> — basic,
              but it halved the manual work: showing the menu, taking orders, pushing them into our WhatsApp.
            </p>
            <p>
              <strong>Clgbytes isn't just a food delivery app anymore.</strong> It's a <em>business creating
              opportunities</em> — a chance to centralise every hotel in Mandadam into one platform that
              actually works for students. The hotels have backed us, which boosted everything.
            </p>
            <p>
              Ups and downs are just data. They taught us what to do — and what not to do. Clgbytes is back,
              and this time, it's built to last.
            </p>
          </div>

          <aside className="story-tl">
            <div className="tl-head">The first five days</div>
            <div className="tl-step"><span className="tl-day">D1</span><span className="tl-amt">₹30</span><span className="tl-note">The first order. Just one.</span></div>
            <div className="tl-step"><span className="tl-day">D2</span><span className="tl-amt">₹180</span><span className="tl-note">Trust grew overnight.</span></div>
            <div className="tl-step"><span className="tl-day">D3</span><span className="tl-amt">₹560</span><span className="tl-note">We got serious.</span></div>
            <div className="tl-step milestone"><span className="tl-day">D5</span><span className="tl-amt">₹1,000</span><span className="tl-note">Milestone unlocked.</span></div>
            <div className="tl-sep" />
            <div className="tl-head">Then</div>
            <div className="tl-step"><span className="tl-day">⚠️</span><span className="tl-amt">Scale broke us</span><span className="tl-note">Manual ops, 3 people.</span></div>
            <div className="tl-step"><span className="tl-day">💻</span><span className="tl-amt">Built the site overnight</span><span className="tl-note">Half the work gone.</span></div>
            <div className="tl-step done"><span className="tl-day">🧡</span><span className="tl-amt">Back — daily</span><span className="tl-note">No breaks this time.</span></div>
          </aside>
        </div>
      </section>

      <section className="pledge">
        <h2>Our pledge to you</h2>
        <div className="pledge-grid">
          <div className="pledge-card">
            <div className="pledge-num">01</div>
            <h3>Menu prices. Always.</h3>
            <p>Never a rupee more than what the hotel charges on their printed menu.</p>
          </div>
          <div className="pledge-card">
            <div className="pledge-num">02</div>
            <h3>Flat, honest delivery</h3>
            <p>₹15 flat above ₹299. No surge, no "dynamic" fees that spike at dinner.</p>
          </div>
          <div className="pledge-card">
            <div className="pledge-num">03</div>
            <h3>Daily — no gaps</h3>
            <p>One run every evening. 6pm order cutoff, 8pm hand-over. On schedule.</p>
          </div>
          <div className="pledge-card">
            <div className="pledge-num">04</div>
            <h3>Student-first support</h3>
            <p>Email, phone, campus-specific rider contact. We pick up — we're one of you.</p>
          </div>
        </div>
      </section>

      <section className="reach">
        <h2>Reach out</h2>
        <div className="reach-row">
          <a href={`mailto:${CONTACT.email}`} className="reach-card">
            <Mail size={20} />
            <div>
              <div className="reach-top">Email</div>
              <div className="reach-value">{CONTACT.email}</div>
            </div>
          </a>
          <a href={`tel:${CONTACT.phone}`} className="reach-card">
            <Phone size={20} />
            <div>
              <div className="reach-top">Phone</div>
              <div className="reach-value">+91 {CONTACT.phone}</div>
            </div>
          </a>
          <Link to="/" className="reach-card cta">
            <ArrowRight size={20} />
            <div>
              <div className="reach-top">Ready?</div>
              <div className="reach-value">Order your food →</div>
            </div>
          </Link>
        </div>
      </section>

      <style>{`
        .about-page { padding-bottom: 100px; }

        .apology {
          background: linear-gradient(135deg, var(--brand-orange) 0%, #FF8842 100%);
          color: #fff;
          border-radius: var(--radius-xl);
          padding: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          margin-bottom: 40px;
        }
        .apology::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(circle at 100% 0%, rgba(255,255,255,0.18), transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(0,0,0,0.14), transparent 50%);
          pointer-events: none;
        }
        .apology > * { position: relative; z-index: 1; }
        .apology-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.25);
          padding: 7px 14px; border-radius: 999px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
        }
        .apology h1 {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.05;
          color: #fff;
          max-width: 740px;
        }
        .apology h1 em { font-family: 'Instrument Serif', serif; font-weight: 500; font-style: italic; }
        .apology-text { font-size: 1.05rem; line-height: 1.65; margin: 16px 0 0; max-width: 720px; opacity: 0.95; }
        .apology-text strong { color: #fff; font-weight: 700; }

        .story { margin-top: 60px; }
        .story-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--ink); color: #fff;
          padding: 7px 14px; border-radius: 999px;
          font-size: 0.78rem; font-weight: 600;
        }
        .story-chip svg { color: var(--brand-orange-glow); }
        .story h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); margin: 14px 0 24px; max-width: 740px; }

        .story-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 32px; align-items: start; }
        .story-text p { font-size: 1rem; line-height: 1.75; color: var(--ink-soft); margin: 0 0 14px; }
        .story-text strong { color: var(--ink); font-weight: 600; }
        .story-text em { font-family: 'Instrument Serif', serif; font-style: italic; }

        .story-tl {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          position: sticky; top: 100px;
        }
        .tl-head { font-family: var(--font-display); font-size: 0.9rem; color: var(--ink-mute); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin: 10px 0; }
        .tl-head:first-child { margin-top: 0; }
        .tl-step {
          display: grid; grid-template-columns: 40px auto 1fr;
          gap: 10px; align-items: center;
          padding: 10px 0;
          border-bottom: 1px dashed var(--line);
        }
        .tl-step:last-child { border-bottom: 0; }
        .tl-day {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--cream);
          font-weight: 700; font-size: 0.85rem;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .tl-amt { font-weight: 700; font-size: 0.95rem; }
        .tl-note { font-size: 0.78rem; color: var(--ink-mute); }
        .tl-step.milestone .tl-amt { color: var(--brand-orange-deep); }
        .tl-step.milestone .tl-day { background: var(--brand-orange); color: #fff; }
        .tl-step.done .tl-amt { color: var(--veg); }
        .tl-sep { height: 1px; background: var(--line); margin: 12px 0; }

        .pledge { margin-top: 70px; }
        .pledge h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); margin-bottom: 24px; }
        .pledge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .pledge-card {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: transform .18s;
        }
        .pledge-card:hover { transform: translateY(-3px); }
        .pledge-num {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--brand-orange);
          margin-bottom: 10px;
        }
        .pledge-card h3 { font-family: var(--font-sans); font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
        .pledge-card p { font-size: 0.85rem; color: var(--ink-mute); line-height: 1.55; margin: 0; }

        .reach { margin-top: 60px; }
        .reach h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); margin-bottom: 24px; }
        .reach-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .reach-card {
          display: flex; align-items: center; gap: 16px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 22px 24px;
          box-shadow: var(--shadow-sm);
          color: var(--ink);
          transition: all .2s;
        }
        .reach-card:hover { transform: translateY(-2px); border-color: var(--brand-orange); box-shadow: var(--shadow-md); }
        .reach-card > svg { color: var(--brand-orange); flex-shrink: 0; }
        .reach-top { font-size: 0.72rem; color: var(--ink-mute); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
        .reach-value { font-weight: 700; font-size: 1rem; margin-top: 4px; }
        .reach-card.cta { background: var(--ink); color: #fff; border-color: transparent; }
        .reach-card.cta > svg { color: var(--brand-orange-glow); }
        .reach-card.cta .reach-top { color: #9a9290; }

        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; }
          .story-tl { position: static; }
          .pledge-grid { grid-template-columns: 1fr 1fr; }
          .reach-row { grid-template-columns: 1fr; }
          .apology { padding: 32px; }
        }
      `}</style>
    </main>
  )
}
