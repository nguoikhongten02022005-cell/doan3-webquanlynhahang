import { formatCurrency } from '../utils/currency'
import { parsePriceToNumber } from '../utils/price'

function DishDetailModal({
  isOpen,
  dish,
  titleId,
  sizeName,
  sizeOptions,
  selectedSize,
  selectedToppings,
  specialNote,
  toppingOptions,
  onClose,
  onSizeChange,
  onToggleTopping,
  onSpecialNoteChange,
  onAddToCart,
}) {
  if (!isOpen || !dish) {
    return null
  }

  const selectedOption = sizeOptions.find((option) => option.value === selectedSize)
  const selectedSurcharge = selectedOption ? selectedOption.surcharge : 0
  const totalPrice = parsePriceToNumber(dish.price) + selectedSurcharge

  return (
    <div className="food-detail-modal-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={onClose}>
      <div className="food-detail-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="food-detail-close" onClick={onClose} aria-label="Đóng chi tiết món">
          ×
        </button>

        <div className={`food-detail-hero ${dish.tone}`}>
          <div className="food-detail-hero-copy">
            <span className="food-badge">{dish.badge}</span>
            <p className="food-detail-kicker">Chef&apos;s note</p>
            <h3 id={titleId}>{dish.name}</h3>
            <p>{dish.description}</p>
          </div>
          <div className="food-detail-hero-price">
            <span>Giá gốc</span>
            <strong>{formatCurrency(parsePriceToNumber(dish.price))}</strong>
          </div>
        </div>

        <div className="food-detail-content">
          <div className="food-detail-grid">
            <div className="food-detail-group">
              <p className="food-detail-group-title">Chọn size</p>
              <div className="food-detail-options two-columns">
                {sizeOptions.map((option) => (
                  <label key={option.value} className="food-detail-option food-detail-option-rich">
                    <input
                      type="radio"
                      name={sizeName}
                      value={option.value}
                      checked={selectedSize === option.value}
                      onChange={(event) => onSizeChange(event.target.value)}
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
                  <label key={topping} className="food-detail-option food-detail-option-rich">
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(topping)}
                      onChange={() => onToggleTopping(topping)}
                    />
                    <span>{topping}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="food-detail-group">
            <label className="food-detail-group-title" htmlFor={`${sizeName}-special-note`}>
              Ghi chú món
            </label>
            <textarea
              id={`${sizeName}-special-note`}
              className="form-textarea food-detail-note"
              rows="3"
              maxLength="120"
              placeholder="Ví dụ: ít cay, không hành..."
              value={specialNote}
              onChange={(event) => onSpecialNoteChange(event.target.value)}
            />
          </div>

          <div className="food-detail-actions">
            <div className="food-detail-total-wrap">
              <span>Tạm tính món</span>
              <strong>{formatCurrency(totalPrice)}</strong>
              {selectedSurcharge > 0 && <small>Đã gồm phụ thu size {formatCurrency(selectedSurcharge)}</small>}
            </div>
            <button type="button" className="btn btn-primary" onClick={onAddToCart}>
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DishDetailModal
