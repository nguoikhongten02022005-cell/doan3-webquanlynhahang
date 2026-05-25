import { Link } from 'react-router-dom'
import { List, Typography, Card, Button, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { SITE_CONTACT } from '../../../constants/lienHeTrang'
import { useState } from 'react'

const { Text } = Typography

function DatBanThanhCong({ confirmation }) {
  const [copiedField, setCopiedField] = useState(null)

  const {
    bookingCode,
    dateTimeLabel,
    guests,
    areaLabel,
    phone,
    email,
    selectedMenuItems,
    subtotal,
    depositInfo,
  } = confirmation || {}

  const hasMenuItems = Array.isArray(selectedMenuItems) && selectedMenuItems.length > 0
  const isDepositRequired = depositInfo?.isYeuCauCoc || false
  const soTienCoc = depositInfo?.soTienCoc || 0
  const liDoCoc = depositInfo?.liDo || []

  const dinhDangTien = (so) => new Intl.NumberFormat('vi-VN').format(so)

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const paymentInfo = {
    bankName: 'Vietcombank',
    accountHolder: 'NHA HANG NGUYEN VI',
    accountNumber: '1900100810086',
    transferContent: bookingCode || 'XXXXXXXX',
  }

  return (
    <section className="dat-ban-success-screen dat-ban-customer-card dat-ban-customer-card-soft">
      <div className="dat-ban-success-hero">
        <span className="dat-ban-success-emoji">⏳</span>
        <p className="eyebrow">Gửi yêu cầu thành công</p>
        <h2>Yêu cầu của bạn đã được ghi nhận.</h2>
        <p>
          Vui lòng hoàn tất đặt cọc để hệ thống xác nhận lịch hẹn.
        </p>
      </div>

      <div className="dat-ban-success-ticket">
        <strong>Mã đặt bàn: {bookingCode}</strong>
        <span>📅 {dateTimeLabel}</span>
        <span>👥 {guests} khách • {areaLabel}</span>
      </div>

      {hasMenuItems ? (
        <div className="dat-ban-success-ticket" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <strong>🍽️ Món đã đặt trước</strong>
          <List
            size="small"
            dataSource={selectedMenuItems}
            renderItem={(item) => (
              <List.Item style={{ padding: '2px 0' }}>
                <Text>{item.quantity}x <Text strong>{item.name}</Text></Text>
                <Text type="secondary" style={{ marginLeft: 'auto' }}>{item.price}</Text>
              </List.Item>
            )}
          />
          {subtotal > 0 && (
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Text strong>Tạm tính: <Text strong style={{ color: '#e8664a' }}>{dinhDangTien(subtotal)}đ</Text></Text>
            </div>
          )}
        </div>
      ) : null}

      {isDepositRequired ? (
        <Card
          style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 12 }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ marginBottom: 12 }}>
            <strong>⚠️ Yêu cầu đặt cọc: <span style={{ color: '#d97706' }}>{dinhDangTien(soTienCoc)}đ</span></strong>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>
              Lý do: {liDoCoc.join(' · ')}
            </div>
          </div>

          <Card
            type="inner"
            title={<span style={{ fontSize: 14 }}>📱 Thông tin chuyển khoản</span>}
            style={{ background: '#fff', borderRadius: 8 }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: 100,
                  height: 100,
                  background: '#f5f5f5',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                  fontSize: 11,
                  color: '#999',
                  textAlign: 'center',
                  padding: 8
                }}>
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>📱</div>
                    <div>QR Code</div>
                    <div>placeholder</div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Ngân hàng</Text>
                  <Text strong style={{ fontSize: 14 }}>{paymentInfo.bankName}</Text>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Chủ tài khoản</Text>
                  <Text strong style={{ fontSize: 14 }}>{paymentInfo.accountHolder}</Text>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Số tài khoản</Text>
                  <Space size={4}>
                    <Text strong style={{ fontSize: 14, fontFamily: 'monospace' }}>{paymentInfo.accountNumber}</Text>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(paymentInfo.accountNumber, 'account')}
                      style={{ color: copiedField === 'account' ? '#52c41a' : '#1890ff' }}
                    >
                      {copiedField === 'account' ? 'Đã copy' : 'Copy'}
                    </Button>
                  </Space>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Nội dung chuyển khoản</Text>
                  <Space size={4}>
                    <Text strong style={{ fontSize: 14, color: '#d97706', fontFamily: 'monospace' }}>
                      {paymentInfo.transferContent}
                    </Text>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(paymentInfo.transferContent, 'content')}
                      style={{ color: copiedField === 'content' ? '#52c41a' : '#1890ff' }}
                    >
                      {copiedField === 'content' ? 'Đã copy' : 'Copy'}
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </Card>

          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 12 }}>
            Vui lòng hoàn tất thanh toán cọc để xác nhận đặt bàn. Tiền cọc sẽ được hoàn lại nếu hủy trước 24 giờ.
          </Text>
        </Card>
      ) : null}

      <div className="dat-ban-success-contact-grid">
        <div>
          <span>📱 SMS xác nhận</span>
          <strong>{phone}</strong>
        </div>
        <div>
          <span>📧 Email xác nhận</span>
          <strong>{email}</strong>
        </div>
      </div>

      <div className="dat-ban-success-map-card">
        <div>
          <strong>{SITE_CONTACT.address}</strong>
          <p>{SITE_CONTACT.hours[0].value}</p>
        </div>
        <a className="btn nut-phu" href={SITE_CONTACT.phoneHref}>
          📞 Gọi hotline
        </a>
      </div>

      <div className="dat-ban-success-actions">
        <Link className="btn nut-phu" to="/">🏠 Về trang chủ</Link>
        <Link className="btn nut-chinh" to="/ho-so">📋 Xem lịch sử đặt bàn</Link>
      </div>
    </section>
  )
}

export default DatBanThanhCong
