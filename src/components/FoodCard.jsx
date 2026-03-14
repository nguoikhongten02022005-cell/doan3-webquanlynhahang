function FoodCard({ dish, onAddToCart, onOpenDetail, variant = 'default' }) {
  const canOpenDetail = typeof onOpenDetail === 'function'
  const isMenuVariant = variant === 'menu'
  const safeDish = dish || {}
  const hasImage = typeof safeDish.image === 'string' && safeDish.image.trim().length > 0

  const handleThumbKeyDown = (event) => {
    if (!canOpenDetail) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenDetail(safeDish)
    }
  }

  return (
    <article className={`food-card ${safeDish.tone || ''} ${isMenuVariant ? 'food-card--menu' : ''}`}>
      <div
        className={`food-thumb ${canOpenDetail ? 'is-clickable' : ''} ${isMenuVariant ? 'food-thumb--menu' : ''} ${hasImage ? 'has-image' : 'is-placeholder'}`}
        role={canOpenDetail ? 'button' : undefined}
        tabIndex={canOpenDetail ? 0 : undefined}
        onClick={canOpenDetail ? () => onOpenDetail(safeDish) : undefined}
        onKeyDown={handleThumbKeyDown}
      >
        {hasImage ? (
          <img className="food-thumb-image" src={safeDish.image} alt={safeDish.name || 'Món ăn'} loading="lazy" />
        ) : null}

        <div className="food-thumb-overlay" aria-hidden="true" />

        <div className="food-thumb-head">
          <span className="food-badge">{safeDish.badge || 'Tuyển chọn'}</span>
          {isMenuVariant ? <span className="food-thumb-label">{hasImage ? 'Xem chi tiết' : 'Chỗ ảnh món'}</span> : null}
        </div>

        {isMenuVariant && !hasImage ? (
          <div className="food-thumb-art" aria-hidden="true">
            <div className="food-thumb-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4v7" />
                <path d="M10 4v7" />
                <path d="M7 8h3" />
                <path d="M14 4c1.4 1.5 2 3 2 4.7V20" />
                <path d="M7 20V11" />
              </svg>
            </div>
            <div className="food-thumb-placeholder-copy">
              <strong>Ảnh món sẽ hiển thị tại đây</strong>
              <span>Giữ `dish.image` để thay ảnh thật khi cần.</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className={`food-body ${isMenuVariant ? 'food-body--menu' : ''}`}>
        <div className="food-copy">
          <h3>{safeDish.name}</h3>
          <p>{safeDish.description}</p>
        </div>
        <div className="food-bottom">
          <strong className="food-price">{safeDish.price}</strong>
          <button
            type="button"
            className={`add-btn ${isMenuVariant ? 'add-btn--menu' : ''}`}
            onClick={() => onAddToCart(safeDish)}
          >
            Thêm món
          </button>
        </div>
      </div>
    </article>
  )
}

export default FoodCard
