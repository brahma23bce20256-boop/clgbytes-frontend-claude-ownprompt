import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CartPopup from './components/CartPopup'
import LandingPage from './pages/LandingPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import TrackingPage from './pages/TrackingPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:hotelId" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track/:orderId" element={<TrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <CartPopup />
      <Footer />
    </>
  )
}
