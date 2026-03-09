import { MENU_SIZE_OPTIONS, MENU_TOPPING_OPTIONS } from '../../data/menuData'
import { formatCurrency } from '../../utils/currency'
import { parsePriceToNumber } from '../../utils/price'

function FoodDetailModal({
  detailPrice,
  isOpen,
  onAddToCart,
  onClose,
  onSelectSize,
  onSpecialNoteChange,
  onToggleTopping,
  scope = 'food',
  selectedDish,
  selectedSize,
  selectedSurcharge,
  selectedToppings,
  sizeOptions = MENU_SIZE_OPTIONS,
  specialNote,
  toppingOptions = MENU_TOPPING_OPTIONS,
}) {
  if (!isOpen || !selectedDish) {
    return null
  }

  const titleId = `${scope}-food-detail-title-${selectedDish.id}`
  const noteId = `${scope}-special-note`

  return (
    <div className="food-detail-modal-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={onClose}>
      <div className="food-detail-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="food-detail-close" onClick={onClose} aria-label="Đóng chi tiết món">
          ×
        </button>

        <div className={`food-detail-hero ${selectedDish.tone}`}>
          <span className="food-badge">{selectedDish.badge}</span>
        </div>

        <div className="food-detail-content">
          <h3 id={titleId}>{selectedDish.name}</h3>
          <p>{selectedDish.description}</p>
          <strong className="food-detail-base-price">Giá gốc: {formatCurrency(parsePriceToNumber(selectedDish.price))}</strong>

          <div className="food-detail-group">
            <p className="food-detail-group-title">Chọn size</p>
            <div className="food-detail-options two-columns">
              {sizeOptions.map((option) => (
                <label key={option.value} className="food-detail-option">
                  <input
                    type="radio"
                    name={`detail-size-${scope}`}
                    value={option.value}
                    checked={selectedSize === option.value}
                    onChange={(event) => onSelectSize(event.target.value)}
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
                    onChange={() => onToggleTopping(topping)}
                  />
                  <span>{topping}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="food-detail-group">
            <label className="food-detail-group-title" htmlFor={noteId}>
              Ghi chú món
            </label>
            <textarea
              id={noteId}
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
              <strong>{formatCurrency(detailPrice)}</strong>
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

export default FoodDetailModal
