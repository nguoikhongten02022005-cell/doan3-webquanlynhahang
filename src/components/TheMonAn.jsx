import { Card, Flex, Tag, Typography } from 'antd'

const { Meta } = Card

function TheMonAn({ dish, onOpenDetail, variant = 'default' }) {
  const canOpenDetail = typeof onOpenDetail === 'function'
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

  const phanAnh = hasImage ? (
    <div className={`the-mon-cover ${isMenuVariant ? 'the-mon-cover--menu' : ''}`}>
      <img className="the-mon-cover-image" src={safeDish.image} alt={dishName} loading="lazy" />
      <div className="the-mon-cover-head">
        <Tag bordered={false} color="default" className="the-mon-badge">
          {dishBadge}
        </Tag>
      </div>
    </div>
  ) : (
    <div className={`the-mon-cover the-mon-cover--placeholder ${isMenuVariant ? 'the-mon-cover--menu' : ''}`}>
      <div className="the-mon-cover-head">
        <Tag bordered={false} color="default" className="the-mon-badge">
          {dishBadge}
        </Tag>
      </div>
      <div className="the-mon-cover-placeholder-copy">
        <Typography.Title level={4}>{dishName}</Typography.Title>
        <Typography.Paragraph>{dishDescription}</Typography.Paragraph>
      </div>
    </div>
  )

  return (
    <Card
      hoverable={canOpenDetail}
      className={`the-mon ${safeDish.tone || ''} ${isMenuVariant ? 'the-mon--menu' : ''}`}
      cover={phanAnh}
    >
      <Meta
        title={<Typography.Text strong className="the-mon-title">{dishName}</Typography.Text>}
        description={
          <Flex vertical gap={12}>
            <Typography.Paragraph className="the-mon-description">{dishDescription}</Typography.Paragraph>
            <div className="chan-mon">
              <Typography.Text className="gia-mon price" strong>
                {dishPrice}
              </Typography.Text>
            </div>
          </Flex>
        }
        className="the-mon-meta"
      />
    </Card>
  )
}

export default TheMonAn
