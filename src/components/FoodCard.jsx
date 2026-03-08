function FoodCard({ dish, onAddToCart, onOpenDetail }) {
  const canOpenDetail = typeof onOpenDetail === 'function'

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
    <article className={`food-card ${dish.tone}`}>
      <div
        className={`food-thumb ${canOpenDetail ? 'is-clickable' : ''}`}
        role={canOpenDetail ? 'button' : undefined}
        tabIndex={canOpenDetail ? 0 : undefined}
        onClick={canOpenDetail ? () => onOpenDetail(dish) : undefined}
        onKeyDown={handleThumbKeyDown}
      >
        <span className="food-badge">{dish.badge}</span>
      </div>
      <div className="food-body">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="food-bottom">
          <strong>{dish.price}</strong>
          <button type="button" className="add-btn" onClick={() => onAddToCart(dish)}>
            + Thêm
          </button>
        </div>
      </div>
    </article>
  )
}

export default FoodCard
