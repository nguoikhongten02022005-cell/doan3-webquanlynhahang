import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { prefetchTrangTheoDuongDan } from '../services/prefetch/taiTuyenTrang'

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Thực đơn', to: '/thuc-don' },
  { label: 'Đặt bàn', to: '/dat-ban' },
  { label: 'Về chúng tôi', to: '/gioi-thieu' },
]

function DauTrang() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartItems } = useGioHang()
  const { nguoiDungHienTai, coTheVaoNoiBo, dangXuat } = useXacThuc()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const displayName = nguoiDungHienTai?.fullName ?? nguoiDungHienTai?.name

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }

  const handleNavLinkClick = () => {
    closeMenus()
  }

  const handlePrefetchTuyen = (duongDan) => {
    prefetchTrangTheoDuongDan(duongDan)
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
    dangXuat()
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
              onMouseEnter={() => handlePrefetchTuyen(item.to)}
              onFocus={() => handlePrefetchTuyen(item.to)}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            to="/dat-ban"
            className="btn nut-chinh header-dat-ban-btn"
            onClick={handleNavLinkClick}
            onMouseEnter={() => handlePrefetchTuyen('/dat-ban')}
            onFocus={() => handlePrefetchTuyen('/dat-ban')}
          >
            Đặt bàn
          </Link>

          <Link
            to="/gio-hang"
            className="icon-btn action-btn gio-hang-btn"
            aria-label="Giỏ hàng"
            data-tooltip="Giỏ hàng"
            onClick={handleNavLinkClick}
            onMouseEnter={() => handlePrefetchTuyen('/gio-hang')}
            onFocus={() => handlePrefetchTuyen('/gio-hang')}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L20 8H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="19" r="1.3" fill="currentColor" />
              <circle cx="17" cy="19" r="1.3" fill="currentColor" />
            </svg>
            {cartCount > 0 ? <span className="gio-hang-count">{cartCount > 99 ? '99+' : cartCount}</span> : null}
          </Link>

          <div className="user-thuc-don-wrap desktop-only">
            <button
              type="button"
              className="icon-btn action-btn"
              aria-label={nguoiDungHienTai ? 'Tài khoản' : 'Đăng nhập'}
              data-tooltip={nguoiDungHienTai ? 'Tài khoản' : 'Đăng nhập'}
              onClick={handleToggleUserMenu}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M6 19.2c0-3.1 2.7-5 6-5s6 1.9 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                {nguoiDungHienTai ? (
                  <>
                    <div className="user-greeting">
                      Xin chào, <strong>{displayName}</strong>
                    </div>
                    {coTheVaoNoiBo && (
                      <Link
                        to="/noi-bo/bang-dieu-khien"
                        role="menuitem"
                        onClick={handleNavLinkClick}
                        onMouseEnter={() => handlePrefetchTuyen('/noi-bo/bang-dieu-khien')}
                        onFocus={() => handlePrefetchTuyen('/noi-bo/bang-dieu-khien')}
                      >
                        Bảng điều khiển nội bộ
                      </Link>
                    )}
                    <Link
                      to="/ho-so"
                      role="menuitem"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => handlePrefetchTuyen('/ho-so')}
                      onFocus={() => handlePrefetchTuyen('/ho-so')}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <button className="logout-btn" onClick={handleLogout} role="menuitem">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dang-nhap"
                      role="menuitem"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => handlePrefetchTuyen('/dang-nhap')}
                      onFocus={() => handlePrefetchTuyen('/dang-nhap')}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/ho-so"
                      role="menuitem"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => handlePrefetchTuyen('/ho-so')}
                      onFocus={() => handlePrefetchTuyen('/ho-so')}
                    >
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
        <div className="mobile-menu open container">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={isActive(item.to) ? 'active' : ''}
              onClick={handleNavLinkClick}
              onMouseEnter={() => handlePrefetchTuyen(item.to)}
              onFocus={() => handlePrefetchTuyen(item.to)}
            >
              {item.label}
            </Link>
          ))}
          {nguoiDungHienTai ? (
            <>
              <div className="mobile-user-greeting">
                Xin chào, <strong>{displayName}</strong>
              </div>
              {coTheVaoNoiBo && (
                <Link
                  to="/noi-bo/bang-dieu-khien"
                  onClick={handleNavLinkClick}
                  onMouseEnter={() => handlePrefetchTuyen('/noi-bo/bang-dieu-khien')}
                  onFocus={() => handlePrefetchTuyen('/noi-bo/bang-dieu-khien')}
                >
                  Bảng điều khiển nội bộ
                </Link>
              )}
              <Link
                to="/ho-so"
                onClick={handleNavLinkClick}
                onMouseEnter={() => handlePrefetchTuyen('/ho-so')}
                onFocus={() => handlePrefetchTuyen('/ho-so')}
              >
                Hồ sơ cá nhân
              </Link>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/dang-nhap"
                onClick={handleNavLinkClick}
                onMouseEnter={() => handlePrefetchTuyen('/dang-nhap')}
                onFocus={() => handlePrefetchTuyen('/dang-nhap')}
              >
                Đăng nhập
              </Link>
              <Link
                to="/ho-so"
                onClick={handleNavLinkClick}
                onMouseEnter={() => handlePrefetchTuyen('/ho-so')}
                onFocus={() => handlePrefetchTuyen('/ho-so')}
              >
                Hồ sơ cá nhân
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default DauTrang
