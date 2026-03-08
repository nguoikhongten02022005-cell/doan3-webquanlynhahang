function FoodCard({ dish, onAddToCart, onOpenDetail, variant = 'default' }) {
  const canOpenDetail = typeof onOpenDetail === 'function'
  const isMenuVariant = variant === 'menu'
  const hasImage = typeof dish.image === 'string' && dish.image.trim().length > 0

  const handleThumbKeyDown = (event) => {
    if (!canOpenDetail) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenDetail(dish)
    }
  }

  return (
    <article className={`food-card ${dish.tone} ${isMenuVariant ? 'food-card--menu' : ''}`}>
      <div
        className={`food-thumb ${canOpenDetail ? 'is-clickable' : ''} ${isMenuVariant ? 'food-thumb--menu' : ''} ${hasImage ? 'has-image' : 'is-placeholder'}`}
        role={canOpenDetail ? 'button' : undefined}
        tabIndex={canOpenDetail ? 0 : undefined}
        onClick={canOpenDetail ? () => onOpenDetail(dish) : undefined}
        onKeyDown={handleThumbKeyDown}
      >
        {hasImage ? (
          <img className="food-thumb-image" src={dish.image} alt={dish.name} loading="lazy" />
        ) : null}
        <div className="food-thumb-head">
          <span className="food-badge">{dish.badge}</span>
          {isMenuVariant ? <span className="food-thumb-label">{hasImage ? 'Ảnh 4:3' : 'Ảnh món ăn'}</span> : null}
        </div>
        {isMenuVariant && !hasImage ? (
          <div className="food-thumb-art" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v7" />
              <path d="M10 4v7" />
              <path d="M7 8h3" />
              <path d="M14 4c1.4 1.5 2 3 2 4.7V20" />
              <path d="M7 20V11" />
            </svg>
          </div>
        ) : null}
      </div>
      <div className={`food-body ${isMenuVariant ? 'food-body--menu' : ''}`}>
        <div className="food-copy">
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
        </div>
        <div className="food-bottom">
          <strong>{dish.price}</strong>
          <button
            type="button"
            className={`add-btn ${isMenuVariant ? 'add-btn--menu' : ''}`}
            onClick={() => onAddToCart(dish)}
          >
            + Thêm
          </button>
        </div>
      </div>
    </article>
  )
}

export default FoodCard
