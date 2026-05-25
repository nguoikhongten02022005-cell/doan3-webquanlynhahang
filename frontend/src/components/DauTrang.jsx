import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Thực đơn', to: '/thuc-don' },
  { label: 'Đặt bàn', to: '/dat-ban' },
  { label: 'Về chúng tôi', to: '/gioi-thieu' },
  { label: 'Đánh giá', to: '/danh-gia' },
]

function DauTrang() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { nguoiDungHienTai, coTheVaoNoiBo, dangXuat } = useXacThuc()

  const displayName = nguoiDungHienTai?.fullName ?? nguoiDungHienTai?.name

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

  const handleLogout = async () => {
    await dangXuat()
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
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/dat-ban" className="btn nut-chinh header-dat-ban-btn" onClick={handleNavLinkClick}>
            Đặt bàn
          </Link>

          <div className="user-thuc-don-wrap desktop-only">
            {nguoiDungHienTai ? (
              <button
                type="button"
                className="header-user-trigger"
                aria-label="Tài khoản"
                onClick={handleToggleUserMenu}
              >
                <span className="header-user-avatar">{String(displayName || 'U').trim().slice(0, 1).toUpperCase()}</span>
                <span className="header-user-name">{displayName}</span>
              </button>
            ) : (
              <Link to="/dang-nhap" className="btn header-login-btn" onClick={handleNavLinkClick}>
                Đăng nhập
              </Link>
            )}

            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                {nguoiDungHienTai ? (
                  <>
                    <div className="user-greeting">
                      Xin chào, <strong>{displayName}</strong>
                    </div>
                    {coTheVaoNoiBo && (
                      <Link to="/noi-bo/dashboard" role="menuitem" onClick={handleNavLinkClick}>
                        Bảng điều khiển nội bộ
                      </Link>
                    )}
                    <Link to="/ho-so" role="menuitem" onClick={handleNavLinkClick}>
                      Hồ sơ cá nhân
                    </Link>
                    <button className="logout-btn" onClick={handleLogout} role="menuitem">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/dang-nhap" role="menuitem" onClick={handleNavLinkClick}>
                      Đăng nhập
                    </Link>
                    <Link to="/dang-ky" role="menuitem" onClick={handleNavLinkClick}>
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="icon-btn mobile-toggle"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-chinh"
            onClick={handleToggleMobileMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu-chinh" className="mobile-menu open container" role="dialog" aria-label="Menu điều hướng trên điện thoại">
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
          {nguoiDungHienTai ? (
            <>
              <div className="mobile-user-greeting">
                Xin chào, <strong>{displayName}</strong>
              </div>
              {coTheVaoNoiBo && (
                <Link to="/noi-bo/dashboard" onClick={handleNavLinkClick}>
                  Bảng điều khiển nội bộ
                </Link>
              )}
              <Link to="/ho-so" onClick={handleNavLinkClick}>
                Hồ sơ cá nhân
              </Link>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/dang-nhap" onClick={handleNavLinkClick}>
                Đăng nhập
              </Link>
              <Link to="/dang-ky" onClick={handleNavLinkClick}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default DauTrang
