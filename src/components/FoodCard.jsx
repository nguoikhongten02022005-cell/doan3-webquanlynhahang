function FoodCard({ dish, onAddToCart }) {
  return (
    <article className={`food-card ${dish.tone}`}>
      <div className="food-thumb">
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
