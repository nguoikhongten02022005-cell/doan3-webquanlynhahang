// Enum trạng thái bàn - nguồn duy nhất cho toàn bộ frontend
// Giá trị lưu trong DB là tiếng Anh, alias tiếng Việt để so sánh

export const TRANG_THAI_BAN = Object.freeze({
  TRONG: 'Available',
  GIU_CHO: 'Reserved',
  DANG_SU_DUNG: 'Occupied',
  BAN: 'Maintenance',
})

// Tập hợp tất cả giá trị có thể gặp (cả tiếng Anh lẫn tiếng Việt)
export const GIA_TRI_TRONG = ['TRONG', 'Available']
export const GIA_TRI_GIU_CHO = ['GIU_CHO', 'Reserved', 'CHO_THANH_TOAN']
export const GIA_TRI_DANG_SU_DUNG = ['DANG_SU_DUNG', 'CO_KHACH', 'Occupied']
export const GIA_TRI_BAN = ['BAN', 'CAN_DON', 'Maintenance', 'DIRTY']

// Hàm chuẩn hóa bất kỳ giá trị nào về key tiếng Việt không dấu
export const chuanHoaTrangThaiBan = (trangThai = '') => {
  const giaTri = String(trangThai || '').trim().toUpperCase()

  if (GIA_TRI_TRONG.map((v) => v.toUpperCase()).includes(giaTri)) return 'TRONG'
  if (GIA_TRI_GIU_CHO.map((v) => v.toUpperCase()).includes(giaTri)) return 'GIU_CHO'
  if (GIA_TRI_DANG_SU_DUNG.map((v) => v.toUpperCase()).includes(giaTri)) return 'CO_KHACH'
  if (GIA_TRI_BAN.map((v) => v.toUpperCase()).includes(giaTri)) return 'CAN_DON'

  // Fallback an toàn: coi là chờ dọn (không cho dùng bàn nếu không rõ tình trạng)
  return 'CAN_DON'
}

// Hàm kiểm tra bàn có khả dụng để đặt không (trống = Available)
export const banKhaDungDat = (trangThai = '') => {
  const chuanHoa = chuanHoaTrangThaiBan(trangThai)
  return chuanHoa === 'TRONG'
}

// Hàm kiểm tra bàn đang bận (không thể đặt)
export const banDangBan = (trangThai = '') => {
  const chuanHoa = chuanHoaTrangThaiBan(trangThai)
  return chuanHoa === 'GIU_CHO' || chuanHoa === 'CO_KHACH' || chuanHoa === 'CAN_DON'
}
