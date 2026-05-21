import { TRANG_THAI_BAN, chuanHoaTrangThaiBan } from '../constants/trangThaiBan'

export { TRANG_THAI_BAN }

export const chuanHoaBanChoNoiBo = (table) => {
  if (!table || typeof table !== 'object') return null
  const status = chuanHoaTrangThaiBan(table.status || table.trangThai || table.TrangThai || '')
  const rawAreaText = table.rawAreaText || table.khuVuc || table.KhuVuc || table.viTri || table.ViTri || ''
  const note = table.note || table.ghiChu || table.GhiChu || ''

  return {
    ...table,
    id: table.id || table.code || table.maBan || table.MaBan,
    code: table.code || table.maBan || table.MaBan,
    name: table.name || `Bàn ${table.tableNumber || table.soBan || table.SoBan || ''}`.trim(),
    areaId: table.areaId || rawAreaText,
    rawAreaText,
    capacity: Number(table.capacity ?? table.soChoNgoi ?? table.SoChoNgoi ?? 0),
    status,
    note,
  }
}
