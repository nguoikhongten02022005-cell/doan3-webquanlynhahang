import { useMemo, useState } from 'react'
import { Alert, Button, Card, Flex, Space, Typography } from 'antd'
import { DANH_SACH_MON } from '../../thucDon/mocks/duLieuThucDon'
import { HOME_CAC_DANH_MUC_THUC_DON } from '../../thucDon/constants/danhMucThucDon'
import { layAnhMonTheoTen } from '../../thucDon/constants/anhMonAn'
import TheMonAn from '../../thucDon/components/TheMonAn'

const ALL_CATEGORIES = ['Tất cả', ...HOME_CAC_DANH_MUC_THUC_DON.map((c) => c.name)]

function BuocHaiChonMon({ selectedMenuItems = [], onToggleItem, onClearAll, onSkip }) {
  const [danhMucDangChon, setActiveCategory] = useState('Món Chính')

  const menuItemsMap = useMemo(() => {
    return selectedMenuItems.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  }, [selectedMenuItems])

  const tinhTongTien = () => {
    return selectedMenuItems.reduce((tong, item) => {
      const giaTri = Number(String(item.price).replace(/\D/g, '')) || 0
      return tong + giaTri * (item.quantity || 1)
    }, 0)
  }

  const dinhDangTien = (so) => new Intl.NumberFormat('vi-VN').format(so)

  const soMon = selectedMenuItems.length
  const tongTien = tinhTongTien()

  const danhSachMonDaLoc = useMemo(() => {
    if (danhMucDangChon === 'Tất cả') return DANH_SACH_MON
    return DANH_SACH_MON.filter((mon) => mon.category === danhMucDangChon)
  }, [danhMucDangChon])

  const handleQuantityChange = (mon, newQuantity) => {
    if (newQuantity <= 0) {
      if (menuItemsMap[mon.id]) {
        onToggleItem({ ...mon, quantity: 0 })
      }
      return
    }
    onToggleItem({ ...mon, quantity: newQuantity })
  }

  const handleRemoveItem = (mon) => {
    onToggleItem({ ...mon, quantity: 0 })
  }

  const soLuongHienThi = danhMucDangChon === 'Tất cả'
    ? DANH_SACH_MON.length
    : danhSachMonDaLoc.length

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Flex justify="space-between" align="center" wrap>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Chọn món trước (Tuỳ chọn)
            </Typography.Title>
            <Typography.Text type="secondary">
              Đặt trước món giúp nhà hàng chuẩn bị tốt hơn và tiết kiệm thời gian khi bạn đến.
            </Typography.Text>
          </div>
          {soMon > 0 && (
            <Button danger size="small" onClick={onClearAll}>
              Xoá tất cả
            </Button>
          )}
        </Flex>
      </Card>

      {soMon > 0 && (
        <Alert
          type="success"
          showIcon
          message={`Đã chọn ${soMon} món · Tạm tính ${dinhDangTien(tongTien)}đ`}
        />
      )}

      <div className="buoc-hai-layout">
        <div className="buoc-hai-main">
          <div className="buoc-hai-tabs" role="tablist" aria-label="Danh mục món ăn">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={danhMucDangChon === cat}
                className={`buoc-hai-tab ${danhMucDangChon === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="buoc-hai-selected-bar">
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {soMon > 0
                ? `${soMon} món đã chọn · ${dinhDangTien(tongTien)}đ`
                : 'Chưa chọn món nào — nhấn [+] để thêm'}
            </Typography.Text>
            {soMon > 0 && (
              <Flex gap={8} wrap>
                {selectedMenuItems.slice(0, 4).map((item) => (
                  <Flex
                    key={item.id}
                    align="center"
                    gap={4}
                    style={{
                      background: '#fffaf4',
                      border: '1px solid #e8664a',
                      borderRadius: 999,
                      padding: '2px 8px 2px 6px',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e8664a' }}>
                      {item.quantity}×
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        maxWidth: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#6b6b6b',
                      }}
                    >
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#e8664a',
                        fontSize: 14,
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                        marginLeft: 2,
                      }}
                      aria-label={`Xoá ${item.name}`}
                    >
                      ×
                    </button>
                  </Flex>
                ))}
                {soMon > 4 && (
                  <span style={{ fontSize: 12, color: '#999', alignSelf: 'center' }}>
                    +{soMon - 4} món khác
                  </span>
                )}
              </Flex>
            )}
          </div>

          <div className="buoc-hai-grid">
            {danhSachMonDaLoc.map((mon) => {
              const item = menuItemsMap[mon.id]
              const quantity = item?.quantity || 0
              const monWithImage = {
                ...mon,
                image: mon.image || layAnhMonTheoTen(mon.name, mon.category),
              }
              return (
                <TheMonAn
                  key={mon.id}
                  dish={monWithImage}
                  variant="menu"
                  selectorMode
                  quantity={quantity}
                  onQuantityChange={(newQty) => handleQuantityChange(mon, newQty)}
                />
              )
            })}
          </div>

          {soLuongHienThi === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>
              <Typography.Text type="secondary">
                Không có món nào trong danh mục này.
              </Typography.Text>
            </div>
          )}
        </div>

        <aside className="buoc-hai-sidebar">
          <Card title={`Món đã chọn (${soMon})`} size="small">
            {soMon === 0 ? (
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Chưa chọn món nào. Nhấn [+] trên thẻ món để thêm vào danh sách.
              </Typography.Text>
            ) : (
              <Flex vertical gap={6} style={{ maxHeight: 240, overflowY: 'auto' }}>
                {selectedMenuItems.map((item) => (
                  <Flex
                    key={item.id}
                    justify="space-between"
                    align="center"
                    wrap
                    style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: 6 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography.Text
                        strong
                        style={{ fontSize: 13, display: 'block' }}
                        ellipsis
                      >
                        {item.name}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {item.quantity} × {item.price}
                      </Typography.Text>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => handleRemoveItem(item)}
                      aria-label={`Xoá ${item.name}`}
                    >
                      ×
                    </button>
                  </Flex>
                ))}
              </Flex>
            )}

            {soMon > 0 && (
              <div
                style={{
                  borderTop: '1px solid #f0f0f0',
                  marginTop: 12,
                  paddingTop: 12,
                }}
              >
                <Flex justify="space-between" align="center">
                  <Typography.Text strong>Tạm tính</Typography.Text>
                  <Typography.Text strong style={{ color: '#e8664a' }}>
                    {dinhDangTien(tongTien)}đ
                  </Typography.Text>
                </Flex>
              </div>
            )}
          </Card>

          <Card size="small">
            <Flex vertical gap={8}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Bạn có thể thay đổi số lượng món sau khi chọn bàn tại bước xác nhận.
              </Typography.Text>
              <Button
                type="primary"
                size="large"
                onClick={onSkip}
                style={{
                  backgroundColor: soMon > 0 ? '#6b6b6b' : '#e8664a',
                  borderColor: soMon > 0 ? '#6b6b6b' : '#e8664a',
                  fontWeight: soMon > 0 ? 'normal' : 'bold',
                }}
              >
                {soMon > 0 ? 'Bỏ qua & Tiếp tục' : 'Bỏ qua bước này'}
              </Button>
            </Flex>
          </Card>
        </aside>
      </div>
    </Space>
  )
}

export default BuocHaiChonMon