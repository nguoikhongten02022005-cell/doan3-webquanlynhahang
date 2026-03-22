function TheMonAn({ dish, xuLyThemVaoGio, onOpenDetail, variant = 'default' }) {
  const canOpenDetail = typeof onOpenDetail === 'function'
  const isMenuVariant = variant === 'menu'
  const safeDish = dish || {}
  const hasImage = typeof safeDish.image === 'string' && safeDish.image.trim().length > 0
  const dishName = safeDish.name || 'Món được chọn'
  const dishDescription = safeDish.description || 'Món ăn đang được hoàn thiện mô tả để bạn xem nhanh và chọn tiếp dễ hơn.'
  const dishPrice = safeDish.price || 'Liên hệ nhà hàng'
  const dishBadge = safeDish.badge || 'Tuyển chọn'

  return (
    <article className={`the-mon ${safeDish.tone || ''} ${isMenuVariant ? 'the-mon--menu' : ''}`}>
      <button
        type="button"
        className={`the-mon-hinh ${canOpenDetail ? 'is-clickable' : ''} ${isMenuVariant ? 'the-mon-hinh--menu' : ''} ${hasImage ? 'has-image' : 'is-placeholder'}`}
        onClick={canOpenDetail ? () => onOpenDetail(safeDish) : undefined}
        disabled={!canOpenDetail}
        aria-label={canOpenDetail ? `Xem chi tiết món ${dishName}` : undefined}
      >
        {hasImage ? (
          <img className="the-mon-hinh-image" src={safeDish.image} alt={dishName} loading="lazy" />
        ) : null}

        <div className="the-mon-hinh-overlay" aria-hidden="true" />

        <div className="the-mon-hinh-head">
          <span className="nhan-mon">{dishBadge}</span>
          {isMenuVariant ? <span className="the-mon-hinh-label">Xem chi tiết</span> : null}
        </div>

        {isMenuVariant && !hasImage ? (
          <div className="the-mon-hinh-art" aria-hidden="true">
            <div className="the-mon-hinh-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4v7" />
                <path d="M10 4v7" />
                <path d="M7 8h3" />
                <path d="M14 4c1.4 1.5 2 3 2 4.7V20" />
                <path d="M7 20V11" />
              </svg>
            </div>
            <div className="the-mon-hinh-placeholder-copy">
              <strong>{dishName}</strong>
              <span>{dishDescription}</span>
            </div>
          </div>
        ) : null}

      </button>

      <div className={`than-mon ${isMenuVariant ? 'than-mon--menu' : ''}`}>
        <div className="noi-dung-mon">
          <h3 title={dishName}>{dishName}</h3>
          <p title={dishDescription}>{dishDescription}</p>
        </div>
        <div className="chan-mon">
          <div className="the-mon-price-block">
            <strong className="gia-mon price">{dishPrice}</strong>
          </div>
          <button
            type="button"
            className={`nut-them-mon ${isMenuVariant ? 'nut-them-mon--menu' : ''}`}
            onClick={() => xuLyThemVaoGio(safeDish)}
          >
            Thêm món
          </button>
        </div>
      </div>
    </article>
  )
}

export default TheMonAn
