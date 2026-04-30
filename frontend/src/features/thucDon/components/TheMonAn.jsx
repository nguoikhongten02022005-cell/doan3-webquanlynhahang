import { Card, Flex, Tag, Typography } from 'antd'

const { Meta } = Card

function TheMonAn({
  dish,
  onOpenDetail,
  onAction,
  actionLabel = '',
  actionDisabled = false,
  variant = 'default',
  selectorMode = false,
  quantity = 0,
  onQuantityChange,
}) {
  const canOpenDetail = typeof onOpenDetail === 'function'
  const canAction = typeof onAction === 'function'
  const isMenuVariant = variant === 'menu'
  const safeDish = dish || {}
  const hasImage = typeof safeDish.image === 'string' && safeDish.image.trim().length > 0
  const dishName = safeDish.name || 'Món được chọn'
  const dishDescription = safeDish.description || 'Món ăn đang được hoàn thiện mô tả để bạn xem nhanh và chọn tiếp dễ hơn.'
  const dishPrice = safeDish.price || 'Liên hệ nhà hàng'
  const dishBadge = safeDish.badge || 'Tuyển chọn'

  const xuLyMoChiTiet = () => {
    if (canOpenDetail) {
      onOpenDetail(safeDish)
    }
  }

  const xuLyHanhDong = (event) => {
    event.stopPropagation()
    if (canAction) {
      onAction(safeDish)
    }
  }

  const phanAnh = hasImage ? (
    <div className={`the-mon-cover ${isMenuVariant ? 'the-mon-cover--menu' : ''}`}>
      <img className="the-mon-cover-image" src={safeDish.image} alt={dishName} loading="lazy" />
      <div className="the-mon-cover-head">
        <Tag variant="filled" color="default" className="the-mon-badge">
          {dishBadge}
        </Tag>
      </div>
    </div>
  ) : (
    <div className={`the-mon-cover the-mon-cover--placeholder ${isMenuVariant ? 'the-mon-cover--menu' : ''}`}>
      <div className="the-mon-cover-head">
        <Tag variant="filled" color="default" className="the-mon-badge">
          {dishBadge}
        </Tag>
      </div>
      <div className="the-mon-cover-placeholder-copy">
        <Typography.Title level={4}>{dishName}</Typography.Title>
        <Typography.Paragraph>{dishDescription}</Typography.Paragraph>
      </div>
    </div>
  )

  const noiDungChanMon = selectorMode ? (
    <div className="chan-mon chan-mon--selector">
      <Typography.Text className="gia-mon price" strong>
        {dishPrice}
      </Typography.Text>
      <div className="bo-chon-so-luong">
        <button
          type="button"
          className="btn btn-giam"
          onClick={(e) => { e.stopPropagation(); onQuantityChange?.(Math.max(0, quantity - 1)) }}
          disabled={quantity <= 0}
          aria-label="Giảm số lượng"
        >
          −
        </button>
        <span className="so-luong-hien-thi">{quantity}</span>
        <button
          type="button"
          className="btn btn-tang"
          onClick={(e) => { e.stopPropagation(); onQuantityChange?.(quantity + 1) }}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>
    </div>
  ) : (
    <div className="chan-mon">
      <Typography.Text className="gia-mon price" strong>
        {dishPrice}
      </Typography.Text>
      {canAction ? (
        <button
          type="button"
          className="btn nut-chinh nut-them-mon--menu"
          onClick={xuLyHanhDong}
          disabled={actionDisabled}
        >
          {actionLabel || 'Thêm vào giỏ'}
        </button>
      ) : null}
    </div>
  )

  return (
    <Card
      hoverable={canOpenDetail}
      className={`the-mon ${safeDish.tone || ''} ${isMenuVariant ? 'the-mon--menu' : ''} ${selectorMode ? 'the-mon--selector' : ''}`}
      cover={phanAnh}
      onClick={selectorMode ? undefined : (canOpenDetail ? xuLyMoChiTiet : undefined)}
    >
      <Meta
        title={
          <Typography.Text
            strong
            className="the-mon-title"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {dishName}
          </Typography.Text>
        }
        description={
          <Flex vertical gap={12}>
            <Typography.Paragraph
              className="the-mon-description"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: 0,
              }}
            >
              {dishDescription}
            </Typography.Paragraph>
            {noiDungChanMon}
          </Flex>
        }
        className="the-mon-meta"
      />
    </Card>
  )
}

export default TheMonAn
