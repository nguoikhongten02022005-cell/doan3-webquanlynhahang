import { useState } from 'react'
import FoodCard from '../components/FoodCard'

function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const categories = ['Tất cả', 'Món Chính', 'Khai Vị', 'Đồ Uống', 'Tráng Miệng', 'Combo']

  const allMenuDishes = [
    {
      id: 1,
      name: 'Bò Bít Tết Úc',
      description: 'Thịt bò Úc cao cấp nướng chín vừa, kèm khoai tây nghiền',
      price: '385.000đ',
      category: 'Món Chính',
      badge: 'Best Seller',
      tone: 'tone-red'
    },
    {
      id: 2,
      name: 'Cá Hồi Nướng Teriyaki',
      description: 'Phi lê cá hồi tươi nướng sốt Teriyaki đặc biệt',
      price: '295.000đ',
      category: 'Món Chính',
      badge: 'Healthy',
      tone: 'tone-amber'
    },
    {
      id: 3,
      name: 'Gà Nướng Mật Ong',
      description: 'Đùi gà nướng mật ong thơm ngon, giòn ngoài mềm trong',
      price: '185.000đ',
      category: 'Món Chính',
      badge: 'Popular',
      tone: 'tone-gold'
    },
    {
      id: 4,
      name: 'Mì Ý Hải Sản',
      description: 'Mì Ý sốt kem với tôm, mực, nghêu tươi ngon',
      price: '165.000đ',
      category: 'Món Chính',
      badge: 'New',
      tone: 'tone-cool'
    },
    {
      id: 5,
      name: 'Salad Caesar',
      description: 'Rau xà lách tươi, gà nướng, phô mai Parmesan, sốt Caesar',
      price: '95.000đ',
      category: 'Khai Vị',
      badge: 'Light',
      tone: 'tone-green'
    },
    {
      id: 6,
      name: 'Súp Bí Đỏ',
      description: 'Súp bí đỏ kem mịn, hạt hạnh nhân rang giòn',
      price: '75.000đ',
      category: 'Khai Vị',
      badge: 'Warm',
      tone: 'tone-amber'
    },
    {
      id: 7,
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún',
      price: '65.000đ',
      category: 'Khai Vị',
      badge: 'Fresh',
      tone: 'tone-mint'
    },
    {
      id: 8,
      name: 'Khoai Tây Chiên',
      description: 'Khoai tây chiên giòn rụm, kèm sốt tương ớt',
      price: '55.000đ',
      category: 'Khai Vị',
      badge: 'Classic',
      tone: 'tone-gold'
    },
    {
      id: 9,
      name: 'Trà Đào Cam Sả',
      description: 'Trà đen pha đào tươi, cam và sả thơm mát',
      price: '55.000đ',
      category: 'Đồ Uống',
      badge: 'Signature',
      tone: 'tone-amber'
    },
    {
      id: 10,
      name: 'Sinh Tố Bơ',
      description: 'Sinh tố bơ sánh mịn, béo ngậy tự nhiên',
      price: '45.000đ',
      category: 'Đồ Uống',
      badge: 'Creamy',
      tone: 'tone-green'
    },
    {
      id: 11,
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê phin truyền thống pha sữa đá mát lạnh',
      price: '35.000đ',
      category: 'Đồ Uống',
      badge: 'Classic',
      tone: 'tone-brown'
    },
    {
      id: 12,
      name: 'Nước Ép Dưa Hấu',
      description: 'Nước ép dưa hấu tươi mát, không đường',
      price: '40.000đ',
      category: 'Đồ Uống',
      badge: 'Fresh',
      tone: 'tone-red'
    },
    {
      id: 13,
      name: 'Tiramisu',
      description: 'Bánh Tiramisu Ý truyền thống với cà phê Espresso',
      price: '85.000đ',
      category: 'Tráng Miệng',
      badge: 'Premium',
      tone: 'tone-brown'
    },
    {
      id: 14,
      name: 'Panna Cotta',
      description: 'Bánh Panna Cotta mềm mịn với sốt dâu tây',
      price: '75.000đ',
      category: 'Tráng Miệng',
      badge: 'Sweet',
      tone: 'tone-violet'
    },
    {
      id: 15,
      name: 'Kem Vani',
      description: 'Kem vani tự làm với hạt vani Madagascar',
      price: '55.000đ',
      category: 'Tráng Miệng',
      badge: 'Homemade',
      tone: 'tone-gold'
    },
    {
      id: 16,
      name: 'Combo Gia Đình',
      description: '2 món chính + 2 khai vị + 4 đồ uống + 1 tráng miệng',
      price: '899.000đ',
      category: 'Combo',
      badge: 'Save 20%',
      tone: 'tone-amber'
    },
    {
      id: 17,
      name: 'Combo Couple',
      description: '2 món chính + 1 khai vị + 2 đồ uống',
      price: '499.000đ',
      category: 'Combo',
      badge: 'Romantic',
      tone: 'tone-red'
    },
    {
      id: 18,
      name: 'Combo Solo',
      description: '1 món chính + 1 khai vị + 1 đồ uống',
      price: '249.000đ',
      category: 'Combo',
      badge: 'Value',
      tone: 'tone-cool'
    }
  ]

  const filteredDishes = allMenuDishes.filter((dish) => {
    const matchesCategory = activeCategory === 'Tất cả' || dish.category === activeCategory
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (dish) => {
    console.log('Thêm vào giỏ:', dish)
  }

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu-layout">
          <aside className="menu-sidebar">
            <div className="menu-search">
              <input
                type="text"
                className="menu-search-input"
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="menu-categories">
              <h3 className="menu-categories-title">Danh mục</h3>
              <div className="menu-category-list">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`menu-category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="menu-main">
            {filteredDishes.length === 0 ? (
              <div className="menu-empty">
                <p>Không tìm thấy món ăn phù hợp với tìm kiếm của bạn</p>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredDishes.map((dish) => (
                  <FoodCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default MenuPage
