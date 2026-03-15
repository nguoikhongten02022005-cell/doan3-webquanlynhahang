import { GOI_Y_NGAY_DONG_CUA, GOI_Y_NGAY_KHONG_HOP_LE, THONG_DIEP_HOTLINE_NHOM_DONG } from './hangSo'
import { layTrangThaiGuiDatBan, laNhomDongChiDatQuaHotline } from './gui'

const normalizePhone = (value) => value.replace(/\s+/g, '').replace(/[^\d+]/g, '')

export const laSoDienThoaiHopLe = (value) => /^(0\d{9,10}|\+84\d{9,10})$/.test(normalizePhone(value))

export const layLoiBuocMot = ({ soLuongKhach, date, time, invalidPastDate, closedDate }) => {
  const errors = {}

  if (!soLuongKhach) {
    errors.guests = 'Vui lòng chọn số khách'
    return errors
  }

  if (laNhomDongChiDatQuaHotline(soLuongKhach)) {
    errors.guests = THONG_DIEP_HOTLINE_NHOM_DONG
    return errors
  }

  if (!date) errors.date = 'Vui lòng chọn ngày'
  else if (invalidPastDate) errors.date = GOI_Y_NGAY_KHONG_HOP_LE
  else if (closedDate) errors.date = GOI_Y_NGAY_DONG_CUA

  if (!time) errors.time = 'Vui lòng chọn khung giờ'

  return errors
}

export const layLoiBuocHai = ({ name, phone }) => {
  const errors = {}

  if (!name.trim()) errors.name = 'Vui lòng nhập họ và tên'
  if (!phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
  else if (!laSoDienThoaiHopLe(phone)) errors.phone = 'Số điện thoại chưa đúng định dạng'

  return errors
}

export const layNhanHanhDongChinh = ({ step, soLuongKhach, date, time, step1Complete, step2Complete, closedDate, seatingArea, notes }) => {
  if (step === 1) {
    if (!soLuongKhach) return 'Chọn số khách'
    if (laNhomDongChiDatQuaHotline(soLuongKhach)) return 'Gọi hotline để đặt nhóm đông'
    if (!date) return 'Chọn ngày'
    if (closedDate) return 'Vui lòng chọn ngày khác'
    if (!time) return 'Chọn giờ'
    if (step1Complete) return 'Tiếp tục nhập thông tin liên hệ'
  }

  if (step === 2) {
    if (step2Complete) return 'Xem lại thông tin đặt bàn'
    return 'Hoàn tất thông tin liên hệ'
  }

  return layTrangThaiGuiDatBan({ seatingArea, soLuongKhach, time, notes }) === 'DA_XAC_NHAN'
    ? 'Xác nhận đặt bàn'
    : 'Gửi yêu cầu đặt bàn'
}
