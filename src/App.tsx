import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HotelSwitchModal from './components/HotelSwitchModal'
import LiveOrdersPill from './components/LiveOrdersPill'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import IntroVideo, { shouldShowIntro } from './components/IntroVideo'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import TrackingPage from './pages/TrackingPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import { HOTELS } from './data/hotels'

export default function App() {
  const [introDone, setIntroDone] = useState(() => !shouldShowIntro())
  const { pathname } = useLocation()

  useEffect(() => {
    HOTELS.forEach((h) => {
      const im = new Image()
      im.decoding = 'async'
      im.src = h.cover
    })
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
      {!introDone && <IntroVideo onDone={() => setIntroDone(true)} />}
      <div className="site-bg" aria-hidden />
      <ScrollToTop />
      {!hideHeader && <Header />}
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
      <LiveOrdersPill />
      <BottomNav />
      <HotelSwitchModal />
      {!hideFooter && <Footer />}
    </>
  )
}
