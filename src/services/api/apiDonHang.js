import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaDonHang = (order) => {
  if (!order || typeof order !== 'object') {
    return null
  }

  return {
    ...order,
    orderDate: order.datLuc,
    total: Number(order.thanhTien || 0),
    subtotal: Number(order.tamTinh || 0),
    discountAmount: Number(order.tienGiam || 0),
    paymentMethod: order.phuongThucThanhToan,
    note: order.ghiChu,
    tableNumber: order.maBan,
    customer: {
      fullName: order.tenKhachHang,
      phone: order.soDienThoaiKhachHang,
      email: order.emailKhachHang,
      address: order.diaChiKhachHang,
    },
  }
}

const chuanHoaPayloadTaoDonHang = (payload = {}) => ({
  danhSachMon: Array.isArray(payload.items)
    ? payload.items.map((item) => ({
        monAnId: item.menuItemId,
        soLuong: item.quantity,
        kichCo: item.kichCoDaChon || 'M',
        toppingDaChon: Array.isArray(item.toppingDaChon) ? item.toppingDaChon : [],
        ghiChuMon: item.ghiChuRieng || '',
        maBienThe: item.variantKey || '',
      }))
    : [],
  maGiamGiaApDung: payload.voucherCode || '',
  khachHang: {
    tenKhachHang: payload.customer?.fullName || '',
    soDienThoaiKhachHang: payload.customer?.phone || '',
    emailKhachHang: payload.customer?.email || '',
    diaChiKhachHang: payload.customer?.address || '',
  },
  ghiChu: payload.note || '',
  maBan: payload.tableNumber || '',
  phuongThucThanhToan: payload.paymentMethod || 'TIEN_MAT',
  emailNguoiDung: payload.customer?.email || '',
})

const tachVaChuanHoa = (phanHoi) => ({
  ...phanHoi,
  duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDonHang).filter(Boolean) : chuanHoaDonHang(phanHoi.duLieu),
})

export const layDanhSachDonHangApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang')))
export const layDonHangCuaToiApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang/me')))
export const taoDonHangApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/don-hang', chuanHoaPayloadTaoDonHang(payload))))
export const capNhatTrangThaiDonHangApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/don-hang/${id}/status`, { trangThai: status })))
