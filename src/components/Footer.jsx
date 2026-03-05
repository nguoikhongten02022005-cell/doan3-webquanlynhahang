import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="container footer-grid">
        <section>
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">NH</span>
            <span className="brand-name">Nhà Hàng Nguyên Vị</span>
          </Link>
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
  )
}

export default Footer
