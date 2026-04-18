import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Badge, Button, Card, Descriptions, Empty, Grid, Input, List, Segmented, Select, Space, Spin, Table, Tag, Typography } from 'antd'
import { dinhDangTienTe } from '../../../utils/tienTe'
import { dinhDangNgay } from '../dinhDang'
import { layNhanTrangThaiDonHang, layNhanPhuongThucThanhToan } from '../../../utils/donHang'

const { TextArea } = Input
const { useBreakpoint } = Grid

const BO_LOC_DON_HANG = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý', statuses: ['Pending', 'Confirmed'] },
  { key: 'preparing', label: 'Đang chuẩn bị', statuses: ['Preparing'] },
  { key: 'served', label: 'Đã phục vụ', statuses: ['Ready', 'Served'] },
  { key: 'paid', label: 'Đã thanh toán', statuses: ['Paid'] },
  { key: 'cancelled', label: 'Đã hủy', statuses: ['Cancelled'] },
]

const TUY_CHON_TRANG_THAI = [
  { value: 'Pending', label: 'Mới tạo' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Preparing', label: 'Đang chuẩn bị' },
  { value: 'Ready', label: 'Sẵn sàng' },
  { value: 'Served', label: 'Đang phục vụ' },
  { value: 'Paid', label: 'Đã thanh toán' },
  { value: 'Cancelled', label: 'Đã hủy' },
]

const KIEU_THE_TRANG_THAI = {
  Pending: {
    tone: 'pending',
    badge: 'badge-pending',
    hint: 'Cần xác nhận và ưu tiên điều phối bếp.',
  },
  Confirmed: {
    tone: 'pending',
    badge: 'badge-pending',
    hint: 'Đơn đã chốt, chờ bếp nhận lệnh.',
  },
  Preparing: {
    tone: 'preparing',
    badge: 'badge-preparing',
    hint: 'Bếp đang xử lý, ưu tiên theo dõi thời gian ra món.',
  },
  Ready: {
    tone: 'served',
    badge: 'badge-served',
    hint: 'Đơn đã sẵn sàng, chờ phục vụ hoặc giao cho khách.',
  },
  Served: {
    tone: 'served',
    badge: 'badge-served',
    hint: 'Đơn đang phục vụ tại bàn, sẵn sàng chốt thanh toán.',
  },
  Paid: {
    tone: 'paid',
    badge: 'badge-paid',
    hint: 'Đơn đã thanh toán và chốt doanh thu.',
  },
  Cancelled: {
    tone: 'cancelled',
    badge: 'badge-cancelled',
    hint: 'Đơn đã hủy, chỉ giữ lại để tra cứu.',
  },
}

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

const maHoaHtmlIn = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const tinhSoLuongTheoBoLoc = (orders) => BO_LOC_DON_HANG.reduce((acc, filter) => {
  if (filter.key === 'all') {
    acc[filter.key] = orders.length
    return acc
  }

  acc[filter.key] = orders.filter((order) => filter.statuses.includes(order.status)).length
  return acc
}, {})

const khopBoLocDonHang = (order, filterKey) => {
  if (filterKey === 'all') {
    return true
  }

  const filter = BO_LOC_DON_HANG.find((item) => item.key === filterKey)
  return filter ? filter.statuses.includes(order.status) : true
}

const dinhDangNhanBan = (tableNumber) => {
  const normalized = String(tableNumber || '').trim()
  return normalized ? `BÀN ${normalized.toUpperCase()}` : 'BÀN WALK-IN'
}

const dinhDangMaDonHang = (order) => order.orderCode || order.code || `DH-${order.id}`

const layKieuTheTrangThai = (status) => KIEU_THE_TRANG_THAI[status] || KIEU_THE_TRANG_THAI.Pending

const taoTongKetTienDonHang = (order) => {
  const items = Array.isArray(order?.items) ? order.items : []
  const subtotalFromItems = items.reduce(
    (tong, item) => tong + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )
  const subtotalValue = Number(order?.subtotal)
  const serviceFeeValue = Number(order?.serviceFee)
  const discountValue = Number(order?.discountAmount)

  const subtotal = Number.isFinite(subtotalValue) ? subtotalValue : subtotalFromItems
  const serviceFee = Number.isFinite(serviceFeeValue) ? serviceFeeValue : tinhPhiDichVu(subtotal)
  const discountAmount = Number.isFinite(discountValue) ? Math.max(0, discountValue) : 0
  const total = Math.max(0, subtotal + serviceFee - discountAmount)

  return {
    subtotal,
    serviceFee,
    discountAmount,
    total,
  }
}

const taoNoiDungInHoaDon = (order) => {
  const items = Array.isArray(order?.items) ? order.items : []
  const tongKetTien = taoTongKetTienDonHang(order)
  const itemRows = items.length
    ? items.map((item, index) => {
        const soLuong = Number(item.quantity) || 0
        const donGia = Number(item.price) || 0
        const thanhTien = soLuong * donGia
        const ghiChu = item.note ? `<div class="invoice-note">${maHoaHtmlIn(item.note)}</div>` : ''
        const size = item.size ? ` <span class="invoice-size">(Size ${maHoaHtmlIn(item.size)})</span>` : ''

        return `
          <tr>
            <td>
              <div class="invoice-item-name">${index + 1}. ${maHoaHtmlIn(item.name || `Món ${index + 1}`)}${size}</div>
              ${ghiChu}
            </td>
            <td>${soLuong}</td>
            <td>${maHoaHtmlIn(dinhDangTienTe(donGia))}</td>
            <td>${maHoaHtmlIn(dinhDangTienTe(thanhTien))}</td>
          </tr>
        `
      }).join('')
    : '<tr><td colspan="4" class="invoice-empty">Chưa có dữ liệu món để in hóa đơn.</td></tr>'

  return `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Hóa đơn #${maHoaHtmlIn(dinhDangMaDonHang(order))}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 24px;
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
          }
          .invoice {
            max-width: 820px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 28px;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding-bottom: 18px;
            border-bottom: 2px solid #e2e8f0;
          }
          .invoice-kicker {
            margin: 0 0 8px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #64748b;
          }
          .invoice-title {
            margin: 0;
            font-size: 28px;
            line-height: 1.2;
          }
          .invoice-subtitle,
          .invoice-meta p,
          .invoice-note,
          .invoice-footer {
            margin: 0;
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
          }
          .invoice-meta {
            text-align: right;
          }
          .invoice-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-top: 22px;
          }
          .invoice-panel {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px 16px;
            background: #f8fafc;
          }
          .invoice-panel h2 {
            margin: 0 0 10px;
            font-size: 14px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 22px;
          }
          .invoice-table th,
          .invoice-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            text-align: left;
            font-size: 14px;
          }
          .invoice-table th:nth-child(2),
          .invoice-table th:nth-child(3),
          .invoice-table th:nth-child(4),
          .invoice-table td:nth-child(2),
          .invoice-table td:nth-child(3),
          .invoice-table td:nth-child(4) {
            width: 110px;
            text-align: right;
          }
          .invoice-item-name {
            font-weight: 700;
            color: #0f172a;
          }
          .invoice-size {
            font-weight: 400;
            color: #475569;
          }
          .invoice-empty {
            text-align: center !important;
            color: #64748b;
          }
          .invoice-summary {
            width: 320px;
            margin-top: 20px;
            margin-left: auto;
          }
          .invoice-summary-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 0;
            font-size: 14px;
          }
          .invoice-summary-row.total {
            margin-top: 8px;
            padding-top: 14px;
            border-top: 1px solid #cbd5e1;
            font-size: 16px;
            font-weight: 700;
          }
          .invoice-footer {
            margin-top: 28px;
            padding-top: 18px;
            border-top: 1px dashed #cbd5e1;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .invoice {
              border: none;
              border-radius: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <main class="invoice">
          <header class="invoice-header">
            <div>
              <p class="invoice-kicker">Hóa đơn thanh toán</p>
              <h1 class="invoice-title">${maHoaHtmlIn(dinhDangNhanBan(order.tableNumber))}</h1>
              <p class="invoice-subtitle">Mã đơn #${maHoaHtmlIn(dinhDangMaDonHang(order))}</p>
            </div>
            <div class="invoice-meta">
              <p><strong>Thời gian:</strong> ${maHoaHtmlIn(dinhDangNgay(order.orderDate))}</p>
              <p><strong>Trạng thái:</strong> ${maHoaHtmlIn(layNhanTrangThaiDonHang(order.status))}</p>
              <p><strong>Thanh toán:</strong> ${maHoaHtmlIn(layNhanPhuongThucThanhToan(order.paymentMethod))}</p>
            </div>
          </header>

          <section class="invoice-grid">
            <div class="invoice-panel">
              <h2>Khách hàng</h2>
              <p>${maHoaHtmlIn(order.customer?.fullName || 'Khách lẻ')}</p>
              <p>${maHoaHtmlIn(order.customer?.phone || 'Không có số điện thoại')}</p>
            </div>
            <div class="invoice-panel">
              <h2>Ghi chú</h2>
              <p>${maHoaHtmlIn(order.note || 'Không có ghi chú cho đơn này.')}</p>
            </div>
          </section>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>Món</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <section class="invoice-summary">
            <div class="invoice-summary-row">
              <span>Tạm tính</span>
              <span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.subtotal))}</span>
            </div>
            <div class="invoice-summary-row">
              <span>Phí dịch vụ</span>
              <span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.serviceFee))}</span>
            </div>
            <div class="invoice-summary-row">
              <span>Voucher</span>
              <span>-${maHoaHtmlIn(dinhDangTienTe(tongKetTien.discountAmount))}</span>
            </div>
            <div class="invoice-summary-row total">
              <span>Tổng cộng</span>
              <span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.total))}</span>
            </div>
          </section>

          <p class="invoice-footer">Cảm ơn quý khách đã sử dụng dịch vụ của nhà hàng.</p>
        </main>
        <script>
          window.addEventListener('load', () => {
            window.print();
            window.onafterprint = () => window.close();
          });
        </script>
      </body>
    </html>
  `
}

const taoCotBangMon = () => [
  {
    title: 'Món',
    dataIndex: 'name',
    key: 'name',
    render: (value, record) => (
      <div className="noi-bo-don-hang-item-name">
        <strong>{value}</strong>
        {record.size ? <span>Size {record.size}</span> : null}
      </div>
    ),
  },
  {
    title: 'SL',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 64,
    align: 'center',
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    render: (value) => dinhDangTienTe(value),
  },
  {
    title: 'Thành tiền',
    key: 'lineTotal',
    width: 132,
    render: (_, record) => dinhDangTienTe((Number(record.price) || 0) * (Number(record.quantity) || 0)),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    render: (value) => value || <span className="noi-bo-don-hang-cell-muted">--</span>,
  },
]

function ThanhBoLocDonHang({ boLocDangChon, onFilterChange, counts, visibleCount, totalCount, donChoXuLy }) {
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  return (
    <Card>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>Quản lý đơn hàng</Typography.Title>
          <Typography.Text type="secondary">{visibleCount}/{totalCount} đơn hiển thị · {donChoXuLy} đơn cần xử lý ngay</Typography.Text>
        </div>
        <Segmented
          block={laMobile}
          options={BO_LOC_DON_HANG.map((filter) => ({
            label: <Space size={6}><span>{filter.label}</span><Badge count={counts[filter.key] || 0} size="small" /></Space>,
            value: filter.key,
          }))}
          value={boLocDangChon}
          onChange={onFilterChange}
        />
      </Space>
    </Card>
  )
}

function DanhSachTheDonHang({ orders, idDonHangDangChon, onSelectOrder }) {
  if (!orders.length) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng phù hợp với bộ lọc hiện tại" />
      </Card>
    )
  }

  return (
    <Card title="Danh sách order">
      <div className="grid gap-2.5">
        {orders.map((order) => {
        const kieuThe = layKieuTheTrangThai(order.status)
        const isSelected = String(idDonHangDangChon) === String(order.id)

        return (
          <div key={order.id} onClick={() => onSelectOrder(order.id)} style={{ cursor: 'pointer', borderRadius: 16, padding: 14, marginBottom: 10, border: isSelected ? '1px solid #f59e0b' : '1px solid #e5e7eb', background: isSelected ? '#fff7ed' : '#fff' }}>
            <Space orientation="vertical" size={10} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <div>
                  <Typography.Text type="secondary">#{dinhDangMaDonHang(order)}</Typography.Text>
                  <div><Typography.Text strong>{dinhDangNhanBan(order.tableNumber)}</Typography.Text></div>
                </div>
                <Tag color={kieuThe.tone === 'cancelled' ? 'red' : kieuThe.tone === 'paid' ? 'green' : kieuThe.tone === 'preparing' ? 'orange' : 'blue'}>{layNhanTrangThaiDonHang(order.status)}</Tag>
              </Space>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Khách">{order.customer?.fullName || 'Khách lẻ'}</Descriptions.Item>
                <Descriptions.Item label="Giờ tạo">{dinhDangNgay(order.orderDate)}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{dinhDangTienTe(order.total)}</Descriptions.Item>
                <Descriptions.Item label="Thanh toán">{layNhanPhuongThucThanhToan(order.paymentMethod)}</Descriptions.Item>
              </Descriptions>
              <Typography.Text type="secondary">{kieuThe.hint}</Typography.Text>
              {order.note ? <Typography.Text>{order.note}</Typography.Text> : null}
            </Space>
          </div>
        )
      })}
      </div>
    </Card>
  )
}

function BangChiTietDonHang({
  order,
  chiTietDonHang,
  dangTaiChiTiet,
  loiChiTiet,
  trangThaiDangSua,
  onStatusChange,
  onReloadDetail,
  onSubmit,
  onQuickPay,
  onPrint,
  dangLuuTrangThai,
}) {
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  if (!order) {
    return (
      <div className="noi-bo-don-hang-form-shell rounded-[22px] border border-dashed border-slate-200 bg-white/90 p-6 text-center shadow-sm">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chọn một đơn ở cột trái để xem chi tiết" />
      </div>
    )
  }

  const donHangNguon = chiTietDonHang || order
  const items = Array.isArray(donHangNguon.items) ? donHangNguon.items : []
  const kieuThe = layKieuTheTrangThai(order.status)
  const daDoiTrangThai = trangThaiDangSua !== order.status
  const tongKetTien = taoTongKetTienDonHang(donHangNguon)
  const coTheIn = !dangTaiChiTiet && items.length > 0

  return (
    <article className="noi-bo-don-hang-form-shell rounded-[22px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4.5 xl:sticky xl:top-4 xl:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Order detail</p>
          <h2 className="m-0 text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-900">{dinhDangNhanBan(order.tableNumber)}</h2>
          <p className="mt-1.5 mb-0 text-xs leading-5 text-slate-500">#{dinhDangMaDonHang(order)} · {kieuThe.hint}</p>
        </div>

        <div className="noi-bo-don-hang-status-control">
          <span className="noi-bo-don-hang-status-control__label">Trạng thái đơn</span>
          <Select size="middle" value={trangThaiDangSua} options={TUY_CHON_TRANG_THAI} onChange={onStatusChange} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Thông tin đơn</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Khách hàng & thanh toán</h3>
          </div>

          <div className="noi-bo-don-hang-detail-grid">
            <label className="noi-bo-don-hang-detail-field">
              <span><UserOutlined /> Khách hàng</span>
              <Input size="middle" value={donHangNguon.customer?.fullName || 'Khách lẻ'} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field">
              <span><FieldTimeOutlined /> Thời gian</span>
              <Input size="middle" value={dinhDangNgay(donHangNguon.orderDate)} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
              <span><CreditCardOutlined /> Thanh toán</span>
              <Input size="middle" value={layNhanPhuongThucThanhToan(donHangNguon.paymentMethod)} readOnly />
            </label>
            <div className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
              <span>Tổng kết thanh toán</span>
              <div className="noi-bo-don-hang-money-summary">
                <div className="noi-bo-don-hang-money-summary__row">
                  <span>Tạm tính</span>
                  <strong>{dinhDangTienTe(tongKetTien.subtotal)}</strong>
                </div>
                <div className="noi-bo-don-hang-money-summary__row">
                  <span>Phí dịch vụ</span>
                  <strong>{dinhDangTienTe(tongKetTien.serviceFee)}</strong>
                </div>
                {tongKetTien.discountAmount > 0 ? (
                  <div className="noi-bo-don-hang-money-summary__row">
                    <span>Voucher</span>
                    <strong>-{dinhDangTienTe(tongKetTien.discountAmount)}</strong>
                  </div>
                ) : null}
                <div className="noi-bo-don-hang-money-summary__divider" />
                <div className="noi-bo-don-hang-money-summary__row noi-bo-don-hang-money-summary__row--total">
                  <span>Tổng cộng</span>
                  <strong>{dinhDangTienTe(tongKetTien.total)}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Ghi chú</p>
              <h3 className="m-0 text-sm font-semibold text-slate-900">Thông tin bổ sung</h3>
            </div>
            <Button size="small" icon={<ReloadOutlined />} onClick={onReloadDetail} loading={dangTaiChiTiet}>
              Tải lại
            </Button>
          </div>

          <label className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
            <span><FileTextOutlined /> Ghi chú đơn</span>
            <TextArea size="middle" rows={3} value={donHangNguon.note || 'Không có ghi chú cho đơn này.'} readOnly />
          </label>

          {loiChiTiet ? <Alert type="warning" showIcon title={loiChiTiet} /> : null}
        </section>

        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Danh sách món</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Chi tiết phục vụ</h3>
          </div>

          {dangTaiChiTiet ? (
            <div className="noi-bo-don-hang-detail-loading">
              <Spin size="small" />
              <span>Đang tải chi tiết món...</span>
            </div>
          ) : items.length ? (
            <div className="noi-bo-don-hang-items-table">
              <Table
                size="small"
                pagination={false}
                columns={taoCotBangMon()}
                dataSource={items.map((item, index) => ({ ...item, key: item.id || `item-${index + 1}` }))}
                rowKey="key"
                scroll={laMobile ? { x: 720 } : undefined}
              />
            </div>
          ) : (
            <div className="noi-bo-don-hang-items-empty">
              Chưa có dữ liệu món chi tiết cho đơn này.
            </div>
          )}
        </section>

        <div className="noi-bo-don-hang-form-actions">
          <Button
            type="primary"
            size="middle"
            icon={<CheckCircleOutlined />}
            onClick={onSubmit}
            loading={dangLuuTrangThai}
            disabled={!daDoiTrangThai}
          >
            Cập nhật
          </Button>
          <Button
            size="middle"
            icon={<PrinterOutlined />}
            onClick={onPrint}
            disabled={!coTheIn || dangLuuTrangThai}
          >
            In hóa đơn
          </Button>
          <Button
            size="middle"
            onClick={onQuickPay}
            loading={dangLuuTrangThai}
            disabled={order.status === 'Paid' || order.status === 'Cancelled'}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </article>
  )
}

function DonHangTab({ orders, tomTatDonHang, donChoXuLy, layChiTietDonHang, onUpdateOrderStatus }) {
  const [boLocDangChon, setActiveFilter] = useState('all')
  const [idDonHangDangChon, setSelectedOrderId] = useState(orders[0]?.id ?? null)
  const [chiTietDonHangTheoId, setOrderDetailsById] = useState({})
  const [dangTaiChiTiet, setLoadingDetail] = useState(false)
  const [loiChiTiet, setDetailError] = useState('')
  const [trangThaiDangSua, setFormStatus] = useState('')
  const [dangLuuTrangThai, setSavingStatus] = useState(false)

  const soLuongTheoBoLoc = useMemo(() => tinhSoLuongTheoBoLoc(orders), [orders])

  const danhSachDonDaLoc = useMemo(
    () => orders.filter((order) => khopBoLocDonHang(order, boLocDangChon)),
    [orders, boLocDangChon],
  )

  useEffect(() => {
    if (!danhSachDonDaLoc.length) {
      setSelectedOrderId(null)
      return
    }

    const vanConTonTai = danhSachDonDaLoc.some((order) => String(order.id) === String(idDonHangDangChon))
    if (!vanConTonTai) {
      setSelectedOrderId(danhSachDonDaLoc[0].id)
    }
  }, [danhSachDonDaLoc, idDonHangDangChon])

  const donHangDangChon = useMemo(
    () => danhSachDonDaLoc.find((order) => String(order.id) === String(idDonHangDangChon)) || null,
    [danhSachDonDaLoc, idDonHangDangChon],
  )

  const chiTietDonHang = donHangDangChon ? chiTietDonHangTheoId[donHangDangChon.id] || null : null

  useEffect(() => {
    if (!donHangDangChon) {
      setFormStatus('')
      return
    }

    setFormStatus((chiTietDonHang || donHangDangChon).status)
  }, [donHangDangChon, chiTietDonHang])

  useEffect(() => {
    let daHuy = false

    const taiChiTiet = async () => {
      if (!donHangDangChon || chiTietDonHangTheoId[donHangDangChon.id]) {
        return
      }

      setLoadingDetail(true)
      setDetailError('')

      try {
        const detail = await layChiTietDonHang(donHangDangChon.id)
        if (!daHuy && detail) {
          setOrderDetailsById((current) => ({ ...current, [donHangDangChon.id]: detail }))
        }
      } catch (error) {
        if (!daHuy) {
          setDetailError(error?.message || 'Không thể tải chi tiết đơn hàng.')
        }
      } finally {
        if (!daHuy) {
          setLoadingDetail(false)
        }
      }
    }

    taiChiTiet()

    return () => {
      daHuy = true
    }
  }, [donHangDangChon, chiTietDonHangTheoId, layChiTietDonHang])

  const xuLyTaiLaiChiTiet = async () => {
    if (!donHangDangChon) return

    setLoadingDetail(true)
    setDetailError('')

    try {
      const detail = await layChiTietDonHang(donHangDangChon.id)
      setOrderDetailsById((current) => ({ ...current, [donHangDangChon.id]: detail }))
    } catch (error) {
      setDetailError(error?.message || 'Không thể tải lại chi tiết đơn hàng.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const xuLyInHoaDon = () => {
    const donHangNguon = chiTietDonHang || donHangDangChon

    if (!donHangNguon || !Array.isArray(donHangNguon.items) || !donHangNguon.items.length) {
      setDetailError('Cần tải đầy đủ chi tiết món trước khi in hóa đơn.')
      return
    }

    const cuaSoIn = window.open('', '_blank', 'width=960,height=720')
    if (!cuaSoIn) {
      setDetailError('Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra chặn popup của trình duyệt.')
      return
    }

    setDetailError('')
    cuaSoIn.document.write(taoNoiDungInHoaDon(donHangNguon))
    cuaSoIn.document.close()
    cuaSoIn.focus()
  }

  const guiCapNhatTrangThai = async (nextStatus) => {
    if (!donHangDangChon || nextStatus === donHangDangChon.status) {
      return
    }

    setSavingStatus(true)
    setDetailError('')

    try {
      const result = await onUpdateOrderStatus(donHangDangChon.id, nextStatus)
      const donHangKeTiep = result?.duLieu || null
      if (donHangKeTiep) {
        setOrderDetailsById((current) => ({
          ...current,
          [donHangDangChon.id]: {
            ...(current[donHangDangChon.id] || donHangDangChon),
            ...donHangKeTiep,
            items: current[donHangDangChon.id]?.items || donHangDangChon.items || [],
          },
        }))
      }
      setFormStatus(nextStatus)
    } catch (error) {
      setDetailError(error?.message || 'Không thể cập nhật trạng thái đơn hàng.')
    } finally {
      setSavingStatus(false)
    }
  }

  const xuLyCapNhatTrangThai = async () => {
    await guiCapNhatTrangThai(trangThaiDangSua)
  }

  const xuLyThanhToanNhanh = async () => {
    setFormStatus('Paid')
    await guiCapNhatTrangThai('Paid')
  }

  return (
    <section className="space-y-4 noi-bo-page-stack">
      <ThanhBoLocDonHang
        boLocDangChon={boLocDangChon}
        onFilterChange={setActiveFilter}
        counts={soLuongTheoBoLoc}
        visibleCount={danhSachDonDaLoc.length}
        totalCount={tomTatDonHang?.total || orders.length}
        donChoXuLy={donChoXuLy}
      />

      <section className="noi-bo-don-hang-layout">
        <div className="space-y-3 noi-bo-don-hang-list-col">
          <DanhSachTheDonHang orders={danhSachDonDaLoc} idDonHangDangChon={idDonHangDangChon} onSelectOrder={setSelectedOrderId} />
        </div>

        <BangChiTietDonHang
          order={donHangDangChon}
          chiTietDonHang={chiTietDonHang}
          dangTaiChiTiet={dangTaiChiTiet}
          loiChiTiet={loiChiTiet}
          trangThaiDangSua={trangThaiDangSua}
          onStatusChange={setFormStatus}
          onReloadDetail={xuLyTaiLaiChiTiet}
          onSubmit={xuLyCapNhatTrangThai}
          onQuickPay={xuLyThanhToanNhanh}
          onPrint={xuLyInHoaDon}
          dangLuuTrangThai={dangLuuTrangThai}
        />
      </section>
    </section>
  )
}

export default DonHangTab
