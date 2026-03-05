import { useState } from 'react'
import './App.css'

const navItems = ['Trang chủ', 'Thực đơn', 'Đặt bàn', 'Về chúng tôi']

const categories = [
  { name: 'Món Chính', icon: '🍲' },
  { name: 'Khai Vị', icon: '🥗' },
  { name: 'Đồ Uống', icon: '🍹' },
  { name: 'Tráng Miệng', icon: '🍮' },
  { name: 'Combo', icon: '🍱' },
]

const signatureDishes = [
  {
    id: 1,
    name: 'Bò Nướng Tảng Sốt Tiêu Xanh',
    description: 'Thăn bò áp chảo lửa lớn, mềm mọng và đậm vị.',
    price: '289.000đ',
    badge: 'Best Seller',
    tone: 'tone-amber',
  },
  {
    id: 2,
    name: 'Cá Hồi Nướng Lá Chanh',
    description: 'Cá hồi sốt bơ chanh, dùng cùng rau củ hấp tươi.',
    price: '245.000đ',
    badge: 'Mới',
    tone: 'tone-green',
  },
  {
    id: 3,
    name: 'Mì Ý Hải Sản Sốt Cà Chua',
    description: 'Mực, tôm và nghêu tươi hòa quyện cùng sốt đặc trưng.',
    price: '198.000đ',
    badge: 'Best Seller',
    tone: 'tone-red',
  },
  {
    id: 4,
    name: 'Gà Nướng Mật Ong Thảo Mộc',
    description: 'Da giòn thơm, thịt mềm ngọt, ăn kèm khoai nghiền mịn.',
    price: '179.000đ',
    badge: 'Mới',
    tone: 'tone-gold',
  },
  {
    id: 5,
    name: 'Sườn Nướng BBQ Khói Nhẹ',
    description: 'Sườn heo nướng chậm, sốt BBQ cay nhẹ dễ ăn.',
    price: '229.000đ',
    badge: 'Best Seller',
    tone: 'tone-brown',
  },
  {
    id: 6,
    name: 'Lẩu Nấm Thanh Vị',
    description: 'Nước dùng ngọt tự nhiên, nhiều loại nấm theo mùa.',
    price: '319.000đ',
    badge: 'Mới',
    tone: 'tone-cool',
  },
  {
    id: 7,
    name: 'Cơm Trộn Bò Nhật',
    description: 'Cơm dẻo, bò xào thơm và rau củ giòn cân bằng vị giác.',
    price: '169.000đ',
    badge: 'Best Seller',
    tone: 'tone-violet',
  },
  {
    id: 8,
    name: 'Salad Trái Cây Sốt Sữa Chua',
    description: 'Món nhẹ thanh mát với trái cây tươi cắt trong ngày.',
    price: '119.000đ',
    badge: 'Mới',
    tone: 'tone-mint',
  },
]

function App() {
  const [cartCount, setCartCount] = useState(3)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Trang chủ')

  const handleNavClick = (item) => {
    setActiveNav(item)
    setMobileMenuOpen(false)
  }

  const addToCart = () => {
    setCartCount((current) => current + 1)
  }

  return (
    <div className="home-page">
      <header className="site-header">
        <div className="container">
          <a href="#home" className="brand" onClick={() => handleNavClick('Trang chủ')}>
            <span className="brand-mark">NH</span>
            <span className="brand-name">Nhà Hàng Nguyên Vị</span>
          </a>

          <nav className="main-nav" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <a
                key={item}
                href={item === 'Trang chủ' ? '#home' : item === 'Thực đơn' ? '#menu' : item === 'Đặt bàn' ? '#booking' : '#about'}
                className={activeNav === item ? 'active' : ''}
                onClick={() => handleNavClick(item)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button type="button" className="icon-btn cart-btn" aria-label="Giỏ hàng">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L20 8H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="19" r="1.3" fill="currentColor" />
                <circle cx="17" cy="19" r="1.3" fill="currentColor" />
              </svg>
              <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
            </button>

            <div className="user-menu-wrap desktop-only">
              <button
                type="button"
                className="icon-btn"
                aria-label="Tài khoản"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M6 19.2c0-3.1 2.7-5 6-5s6 1.9 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                  <a href="/login" role="menuitem">
                    Đăng nhập
                  </a>
                  <a href="/orders" role="menuitem">
                    Lịch sử đơn hàng
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              className="icon-btn mobile-toggle"
              aria-label="Mở menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
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
              <a
                key={item}
                href={item === 'Trang chủ' ? '#home' : item === 'Thực đơn' ? '#menu' : item === 'Đặt bàn' ? '#booking' : '#about'}
                className={activeNav === item ? 'active' : ''}
                onClick={() => handleNavClick(item)}
              >
                {item}
              </a>
            ))}
            <a href="/login">Đăng nhập</a>
            <a href="/orders">Lịch sử đơn hàng</a>
          </div>
        )}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Ẩm thực chuẩn nhà hàng</p>
              <h1>Hương vị nguyên bản, trải nghiệm trọn vẹn.</h1>
              <p>
                Từ nguyên liệu tuyển chọn đến cách trình bày tinh gọn, mỗi món ăn được hoàn thiện để bạn có một bữa ăn ngon đúng nghĩa.
              </p>
              <div className="hero-actions-group">
                <a className="btn btn-primary" href="#menu">
                  Xem Thực Đơn
                </a>
                <a className="btn btn-ghost" href="#booking">
                  Đặt Bàn Ngay
                </a>
              </div>
              <div className="hero-stats" aria-label="Thông tin nhanh">
                <div className="stat-chip">
                  <strong>150+</strong>
                  <span>Món được phục vụ mỗi ngày</span>
                </div>
                <div className="stat-chip">
                  <strong>4.9/5</strong>
                  <span>Đánh giá từ khách hàng</span>
                </div>
                <div className="stat-chip">
                  <strong>20 phút</strong>
                  <span>Thời gian chuẩn bị trung bình</span>
                </div>
              </div>
            </div>

            <div className="hero-showcase" aria-hidden="true">
              <article className="hero-card">
                <span className="hero-tag">Signature</span>
                <div className="hero-art" />
                <div className="hero-card-meta">
                  <h3>Set tối Chef&apos;s Choice</h3>
                  <p>Khai vị · Món chính · Tráng miệng</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="categories" id="menu">
          <div className="container">
            <div className="section-head">
              <h2>Danh mục nổi bật</h2>
              <p>Chọn nhanh món bạn muốn và đi thẳng tới phần thực đơn liên quan.</p>
            </div>
            <div className="category-row">
              {categories.map((category) => (
                <a key={category.name} href="#menu" className="category-item">
                  <span className="category-icon" aria-hidden="true">
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="signature-section">
          <div className="container">
            <div className="section-head center">
              <h2>Món Ngon Phải Thử</h2>
              <p>Những món được gọi nhiều nhất trong tuần này.</p>
            </div>

            <div className="food-grid">
              {signatureDishes.map((dish) => (
                <article key={dish.id} className={`food-card ${dish.tone}`}>
                  <div className="food-thumb">
                    <span className="food-badge">{dish.badge}</span>
                  </div>
                  <div className="food-body">
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>
                    <div className="food-bottom">
                      <strong>{dish.price}</strong>
                      <button type="button" className="add-btn" onClick={addToCart}>
                        + Thêm
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="booking-banner" id="booking">
          <div className="container booking-inner">
            <div>
              <h2>Bạn muốn có một bữa tối hoàn hảo? Hãy giữ chỗ ngay.</h2>
              <p>Chọn khung giờ đẹp và chúng tôi sẽ chuẩn bị bàn trước khi bạn đến.</p>
            </div>
            <a className="btn btn-light" href="/booking">
              Đặt Bàn Khung Giờ Đẹp
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <div className="container footer-grid">
          <section>
            <a href="#home" className="brand footer-brand" onClick={() => handleNavClick('Trang chủ')}>
              <span className="brand-mark">NH</span>
              <span className="brand-name">Nhà Hàng Nguyên Vị</span>
            </a>
            <p>Không gian ấm cúng, món ăn chỉn chu, dịch vụ thân thiện cho mọi buổi gặp gỡ.</p>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
            </div>
          </section>

          <section>
            <h3>Liên hệ</h3>
            <ul>
              <li>28 Nguyễn Huệ, Q.1, TP. HCM</li>
              <li>
                Hotline: <a href="tel:02812345678">(028) 1234 5678</a>
              </li>
              <li>
                Email: <a href="mailto:hello@nguyenvi.vn">hello@nguyenvi.vn</a>
              </li>
            </ul>
          </section>

          <section>
            <h3>Giờ mở cửa</h3>
            <ul>
              <li>Thứ 2 - Thứ 6: 10:00 - 22:00</li>
              <li>Thứ 7 - Chủ nhật: 08:00 - 22:30</li>
              <li>Nhận đơn online đến 21:45</li>
            </ul>
          </section>
        </div>
      </footer>
    </div>
  )
}

export default App
