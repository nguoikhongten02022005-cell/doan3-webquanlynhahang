import { THONG_DIEP_HOTLINE_NHOM_DONG, SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN, PHUT_KET_THUC_CAO_DIEM, PHUT_BAT_DAU_CAO_DIEM } from './hangSo'
import { phanTichGioThanhPhut } from './khaDung'

export const taoMaDatBan = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DB-'
  for (let i = 0; i < 6; i += 1) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export const laNhomDongChiDatQuaHotline = (guestCount) => guestCount > SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN

export const layThoiLuongBuaAn = (guestCount, timeValue) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = timeValue ? phanTichGioThanhPhut(timeValue) : 0
  const isPeakHour = timeInMinutes >= PHUT_BAT_DAU_CAO_DIEM && timeInMinutes <= PHUT_KET_THUC_CAO_DIEM

  if (parsedGuests <= 2) return isPeakHour ? 75 : 90
  if (parsedGuests <= 6) return isPeakHour ? 105 : 120
  return isPeakHour ? 120 : 135
}

export const layThoiLuongBuaAnText = (guestCount, timeValue) => {
  const duration = layThoiLuongBuaAn(guestCount, timeValue)
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours === 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}

export const layQuyTacVanHanh = (guestCount, seatingArea, timeValue) => {
  const parsedGuests = Number(guestCount) || 0
  const items = [
    { icon: '🕒', text: 'Giữ bàn 15 phút sau giờ hẹn.' },
    { icon: '🪑', text: 'Khu vực ngồi là ưu tiên, không cam kết 100%.' },
    { icon: '📞', text: 'Một số booking có thể cần host gọi lại để xác nhận.' },
  ]

  if (seatingArea === 'PHONG_VIP') {
    items.push({ icon: '◆', text: 'Phòng riêng / VIP có thể áp dụng phụ thu tùy thời điểm.' })
  }

  if (seatingArea === 'BAN_CONG') {
    items.push({ icon: '☼', text: 'Ban công / ngoài trời phụ thuộc thời tiết và tình trạng phục vụ thực tế.' })
  }

  if (parsedGuests >= 8 || (timeValue && phanTichGioThanhPhut(timeValue) >= PHUT_BAT_DAU_CAO_DIEM && phanTichGioThanhPhut(timeValue) <= PHUT_KET_THUC_CAO_DIEM)) {
    items.push({ icon: '✳️', text: 'Nhóm đông hoặc giờ cao điểm có thể chuyển sang trạng thái cần gọi lại.' })
  }

  return items
}

export const layTrangThaiGuiDatBan = ({ seatingArea, guestCount, time, notes }) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = time ? phanTichGioThanhPhut(time) : 0
  const isPeakHour = timeInMinutes >= PHUT_BAT_DAU_CAO_DIEM && timeInMinutes <= PHUT_KET_THUC_CAO_DIEM
  const hasSpecialRequest = Boolean(notes?.trim())

  if (seatingArea === 'PHONG_VIP' || parsedGuests >= 8 || isPeakHour || hasSpecialRequest) return 'CAN_GOI_LAI'
  return 'DA_XAC_NHAN'
}

export const layTieuDeTrangThaiDatBan = (status) => {
  if (status === 'DA_XAC_NHAN') return 'Đặt bàn thành công'
  if (status === 'CAN_GOI_LAI') return 'Yêu cầu đã được ghi nhận'
  if (status === 'TU_CHOI_HET_CHO') return 'Nhà hàng hiện chưa thể nhận booking này'
  return 'Yêu cầu đặt bàn đã được ghi nhận'
}

export const layThongDiepTrangThaiDatBan = (status, seatingArea) => {
  if (status === 'DA_XAC_NHAN') {
    return 'Bàn của bạn đã được giữ đến 15 phút sau giờ hẹn.'
  }

  if (status === 'CAN_GOI_LAI') {
    return seatingArea === 'PHONG_VIP'
      ? 'Host sẽ gọi lại để xác nhận phương án phục vụ, vị trí ngồi và phụ thu nếu có.'
      : 'Host sẽ gọi lại để xác nhận phương án phục vụ phù hợp.'
  }

  if (status === 'TU_CHOI_HET_CHO') {
    return 'Hiện chưa thể giữ bàn cho yêu cầu này. Vui lòng chọn khung giờ khác hoặc liên hệ hotline để được hỗ trợ nhanh hơn.'
  }

  return 'Yêu cầu của bạn đã được ghi nhận.'
}

export const layDanhSachChinhSach = (guestCount, seatingArea, timeValue) => ([
  { icon: '📞', text: `Nhóm trên ${SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN} khách vui lòng liên hệ hotline để được hỗ trợ trực tiếp.` },
  ...layQuyTacVanHanh(guestCount, seatingArea, timeValue),
])

export { THONG_DIEP_HOTLINE_NHOM_DONG }
