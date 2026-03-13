import { useMemo, useState } from 'react'
import FoodCard from '../components/FoodCard'
import FoodDetailModal from '../components/menu/FoodDetailModal'
import { MENU_ALL_CATEGORY, MENU_CATEGORIES, MENU_CATEGORY_DESCRIPTIONS } from '../constants/menuCategories'
import { MENU_SORT_OPTIONS } from '../constants/menuOptions'
import { useCart } from '../context/CartContext'
import { useFoodDetailModal } from '../hooks/useFoodDetailModal'
import { useMenuDishes } from '../hooks/useMenuDishes'

function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(MENU_ALL_CATEGORY)
  const [sortOption, setSortOption] = useState('featured')
  const {
    dishes,
    loading,
    error,
    reloadDishes,
  } = useMenuDishes()
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

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const categoryCounts = useMemo(
    () => MENU_CATEGORIES.reduce((counts, category) => {
      counts[category] = category === MENU_ALL_CATEGORY
        ? dishes.length
        : dishes.filter((dish) => dish.category === category).length
      return counts
    }, {}),
    [dishes],
  )

  const filteredDishes = useMemo(
    () => dishes
      .filter((dish) => {
        const matchesCategory = activeCategory === MENU_ALL_CATEGORY || dish.category === activeCategory
        const searchableName = String(dish?.name || '').toLowerCase()
        const searchableDescription = String(dish?.description || '').toLowerCase()
        const matchesSearch = !normalizedQuery
          || searchableName.includes(normalizedQuery)
          || searchableDescription.includes(normalizedQuery)
        return matchesCategory && matchesSearch
      })
      .sort((firstDish, secondDish) => {
        if (sortOption === 'price-asc') {
          return (firstDish.priceValue || 0) - (secondDish.priceValue || 0)
        }

        if (sortOption === 'price-desc') {
          return (secondDish.priceValue || 0) - (firstDish.priceValue || 0)
        }

        if (sortOption === 'newest') {
          return (Number(secondDish.id) || 0) - (Number(firstDish.id) || 0)
        }

        return 0
      }),
    [activeCategory, dishes, normalizedQuery, sortOption],
  )

  const hasSourceDishes = dishes.length > 0
  const hasLoadError = Boolean(error)
  const isEmptyState = !loading && !hasLoadError && !hasSourceDishes
  const isNoResultState = !loading && !hasLoadError && hasSourceDishes && filteredDishes.length === 0
  const activeCategoryLabel = activeCategory === MENU_ALL_CATEGORY ? 'Tất cả danh mục' : activeCategory
  const activeCategoryDescription = MENU_CATEGORY_DESCRIPTIONS[activeCategory] || MENU_CATEGORY_DESCRIPTIONS[MENU_ALL_CATEGORY]
  const searchLabel = normalizedQuery ? `· Từ khóa “${searchQuery.trim()}”` : ''

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
                  {loading ? 'Đang tải thực đơn...' : `${filteredDishes.length} món ${searchLabel}`}
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

            {loading ? (
              <div className="menu-empty">
                <p>Đang tải thực đơn...</p>
              </div>
            ) : null}

            {!loading && hasLoadError ? (
              <div className="menu-empty">
                <p>{error}</p>
                <button type="button" className="btn btn-primary" onClick={reloadDishes}>
                  Tải lại
                </button>
              </div>
            ) : null}

            {isEmptyState ? (
              <div className="menu-empty">
                <p>Hiện chưa có món nào trong thực đơn.</p>
              </div>
            ) : null}

            {isNoResultState ? (
              <div className="menu-empty">
                <p>Không tìm thấy món ăn phù hợp với bộ lọc hiện tại.</p>
              </div>
            ) : null}

            {!loading && !hasLoadError && !isEmptyState && !isNoResultState ? (
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
            ) : null}
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
