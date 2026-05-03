import { useMemo, useState } from 'react'
import { Alert, Button, Card, Flex, Space, Typography } from 'antd'
import { useDanhSachMonAn } from '../../thucDon/hooks/useDanhSachMonAn'
import { HOME_CAC_DANH_MUC_THUC_DON } from '../../thucDon/constants/danhMucThucDon'
import { layAnhMonTheoTen } from '../../thucDon/constants/anhMonAn'
import TheMonAn from '../../thucDon/components/TheMonAn'

const ALL_CATEGORIES = ['Tất cả', ...HOME_CAC_DANH_MUC_THUC_DON.map((c) => c.name)]

const layIconTheoDanhMuc = (danhMuc) => {
  const muc = HOME_CAC_DANH_MUC_THUC_DON.find((c) => c.name === danhMuc)
  return muc?.icon || '🍽️'
}

function BuocHaiChonMon({ selectedMenuItems = [], onToggleItem, onClearAll }) {
  const [danhMucDangChon, setActiveCategory] = useState('Món Chính')

  const { dishes: DANH_SACH_MON, error, daTaiLanDau } = useDanhSachMonAn()

  const menuItemsMap = useMemo(() => {
    return selectedMenuItems.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  }, [selectedMenuItems])

  const soMon = selectedMenuItems.length

  const danhSachMonDaLoc = useMemo(() => {
    if (danhMucDangChon === 'Tất cả') return DANH_SACH_MON
    return DANH_SACH_MON.filter((mon) => mon.category === danhMucDangChon)
  }, [danhMucDangChon, DANH_SACH_MON])

  const handleQuantityChange = (mon, newQuantity) => {
    if (newQuantity <= 0) {
      if (menuItemsMap[mon.id]) {
        onToggleItem({ ...mon, quantity: 0 })
      }
      return
    }
    onToggleItem({ ...mon, quantity: newQuantity })
  }

  const soLuongHienThi = danhMucDangChon === 'Tất cả'
    ? DANH_SACH_MON.length
    : danhSachMonDaLoc.length

  if (!daTaiLanDau) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 400 }}>
        <Typography.Text type="secondary">Đang tải thực đơn...</Typography.Text>
      </Flex>
    )
  }

  if (error) {
    return (
      <Alert type="error" message={error} showIcon />
    )
  }

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

        <div className="thuc-don-tabs-row" role="tablist" aria-label="Danh mục món ăn">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={danhMucDangChon === cat}
              className={`thuc-don-tab ${danhMucDangChon === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="thuc-don-tab-icon" aria-hidden="true">
                {cat === 'Tất cả' ? '🍽️' : layIconTheoDanhMuc(cat)}
              </span>
              <span className="thuc-don-tab-copy">
                <strong>{cat}</strong>
              </span>
            </button>
          ))}
        </div>

        <div className="thuc-don-grid buoc-hai-grid">
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
      </Space>
  )
}

export default BuocHaiChonMon