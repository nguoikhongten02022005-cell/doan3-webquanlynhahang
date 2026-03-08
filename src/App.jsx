import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import InternalLayout from './layouts/InternalLayout'
import MainLayout from './layouts/MainLayout'
import AboutPage from './pages/AboutPage'
import BookingPage from './pages/BookingPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import InternalDashboardPage from './pages/InternalDashboardPage'
import InternalLoginPage from './pages/InternalLoginPage'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/internal" element={<InternalLayout />}>
          <Route index element={<Navigate to="/internal/dashboard" replace />} />
          <Route path="login" element={<InternalLoginPage />} />
          <Route
            path="dashboard"
            element={(
              <ProtectedRoute>
                <InternalDashboardPage />
              </ProtectedRoute>
            )}
          />
        </Route>

        <Route path="/host-dashboard" element={<Navigate to="/internal/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
