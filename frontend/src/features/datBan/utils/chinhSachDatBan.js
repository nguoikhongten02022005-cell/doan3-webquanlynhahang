import { TRANG_THAI_BAN } from '../../../services/dichVuBanAn.js'
import { chuanHoaDanhSachIdBanDaGan } from './anhXaDatBan.js'

export const CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const CAC_TRANG_THAI_DAT_BAN_DA_KET_THUC = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

export const CAC_TRANG_THAI_DAT_BAN_NOI_BO_CO_THE_SUA = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
])

export const CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO = new Set([
  'CHO_XAC_NHAN',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
])

export const CHUYEN_TRANG_THAI_THU_CONG = {
  YEU_CAU_DAT_BAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CHO_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CAN_GOI_LAI: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  GIU_CHO_TAM: new Set(['DA_XAC_NHAN', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN', 'TU_CHOI_HET_CHO']),
  DA_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_GHI_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_CHECK_IN: new Set(['DA_XEP_BAN', 'DA_HOAN_THANH']),
  DA_XEP_BAN: new Set(['DA_HOAN_THANH']),
}

export const laTrangThaiDaCheckIn = (status) => status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN'

export const laTrangThaiDaHoanTat = (status) => CAC_TRANG_THAI_DAT_BAN_DA_KET_THUC.has(status)

export const coTheHuyDatBan = (status) => (
  status === 'CHO_XAC_NHAN'
  || status === 'YEU_CAU_DAT_BAN'
  || status === 'GIU_CHO_TAM'
  || status === 'CAN_GOI_LAI'
)

export const coTheSuaDatBanNoiBo = (booking) => {
  if (!booking) {
    return false
  }

  return !laTrangThaiDaCheckIn(booking.status) && !laTrangThaiDaHoanTat(booking.status) && CAC_TRANG_THAI_DAT_BAN_NOI_BO_CO_THE_SUA.has(booking.status)
}

export const coTheChuyenTrangThaiDatBanThuCong = (booking, nextStatus) => {
  if (!booking || !nextStatus || booking.status === nextStatus) {
    return false
  }

  if (laTrangThaiDaHoanTat(booking.status)) {
    return false
  }

  const allowedStatuses = CHUYEN_TRANG_THAI_THU_CONG[booking.status]
  if (!allowedStatuses || !allowedStatuses.has(nextStatus)) {
    return false
  }

  if ((nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN') && !chuanHoaDanhSachIdBanDaGan(booking.assignedTableIds).length) {
    return false
  }

  return true
}

export const taiDuLieuBanCongKhai = async ({
  coTheVaoNoiBo,
  layDanhSachBanApi,
  layDanhSachDatBanHost,
}) => {
  const [{ duLieu: duLieuBan }, danhSachDatBan] = await Promise.all([
    layDanhSachBanApi(),
    coTheVaoNoiBo ? layDanhSachDatBanHost() : Promise.resolve([]),
  ])

  return {
    duLieuBan: Array.isArray(duLieuBan) ? duLieuBan : [],
    danhSachDatBan: Array.isArray(danhSachDatBan) ? danhSachDatBan : [],
  }
}

export const kiemTraBanDaGan = ({ assignedTableIds, tables, soLuongKhach, preferredArea, bookingId }) => {
  const selectedTables = assignedTableIds
    .map((tableId) => tables.find((table) => table.id === tableId))
    .filter(Boolean)

  const chuanHoaTrangThaiBan = (trangThai) => {
    if (trangThai === TRANG_THAI_BAN.BAN || trangThai === 'DIRTY') return TRANG_THAI_BAN.BAN
    if (trangThai === TRANG_THAI_BAN.DANG_SU_DUNG || trangThai === 'OCCUPIED') return TRANG_THAI_BAN.DANG_SU_DUNG
    if (trangThai === TRANG_THAI_BAN.GIU_CHO || trangThai === 'HELD') return TRANG_THAI_BAN.GIU_CHO
    return TRANG_THAI_BAN.TRONG
  }

  if (selectedTables.length !== assignedTableIds.length) {
    return { success: false, error: 'Có bàn không tồn tại hoặc đã bị thay đổi. Vui lòng tải lại dữ liệu.' }
  }

  const busyTable = selectedTables.find((table) => table.activeBookingId && String(table.activeBookingId) !== String(bookingId))
  if (busyTable) {
    return { success: false, error: `Bàn ${busyTable.code} hiện đang được sử dụng.` }
  }

  const invalidStatusTable = selectedTables.find((table) => chuanHoaTrangThaiBan(table.status) === TRANG_THAI_BAN.BAN)
  if (invalidStatusTable) {
    return { success: false, error: `Bàn ${invalidStatusTable.code} đang ở trạng thái dọn bàn.` }
  }

  const totalCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0)
  if (soLuongKhach > 0 && totalCapacity < soLuongKhach) {
    return { success: false, error: 'Tổng sức chứa bàn được chọn chưa đủ số khách.' }
  }

  if (preferredArea && preferredArea !== 'KHONG_UU_TIEN') {
    const hasWrongArea = selectedTables.some((table) => table.areaId !== preferredArea)
    if (hasWrongArea) {
      return { success: false, error: 'Bàn được chọn không khớp khu vực ưu tiên của booking.' }
    }
  }

  return { success: true }
}
