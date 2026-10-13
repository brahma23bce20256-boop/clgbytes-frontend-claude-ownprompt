import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HotelSwitchModal from './components/HotelSwitchModal'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import { HOTELS } from './data/hotels'

const SearchPage = lazy(() => import('./pages/SearchPage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const LiveOrdersPill = lazy(() => import('./components/LiveOrdersPill'))

function RouteFallback() {
  return <div style={{ minHeight: '60vh' }} aria-hidden />
}

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    const warm = () => {
      HOTELS.forEach((h) => {
        const im = new Image()
        im.decoding = 'async'
        im.src = h.cover
      })
    }
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number }
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(warm)
    } else {
      setTimeout(warm, 400)
    }
  }, [])

  const hideHeader =
    pathname === '/search' ||
    pathname.startsWith('/menu/')
  const hideFooter =
    pathname === '/search' ||
    pathname === '/cart' ||
    pathname.startsWith('/menu/')

  return (
    <>
      <div className="site-bg" aria-hidden />
      <ScrollToTop />
      {!hideHeader && <Header />}
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
      <Suspense fallback={null}>
        <LiveOrdersPill />
      </Suspense>
      <BottomNav />
      <HotelSwitchModal />
      {!hideFooter && <Footer />}
    </>
  )
}
