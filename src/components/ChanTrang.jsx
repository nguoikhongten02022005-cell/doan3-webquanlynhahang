import { Link } from 'react-router-dom'
import { SITE_CONTACT } from '../constants/lienHeTrang'

function ChanTrang() {
  return (
    <footer className="site-footer" id="about">
      <div className="container footer-grid">
        <section className="footer-khoi footer-khoi-thuong-hieu">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">NH</span>
            <span className="brand-name">Nhà Hàng Nguyên Vị</span>
          </Link>
          <p>Không gian ấm cúng, món ăn chỉn chu và nhịp phục vụ vừa vặn cho những buổi gặp gỡ đáng nhớ.</p>
          <div className="social-links" aria-label="Mạng xã hội">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </section>

        <section className="footer-khoi">
          <h3>Liên hệ</h3>
          <ul>
            <li>{SITE_CONTACT.address}</li>
            <li>
              Hotline: <a href={SITE_CONTACT.phoneHref}>{SITE_CONTACT.phoneDisplay}</a>
            </li>
            <li>
              Email: <a href={SITE_CONTACT.emailHref}>{SITE_CONTACT.emailDisplay}</a>
            </li>
          </ul>
        </section>

        <section className="footer-khoi">
          <h3>Giờ mở cửa</h3>
          <ul>
            {SITE_CONTACT.hours.map((item) => (
              <li key={item.label}>{item.label}: {item.value}</li>
            ))}
            <li>{SITE_CONTACT.onlineOrderCutoff}</li>
          </ul>
        </section>
      </div>
    </footer>
  )
}

export default ChanTrang
