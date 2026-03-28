export const TRANG_THAI_BAN = Object.freeze({
  TRONG: 'Available',
  GIU_CHO: 'Reserved',
  DANG_SU_DUNG: 'Occupied',
  BAN: 'Maintenance',
})

const CAC_TRANG_THAI_BAN_DANG_HOAT_DONG = new Set([
  TRANG_THAI_BAN.GIU_CHO,
  TRANG_THAI_BAN.DANG_SU_DUNG,
])

export const laBanDangHoatDong = (table) => CAC_TRANG_THAI_BAN_DANG_HOAT_DONG.has(table?.status)

export const chuanHoaBanChoNoiBo = (table) => {
  if (!table || typeof table !== 'object') return null
  const status = table.status || table.trangThai || table.TrangThai || TRANG_THAI_BAN.TRONG
  return {
    ...table,
    id: table.id || table.code || table.maBan || table.MaBan,
    code: table.code || table.maBan || table.MaBan,
    name: table.name || `Bàn ${table.tableNumber || table.soBan || table.SoBan || ''}`.trim(),
    areaId: table.areaId || table.viTri || table.ViTri || '',
    capacity: Number(table.capacity ?? table.soChoNgoi ?? table.SoChoNgoi ?? 0),
    status,
  }
}
