import { useEffect, useMemo, useState } from 'react'
import { CheckCircleOutlined, CreditCardOutlined, FieldTimeOutlined, FileTextOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Badge, Button, Empty, Input, Select, Space, Spin, Table } from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'
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
    <div className="noi-bo-don-hang-toolbar rounded-[20px] border border-[#E5E0DB] bg-white/95 p-3.5 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="m-0 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-900">Quản lý đơn hàng</h2>
          <p className="mt-1 mb-0 text-xs leading-5 text-slate-500">
            {visibleCount}/{totalCount} đơn hiển thị · {donChoXuLy} đơn cần xử lý ngay
          </p>
        </div>

        <Space size={[8, 8]} wrap>
          {ORDER_FILTERS.map((filter) => (
            <CheckableTag
              key={filter.key}
              checked={activeFilter === filter.key}
              onChange={() => onFilterChange(filter.key)}
              className="booking-admin-filter-chip"
            >
              <span>{filter.label}</span>
              <Badge count={counts[filter.key] || 0} size="small" color={activeFilter === filter.key ? '#f97316' : '#94a3b8'} />
            </CheckableTag>
          ))}
        </Space>
      </div>
    </div>
  )
}

function OrderTicketList({ orders, selectedOrderId, onSelectOrder }) {
  if (!orders.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center shadow-sm">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng phù hợp với bộ lọc hiện tại" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const ticketStyle = getTicketStyle(order.status)
        const isSelected = String(selectedOrderId) === String(order.id)

        return (
          <button
            key={order.id}
            type="button"
            onClick={() => onSelectOrder(order.id)}
            className={`noi-bo-don-hang-ticket noi-bo-don-hang-ticket--${ticketStyle.tone} ${isSelected ? 'is-selected' : ''}`}
          >
            <div className="noi-bo-don-hang-ticket__top">
              <div>
                <p className="noi-bo-don-hang-ticket__code">#{formatOrderCode(order)}</p>
                <strong className="noi-bo-don-hang-ticket__table">{formatTableLabel(order.tableNumber)}</strong>
              </div>
              <span className={`noi-bo-don-hang-badge ${ticketStyle.badge}`}>{layNhanTrangThaiDonHang(order.status)}</span>
            </div>

            <div className="noi-bo-don-hang-ticket__meta">
              <div>
                <span>Khách</span>
                <strong>{order.customer?.fullName || 'Khách lẻ'}</strong>
              </div>
              <div>
                <span>Giờ tạo</span>
                <strong>{dinhDangNgay(order.orderDate)}</strong>
              </div>
              <div>
                <span>Tổng tiền</span>
                <strong>{dinhDangTienTe(order.total)}</strong>
              </div>
              <div>
                <span>Thanh toán</span>
                <strong>{layNhanPhuongThucThanhToan(order.paymentMethod)}</strong>
              </div>
            </div>

            <div className="noi-bo-don-hang-ticket__footer">
              <span>{ticketStyle.hint}</span>
              {order.note ? <span className="noi-bo-don-hang-ticket__note">{order.note}</span> : null}
            </div>
          </button>
        )
      })}
    </div>
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

  return (
    <article className="noi-bo-don-hang-form-shell rounded-[22px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4.5 xl:sticky xl:top-4 xl:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Order detail</p>
          <h2 className="m-0 text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-900">{formatTableLabel(order.tableNumber)}</h2>
          <p className="mt-1.5 mb-0 text-xs leading-5 text-slate-500">#{formatOrderCode(order)} · {ticketStyle.hint}</p>
        </div>
        <span className={`noi-bo-don-hang-badge ${ticketStyle.badge}`}>{layNhanTrangThaiDonHang(order.status)}</span>
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
            <label className="noi-bo-don-hang-detail-field">
              <span><CreditCardOutlined /> Thanh toán</span>
              <Input size="middle" value={layNhanPhuongThucThanhToan(sourceOrder.paymentMethod)} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field">
              <span>Tổng tiền</span>
              <Input size="middle" value={dinhDangTienTe(sourceOrder.total)} readOnly />
            </label>
            <label className="noi-bo-don-hang-detail-field noi-bo-don-hang-detail-field--wide">
              <span>Trạng thái đơn</span>
              <Select size="middle" value={formStatus} options={STATUS_OPTIONS} onChange={onStatusChange} />
            </label>
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

          {detailError ? <Alert type="warning" showIcon message={detailError} /> : null}
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
          savingStatus={savingStatus}
        />
      </section>
    </section>
  )
}

export default DonHangTab
