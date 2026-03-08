import { Link } from 'react-router-dom'
import { SITE_CONTACT } from '../constants/siteContact'

function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="site-footer site-footer-compact" id="about">
        <div className="container footer-compact-bar">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">NH</span>
            <span className="brand-name">Nhà Hàng Nguyên Vị</span>
          </Link>
          <div className="footer-compact-contact">
            <a href={SITE_CONTACT.phoneHref}>{SITE_CONTACT.phoneDisplay}</a>
            <span>{SITE_CONTACT.onlineOrderCutoff}</span>
          </div>
        </div>
      </footer>
    )
  }

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
            <li>{SITE_CONTACT.address}</li>
            <li>
              Hotline: <a href={SITE_CONTACT.phoneHref}>{SITE_CONTACT.phoneDisplay}</a>
            </li>
            <li>
              Email: <a href={SITE_CONTACT.emailHref}>{SITE_CONTACT.emailDisplay}</a>
            </li>
          </ul>
        </section>

        <section>
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

export default Footer
