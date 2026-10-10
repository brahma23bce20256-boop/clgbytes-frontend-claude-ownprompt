import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Mail, Phone, Sparkles } from 'lucide-react'
import { CONTACT } from '../data/universities'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <main className="page container about-page">
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
    </main>
  )
}
