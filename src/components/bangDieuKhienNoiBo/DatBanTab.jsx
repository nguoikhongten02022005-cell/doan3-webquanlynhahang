import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Badge, Button, Drawer, Empty, Input, InputNumber, Modal, Select, Space, Tag } from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'
import { HOST_NHAN_TRANG_THAI_DAT_BAN, CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO } from '../../data/duLieuDatBan'
import {
  dinhDangNgayGio,
  dinhDangSoKhach,
  laySacThaiTrangThaiDatBan,
  layNhanKenhXacNhan,
  layNhanChoNgoi,
} from '../../features/bangDieuKhienNoiBo/dinhDang'
import {
  coTheGanBanChoDatBan,
  coTheCheckInDatBan,
  coTheHoanThanhDatBan,
  coTheDanhDauKhongDen,
  layGhiChuUuTienDatBan,
  khopTimKiemDatBan,
  canXacNhanThuCong,
} from '../../features/bangDieuKhienNoiBo/boChon'

const { TextArea } = Input

const DEFAULT_FORM_VALUES = {
  name: '',
  phone: '',
  email: '',
  guests: '',
  date: '',
  time: '',
  seatingArea: 'KHONG_UU_TIEN',
  notes: '',
  internalNote: '',
  status: 'DA_XAC_NHAN',
}

const QUICK_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'unassigned', label: 'Chưa gán bàn' },
  { key: 'pending', label: 'Chờ xác nhận' },
]

const PENDING_STATUS_SET = new Set(['YEU_CAU_DAT_BAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN', 'Pending'])

const CREATE_STATUS_OPTIONS = CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.filter((status) => Boolean(HOST_NHAN_TRANG_THAI_DAT_BAN[status]))

const STATUS_TAG_COLORS = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  neutral: 'processing',
}

const ACTION_CONFIRMATION_COPY = {
  checkIn: {
    title: 'Xác nhận check-in',
    confirmLabel: 'Xác nhận check-in',
    message: 'Khách sẽ được chuyển sang trạng thái đang phục vụ và bàn đi kèm sẽ được giữ cho booking này.',
    getMessage: (booking) => `Đánh dấu booking ${booking.bookingCode} là đã check-in và chuyển bàn sang trạng thái đang phục vụ?`,
  },
  complete: {
    title: 'Xác nhận hoàn thành',
    confirmLabel: 'Hoàn thành booking',
    message: 'Hành động này sẽ giải phóng các bàn đang gán và đóng luồng phục vụ cho booking.',
    getMessage: (booking) => `Hoàn thành booking ${booking.bookingCode} và giải phóng các bàn đang gán?`,
  },
  noShow: {
    title: 'Xác nhận khách không đến',
    confirmLabel: 'Đánh dấu không đến',
    message: 'Dùng khi cần trả lại bàn đang giữ và đóng booking mà không thực hiện check-in.',
    getMessage: (booking) => `Đánh dấu khách của booking ${booking.bookingCode} là không đến và trả lại bàn đang giữ?`,
  },
}

const seatingAreaOptions = [
  { value: 'KHONG_UU_TIEN', label: 'Không ưu tiên' },
  { value: 'SANH_CHINH', label: 'Sảnh chính' },
  { value: 'PHONG_VIP', label: 'Khu riêng / VIP' },
  { value: 'BAN_CONG', label: 'Ban công' },
  { value: 'QUAY_BAR', label: 'Quầy bar' },
]

const getStatusTagColor = (status) => STATUS_TAG_COLORS[laySacThaiTrangThaiDatBan(status)] || 'default'

const isTodayLocal = (value) => {
  if (!value) return false
  const parsed = dayjs(value)
  return parsed.isValid() && parsed.isSame(dayjs(), 'day')
}

function applyQuickFilter(bookings, quickFilter) {
  if (quickFilter === 'all') return bookings

  if (quickFilter === 'today') {
    return bookings.filter((booking) => isTodayLocal(booking.date))
  }

  if (quickFilter === 'unassigned') {
    return bookings.filter((booking) => !Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0)
  }

  if (quickFilter === 'pending') {
    return bookings.filter((booking) => PENDING_STATUS_SET.has(booking.status))
  }

  return bookings
}

function getQuickFilterCounts(bookings) {
  return {
    all: bookings.length,
    today: bookings.filter((booking) => isTodayLocal(booking.date)).length,
    unassigned: bookings.filter((booking) => !Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0).length,
    pending: bookings.filter((booking) => PENDING_STATUS_SET.has(booking.status)).length,
  }
}

function DatBanToolbar({
  searchQuery,
  onSearchChange,
  onReset,
  formMode,
  visibleCount,
  phamViLabel,
  quickFilter,
  onQuickFilterChange,
  filterCounts,
}) {
  return (
    <div className="rounded-[20px] border border-[#E5E0DB] bg-white/95 p-3.5 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="m-0 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-900">Danh sách booking</h2>
          <p className="mt-1 mb-0 text-xs leading-5 text-slate-500">{visibleCount} booking · {phamViLabel}</p>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-[560px]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <Input
              allowClear
              size="middle"
              value={searchQuery}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo mã booking, tên khách hoặc SĐT"
              onChange={(event) => onSearchChange(event.target.value)}
              className="booking-admin-search"
            />
            <Button size="middle" onClick={onReset} icon={<PlusOutlined />}>
              {formMode === 'edit' ? 'Tạo mới' : 'Làm mới'}
            </Button>
          </div>

          <Space size={[8, 8]} wrap>
            {QUICK_FILTERS.map((filter) => (
              <CheckableTag
                key={filter.key}
                checked={quickFilter === filter.key}
                onChange={() => onQuickFilterChange(filter.key)}
                className="booking-admin-filter-chip"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span>{filter.label}</span>
                  <Badge count={filterCounts[filter.key] || 0} size="small" color={quickFilter === filter.key ? '#f97316' : '#94a3b8'} />
                </span>
              </CheckableTag>
            ))}
          </Space>
        </div>
      </div>
    </div>
  )
}

function DatBanFormCard({
  formMode,
  editingBookingId,
  formValues,
  formError,
  onFieldChange,
  onSubmit,
  onReset,
}) {
  const title = formMode === 'edit' ? `Sửa booking #${editingBookingId}` : 'Tạo đặt bàn nội bộ'
  const subtitle = formMode === 'edit' ? 'Cập nhật nhanh cho lễ tân / host' : 'Điền nhanh yêu cầu để chốt chỗ ngay tại quầy'

  return (
    <article className="rounded-[22px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-4.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="m-0 text-[1.25rem] font-semibold tracking-[-0.04em] text-slate-900">{title}</h2>
          <p className="mt-1.5 mb-0 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
          {formMode === 'edit' ? 'Edit' : 'Create'}
        </span>
      </div>

      <form className="mt-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Thông tin khách</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Khách hàng & liên hệ</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tên khách</span>
              <Input size="middle" value={formValues.name} onChange={onFieldChange('name')} placeholder="Nguyễn Văn A" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Số điện thoại</span>
              <Input size="middle" value={formValues.phone} onChange={onFieldChange('phone')} placeholder="0901234567" />
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</span>
              <Input size="middle" type="email" value={formValues.email} onChange={onFieldChange('email')} placeholder="khach@example.com" />
            </label>
          </div>
        </section>

        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Thông tin booking</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Thời gian & khu vực</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Ngày</span>
              <Input size="middle" type="date" value={formValues.date} onChange={onFieldChange('date')} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Giờ</span>
              <Input size="middle" type="time" value={formValues.time} onChange={onFieldChange('time')} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Số khách</span>
              <InputNumber
                size="middle"
                min={1}
                value={formValues.guests === '' ? null : Number(formValues.guests)}
                placeholder="Nhập số khách"
                onChange={(value) => onFieldChange('guests')({ target: { value: value == null ? '' : String(value) } })}
                className="!w-full"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Khu vực</span>
              <Select size="middle" value={formValues.seatingArea} options={seatingAreaOptions} onChange={(value) => onFieldChange('seatingArea')({ target: { value } })} />
            </label>
            {formMode === 'create' ? (
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Trạng thái ban đầu</span>
                <Select
                  size="middle"
                  value={formValues.status}
                  options={CREATE_STATUS_OPTIONS.map((status) => ({ value: status, label: HOST_NHAN_TRANG_THAI_DAT_BAN[status] }))}
                  onChange={(value) => onFieldChange('status')({ target: { value } })}
                />
              </label>
            ) : null}
          </div>
        </section>

        <section className="space-y-3 rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Ghi chú</p>
            <h3 className="m-0 text-sm font-semibold text-slate-900">Thông tin bổ sung</h3>
          </div>
          <div className="grid gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Ghi chú khách</span>
              <TextArea rows={3} value={formValues.notes} onChange={onFieldChange('notes')} placeholder="Yêu cầu bàn gần cửa sổ, có trẻ nhỏ..." />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Ghi chú nội bộ</span>
              <TextArea rows={3} value={formValues.internalNote} onChange={onFieldChange('internalNote')} placeholder="Ưu tiên gọi xác nhận lại, cần quản lý duyệt..." />
            </label>
          </div>
        </section>

        {formError ? <Alert type="error" showIcon message={formError} /> : null}

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button size="middle" onClick={onReset}>
            {formMode === 'edit' ? 'Hủy' : 'Reset'}
          </Button>
          <Button type="primary" size="middle" htmlType="submit" icon={<CheckCircleOutlined />}>
            {formMode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </article>
  )
}

function DatBanBookingList({ bookings, onEdit, onAssign, onConfirmAction, onQuickStatusChange }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center shadow-sm">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có booking phù hợp với bộ lọc hiện tại" />
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {bookings.map((booking) => {
        const assignedTables = booking.assignedTables || []
        const isUnassigned = !Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0
        const isPending = PENDING_STATUS_SET.has(booking.status)
        const isUrgentCard = isUnassigned || isPending
        const canAssignTables = coTheGanBanChoDatBan(booking)
        const canCheckIn = coTheCheckInDatBan(booking)
        const canComplete = coTheHoanThanhDatBan(booking)
        const canNoShow = coTheDanhDauKhongDen(booking)
        const daCheckIn = booking.status === 'DA_CHECK_IN'
        const canQuickApprove = PENDING_STATUS_SET.has(booking.status)
        const priorityNote = canXacNhanThuCong(booking)
          ? layGhiChuUuTienDatBan(booking) || 'Booking này cần host xác nhận trước khi chốt bàn.'
          : ''

        return (
          <article
            key={booking.id}
            className={`rounded-[20px] border bg-white/95 p-3.5 shadow-[0_18px_40px_rgba(55,39,28,0.08)] transition-shadow hover:shadow-[0_24px_48px_rgba(55,39,28,0.11)] md:p-4 ${isUrgentCard ? 'border-l-4 border-l-rose-500 border-rose-200 bg-rose-50/60' : 'border-[#E5E0DB]'}`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-base font-semibold tracking-[-0.03em] text-slate-900">
                        {booking.bookingCode || booking.code || `DB-${booking.id}`}
                      </strong>
                      <Tag color={getStatusTagColor(booking.status)} className="!rounded-full !px-2.5 !py-0.5 !text-[10px] !font-semibold !uppercase !tracking-[0.14em]">
                        {HOST_NHAN_TRANG_THAI_DAT_BAN[booking.status] || booking.status}
                      </Tag>
                      {isUnassigned ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-700">
                          Chưa gán bàn
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 mb-0 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{booking.name}</span>
                      {' · '}
                      {booking.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <CalendarOutlined />
                    {dinhDangNgayGio(booking.date, booking.time)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <UserOutlined />
                    {dinhDangSoKhach(booking.guests)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <EnvironmentOutlined />
                    {layNhanChoNgoi(booking.seatingArea)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <PhoneOutlined />
                    {layNhanKenhXacNhan(booking.confirmationChannel)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Bàn đã gán</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">
                      {assignedTables.length > 0 ? assignedTables.map((table) => table.code).join(', ') : 'Chưa gán bàn'}
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Nguồn</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{booking.source === 'internal' ? 'Nội bộ' : 'Web'}</div>
                  </div>
                  {booking.email ? (
                    <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:col-span-2 xl:col-span-1">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Email</div>
                      <div className="mt-1 truncate text-sm font-semibold text-slate-800">{booking.email}</div>
                    </div>
                  ) : null}
                </div>

                {priorityNote ? (
                  <div className="mt-3 rounded-[16px] border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-6 text-amber-800">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600">Ưu tiên xử lý</span>
                    <span>{priorityNote}</span>
                  </div>
                ) : null}

                {canQuickApprove ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => onQuickStatusChange(booking, 'DA_XAC_NHAN')}>
                      Duyệt booking
                    </Button>
                    <Button size="small" icon={<PhoneOutlined />} onClick={() => onQuickStatusChange(booking, 'CAN_GOI_LAI')}>
                      Cần gọi lại
                    </Button>
                    <Button size="small" danger icon={<StopOutlined />} onClick={() => onQuickStatusChange(booking, 'TU_CHOI_HET_CHO')}>
                      Từ chối
                    </Button>
                  </div>
                ) : null}

                {booking.notes ? (
                  <p className="mt-3 mb-0 text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-900">Ghi chú:</span> {booking.notes}</p>
                ) : null}
                {booking.internalNote ? (
                  <p className="mt-1.5 mb-0 text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-900">Nội bộ:</span> {booking.internalNote}</p>
                ) : null}
              </div>

              <div className="w-full lg:max-w-[210px]">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(booking)}>
                    Sửa
                  </Button>
                  {!daCheckIn ? (
                    assignedTables.length === 0 ? (
                      <Button type="primary" danger size="small" icon={<SwapOutlined />} onClick={() => onAssign(booking)} disabled={!canAssignTables}>
                        Gán bàn
                      </Button>
                    ) : (
                      <Button size="small" icon={<SwapOutlined />} onClick={() => onAssign(booking)} disabled={!canAssignTables}>
                        Đổi bàn
                      </Button>
                    )
                  ) : null}
                  <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => onConfirmAction('checkIn', booking)} disabled={!canCheckIn}>
                    Check-in
                  </Button>
                  <Button size="small" icon={<CheckCircleOutlined />} onClick={() => onConfirmAction('complete', booking)} disabled={!canComplete}>
                    Hoàn thành
                  </Button>
                  {!daCheckIn ? (
                    <Button
                      size="small"
                      icon={<StopOutlined />}
                      onClick={() => onConfirmAction('noShow', booking)}
                      disabled={!canNoShow}
                      className="sm:col-span-2 lg:col-span-1 !border-rose-200 !text-rose-500 hover:!border-rose-300 hover:!text-rose-600"
                    >
                      Không đến
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function DatBanAssignModal({ booking, open, selectedTableIds, assignableTables, selectedCapacity, error, onClose, onToggleTable, onSubmit }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={booking ? `Gán bàn · ${booking.bookingCode}` : 'Gán bàn'}
      width={420}
      destroyOnClose
    >
      {booking ? (
        <div className="space-y-4">
          <div className="rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Khách</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{booking.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Số khách</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{dinhDangSoKhach(booking.guests)}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Khu vực ưu tiên</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{layNhanChoNgoi(booking.seatingArea)}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Thời gian</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{dinhDangNgayGio(booking.date, booking.time)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Đang gán</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {booking.assignedTables?.length ? booking.assignedTables.map((table) => table.code).join(', ') : 'Chưa gán bàn'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Sức chứa đang chọn</div>
                <div className={`mt-1 text-sm font-semibold ${selectedCapacity < Number(booking.guests || 0) ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedCapacity}/{Number(booking.guests) || 0} khách
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {assignableTables.map((table) => {
              const isSelected = selectedTableIds.includes(table.id)
              const isCurrent = Array.isArray(booking.assignedTableIds) && booking.assignedTableIds.includes(table.id)

              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => onToggleTable(table.id)}
                  className={`rounded-[18px] border p-3 text-center transition-all ${isSelected ? 'border-emerald-300 bg-emerald-100 shadow-sm' : 'border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:shadow-sm'}`}
                >
                  <strong className="block text-sm font-semibold text-slate-900">{table.code}</strong>
                  <span className="mt-1 block text-[11px] font-medium text-emerald-700">{table.capacity} khách</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-slate-500">{layNhanChoNgoi(table.areaId)}</span>
                  <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {isCurrent ? 'Đang gán' : isSelected ? 'Đã chọn' : 'Bàn trống'}
                  </span>
                </button>
              )
            })}
          </div>

          {error ? <Alert type="error" showIcon message={error} /> : null}

          <div className="flex items-center justify-end gap-2">
            <Button size="middle" onClick={onClose}>Hủy</Button>
            <Button size="middle" type="primary" onClick={onSubmit}>Lưu gán bàn</Button>
          </div>
        </div>
      ) : null}
    </Drawer>
  )
}

function DatBanConfirmModal({ pendingAction, open, onClose, onConfirm }) {
  if (!pendingAction) return null

  const copy = ACTION_CONFIRMATION_COPY[pendingAction.type]
  if (!copy) return null

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okText={copy.confirmLabel}
      cancelText="Hủy"
      title={copy.title}
      centered
    >
      <div className="space-y-3">
        <Alert type="warning" showIcon message={copy.message} />
        <p className="mb-0 text-sm leading-6 text-slate-600">{copy.getMessage(pendingAction.booking)}</p>
      </div>
    </Modal>
  )
}

function DatBanTab({
  hangDoiDatBan,
  handleCreateInternalBooking,
  handleUpdateInternalBooking,
  handleAssignTables,
  handleQuickStatusChange,
  handleCheckIn,
  handleComplete,
  xuLyKhachKhongDen,
  phamViLabel,
  getAvailableTablesForBooking,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState('all')
  const [formMode, setFormMode] = useState('create')
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [formError, setFormError] = useState('')
  const [assigningBooking, setAssigningBooking] = useState(null)
  const [selectedTableIds, setSelectedTableIds] = useState([])
  const [assignModalError, setAssignModalError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  const filterCounts = useMemo(() => getQuickFilterCounts(hangDoiDatBan), [hangDoiDatBan])

  const visibleBookings = useMemo(() => {
    const searched = hangDoiDatBan.filter((booking) => khopTimKiemDatBan(booking, searchQuery))
    return applyQuickFilter(searched, quickFilter)
  }, [hangDoiDatBan, quickFilter, searchQuery])

  const assignableTables = useMemo(
    () => (assigningBooking ? getAvailableTablesForBooking(assigningBooking) : []),
    [assigningBooking, getAvailableTablesForBooking],
  )

  const selectedTables = useMemo(
    () => assignableTables.filter((table) => selectedTableIds.includes(table.id)),
    [assignableTables, selectedTableIds],
  )

  const selectedCapacity = selectedTables.reduce((sum, table) => sum + (Number(table.capacity) || 0), 0)

  const resetForm = () => {
    setFormMode('create')
    setEditingBookingId(null)
    setFormValues(DEFAULT_FORM_VALUES)
    setFormError('')
  }

  const resetAssignModal = () => {
    setAssigningBooking(null)
    setSelectedTableIds([])
    setAssignModalError('')
  }

  const resetPendingAction = () => {
    setPendingAction(null)
  }

  const handleChange = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  const validateForm = () => {
    if (!formValues.name.trim()) return 'Vui lòng nhập tên khách.'
    if (!formValues.phone.trim()) return 'Vui lòng nhập số điện thoại.'
    if (!formValues.date.trim()) return 'Vui lòng chọn ngày.'
    if (!formValues.time.trim()) return 'Vui lòng nhập giờ.'
    if ((Number(formValues.guests) || 0) <= 0) return 'Số khách phải lớn hơn 0.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextError = validateForm()
    if (nextError) {
      setFormError(nextError)
      return
    }

    const duLieuGuiDi = {
      ...formValues,
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      guests: String(Number(formValues.guests) || 0),
      date: formValues.date.trim(),
      time: formValues.time.trim(),
      seatingArea: formValues.seatingArea,
      notes: formValues.notes.trim(),
      internalNote: formValues.internalNote.trim(),
      ...(formMode === 'create' ? { status: formValues.status } : {}),
    }

    const ketQua = formMode === 'edit'
      ? await handleUpdateInternalBooking(editingBookingId, duLieuGuiDi)
      : await handleCreateInternalBooking(duLieuGuiDi)

    if (!ketQua?.success) {
      setFormError(ketQua?.error || 'Không thể lưu đặt bàn nội bộ.')
      return
    }

    resetForm()
  }

  const handleEditBooking = (booking) => {
    setFormMode('edit')
    setEditingBookingId(booking.id)
    setFormValues({
      name: booking.name || '',
      phone: booking.phone || '',
      email: booking.email || '',
      guests: booking.guests ? String(booking.guests) : '',
      date: booking.date || '',
      time: booking.time || '',
      seatingArea: booking.seatingArea || 'KHONG_UU_TIEN',
      notes: booking.notes || '',
      internalNote: booking.internalNote || '',
      status: 'DA_XAC_NHAN',
    })
    setFormError('')
  }

  const openAssignModal = (booking) => {
    const danhSachBanPhuHop = getAvailableTablesForBooking(booking)

    if (danhSachBanPhuHop.length === 0) {
      setFormError(`Không còn bàn phù hợp cho booking ${booking.bookingCode}.`)
      return
    }

    setAssigningBooking(booking)
    setSelectedTableIds(Array.isArray(booking.assignedTableIds) ? booking.assignedTableIds : [])
    setAssignModalError('')
    setFormError('')
  }

  const toggleTableSelection = (tableId) => {
    setSelectedTableIds((currentIds) => (
      currentIds.includes(tableId)
        ? currentIds.filter((id) => id !== tableId)
        : [...currentIds, tableId]
    ))
    setAssignModalError('')
  }

  const handleAssignSubmit = async () => {
    if (!assigningBooking) return

    if (selectedTableIds.length === 0) {
      setAssignModalError('Vui lòng chọn ít nhất một bàn để gán.')
      return
    }

    const ketQua = await handleAssignTables(assigningBooking.id, selectedTableIds)
    if (!ketQua?.success) {
      setAssignModalError(ketQua?.error || 'Không thể gán bàn cho booking này.')
      return
    }

    setFormError('')
    resetAssignModal()
  }

  const openConfirmAction = (type, booking) => {
    setPendingAction({ type, booking })
    setFormError('')
  }

  const handleConfirmAction = async () => {
    if (!pendingAction?.booking) return

    const { booking, type } = pendingAction
    let ketQua = null

    if (type === 'checkIn') ketQua = await handleCheckIn(booking.id)
    if (type === 'complete') ketQua = await handleComplete(booking.id)
    if (type === 'noShow') ketQua = await xuLyKhachKhongDen(booking.id)

    if (!ketQua?.success) {
      setFormError(ketQua?.error || 'Không thể thực hiện thao tác này.')
      return
    }

    setFormError('')
    resetPendingAction()
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.78fr)]">
      <div className="space-y-3">
        <DatBanToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onReset={resetForm}
          formMode={formMode}
          visibleCount={visibleBookings.length}
          phamViLabel={phamViLabel}
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
          filterCounts={filterCounts}
        />

        <DatBanBookingList
          bookings={visibleBookings}
          onEdit={handleEditBooking}
          onAssign={openAssignModal}
          onConfirmAction={openConfirmAction}
          onQuickStatusChange={handleQuickStatusChange}
        />
      </div>

      <div className="xl:sticky xl:top-4 xl:self-start">
        <DatBanFormCard
          formMode={formMode}
          editingBookingId={editingBookingId}
          formValues={formValues}
          formError={formError}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />
      </div>

      <DatBanAssignModal
        booking={assigningBooking}
        open={Boolean(assigningBooking)}
        selectedTableIds={selectedTableIds}
        assignableTables={assignableTables}
        selectedCapacity={selectedCapacity}
        error={assignModalError}
        onClose={resetAssignModal}
        onToggleTable={toggleTableSelection}
        onSubmit={handleAssignSubmit}
      />

      <DatBanConfirmModal
        pendingAction={pendingAction}
        open={Boolean(pendingAction)}
        onClose={resetPendingAction}
        onConfirm={handleConfirmAction}
      />
    </section>
  )
}

export default DatBanTab
