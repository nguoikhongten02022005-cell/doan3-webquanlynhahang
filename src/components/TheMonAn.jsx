function TheMonAn({ dish, xuLyThemVaoGio, onOpenDetail, variant = 'default' }) {
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
    <article className={`the-mon ${safeDish.tone || ''} ${isMenuVariant ? 'the-mon--menu' : ''}`}>
      <div
        className={`the-mon-hinh ${canOpenDetail ? 'is-clickable' : ''} ${isMenuVariant ? 'the-mon-hinh--menu' : ''} ${hasImage ? 'has-image' : 'is-placeholder'}`}
        role={canOpenDetail ? 'button' : undefined}
        tabIndex={canOpenDetail ? 0 : undefined}
        onClick={canOpenDetail ? () => onOpenDetail(safeDish) : undefined}
        onKeyDown={handleThumbKeyDown}
      >
        {hasImage ? (
          <img className="the-mon-hinh-image" src={safeDish.image} alt={safeDish.name || 'Món ăn'} loading="lazy" />
        ) : null}

        <div className="the-mon-hinh-overlay" aria-hidden="true" />

        <div className="the-mon-hinh-head">
          <span className="nhan-mon">{safeDish.badge || 'Tuyển chọn'}</span>
          {isMenuVariant ? <span className="the-mon-hinh-label">{hasImage ? 'Xem chi tiết' : 'Chỗ ảnh món'}</span> : null}
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
              <strong>Ảnh món sẽ hiển thị tại đây</strong>
              <span>Giữ `dish.image` để thay ảnh thật khi cần.</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className={`than-mon ${isMenuVariant ? 'than-mon--menu' : ''}`}>
        <div className="noi-dung-mon">
          <h3>{safeDish.name}</h3>
          <p>{safeDish.description}</p>
        </div>
        <div className="chan-mon">
          <strong className="gia-mon">{safeDish.price}</strong>
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
