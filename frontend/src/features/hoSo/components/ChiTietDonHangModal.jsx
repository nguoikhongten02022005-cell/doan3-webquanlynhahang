import { Button, Card, Divider, List, Modal, Space, Tag, Typography } from 'antd'
import { dinhDangNgay } from '../../noiBo/dinhDang'
import { dinhDangTienTeVietNam } from '../../../utils/tienTe'

const { Paragraph, Text, Title } = Typography

const NHAN_TRANG_THAI = {
  Pending: { label: 'Chờ xác nhận', mau: 'gold' },
  Confirmed: { label: 'Đã xác nhận', mau: 'green' },
  Preparing: { label: 'Đang chuẩn bị', mau: 'processing' },
  Ready: { label: 'Sẵn sàng lấy', mau: 'cyan' },
  Served: { label: 'Đang giao', mau: 'blue' },
  Paid: { label: 'Hoàn thành', mau: 'default' },
  Cancelled: { label: 'Đã hủy', mau: 'red' },
}

function ChiTietDonHangModal({ donHang, dangMo, onClose }) {
  if (!dangMo || !donHang) {
    return null
  }

  const nhanTrangThai = NHAN_TRANG_THAI[donHang.trangThai] || {
    label: donHang.statusLabel || donHang.trangThai,
    mau: 'default',
  }
  const danhSachMon = donHang.danhSachMon || donHang.items || []
  const maDonHang = donHang.maDonHang || donHang.orderCode
  const thoiGianDon = donHang.ngayTao || donHang.date
  const gioDon = donHang.gioGiao || donHang.gioLayHang || donHang.time || ''
  const tongTien = donHang.tongTien || donHang.total || 0

  return (
    <Modal
      open={dangMo}
      onCancel={onClose}
      footer={[
        <Button key="dong" onClick={onClose} size="large">
          Đóng
        </Button>,
      ]}
      width={760}
      centered
      destroyOnClose
      title={null}
      styles={{
        body: {
          paddingTop: 8,
        },
      }}
    >
      <Space orientation="vertical" size={20} style={{ width: '100%' }}>
        <div>
          <Tag color={nhanTrangThai.mau} style={{ marginBottom: 12, borderRadius: 999, paddingInline: 10, paddingBlock: 4 }}>
            {nhanTrangThai.label}
          </Tag>
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết đơn {maDonHang}
          </Title>
          <Text type="secondary">
            {dinhDangNgay(thoiGianDon)}
            {gioDon ? ` • ${gioDon}` : ''}
          </Text>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <Card size="small" bordered style={{ borderRadius: 16 }}>
            <Text type="secondary">Số món</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>
              {danhSachMon.length} món
            </Title>
          </Card>

          <Card size="small" bordered style={{ borderRadius: 16 }}>
            <Text type="secondary">Tổng tiền</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>
              {dinhDangTienTeVietNam(tongTien)}
            </Title>
          </Card>
        </div>

        <Divider style={{ margin: 0 }} />

        <List
          dataSource={danhSachMon}
          locale={{ emptyText: 'Chưa có món nào trong đơn hàng.' }}
          renderItem={(mon, chiSo) => {
            const tenMon = mon.tenMon || mon.name
            const soLuong = mon.soLuong || mon.quantity || 0
            const thanhTien = mon.thanhTien || mon.donGia || mon.price || 0

            return (
              <List.Item
                key={mon.id || `${tenMon}-${chiSo}`}
                style={{
                  padding: 16,
                  marginBottom: 12,
                  border: '1px solid rgba(5, 5, 5, 0.08)',
                  borderRadius: 16,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <Title level={5} style={{ margin: 0, marginBottom: 6 }}>
                        {tenMon}
                      </Title>
                      <Paragraph type="secondary" style={{ margin: 0 }}>
                        Số lượng: {soLuong}
                      </Paragraph>
                    </div>
                    <Text strong style={{ fontSize: 20, whiteSpace: 'nowrap' }}>
                      {dinhDangTienTeVietNam(thanhTien)}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )
          }}
        />
      </Space>
    </Modal>
  )
}

export default ChiTietDonHangModal
