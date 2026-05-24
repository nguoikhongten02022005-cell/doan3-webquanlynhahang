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
    maBan: table.maBan || table.MaBan || table.code || table.id || '',
    name: table.name || table.tenBan || table.TenBan || `Bàn ${table.tableNumber || table.soBan || table.SoBan || ''}`.trim(),
    tenBan: table.tenBan || table.TenBan || table.name || '',
    tableNumber: Number(table.tableNumber ?? table.soBan ?? table.SoBan ?? 0),
    soBan: Number(table.soBan ?? table.SoBan ?? table.tableNumber ?? 0),
    areaId: table.areaId || rawAreaText,
    khuVuc: table.khuVuc || table.KhuVuc || rawAreaText,
    viTri: table.viTri || table.ViTri || '',
    rawAreaText,
    capacity: Number(table.capacity ?? table.soChoNgoi ?? table.SoChoNgoi ?? 0),
    sucChua: Number(table.sucChua ?? table.capacity ?? table.soChoNgoi ?? table.SoChoNgoi ?? 0),
    status,
    trangThai: table.trangThai || table.TrangThai || status,
    note,
  }
}
