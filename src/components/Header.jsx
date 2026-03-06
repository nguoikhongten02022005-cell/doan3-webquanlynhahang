import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Thực đơn', to: '/menu' },
  { label: 'Đặt bàn', to: '/booking' },
  { label: 'Về chúng tôi', to: '/about' },
]

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartItems } = useCart()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const userDataString = localStorage.getItem('restaurant_current_user')

  let currentUser = null

  if (userDataString) {
    try {
      currentUser = JSON.parse(userDataString)
    } catch {
      currentUser = null
    }
  }

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }

  const handleNavLinkClick = () => {
    closeMenus()
  }

  const handleToggleUserMenu = () => {
    setUserMenuOpen((open) => !open)
    setMobileMenuOpen(false)
  }

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open)
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('restaurant_current_user')
    closeMenus()
    navigate('/')
  }

  const isActive = (to) => pathname === to

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand" onClick={handleNavLinkClick}>
          <span className="brand-mark">NH</span>
          <span className="brand-name">Nhà Hàng Nguyên Vị</span>
        </Link>

        <nav className="main-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={isActive(item.to) ? 'active' : ''}
              onClick={handleNavLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/profile" className="icon-btn profile-btn" aria-label="Hồ sơ cá nhân" onClick={handleNavLinkClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M6 19.2c0-3.1 2.7-5 6-5s6 1.9 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </Link>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Giỏ hàng" onClick={handleNavLinkClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L20 8H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="19" r="1.3" fill="currentColor" />
              <circle cx="17" cy="19" r="1.3" fill="currentColor" />
            </svg>
            <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
          </Link>

          <div className="user-menu-wrap desktop-only">
            <button
              type="button"
              className="icon-btn"
              aria-label="Tài khoản"
              onClick={handleToggleUserMenu}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M6 19.2c0-3.1 2.7-5 6-5s6 1.9 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                {currentUser ? (
                  <>
                    <div className="user-greeting">
                      Xin chào, <strong>{currentUser.name}</strong>
                    </div>
                    <Link to="/profile" role="menuitem" onClick={handleNavLinkClick}>
                      Hồ sơ cá nhân
                    </Link>
                    <button className="logout-btn" onClick={handleLogout} role="menuitem">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" role="menuitem" onClick={handleNavLinkClick}>
                      Đăng nhập
                    </Link>
                    <Link to="/profile" role="menuitem" onClick={handleNavLinkClick}>
                      Hồ sơ cá nhân
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="icon-btn mobile-toggle"
            aria-label="Mở menu"
            onClick={handleToggleMobileMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu container">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={isActive(item.to) ? 'active' : ''}
              onClick={handleNavLinkClick}
            >
              {item.label}
            </Link>
          ))}
          {currentUser ? (
            <>
              <div className="mobile-user-greeting">
                Xin chào, <strong>{currentUser.name}</strong>
              </div>
              <Link to="/profile" onClick={handleNavLinkClick}>
                Hồ sơ cá nhân
              </Link>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleNavLinkClick}>
                Đăng nhập
              </Link>
              <Link to="/profile" onClick={handleNavLinkClick}>
                Hồ sơ cá nhân
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
