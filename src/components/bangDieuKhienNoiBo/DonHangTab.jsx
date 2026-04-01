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
import { Alert, Badge, Button, Card, Descriptions, Empty, Input, List, Segmented, Select, Space, Spin, Table, Tag, Typography } from 'antd'
import { dinhDangTienTe } from '../../utils/tienTe'
import { dinhDangNgay } from '../../features/bangDieuKhienNoiBo/dinhDang'
import { layNhanTrangThaiDonHang, layNhanPhuongThucThanhToan } from '../../utils/donHang'

const { TextArea } = Input

const ORDER_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý', statuses: ['MOI_TAO', 'DA_XAC_NHAN'] },
  { key: 'preparing', label: 'Đang chuẩn bị', statuses: ['DANG_CHUAN_BI'] },
  { key: 'served', label: 'Đã phục vụ', statuses: ['DANG_PHUC_VU'] },
  { key: 'paid', label: 'Đã thanh toán', statuses: ['DA_HOAN_THANH'] },
  { key: 'cancelled', label: 'Đã hủy', statuses: ['DA_HUY'] },
]

const STATUS_OPTIONS = [
  { value: 'MOI_TAO', label: 'Mới tạo' },
  { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
  { value: 'DANG_CHUAN_BI', label: 'Đang chuẩn bị' },
  { value: 'DANG_PHUC_VU', label: 'Đang phục vụ' },
  { value: 'DA_HOAN_THANH', label: 'Đã thanh toán' },
  { value: 'DA_HUY', label: 'Đã hủy' },
]

const STATUS_TICKET_STYLES = {
  MOI_TAO: {
    tone: 'pending',
    badge: 'badge-pending',
    hint: 'Cần xác nhận và ưu tiên điều phối bếp.',
  },
  DA_XAC_NHAN: {
    tone: 'pending',
    badge: 'badge-pending',
    hint: 'Đơn đã chốt, chờ bếp nhận lệnh.',
  },
  DANG_CHUAN_BI: {
    tone: 'preparing',
    badge: 'badge-preparing',
    hint: 'Bếp đang xử lý, ưu tiên theo dõi thời gian ra món.',
  },
  DANG_PHUC_VU: {
    tone: 'served',
    badge: 'badge-served',
    hint: 'Đơn đang phục vụ tại bàn, sẵn sàng chốt thanh toán.',
  },
  DA_HOAN_THANH: {
    tone: 'paid',
    badge: 'badge-paid',
    hint: 'Đơn đã thanh toán và chốt doanh thu.',
  },
  DA_HUY: {
    tone: 'cancelled',
    badge: 'badge-cancelled',
    hint: 'Đơn đã hủy, chỉ giữ lại để tra cứu.',
  },
}

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

const escapePrintHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const buildFilterCounts = (orders) => ORDER_FILTERS.reduce((acc, filter) => {
  if (filter.key === 'all') {
    acc[filter.key] = orders.length
    return acc
  }

  acc[filter.key] = orders.filter((order) => filter.statuses.includes(order.status)).length
  return acc
}, {})

const matchOrderFilter = (order, filterKey) => {
  if (filterKey === 'all') {
    return true
  }

  const filter = ORDER_FILTERS.find((item) => item.key === filterKey)
  return filter ? filter.statuses.includes(order.status) : true
}

const formatTableLabel = (tableNumber) => {
  const normalized = String(tableNumber || '').trim()
  return normalized ? `BÀN ${normalized.toUpperCase()}` : 'BÀN WALK-IN'
}

const formatOrderCode = (order) => order.orderCode || order.code || `DH-${order.id}`

const getTicketStyle = (status) => STATUS_TICKET_STYLES[status] || STATUS_TICKET_STYLES.MOI_TAO

const buildOrderFinancialSummary = (order) => {
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
  const moneySummary = buildOrderFinancialSummary(order)
  const itemRows = items.length
    ? items.map((item, index) => {
        const soLuong = Number(item.quantity) || 0
        const donGia = Number(item.price) || 0
        const thanhTien = soLuong * donGia
        const ghiChu = item.note ? `<div class="invoice-note">${escapePrintHtml(item.note)}</div>` : ''
        const size = item.size ? ` <span class="invoice-size">(Size ${escapePrintHtml(item.size)})</span>` : ''

        return `
          <tr>
            <td>
              <div class="invoice-item-name">${index + 1}. ${escapePrintHtml(item.name || `Món ${index + 1}`)}${size}</div>
              ${ghiChu}
            </td>
            <td>${soLuong}</td>
            <td>${escapePrintHtml(dinhDangTienTe(donGia))}</td>
            <td>${escapePrintHtml(dinhDangTienTe(thanhTien))}</td>
          </tr>
        `
      }).join('')
    : '<tr><td colspan="4" class="invoice-empty">Chưa có dữ liệu món để in hóa đơn.</td></tr>'

  return `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Hóa đơn #${escapePrintHtml(formatOrderCode(order))}</title>
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
              <h1 class="invoice-title">${escapePrintHtml(formatTableLabel(order.tableNumber))}</h1>
              <p class="invoice-subtitle">Mã đơn #${escapePrintHtml(formatOrderCode(order))}</p>
            </div>
            <div class="invoice-meta">
              <p><strong>Thời gian:</strong> ${escapePrintHtml(dinhDangNgay(order.orderDate))}</p>
              <p><strong>Trạng thái:</strong> ${escapePrintHtml(layNhanTrangThaiDonHang(order.status))}</p>
              <p><strong>Thanh toán:</strong> ${escapePrintHtml(layNhanPhuongThucThanhToan(order.paymentMethod))}</p>
            </div>
          </header>

          <section class="invoice-grid">
            <div class="invoice-panel">
              <h2>Khách hàng</h2>
              <p>${escapePrintHtml(order.customer?.fullName || 'Khách lẻ')}</p>
              <p>${escapePrintHtml(order.customer?.phone || 'Không có số điện thoại')}</p>
            </div>
            <div class="invoice-panel">
              <h2>Ghi chú</h2>
              <p>${escapePrintHtml(order.note || 'Không có ghi chú cho đơn này.')}</p>
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
              <span>${escapePrintHtml(dinhDangTienTe(moneySummary.subtotal))}</span>
            </div>
            <div class="invoice-summary-row">
              <span>Phí dịch vụ</span>
              <span>${escapePrintHtml(dinhDangTienTe(moneySummary.serviceFee))}</span>
            </div>
            <div class="invoice-summary-row">
              <span>Voucher</span>
              <span>-${escapePrintHtml(dinhDangTienTe(moneySummary.discountAmount))}</span>
            </div>
            <div class="invoice-summary-row total">
              <span>Tổng cộng</span>
              <span>${escapePrintHtml(dinhDangTienTe(moneySummary.total))}</span>
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

const buildItemsTableColumns = () => [
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

function OrderFilterBar({ activeFilter, onFilterChange, counts, visibleCount, totalCount, donChoXuLy }) {
  return (
    <Card>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>Quản lý đơn hàng</Typography.Title>
          <Typography.Text type="secondary">{visibleCount}/{totalCount} đơn hiển thị · {donChoXuLy} đơn cần xử lý ngay</Typography.Text>
        </div>
        <Segmented
          options={ORDER_FILTERS.map((filter) => ({
            label: <Space size={6}><span>{filter.label}</span><Badge count={counts[filter.key] || 0} size="small" /></Space>,
            value: filter.key,
          }))}
          value={activeFilter}
          onChange={onFilterChange}
        />
      </Space>
    </Card>
  )
}

function OrderTicketList({ orders, selectedOrderId, onSelectOrder }) {
  if (!orders.length) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng phù hợp với bộ lọc hiện tại" />
      </Card>
    )
  }

  return (
    <Card title="Danh sách order">
      <List
        itemLayout="vertical"
        dataSource={orders}
        renderItem={(order) => {
        const ticketStyle = getTicketStyle(order.status)
        const isSelected = String(selectedOrderId) === String(order.id)

        return (
          <List.Item key={order.id} onClick={() => onSelectOrder(order.id)} style={{ cursor: 'pointer', borderRadius: 16, padding: 14, marginBottom: 10, border: isSelected ? '1px solid #f59e0b' : '1px solid #e5e7eb', background: isSelected ? '#fff7ed' : '#fff' }}>
            <Space orientation="vertical" size={10} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <div>
                  <Typography.Text type="secondary">#{formatOrderCode(order)}</Typography.Text>
                  <div><Typography.Text strong>{formatTableLabel(order.tableNumber)}</Typography.Text></div>
                </div>
                <Tag color={ticketStyle.tone === 'cancelled' ? 'red' : ticketStyle.tone === 'paid' ? 'green' : ticketStyle.tone === 'preparing' ? 'orange' : 'blue'}>{layNhanTrangThaiDonHang(order.status)}</Tag>
              </Space>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Khách">{order.customer?.fullName || 'Khách lẻ'}</Descriptions.Item>
                <Descriptions.Item label="Giờ tạo">{dinhDangNgay(order.orderDate)}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{dinhDangTienTe(order.total)}</Descriptions.Item>
                <Descriptions.Item label="Thanh toán">{layNhanPhuongThucThanhToan(order.paymentMethod)}</Descriptions.Item>
              </Descriptions>
              <Typography.Text type="secondary">{ticketStyle.hint}</Typography.Text>
              {order.note ? <Typography.Text>{order.note}</Typography.Text> : null}
            </Space>
          </List.Item>
        )
      }}
      />
    </Card>
  )
}

function OrderDetailPanel({
  order,
  detailOrder,
  loadingDetail,
  detailError,
  formStatus,
  onStatusChange,
  onReloadDetail,
  onSubmit,
  onQuickPay,
  onPrint,
  savingStatus,
}) {
  if (!order) {
    return (
      <div className="noi-bo-don-hang-form-shell rounded-[22px] border border-dashed border-slate-200 bg-white/90 p-6 text-center shadow-sm">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chọn một đơn ở cột trái để xem chi tiết" />
      </div>
    )
  }

  const sourceOrder = detailOrder || order
  const items = Array.isArray(sourceOrder.items) ? sourceOrder.items : []
  const ticketStyle = getTicketStyle(order.status)
  const hasStatusChanged = formStatus !== order.status
  const moneySummary = buildOrderFinancialSummary(sourceOrder)
  const canPrint = !loadingDetail && items.length > 0

  return (
    <article className="noi-bo-don-hang-form-shell rounded-[22px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4.5 xl:sticky xl:top-4 xl:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Order detail</p>
          <h2 className="m-0 text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-900">{formatTableLabel(order.tableNumber)}</h2>
          <p className="mt-1.5 mb-0 text-xs leading-5 text-slate-500">#{formatOrderCode(order)} · {ticketStyle.hint}</p>
        </div>

        <div className="noi-bo-don-hang-status-control">
          <span className="noi-bo-don-hang-status-control__label">Trạng thái đơn</span>
          <Select size="middle" value={formStatus} options={STATUS_OPTIONS} onChange={onStatusChange} />
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
              <Input size="middle" value={sourceOrder.customer?.fullName || 'Khách lẻ'} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field">
              <span><FieldTimeOutlined /> Thời gian</span>
              <Input size="middle" value={dinhDangNgay(sourceOrder.orderDate)} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
              <span><CreditCardOutlined /> Thanh toán</span>
              <Input size="middle" value={layNhanPhuongThucThanhToan(sourceOrder.paymentMethod)} readOnly />
            </label>
            <div className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
              <span>Tổng kết thanh toán</span>
              <div className="noi-bo-don-hang-money-summary">
                <div className="noi-bo-don-hang-money-summary__row">
                  <span>Tạm tính</span>
                  <strong>{dinhDangTienTe(moneySummary.subtotal)}</strong>
                </div>
                <div className="noi-bo-don-hang-money-summary__row">
                  <span>Phí dịch vụ</span>
                  <strong>{dinhDangTienTe(moneySummary.serviceFee)}</strong>
                </div>
                {moneySummary.discountAmount > 0 ? (
                  <div className="noi-bo-don-hang-money-summary__row">
                    <span>Voucher</span>
                    <strong>-{dinhDangTienTe(moneySummary.discountAmount)}</strong>
                  </div>
                ) : null}
                <div className="noi-bo-don-hang-money-summary__divider" />
                <div className="noi-bo-don-hang-money-summary__row noi-bo-don-hang-money-summary__row--total">
                  <span>Tổng cộng</span>
                  <strong>{dinhDangTienTe(moneySummary.total)}</strong>
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
            <Button size="small" icon={<ReloadOutlined />} onClick={onReloadDetail} loading={loadingDetail}>
              Tải lại
            </Button>
          </div>

          <label className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
            <span><FileTextOutlined /> Ghi chú đơn</span>
            <TextArea size="middle" rows={3} value={sourceOrder.note || 'Không có ghi chú cho đơn này.'} readOnly />
          </label>

          {detailError ? <Alert type="warning" showIcon title={detailError} /> : null}
        </section>

        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Danh sách món</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Chi tiết phục vụ</h3>
          </div>

          {loadingDetail ? (
            <div className="noi-bo-don-hang-detail-loading">
              <Spin size="small" />
              <span>Đang tải chi tiết món...</span>
            </div>
          ) : items.length ? (
            <div className="noi-bo-don-hang-items-table">
              <Table
                size="small"
                pagination={false}
                columns={buildItemsTableColumns()}
                dataSource={items.map((item, index) => ({ ...item, key: item.id || `item-${index + 1}` }))}
                rowKey="key"
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
            loading={savingStatus}
            disabled={!hasStatusChanged}
          >
            Cập nhật
          </Button>
          <Button
            size="middle"
            icon={<PrinterOutlined />}
            onClick={onPrint}
            disabled={!canPrint || savingStatus}
          >
            In hóa đơn
          </Button>
          <Button
            size="middle"
            onClick={onQuickPay}
            loading={savingStatus}
            disabled={order.status === 'DA_HOAN_THANH' || order.status === 'DA_HUY'}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </article>
  )
}

function DonHangTab({ orders, tomTatDonHang, donChoXuLy, layChiTietDonHang, onUpdateOrderStatus }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? null)
  const [orderDetailsById, setOrderDetailsById] = useState({})
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [formStatus, setFormStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  const filterCounts = useMemo(() => buildFilterCounts(orders), [orders])

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchOrderFilter(order, activeFilter)),
    [orders, activeFilter],
  )

  useEffect(() => {
    if (!filteredOrders.length) {
      setSelectedOrderId(null)
      return
    }

    const stillExists = filteredOrders.some((order) => String(order.id) === String(selectedOrderId))
    if (!stillExists) {
      setSelectedOrderId(filteredOrders[0].id)
    }
  }, [filteredOrders, selectedOrderId])

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => String(order.id) === String(selectedOrderId)) || null,
    [filteredOrders, selectedOrderId],
  )

  const detailOrder = selectedOrder ? orderDetailsById[selectedOrder.id] || null : null

  useEffect(() => {
    if (!selectedOrder) {
      setFormStatus('')
      return
    }

    setFormStatus((detailOrder || selectedOrder).status)
  }, [selectedOrder, detailOrder])

  useEffect(() => {
    let cancelled = false

    const fetchDetail = async () => {
      if (!selectedOrder || orderDetailsById[selectedOrder.id]) {
        return
      }

      setLoadingDetail(true)
      setDetailError('')

      try {
        const detail = await layChiTietDonHang(selectedOrder.id)
        if (!cancelled && detail) {
          setOrderDetailsById((current) => ({ ...current, [selectedOrder.id]: detail }))
        }
      } catch (error) {
        if (!cancelled) {
          setDetailError(error?.message || 'Không thể tải chi tiết đơn hàng.')
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false)
        }
      }
    }

    fetchDetail()

    return () => {
      cancelled = true
    }
  }, [selectedOrder, orderDetailsById, layChiTietDonHang])

  const handleReloadDetail = async () => {
    if (!selectedOrder) return

    setLoadingDetail(true)
    setDetailError('')

    try {
      const detail = await layChiTietDonHang(selectedOrder.id)
      setOrderDetailsById((current) => ({ ...current, [selectedOrder.id]: detail }))
    } catch (error) {
      setDetailError(error?.message || 'Không thể tải lại chi tiết đơn hàng.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handlePrintInvoice = () => {
    const sourceOrder = detailOrder || selectedOrder

    if (!sourceOrder || !Array.isArray(sourceOrder.items) || !sourceOrder.items.length) {
      setDetailError('Cần tải đầy đủ chi tiết món trước khi in hóa đơn.')
      return
    }

    const printWindow = window.open('', '_blank', 'width=960,height=720')
    if (!printWindow) {
      setDetailError('Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra chặn popup của trình duyệt.')
      return
    }

    setDetailError('')
    printWindow.document.write(taoNoiDungInHoaDon(sourceOrder))
    printWindow.document.close()
    printWindow.focus()
  }

  const submitStatusUpdate = async (nextStatus) => {
    if (!selectedOrder || nextStatus === selectedOrder.status) {
      return
    }

    setSavingStatus(true)
    setDetailError('')

    try {
      const result = await onUpdateOrderStatus(selectedOrder.id, nextStatus)
      const nextOrder = result?.duLieu || null
      if (nextOrder) {
        setOrderDetailsById((current) => ({
          ...current,
          [selectedOrder.id]: {
            ...(current[selectedOrder.id] || selectedOrder),
            ...nextOrder,
            items: current[selectedOrder.id]?.items || selectedOrder.items || [],
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

  const handleSubmit = async () => {
    await submitStatusUpdate(formStatus)
  }

  const handleQuickPay = async () => {
    setFormStatus('DA_HOAN_THANH')
    await submitStatusUpdate('DA_HOAN_THANH')
  }

  return (
    <section className="space-y-4">
      <OrderFilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={filterCounts}
        visibleCount={filteredOrders.length}
        totalCount={tomTatDonHang?.total || orders.length}
        donChoXuLy={donChoXuLy}
      />

      <section className="noi-bo-don-hang-layout">
        <div className="space-y-3">
          <OrderTicketList orders={filteredOrders} selectedOrderId={selectedOrderId} onSelectOrder={setSelectedOrderId} />
        </div>

        <OrderDetailPanel
          order={selectedOrder}
          detailOrder={detailOrder}
          loadingDetail={loadingDetail}
          detailError={detailError}
          formStatus={formStatus}
          onStatusChange={setFormStatus}
          onReloadDetail={handleReloadDetail}
          onSubmit={handleSubmit}
          onQuickPay={handleQuickPay}
          onPrint={handlePrintInvoice}
          savingStatus={savingStatus}
        />
      </section>
    </section>
  )
}

export default DonHangTab
