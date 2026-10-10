import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CartPopup from './components/CartPopup'
import LiveOrdersPill from './components/LiveOrdersPill'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

function RouteFallback() {
  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-h) - 200px)' }} aria-hidden />
  )
}

export default function App() {
  return (
    <>
      <div className="site-bg" aria-hidden />
      <ScrollToTop />
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/menu/:hotelId" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track/:orderId" element={<TrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Suspense>
      <CartPopup />
      <LiveOrdersPill />
      <Footer />
    </>
  )
}
