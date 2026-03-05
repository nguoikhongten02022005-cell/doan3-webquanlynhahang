import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'

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

function HomePage() {
  const handleAddToCart = () => {}

  return (
    <div className="home-page">
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Ẩm thực chuẩn nhà hàng</p>
            <h1>Hương vị nguyên bản, trải nghiệm trọn vẹn.</h1>
            <p>
              Từ nguyên liệu tuyển chọn đến cách trình bày tinh gọn, mỗi món ăn được hoàn thiện để bạn có một bữa ăn ngon đúng nghĩa.
            </p>
            <div className="hero-actions-group">
              <Link className="btn btn-primary" to="/menu">
                Xem Thực Đơn
              </Link>
              <Link className="btn btn-ghost" to="/booking">
                Đặt Bàn Ngay
              </Link>
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
              <Link key={category.name} to="/menu" className="category-item">
                <span className="category-icon" aria-hidden="true">
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </Link>
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
              <FoodCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} />
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
          <Link className="btn btn-light" to="/booking">
            Đặt Bàn Khung Giờ Đẹp
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
