import { Button, Card, Space, Tag, Typography } from 'antd'

function TheMonAn({ dish, onOpenDetail, variant = 'default' }) {
  const canOpenDetail = typeof onOpenDetail === 'function'
  const isMenuVariant = variant === 'menu'
  const safeDish = dish || {}
  const hasImage = typeof safeDish.image === 'string' && safeDish.image.trim().length > 0
  const dishName = safeDish.name || 'Món được chọn'
  const dishDescription = safeDish.description || 'Món ăn đang được hoàn thiện mô tả để bạn xem nhanh và chọn tiếp dễ hơn.'
  const dishPrice = safeDish.price || 'Liên hệ nhà hàng'
  const dishBadge = safeDish.badge || 'Tuyển chọn'

  return (
    <Card
      hoverable={canOpenDetail}
      className={`the-mon ${safeDish.tone || ''} ${isMenuVariant ? 'the-mon--menu' : ''}`}
      cover={
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
            <Tag className="nhan-mon" variant="filled">{dishBadge}</Tag>
            {isMenuVariant ? <Tag className="the-mon-hinh-label" variant="filled">Xem chi tiết</Tag> : null}
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
      }
    >
      <Space orientation="vertical" size={12} className={`than-mon ${isMenuVariant ? 'than-mon--menu' : ''}`} style={{ width: '100%' }}>
        <div className="noi-dung-mon">
          <Typography.Title level={3} title={dishName}>{dishName}</Typography.Title>
          <Typography.Paragraph title={dishDescription}>{dishDescription}</Typography.Paragraph>
        </div>
        <div className="chan-mon">
          <div className="the-mon-price-block">
            <Typography.Text className="gia-mon price" strong>{dishPrice}</Typography.Text>
          </div>
        </div>
      </Space>
    </Card>
  )
}

export default TheMonAn
