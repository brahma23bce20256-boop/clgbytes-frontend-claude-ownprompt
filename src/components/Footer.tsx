import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram } from 'lucide-react'
import { CONTACT } from '../data/universities'
import Logo from './Logo'
import './Footer.css'

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
    </footer>
  )
}
