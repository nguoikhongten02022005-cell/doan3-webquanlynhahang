import { useMemo, useState } from 'react'
import { HOST_NHAN_TRANG_THAI_DAT_BAN, CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO } from '../../../data/duLieuDatBan'
import { dinhDangNgayGio, dinhDangSoKhach, laySacThaiTrangThaiDatBan, layNhanKenhXacNhan, layNhanChoNgoi } from '../dinhDang'
import {
  coTheGanBanChoDatBan,
  coTheCheckInDatBan,
  coTheHoanThanhDatBan,
  coTheDanhDauKhongDen,
  layGhiChuUuTienDatBan,
  khopTimKiemDatBan,
  canXacNhanThuCong,
} from '../boChon'

const DEFAULT_FORM_VALUES = {
  name: '',
  phone: '',
  email: '',
  guests: '2',
  date: '',
  time: '',
  seatingArea: 'KHONG_UU_TIEN',
  notes: '',
  internalNote: '',
  status: 'DA_XAC_NHAN',
}

const CREATE_STATUS_OPTIONS = CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.filter((status) => Boolean(HOST_NHAN_TRANG_THAI_DAT_BAN[status]))

const ACTION_CONFIRMATION_COPY = {
  checkIn: {
    title: 'Xác nhận check-in',
    confirmLabel: 'Xác nhận check-in',
    getMessage: (booking) => `Đánh dấu booking ${booking.bookingCode} là đã check-in và chuyển bàn sang trạng thái đang phục vụ?`,
  },
  complete: {
    title: 'Xác nhận hoàn thành',
    confirmLabel: 'Hoàn thành booking',
    getMessage: (booking) => `Hoàn thành booking ${booking.bookingCode} và giải phóng các bàn đang gán?`,
  },
  noShow: {
    title: 'Xác nhận không đến',
    confirmLabel: 'Đánh dấu không đến',
    getMessage: (booking) => `Đánh dấu khách của booking ${booking.bookingCode} là không đến và trả lại bàn đang giữ?`,
  },
}

function DatBanTab({
  hangDoiDatBan,
  handleCreateInternalBooking,
  handleUpdateInternalBooking,
  handleAssignTables,
  handleCheckIn,
  handleComplete,
  xuLyKhachKhongDen,
  phamViLabel,
  getAvailableTablesForBooking,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [formMode, setFormMode] = useState('create')
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [formError, setFormError] = useState('')
  const [assigningBooking, setAssigningBooking] = useState(null)
  const [selectedTableIds, setSelectedTableIds] = useState([])
  const [assignModalError, setAssignModalError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  const visibleBookings = useMemo(
    () => hangDoiDatBan.filter((booking) => khopTimKiemDatBan(booking, searchQuery)),
    [hangDoiDatBan, searchQuery],
  )

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

    const result = formMode === 'edit'
      ? await handleUpdateInternalBooking(editingBookingId, duLieuGuiDi)
      : await handleCreateInternalBooking(duLieuGuiDi)

    if (!result?.success) {
      setFormError(result?.error || 'Không thể lưu đặt bàn nội bộ.')
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
      guests: String(booking.guests || '2'),
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
    if (!assigningBooking) {
      return
    }

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
    if (!pendingAction?.booking) {
      return
    }

    const { booking, type } = pendingAction
    let ketQua = null

    if (type === 'checkIn') {
      ketQua = await handleCheckIn(booking.id)
    }

    if (type === 'complete') {
      ketQua = await handleComplete(booking.id)
    }

    if (type === 'noShow') {
      ketQua = await xuLyKhachKhongDen(booking.id)
    }

    if (!ketQua?.success) {
      setFormError(ketQua?.error || 'Không thể thực hiện thao tác này.')
      return
    }

    setFormError('')
    resetPendingAction()
  }

  const pendingActionCopy = pendingAction ? ACTION_CONFIRMATION_COPY[pendingAction.type] : null

  return (
    <section className="van-hanh-board-card">
      <div className="van-hanh-board-head">
        <h2>Danh sách booking</h2>
        <span>{visibleBookings.length} yêu cầu · {phamViLabel}</span>
      </div>

      <div className="noi-bo-dat-ban-toolbar">
        <input
          type="text"
          className="truong-nhap"
          placeholder="Tìm theo mã booking, tên khách hoặc SĐT"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <button type="button" className="btn nut-phu" onClick={resetForm}>
          {formMode === 'edit' ? 'Tạo booking mới' : 'Làm mới form'}
        </button>
      </div>

      <article className="ho-so-card noi-bo-dat-ban-form-card">
        <div className="van-hanh-board-head">
          <h2>{formMode === 'edit' ? `Sửa booking #${editingBookingId}` : 'Tạo đặt bàn nội bộ'}</h2>
          <span>{formMode === 'edit' ? 'Cập nhật nhanh cho lễ tân/host' : 'Dành cho staff/admin'}</span>
        </div>

        <form className="noi-bo-mon-form" onSubmit={handleSubmit}>
          <div className="noi-bo-mon-form-grid">
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-name">
              <span className="nhan-truong">Tên khách</span>
              <input id="noi-bo-dat-ban-name" type="text" className="truong-nhap" value={formValues.name} onChange={handleChange('name')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-phone">
              <span className="nhan-truong">Số điện thoại</span>
              <input id="noi-bo-dat-ban-phone" type="text" className="truong-nhap" value={formValues.phone} onChange={handleChange('phone')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-email">
              <span className="nhan-truong">Email</span>
              <input id="noi-bo-dat-ban-email" type="email" className="truong-nhap" value={formValues.email} onChange={handleChange('email')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-guests">
              <span className="nhan-truong">Số khách</span>
              <input id="noi-bo-dat-ban-guests" type="number" min="1" className="truong-nhap" value={formValues.guests} onChange={handleChange('guests')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-date">
              <span className="nhan-truong">Ngày</span>
              <input id="noi-bo-dat-ban-date" type="date" className="truong-nhap" value={formValues.date} onChange={handleChange('date')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-time">
              <span className="nhan-truong">Giờ</span>
              <input id="noi-bo-dat-ban-time" type="time" className="truong-nhap" value={formValues.time} onChange={handleChange('time')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-area">
              <span className="nhan-truong">Khu vực</span>
              <select id="noi-bo-dat-ban-area" className="truong-nhap" value={formValues.seatingArea} onChange={handleChange('seatingArea')}>
                <option value="KHONG_UU_TIEN">Không ưu tiên</option>
                <option value="SANH_CHINH">Sảnh chính</option>
                <option value="PHONG_VIP">Phòng VIP</option>
                <option value="BAN_CONG">Ban công</option>
                <option value="QUAY_BAR">Quầy bar</option>
              </select>
            </label>
            {formMode === 'create' ? (
              <label className="nhom-truong noi-bo-mon-field" htmlFor="noi-bo-dat-ban-status">
                <span className="nhan-truong">Trạng thái ban đầu</span>
                <select id="noi-bo-dat-ban-status" className="truong-nhap" value={formValues.status} onChange={handleChange('status')}>
                  {CREATE_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{HOST_NHAN_TRANG_THAI_DAT_BAN[status]}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="nhom-truong noi-bo-mon-field noi-bo-mon-field-wide" htmlFor="noi-bo-dat-ban-notes">
              <span className="nhan-truong">Ghi chú khách</span>
              <textarea id="noi-bo-dat-ban-notes" className="truong-van-ban" rows="2" value={formValues.notes} onChange={handleChange('notes')} />
            </label>
            <label className="nhom-truong noi-bo-mon-field noi-bo-mon-field-wide" htmlFor="noi-bo-dat-ban-noi-bo-note">
              <span className="nhan-truong">Ghi chú nội bộ</span>
              <textarea id="noi-bo-dat-ban-noi-bo-note" className="truong-van-ban" rows="2" value={formValues.internalNote} onChange={handleChange('internalNote')} />
            </label>
          </div>

          {formError ? <p className="loi-bieu-mau">{formError}</p> : null}

          <div className="noi-bo-mon-form-actions">
            <button type="submit" className="btn nut-chinh">
              {formMode === 'edit' ? 'Lưu cập nhật' : 'Tạo booking'}
            </button>
            {formMode === 'edit' ? (
              <button type="button" className="btn nut-phu" onClick={resetForm}>
                Hủy sửa
              </button>
            ) : null}
          </div>
        </form>
      </article>

      {visibleBookings.length === 0 ? (
        <div className="van-hanh-empty-state">Chưa có booking phù hợp với bộ lọc hiện tại.</div>
      ) : (
        <div className="van-hanh-dat-ban-list noi-bo-list-top-gap">
          {visibleBookings.map((booking) => {
            const assignedTables = booking.assignedTables || []
            const canAssignTables = coTheGanBanChoDatBan(booking)
            const canCheckIn = coTheCheckInDatBan(booking)
            const canComplete = coTheHoanThanhDatBan(booking)
            const canNoShow = coTheDanhDauKhongDen(booking)

            return (
              <article key={booking.id} className="van-hanh-dat-ban-card">
                <div className="van-hanh-dat-ban-top">
                  <div>
                    <strong>{booking.bookingCode || `DB-${booking.id}`}</strong>
                    <p>{booking.name} · {booking.phone}</p>
                  </div>
                  <span className={`nhan-trang-thai tone-${laySacThaiTrangThaiDatBan(booking.status)}`}>
                    {HOST_NHAN_TRANG_THAI_DAT_BAN[booking.status] || booking.status}
                  </span>
                </div>

                <div className="van-hanh-dat-ban-meta">
                  <p><span>Ngày giờ</span><strong>{dinhDangNgayGio(booking.date, booking.time)}</strong></p>
                  <p><span>Số khách</span><strong>{dinhDangSoKhach(booking.guests)}</strong></p>
                  <p><span>Khu vực</span><strong>{layNhanChoNgoi(booking.seatingArea)}</strong></p>
                  <p><span>Kênh xác nhận</span><strong>{layNhanKenhXacNhan(booking.confirmationChannel)}</strong></p>
                </div>

                <div className="van-hanh-dat-ban-meta noi-bo-dat-ban-meta-extended">
                  <p>
                    <span>Bàn đã gán</span>
                    <strong>{assignedTables.length > 0 ? assignedTables.map((table) => table.code).join(', ') : 'Chưa gán bàn'}</strong>
                  </p>
                  <p>
                    <span>Nguồn</span>
                    <strong>{booking.source === 'internal' ? 'Nội bộ' : 'Web'}</strong>
                  </p>
                </div>

                {canXacNhanThuCong(booking) && (
                  <p className="van-hanh-dat-ban-note van-hanh-dat-ban-note-priority">
                    {layGhiChuUuTienDatBan(booking) || 'Booking này cần host xác nhận trước khi chốt bàn.'}
                  </p>
                )}
                {booking.notes && <p className="van-hanh-dat-ban-note">Ghi chú: {booking.notes}</p>}
                {booking.internalNote && <p className="van-hanh-dat-ban-note">Nội bộ: {booking.internalNote}</p>}

                <div className="van-hanh-dat-ban-actions">
                  <button type="button" className="van-hanh-action-btn" onClick={() => handleEditBooking(booking)}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="van-hanh-action-btn"
                    onClick={() => openAssignModal(booking)}
                    disabled={!canAssignTables}
                  >
                    {assignedTables.length > 0 ? 'Đổi bàn' : 'Gán bàn'}
                  </button>
                  <button
                    type="button"
                    className="van-hanh-action-btn"
                    onClick={() => openConfirmAction('checkIn', booking)}
                    disabled={!canCheckIn}
                  >
                    Check-in
                  </button>
                  <button
                    type="button"
                    className="van-hanh-action-btn"
                    onClick={() => openConfirmAction('complete', booking)}
                    disabled={!canComplete}
                  >
                    Hoàn thành
                  </button>
                  <button
                    type="button"
                    className="van-hanh-action-btn"
                    onClick={() => openConfirmAction('noShow', booking)}
                    disabled={!canNoShow}
                  >
                    Không đến
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {assigningBooking ? (
        <div className="noi-bo-dat-ban-hop-thoai-overlay" role="dialog" aria-modal="true" aria-labelledby="dat-ban-assign-hop-thoai-title" onClick={resetAssignModal}>
          <div className="noi-bo-dat-ban-modal ho-so-card" onClick={(event) => event.stopPropagation()}>
            <div className="van-hanh-board-head noi-bo-dat-ban-hop-thoai-head">
              <div>
                <h2 id="dat-ban-assign-hop-thoai-title">Gán bàn cho booking</h2>
                <span>{assigningBooking.bookingCode}</span>
              </div>
              <button type="button" className="noi-bo-dat-ban-hop-thoai-close" onClick={resetAssignModal} aria-label="Đóng modal gán bàn">
                ×
              </button>
            </div>

            <div className="van-hanh-dat-ban-meta noi-bo-dat-ban-hop-thoai-meta">
              <p><span>Khách</span><strong>{assigningBooking.name}</strong></p>
              <p><span>Số khách</span><strong>{dinhDangSoKhach(assigningBooking.guests)}</strong></p>
              <p><span>Khu vực ưu tiên</span><strong>{layNhanChoNgoi(assigningBooking.seatingArea)}</strong></p>
              <p><span>Thời gian</span><strong>{dinhDangNgayGio(assigningBooking.date, assigningBooking.time)}</strong></p>
            </div>

            <div className="noi-bo-dat-ban-assign-summary">
              <div>
                <span>Đang gán</span>
                <strong>
                  {assigningBooking.assignedTables?.length
                    ? assigningBooking.assignedTables.map((table) => table.code).join(', ')
                    : 'Chưa gán bàn'}
                </strong>
              </div>
              <div>
                <span>Sức chứa đang chọn</span>
                <strong className={selectedCapacity < Number(assigningBooking.guests || 0) ? 'is-warning' : ''}>
                  {selectedCapacity}/{Number(assigningBooking.guests) || 0} khách
                </strong>
              </div>
            </div>

            <div className="noi-bo-dat-ban-ban-list" aria-label="Danh sách bàn hợp lệ">
              {assignableTables.map((table) => {
                const isSelected = selectedTableIds.includes(table.id)
                const isCurrent = Array.isArray(assigningBooking.assignedTableIds) && assigningBooking.assignedTableIds.includes(table.id)

                return (
                  <button
                    key={table.id}
                    type="button"
                    className={`noi-bo-dat-ban-ban-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTableSelection(table.id)}
                  >
                    <div>
                      <strong>{table.code}</strong>
                      <span>{layNhanChoNgoi(table.areaId)} · {table.capacity} khách</span>
                    </div>
                    {isCurrent ? <small>Đang gán</small> : <small>{isSelected ? 'Đã chọn' : 'Chọn bàn'}</small>}
                  </button>
                )
              })}
            </div>

            {assignModalError ? <p className="loi-bieu-mau">{assignModalError}</p> : null}

            <div className="noi-bo-dat-ban-hop-thoai-actions">
              <button type="button" className="btn nut-phu" onClick={resetAssignModal}>
                Hủy
              </button>
              <button type="button" className="btn nut-chinh" onClick={handleAssignSubmit}>
                Lưu gán bàn
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingAction && pendingActionCopy ? (
        <div className="noi-bo-dat-ban-hop-thoai-overlay" role="dialog" aria-modal="true" aria-labelledby="dat-ban-confirm-hop-thoai-title" onClick={resetPendingAction}>
          <div className="noi-bo-dat-ban-modal noi-bo-dat-ban-confirm-modal ho-so-card" onClick={(event) => event.stopPropagation()}>
            <div className="van-hanh-board-head noi-bo-dat-ban-hop-thoai-head">
              <div>
                <h2 id="dat-ban-confirm-hop-thoai-title">{pendingActionCopy.title}</h2>
                <span>{pendingAction.booking.bookingCode}</span>
              </div>
            </div>

            <p className="noi-bo-dat-ban-confirm-text">{pendingActionCopy.getMessage(pendingAction.booking)}</p>

            <div className="noi-bo-dat-ban-hop-thoai-actions">
              <button type="button" className="btn nut-phu" onClick={resetPendingAction}>
                Hủy
              </button>
              <button type="button" className="btn nut-chinh" onClick={handleConfirmAction}>
                {pendingActionCopy.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default DatBanTab
