import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram } from 'lucide-react'
import { CONTACT } from '../data/universities'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container ft-grid">
        <div className="ft-brand">
          <Logo size={40} withWordmark />
          <p className="ft-tag">
            Food, from your campus hotels — delivered to your main gate. Order by <strong>6pm</strong>,
            we're at your gate before <strong>8pm</strong>.
          </p>
        </div>

        <div className="ft-col">
          <div className="ft-title">Explore</div>
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/about">About us</Link>
        </div>

        <div className="ft-col">
          <div className="ft-title">Campuses</div>
          <span>VIT-AP University</span>
          <span>SRM AP University</span>
          <span>Amrita AP University</span>
        </div>

        <div className="ft-col">
          <div className="ft-title">Reach us</div>
          <a href={`mailto:${CONTACT.email}`}><Mail size={14} /> {CONTACT.email}</a>
          <a href={`tel:${CONTACT.phone}`}><Phone size={14} /> {CONTACT.phone}</a>
          <a href="#" aria-label="Instagram"><Instagram size={14} /> @clgbytes</a>
        </div>
      </div>

      <div className="ft-bottom container">
        <span>© {new Date().getFullYear()} Clgbytes · Made by students, for students.</span>
        <span className="ft-small">Trust the fork. 🍴</span>
      </div>

      <style>{`
        .site-footer {
          background: var(--ink);
          color: #d7d2cf;
          margin-top: 60px;
          padding: 60px 0 24px;
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
          gap: 40px;
        }
        .ft-tag { font-size: 0.9rem; line-height: 1.5; margin: 16px 0 0; max-width: 320px; color: #cbc6c3; }
        .ft-tag strong { color: var(--brand-orange-glow); font-weight: 600; }
        .ft-col { display: flex; flex-direction: column; gap: 10px; }
        .ft-title {
          font-family: var(--font-display);
          color: #fff;
          font-size: 1rem; margin-bottom: 6px;
        }
        .ft-col a, .ft-col span {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.88rem; color: #cbc6c3;
          transition: color .18s;
        }
        .ft-col a:hover { color: var(--brand-orange-glow); }
        .ft-bottom {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 50px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.78rem; color: #9a9290;
        }
        .ft-small { color: var(--brand-orange-glow); }
        .site-footer .logo-word-main { color: #fff; }
        .site-footer .logo-word-sub { color: #9a9290; }
        @media (max-width: 760px) {
          .ft-grid { grid-template-columns: 1fr 1fr; }
          .ft-brand { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  )
}
