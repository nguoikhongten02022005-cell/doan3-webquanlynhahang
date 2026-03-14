import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import FoodDetailModal from '../components/menu/FoodDetailModal'
import { HOME_MENU_CATEGORIES } from '../constants/menuCategories'
import { useCart } from '../context/CartContext'
import { useFoodDetailModal } from '../hooks/useFoodDetailModal'
import { useMenuDishes } from '../hooks/useMenuDishes'
import { getHomeSignatureDishes } from '../services/mappers/menuMappers'

const HOME_CATEGORY_NOTES = {
  'Món Chính': 'Đậm vị, chỉn chu cho bữa chính.',
  'Khai Vị': 'Nhẹ nhàng để mở vị và khởi nhịp bàn ăn.',
  'Đồ Uống': 'Cocktail, trà và thức uống đi cùng món.',
  'Tráng Miệng': 'Một kết thúc mềm và gọn cho bữa tối.',
  Combo: 'Lựa chọn tiện cho cặp đôi và nhóm nhỏ.',
}

const HOME_ATMOSPHERE_NOTES = [
  'Editorial tối giản',
  'Tông kem ấm và nhẹ',
  'Dễ thay ảnh món về sau',
]

function HomePage() {
  const { addToCart } = useCart()
  const { dishes } = useMenuDishes()
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

  const signatureDishes = useMemo(() => getHomeSignatureDishes(dishes), [dishes])

  return (
    <div className="home-page">
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Nhà hàng nguyên vị</p>
            <h1>
              Một homepage
              <br />
              gọn, sang và
              <br />
              đủ chỗ để món ăn
              <br />
              tự kể chuyện.
            </h1>
            <p>
              Từ phần mở đầu đến khu món nổi bật, mọi nhịp trình bày được tiết chế để thực khách nhìn thấy sự chỉn chu ngay từ lần ghé đầu tiên.
            </p>
            <div className="hero-actions-group">
              <Link className="btn btn-primary" to="/booking">
                Đặt bàn ngay
              </Link>
              <Link className="btn btn-ghost" to="/menu">
                Xem thực đơn
              </Link>
            </div>
            <div className="hero-atmosphere" aria-label="Tinh thần trình bày">
              {HOME_ATMOSPHERE_NOTES.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="hero-showcase">
            <article className="hero-card">
              <div className="hero-card-head">
                <span className="hero-tag">Hero visual</span>
                <span className="hero-note-chip">Sẵn sàng thay ảnh món</span>
              </div>

              <div className="hero-art">
                <div className="hero-visual-frame">
                  <div className="hero-visual-copy">
                    <span className="hero-visual-kicker">Khung ảnh signature</span>
                    <strong>Chỉ cần thay ảnh món chủ đạo tại đây.</strong>
                    <span>Giữ bố cục sáng, gọn và đủ sang kể cả khi chưa có ảnh thật.</span>
                  </div>

                  <div className="hero-plate" aria-hidden="true">
                    <span className="hero-food hero-food--protein" />
                    <span className="hero-food hero-food--glaze" />
                    <span className="hero-food hero-food--puree" />
                    <span className="hero-food hero-food--greens" />
                    <span className="hero-food hero-food--accent" />
                  </div>
                </div>
              </div>

              <div className="hero-card-meta">
                <p className="hero-card-overline">Tinh thần trình bày</p>
                <h3>Editorial nhẹ, sang và dễ thay đổi về sau.</h3>
                <p>Giữ phần visual như một frame món chủ đạo để sau này cập nhật ảnh thật mà không cần đụng đến flow hiện tại.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="categories" id="menu">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="section-head-copy">
              <p className="eyebrow">Đi nhanh vào thực đơn</p>
              <h2>Danh mục nổi bật</h2>
            </div>
            <p className="section-head-description">Những nhóm món được sắp gọn để người xem chọn nhanh phần mình quan tâm và tiếp tục đi sâu vào menu.</p>
          </div>

          <div className="category-row">
            {HOME_MENU_CATEGORIES.map((category, index) => (
              <Link key={category.name} to="/menu" className="category-item">
                <span className="category-index">0{index + 1}</span>
                <span className="category-icon" aria-hidden="true">
                  {category.icon}
                </span>
                <span className="category-copy">
                  <strong>{category.name}</strong>
                  <small>{HOME_CATEGORY_NOTES[category.name]}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="signature-section">
        <div className="container">
          <div className="section-head section-head--split signature-head">
            <div className="section-head-copy">
              <p className="eyebrow">Chef&apos;s picks</p>
              <h2>Món Ngon Phải Thử</h2>
            </div>
            <div className="signature-intro">
              <p>Những món được gọi nhiều nhất trong tuần, giữ nguyên đầy đủ thao tác xem chi tiết và thêm món như luồng hiện tại.</p>
              <Link className="signature-link" to="/menu">
                Xem toàn bộ thực đơn
              </Link>
            </div>
          </div>

          <div className="food-grid">
            {signatureDishes.map((dish) => (
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
          <div className="booking-copy">
            <p className="eyebrow">Đặt bàn tinh gọn</p>
            <h2>Giữ một góc bàn đẹp cho buổi hẹn tối nay.</h2>
            <p>Chọn khung giờ phù hợp và để đội ngũ chuẩn bị sẵn không gian vừa vặn cho cuộc gặp của bạn.</p>
            <div className="booking-points" aria-label="Điểm nổi bật đặt bàn">
              <span>Khung giờ rõ ràng</span>
              <span>Xác nhận nhanh</span>
              <span>Phù hợp cặp đôi và nhóm nhỏ</span>
            </div>
          </div>

          <div className="booking-cta">
            <Link className="btn btn-light" to="/booking">
              Giữ bàn cho tối nay
            </Link>
            <span>Mở form đặt bàn chỉ trong vài bước.</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
