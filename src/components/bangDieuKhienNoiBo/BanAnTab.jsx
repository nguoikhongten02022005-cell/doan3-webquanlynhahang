import { useMemo, useState } from 'react'
import {
  CheckOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Badge, Button, Drawer, Empty, Tabs } from 'antd'
import { layNhanChoNgoi } from '../../features/bangDieuKhienNoiBo/dinhDang'

const TABLE_STATUS_LABELS = {
  AVAILABLE: 'Sẵn sàng',
  HELD: 'Đã đặt',
  OCCUPIED: 'Đang phục vụ',
  DIRTY: 'Chờ dọn',
}

const TABLE_STATUS_TONES = {
  AVAILABLE: 'success',
  HELD: 'warning',
  OCCUPIED: 'danger',
  DIRTY: 'neutral',
}

const TABLE_STATUS_STYLES = {
  AVAILABLE: {
    card: 'border-emerald-100 bg-white text-slate-900',
    dot: 'bg-emerald-500',
    accent: 'text-emerald-700',
    subtle: 'text-emerald-600',
    surface: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    badgeColor: '#10b981',
    drawerSurface: 'border-emerald-100 bg-emerald-50/70',
  },
  HELD: {
    card: 'border-orange-200 bg-orange-50 text-orange-950',
    dot: 'bg-orange-500',
    accent: 'text-orange-700',
    subtle: 'text-orange-600',
    surface: 'border-orange-100 bg-orange-100/80 text-orange-700',
    badgeColor: '#f97316',
    drawerSurface: 'border-orange-100 bg-orange-50/80',
  },
  OCCUPIED: {
    card: 'border-rose-200 bg-rose-50 text-rose-950',
    dot: 'bg-rose-500',
    accent: 'text-rose-700',
    subtle: 'text-rose-600',
    surface: 'border-rose-100 bg-rose-100/80 text-rose-700',
    badgeColor: '#f43f5e',
    drawerSurface: 'border-rose-100 bg-rose-50/80',
  },
  DIRTY: {
    card: 'border-slate-200 bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
    accent: 'text-slate-600',
    subtle: 'text-slate-500',
    surface: 'border-slate-200 bg-white/70 text-slate-600',
    badgeColor: '#94a3b8',
    drawerSurface: 'border-slate-200 bg-slate-50/90',
  },
}

const drawerButtonStyles = {
  order: {
    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
    borderColor: '#f97316',
    boxShadow: '0 12px 24px rgba(249, 115, 22, 0.2)',
  },
  payment: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    borderColor: '#16a34a',
    boxShadow: '0 12px 24px rgba(34, 197, 94, 0.18)',
  },
}

const formatBookingTime = (booking) => {
  if (!booking?.time) return ''

  const normalized = String(booking.time).trim()
  if (/^\d{2}:\d{2}$/.test(normalized)) return normalized
  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) return normalized.slice(0, 5)

  return ''
}

const buildTableViewModel = (table, bookingById) => {
  const booking = table.activeBookingId ? bookingById.get(String(table.activeBookingId)) : null
  const statusStyle = TABLE_STATUS_STYLES[table.status] || TABLE_STATUS_STYLES.DIRTY

  return {
    ...table,
    booking,
    displayName: table.name || table.code || 'Bàn',
    areaLabel: layNhanChoNgoi(table.areaId),
    statusLabel: TABLE_STATUS_LABELS[table.status] || table.status,
    statusTone: TABLE_STATUS_TONES[table.status] || 'neutral',
    statusStyle,
    bookingCode: booking?.bookingCode || table.activeBookingCode || '',
    timeText: table.status === 'HELD' || table.status === 'OCCUPIED' ? formatBookingTime(booking) : '',
  }
}

function LegacyBanAnTab({ phamViLabel, tomTatBan, tables, tomTatTonKhoBan, xuLyDanhDauBanSanSang, xuLyDanhDauBanBan }) {
  return (
    <article className="ho-so-card">
      <div className="van-hanh-board-head">
        <h2>Tình trạng bàn ăn</h2>
        <span>{phamViLabel}</span>
      </div>

      <div className="noi-bo-ban-overview-grid">
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Sẵn sàng</span>
          <strong>{tomTatTonKhoBan.available}</strong>
          <p className="noi-bo-ban-note">Bàn có thể nhận khách ngay.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Giữ chỗ</span>
          <strong>{tomTatTonKhoBan.held}</strong>
          <p className="noi-bo-ban-note">Đã gán booking nhưng chưa check-in.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Đang phục vụ</span>
          <strong>{tomTatTonKhoBan.occupied}</strong>
          <p className="noi-bo-ban-note">Đang có khách tại bàn.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Đang dọn</span>
          <strong>{tomTatTonKhoBan.dirty}</strong>
          <p className="noi-bo-ban-note">Cần dọn trước khi nhận khách mới.</p>
        </article>
      </div>

      <div className="noi-bo-ban-grid noi-bo-list-top-gap">
        {tomTatBan.map((area) => (
          <article key={area.id} className="van-hanh-stat-card noi-bo-ban-card">
            <span>{area.name}</span>
            <strong>{area.available}/{area.total}</strong>
            <p className="noi-bo-ban-note">
              {area.occupied} đang phục vụ · {area.held} giữ chỗ · {area.dirty} đang dọn.
            </p>
          </article>
        ))}
      </div>

      <div className="ho-so-list noi-bo-list-top-gap">
        {tables.map((table) => (
          <div key={table.id} className="ho-so-list-item">
            <div className="ho-so-list-top">
              <strong>{table.code}</strong>
              <span className={`nhan-trang-thai tone-${TABLE_STATUS_TONES[table.status] || 'neutral'}`}>
                {TABLE_STATUS_LABELS[table.status] || table.status}
              </span>
            </div>

            <div className="ho-so-list-meta noi-bo-don-hang-meta">
              <p><span>Khu vực</span><strong>{layNhanChoNgoi(table.areaId)}</strong></p>
              <p><span>Sức chứa</span><strong>{table.capacity} khách</strong></p>
              <p><span>Booking hiện tại</span><strong>{table.activeBookingCode || 'Trống'}</strong></p>
              <p><span>Ghi chú</span><strong>{table.note || '--'}</strong></p>
            </div>

            <div className="noi-bo-mon-item-actions">
              {table.status === 'DIRTY' ? (
                <button type="button" className="noi-bo-quick-btn noi-bo-quick-nut-chinh" onClick={() => xuLyDanhDauBanSanSang(table.id)}>
                  Sẵn sàng lại
                </button>
              ) : (
                <button type="button" className="noi-bo-quick-btn" onClick={() => xuLyDanhDauBanBan(table.id)}>
                  Đánh dấu dọn bàn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function PosBanAnTab({ phamViLabel, tomTatBan, tables, tomTatTonKhoBan, bookings, xuLyDanhDauBanSanSang }) {
  const [selectedTableId, setSelectedTableId] = useState(null)

  const bookingById = useMemo(
    () => new Map((bookings || []).map((booking) => [String(booking.id), booking])),
    [bookings],
  )

  const tableViewModels = useMemo(
    () => tables.map((table) => buildTableViewModel(table, bookingById)),
    [bookingById, tables],
  )

  const selectedTable = useMemo(
    () => tableViewModels.find((table) => table.id === selectedTableId) || null,
    [selectedTableId, tableViewModels],
  )

  const summaryItems = [
    { key: 'total', label: 'Tổng bàn', value: tomTatTonKhoBan.total, dot: 'bg-slate-400' },
    { key: 'available', label: 'Trống', value: tomTatTonKhoBan.available, dot: TABLE_STATUS_STYLES.AVAILABLE.dot },
    { key: 'occupied', label: 'Đang phục vụ', value: tomTatTonKhoBan.occupied, dot: TABLE_STATUS_STYLES.OCCUPIED.dot },
    { key: 'held', label: 'Đã đặt', value: tomTatTonKhoBan.held, dot: TABLE_STATUS_STYLES.HELD.dot },
    { key: 'dirty', label: 'Chờ dọn', value: tomTatTonKhoBan.dirty, dot: TABLE_STATUS_STYLES.DIRTY.dot },
  ]

  const handleOpenDrawer = (tableId) => setSelectedTableId(tableId)
  const handleCloseDrawer = () => setSelectedTableId(null)

  const handleMarkReady = async (event, tableId) => {
    event.stopPropagation()
    await xuLyDanhDauBanSanSang?.(tableId)
  }

  const tabItems = tomTatBan.map((area) => {
    const areaTables = tableViewModels.filter((table) => table.areaId === area.id)

    return {
      key: area.id,
      label: (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{area.name}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {area.available}/{area.total}
          </span>
        </div>
      ),
      children: areaTables.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(126px,1fr))] gap-3">
          {areaTables.map((table) => (
            <button
              key={table.id}
              type="button"
              onClick={() => handleOpenDrawer(table.id)}
              className={`group relative flex min-h-[138px] flex-col justify-between rounded-[20px] border p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 ${table.statusStyle.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${table.statusStyle.dot}`} />

                <div className="flex items-center gap-2">
                  {table.status === 'DIRTY' && (
                    <Button
                      size="small"
                      shape="circle"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={(event) => handleMarkReady(event, table.id)}
                      aria-label={`Đánh dấu ${table.displayName} sẵn sàng lại`}
                      className="!h-7 !w-7 !border !border-emerald-200 !bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100"
                    />
                  )}

                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${table.statusStyle.surface}`}>
                    <UserOutlined className="text-[10px]" />
                    {table.capacity}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
                <div className="text-[1.35rem] font-black leading-none tracking-[-0.04em] text-inherit md:text-[1.45rem]">
                  {table.displayName}
                </div>
                {table.bookingCode ? (
                  <div className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${table.statusStyle.subtle}`}>
                    {table.bookingCode}
                  </div>
                ) : null}
              </div>

              <div className="flex items-end justify-between gap-2 text-[11px]">
                <span className={`font-semibold ${table.statusStyle.accent}`}>{table.statusLabel}</span>
                {table.timeText ? (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-semibold ${table.statusStyle.surface}`}>
                    <ClockCircleOutlined className="text-[10px]" />
                    {table.timeText}
                  </span>
                ) : <span />}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bàn trong khu vực này" />
        </div>
      ),
    }
  })

  return (
    <>
      <article className="rounded-[28px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">POS floor map</p>
              <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">Tổng quan sơ đồ bàn</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">{phamViLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${TABLE_STATUS_STYLES.AVAILABLE.dot}`} /> Trống
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${TABLE_STATUS_STYLES.HELD.dot}`} /> Đã đặt
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${TABLE_STATUS_STYLES.OCCUPIED.dot}`} /> Đang phục vụ
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${TABLE_STATUS_STYLES.DIRTY.dot}`} /> Chờ dọn
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {summaryItems.map((item) => (
              <div key={item.key} className="inline-flex min-w-[116px] items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 shadow-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                <div>
                  <div className="text-lg font-bold leading-none text-slate-900">{item.value}</div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-[#FCFCFD] px-2 py-3 md:px-3">
            <Tabs items={tabItems} animated size="middle" className="admin-pos-table-tabs" />
          </div>
        </div>
      </article>

      <Drawer
        open={Boolean(selectedTable)}
        onClose={handleCloseDrawer}
        width={420}
        destroyOnClose
        title={selectedTable ? (
          <div className="flex items-center justify-between gap-3 pr-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Chi tiết bàn</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{selectedTable.displayName}</div>
            </div>
            <Badge
              color={selectedTable.statusStyle.badgeColor}
              text={<span className="text-sm font-semibold text-slate-600">{selectedTable.statusLabel}</span>}
            />
          </div>
        ) : null}
      >
        {selectedTable ? (
          <div className="flex flex-col gap-4">
            <div className={`rounded-[22px] border p-4 shadow-sm ${selectedTable.statusStyle.drawerSurface}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Khu vực</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{selectedTable.areaLabel}</div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${selectedTable.statusStyle.surface}`}>
                  <UserOutlined />
                  {selectedTable.capacity} ghế
                </span>
              </div>

              {selectedTable.bookingCode || selectedTable.timeText ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Booking</div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">{selectedTable.bookingCode || '—'}</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Giờ vào</div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">{selectedTable.timeText || '—'}</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-3.5 py-3">
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Sức chứa</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{selectedTable.capacity} khách</div>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-3.5 py-3">
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Giờ vào</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{selectedTable.timeText || 'Chưa có'}</div>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Khối action</div>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                  style={drawerButtonStyles.order}
                >
                  Thêm món / Gọi món
                </Button>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CreditCardOutlined />}
                  style={drawerButtonStyles.payment}
                >
                  Thanh toán
                </Button>
                <Button size="large" block icon={<SwapOutlined />}>
                  Đổi bàn
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}

function BanAnTab(props) {
  const { variant = 'legacy' } = props

  if (variant === 'pos') {
    return <PosBanAnTab {...props} />
  }

  return <LegacyBanAnTab {...props} />
}

export default BanAnTab
