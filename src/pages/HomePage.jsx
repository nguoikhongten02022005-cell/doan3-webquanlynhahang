import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import FoodDetailModal from '../components/menu/FoodDetailModal'
import { useCart } from '../context/CartContext'
import { HOME_CATEGORIES, HOME_SIGNATURE_DISHES } from '../data/menuData'
import { useFoodDetailModal } from '../hooks/useFoodDetailModal'

function HomePage() {
  const { addToCart } = useCart()
  const {
    closeDetailModal,
    detailPrice,
    handleAddConfiguredDish,
    handleAddToCart,
    handleToggleTopping,
    isDetailOpen,
    openDetailModal,
    selectedDish,
    selectedSize,
    selectedSurcharge,
    selectedToppings,
    setSelectedSize,
    setSpecialNote,
    specialNote,
  } = useFoodDetailModal({ addToCart })

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
              <span className="hero-tag">Signature Plate</span>
              <div className="hero-art">
                <div className="hero-plate">
                  <span className="hero-food hero-food--protein" />
                  <span className="hero-food hero-food--glaze" />
                  <span className="hero-food hero-food--puree" />
                  <span className="hero-food hero-food--greens" />
                  <span className="hero-food hero-food--accent" />
                </div>
                <div className="hero-art-note">
                  <strong>Bò nướng tảng</strong>
                  <span>Sốt tiêu xanh · Khoai mịn · Rau nướng</span>
                </div>
              </div>
              <div className="hero-card-meta">
                <h3>Chef&apos;s signature cho buổi tối</h3>
                <p>Thịt nướng mọng vị, hoàn thiện cùng sốt đậm đà và phần ăn được plating chỉn chu.</p>
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
            {HOME_CATEGORIES.map((category) => (
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
            {HOME_SIGNATURE_DISHES.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} onOpenDetail={openDetailModal} variant="menu" />
            ))}
          </div>
        </div>
      </section>

      <FoodDetailModal
        detailPrice={detailPrice}
        isOpen={isDetailOpen}
        onAddToCart={handleAddConfiguredDish}
        onClose={closeDetailModal}
        onSelectSize={setSelectedSize}
        onSpecialNoteChange={setSpecialNote}
        onToggleTopping={handleToggleTopping}
        scope="home"
        selectedDish={selectedDish}
        selectedSize={selectedSize}
        selectedSurcharge={selectedSurcharge}
        selectedToppings={selectedToppings}
        specialNote={specialNote}
      />

      <section className="booking-banner" id="booking">
        <div className="container booking-inner">
          <div>
            <h2>Bạn muốn có một bữa tối hoàn hảo? Hãy giữ chỗ ngay.</h2>
            <p>Chọn khung giờ đẹp và chúng tôi sẽ chuẩn bị bàn trước khi bạn đến.</p>
          </div>
          <Link className="btn btn-light" to="/booking">
            Đặt Bàn Cho Tối Nay
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
