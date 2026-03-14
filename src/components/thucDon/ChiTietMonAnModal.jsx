import { CAC_LUA_CHON_KICH_CO_THUC_DON, CAC_LUA_CHON_TOPPING_THUC_DON } from '../../constants/tuyChonThucDon'
import { dinhDangTienTe } from '../../utils/tienTe'
import { phanTichGiaThanhSo } from '../../utils/giaTien'

function ChiTietMonAnModal({
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
  sizeOptions = CAC_LUA_CHON_KICH_CO_THUC_DON,
  specialNote,
  toppingOptions = CAC_LUA_CHON_TOPPING_THUC_DON,
}) {
  if (!isOpen || !selectedDish) {
    return null
  }

  const safeDish = selectedDish || {}
  const titleId = `${scope}-food-detail-title-${safeDish.id}`
  const noteId = `${scope}-special-note`

  return (
    <div className="food-detail-modal-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={onClose}>
      <div className="food-detail-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="food-detail-close" onClick={onClose} aria-label="Đóng chi tiết món">
          ×
        </button>

        <div className={`food-detail-hero ${safeDish.tone || ''}`}>
          {safeDish.image ? (
            <img className="food-detail-hero-image" src={safeDish.image} alt={safeDish.name || 'Món ăn'} loading="lazy" />
          ) : (
            <div className="food-detail-hero-fallback" aria-hidden="true">{safeDish.name?.slice(0, 1) || 'M'}</div>
          )}
          <div className="food-detail-hero-overlay">
            <span className="food-badge">{safeDish.badge}</span>
          </div>
        </div>

        <div className="food-detail-content">
          <h3 id={titleId}>{safeDish.name}</h3>
          <p>{safeDish.description}</p>
          <strong className="food-detail-base-price">Giá gốc: {dinhDangTienTe(phanTichGiaThanhSo(safeDish.price))}</strong>

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
                  <small>{option.surcharge > 0 ? `+${dinhDangTienTe(option.surcharge)}` : 'Giá gốc'}</small>
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
              <strong>{dinhDangTienTe(detailPrice)}</strong>
              {selectedSurcharge > 0 && <small>Đã gồm phụ thu size {dinhDangTienTe(selectedSurcharge)}</small>}
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

export default ChiTietMonAnModal
