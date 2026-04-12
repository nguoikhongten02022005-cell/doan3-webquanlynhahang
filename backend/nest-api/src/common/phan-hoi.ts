export const taoPhanHoi = (duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) => ({
  success: true,
  data: duLieu,
  message: thongDiep,
  meta,
})
