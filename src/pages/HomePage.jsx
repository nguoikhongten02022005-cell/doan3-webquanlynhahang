import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/currency'
import { parsePriceToNumber } from '../utils/price'

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
  const [selectedDish, setSelectedDish] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedToppings, setSelectedToppings] = useState([])
  const [specialNote, setSpecialNote] = useState('')
  const { addToCart } = useCart()

  const toppingOptions = ['Thêm phô mai', 'Thêm trứng', 'Sốt đặc biệt']
  const sizeOptions = [
    { value: 'M', label: 'Size M', surcharge: 0 },
    { value: 'L', label: 'Size L', surcharge: 30000 },
  ]

  useEffect(() => {
    if (!isDetailOpen) {
      return
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isDetailOpen])

  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = 'hidden'
      return
    }

    document.body.style.overflow = ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isDetailOpen])

  const getSurchargeBySize = (size) => {
    const selected = sizeOptions.find((option) => option.value === size)
    return selected ? selected.surcharge : 0
  }

  const openDetailModal = (dish) => {
    setSelectedDish(dish)
    setSelectedSize('M')
    setSelectedToppings([])
    setSpecialNote('')
    setIsDetailOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailOpen(false)
    setSelectedDish(null)
  }

  const handleToggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((item) => item !== topping) : [...prev, topping],
    )
  }

  const handleAddToCart = (dish) => {
    addToCart({
      ...dish,
      selectedSize: 'M',
      selectedToppings: [],
      specialNote: '',
    })
    alert(`Đã thêm ${dish.name} vào giỏ`)
  }

  const handleAddConfiguredDish = () => {
    if (!selectedDish) {
      return
    }

    const surcharge = getSurchargeBySize(selectedSize)
    const dishPrice = parsePriceToNumber(selectedDish.price)

    addToCart({
      ...selectedDish,
      price: dishPrice + surcharge,
      selectedSize,
      selectedToppings,
      specialNote,
    })

    alert(`Đã thêm ${selectedDish.name} vào giỏ`)
    closeDetailModal()
  }

  const getDetailPrice = () => {
    if (!selectedDish) {
      return 0
    }

    return parsePriceToNumber(selectedDish.price) + getSurchargeBySize(selectedSize)
  }

  const selectedSurcharge = getSurchargeBySize(selectedSize)
  const detailTitleId = selectedDish ? `home-food-detail-title-${selectedDish.id}` : 'home-food-detail-title'

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
              <FoodCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} onOpenDetail={openDetailModal} variant="menu" />
            ))}
          </div>
        </div>
      </section>

      {isDetailOpen && selectedDish && (
        <div className="food-detail-modal-overlay" role="dialog" aria-modal="true" aria-labelledby={detailTitleId} onClick={closeDetailModal}>
          <div className="food-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="food-detail-close" onClick={closeDetailModal} aria-label="Đóng chi tiết món">
              ×
            </button>

            <div className={`food-detail-hero ${selectedDish.tone}`}>
              <span className="food-badge">{selectedDish.badge}</span>
            </div>

            <div className="food-detail-content">
              <h3 id={detailTitleId}>{selectedDish.name}</h3>
              <p>{selectedDish.description}</p>
              <strong className="food-detail-base-price">Giá gốc: {formatCurrency(parsePriceToNumber(selectedDish.price))}</strong>

              <div className="food-detail-group">
                <p className="food-detail-group-title">Chọn size</p>
                <div className="food-detail-options two-columns">
                  {sizeOptions.map((option) => (
                    <label key={option.value} className="food-detail-option">
                      <input
                        type="radio"
                        name="detail-size-home"
                        value={option.value}
                        checked={selectedSize === option.value}
                        onChange={(event) => setSelectedSize(event.target.value)}
                      />
                      <span>{option.label}</span>
                      <small>{option.surcharge > 0 ? `+${formatCurrency(option.surcharge)}` : 'Giá gốc'}</small>
                    </label>
                  ))}
                </div>
              </div>

              <div className="food-detail-group">
                <p className="food-detail-group-title">Topping thêm</p>
                <div className="food-detail-options">
                  {toppingOptions.map((topping) => (
                    <label key={topping} className="food-detail-option">
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping)}
                        onChange={() => handleToggleTopping(topping)}
                      />
                      <span>{topping}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="food-detail-group">
                <label className="food-detail-group-title" htmlFor="home-special-note">
                  Ghi chú món
                </label>
                <textarea
                  id="home-special-note"
                  className="form-textarea food-detail-note"
                  rows="3"
                  maxLength="120"
                  placeholder="Ví dụ: ít cay, không hành..."
                  value={specialNote}
                  onChange={(event) => setSpecialNote(event.target.value)}
                />
              </div>

              <div className="food-detail-actions">
                <div className="food-detail-total-wrap">
                  <span>Tạm tính món</span>
                  <strong>{formatCurrency(getDetailPrice())}</strong>
                  {selectedSurcharge > 0 && <small>Đã gồm phụ thu size {formatCurrency(selectedSurcharge)}</small>}
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddConfiguredDish}>
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
