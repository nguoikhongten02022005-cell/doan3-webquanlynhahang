import { useMemo, useState } from 'react'
import FoodCard from '../components/FoodCard'
import FoodDetailModal from '../components/menu/FoodDetailModal'
import { useCart } from '../context/CartContext'
import {
  MENU_CATEGORIES,
  MENU_CATEGORY_DESCRIPTIONS,
  MENU_SORT_OPTIONS,
} from '../data/menuData'
import { useFoodDetailModal } from '../hooks/useFoodDetailModal'
import { useMenuDishes } from '../hooks/useMenuDishes'
import { parsePriceToNumber } from '../utils/price'

function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [sortOption, setSortOption] = useState('featured')
  const { dishes } = useMenuDishes()
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

  const categoryCounts = useMemo(
    () => MENU_CATEGORIES.reduce((counts, category) => {
      counts[category] = category === 'Tất cả'
        ? dishes.length
        : dishes.filter((dish) => dish.category === category).length
      return counts
    }, {}),
    [dishes],
  )

  const filteredDishes = useMemo(
    () => dishes
      .filter((dish) => {
        const matchesCategory = activeCategory === 'Tất cả' || dish.category === activeCategory
        const normalizedQuery = searchQuery.toLowerCase()
        const matchesSearch = dish.name.toLowerCase().includes(normalizedQuery)
          || dish.description.toLowerCase().includes(normalizedQuery)
        return matchesCategory && matchesSearch
      })
      .sort((firstDish, secondDish) => {
        if (sortOption === 'price-asc') {
          return parsePriceToNumber(firstDish.price) - parsePriceToNumber(secondDish.price)
        }

        if (sortOption === 'price-desc') {
          return parsePriceToNumber(secondDish.price) - parsePriceToNumber(firstDish.price)
        }

        if (sortOption === 'newest') {
          return secondDish.id - firstDish.id
        }

        return 0
      }),
    [activeCategory, dishes, searchQuery, sortOption],
  )

  const activeCategoryLabel = activeCategory === 'Tất cả' ? 'Tất cả danh mục' : activeCategory
  const activeCategoryDescription = MENU_CATEGORY_DESCRIPTIONS[activeCategory] || MENU_CATEGORY_DESCRIPTIONS['Tất cả']
  const searchLabel = searchQuery.trim() ? `· Từ khóa “${searchQuery.trim()}”` : ''

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
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="menu-categories">
              <div className="menu-sidebar-head">
                <h3 className="menu-categories-title">Danh mục</h3>
                <span className="menu-sidebar-count">{MENU_CATEGORIES.length - 1} nhóm món</span>
              </div>
              <div className="menu-category-list">
                {MENU_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`menu-category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span>{category}</span>
                    <small>{categoryCounts[category] ?? 0}</small>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="menu-main">
            <div className="menu-toolbar">
              <div className="menu-toolbar-copy">
                <p className="menu-toolbar-eyebrow">Đang duyệt menu</p>
                <h1 className="menu-toolbar-title">{activeCategoryLabel}</h1>
                <p className="menu-toolbar-summary">
                  {filteredDishes.length} món {searchLabel}
                </p>
                <p className="menu-toolbar-description">{activeCategoryDescription}</p>
              </div>

              <label className="menu-sort" htmlFor="menu-sort-select">
                <span>Sắp xếp</span>
                <select
                  id="menu-sort-select"
                  className="menu-sort-select"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                >
                  {MENU_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filteredDishes.length === 0 ? (
              <div className="menu-empty">
                <p>Không tìm thấy món ăn phù hợp với tìm kiếm của bạn</p>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredDishes.map((dish) => (
                  <FoodCard
                    key={dish.id}
                    dish={dish}
                    variant="menu"
                    onAddToCart={handleAddToCart}
                    onOpenDetail={openDetailModal}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <FoodDetailModal
        detailPrice={detailPrice}
        isOpen={isDetailOpen}
        onAddToCart={handleAddConfiguredDish}
        onClose={closeDetailModal}
        onSelectSize={setSelectedSize}
        onSpecialNoteChange={setSpecialNote}
        onToggleTopping={handleToggleTopping}
        scope="menu"
        selectedDish={selectedDish}
        selectedSize={selectedSize}
        selectedSurcharge={selectedSurcharge}
        selectedToppings={selectedToppings}
        specialNote={specialNote}
      />
    </div>
  )
}

export default MenuPage
