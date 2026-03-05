import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import BookingPage from './pages/BookingPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AboutPage from './pages/AboutPage'

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
