import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const layGiaTri = (nguon, ...khoa) => {
  for (const key of khoa) {
    if (nguon?.[key] !== undefined && nguon?.[key] !== null) {
      return nguon[key]
    }
  }

  return undefined
}

const chuanHoaChiTietDonHang = (item, index = 0) => {
  if (!item || typeof item !== 'object') {
    return null
  }

  return {
    ...item,
    id: layGiaTri(item, 'id', 'Id') ?? `order-item-${index + 1}`,
    menuItemId: layGiaTri(item, 'menuItemId', 'monAnId', 'MonAnId'),
    name: layGiaTri(item, 'name', 'tenMon', 'TenMon') || `Món ${index + 1}`,
    quantity: Number(layGiaTri(item, 'quantity', 'soLuong', 'SoLuong') || 0),
    price: Number(layGiaTri(item, 'price', 'donGia', 'DonGia') || 0),
    size: layGiaTri(item, 'size', 'kichCo', 'KichCo') || 'M',
    note: layGiaTri(item, 'note', 'ghiChuMon', 'GhiChuMon') || '',
    toppingDaChon: layGiaTri(item, 'toppingDaChon', 'ToppingDaChon') || [],
    variantKey: layGiaTri(item, 'variantKey', 'maBienThe', 'MaBienThe') || '',
  }
}

const chuanHoaDanhSachChiTiet = (items) => (
  Array.isArray(items)
    ? items.map((item, index) => chuanHoaChiTietDonHang(item, index)).filter(Boolean)
    : []
)

const chuanHoaKhachHang = (order) => ({
  fullName: layGiaTri(order, 'tenKhachHang', 'TenKhachHang') || order.customer?.fullName || '',
  phone: layGiaTri(order, 'soDienThoaiKhachHang', 'SoDienThoaiKhachHang') || order.customer?.phone || '',
  email: layGiaTri(order, 'emailKhachHang', 'EmailKhachHang') || order.customer?.email || '',
  address: layGiaTri(order, 'diaChiKhachHang', 'DiaChiKhachHang') || order.customer?.address || '',
})

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

const chuanHoaDonHang = (order) => {
  if (!order || typeof order !== 'object') {
    return null
  }

  const items = chuanHoaDanhSachChiTiet(order.items)
  const subtotalFromItems = items.reduce((tong, item) => tong + item.price * item.quantity, 0)
  const subtotalValue = Number(layGiaTri(order, 'subtotal', 'tamTinh', 'TamTinh'))
  const serviceFeeValue = Number(layGiaTri(order, 'serviceFee', 'phiDichVu', 'PhiDichVu'))
  const discountAmountValue = Number(layGiaTri(order, 'discountAmount', 'tienGiam', 'TienGiam'))
  const totalValue = Number(layGiaTri(order, 'total', 'thanhTien', 'ThanhTien'))
  const subtotal = Number.isFinite(subtotalValue) ? subtotalValue : subtotalFromItems
  const serviceFee = Number.isFinite(serviceFeeValue) ? serviceFeeValue : tinhPhiDichVu(subtotal)
  const discountAmount = Number.isFinite(discountAmountValue) ? discountAmountValue : 0
  const total = Number.isFinite(totalValue) ? totalValue : Math.max(0, subtotal + serviceFee - discountAmount)

  return {
    ...order,
    id: layGiaTri(order, 'id', 'Id'),
    orderCode: layGiaTri(order, 'orderCode', 'code', 'maDonHang', 'MaDonHang') || '',
    orderDate: layGiaTri(order, 'orderDate', 'datLuc', 'DatLuc') || '',
    total,
    subtotal,
    serviceFee,
    discountAmount,
    paymentMethod: layGiaTri(order, 'paymentMethod', 'phuongThucThanhToan', 'PhuongThucThanhToan') || 'TIEN_MAT',
    paymentStatus: layGiaTri(order, 'paymentStatus', 'trangThaiThanhToan', 'TrangThaiThanhToan') || '',
    note: layGiaTri(order, 'note', 'ghiChu', 'GhiChu') || '',
    tableNumber: layGiaTri(order, 'tableNumber', 'maBan', 'MaBan') || '',
    status: layGiaTri(order, 'status', 'trangThai', 'TrangThai') || '',
    customer: chuanHoaKhachHang(order),
    items,
  }
}

const chuanHoaChiTietResponse = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const order = chuanHoaDonHang(payload.donHang || payload.order || payload)

  if (!order) {
    return null
  }

  return {
    ...order,
    items: chuanHoaDanhSachChiTiet(payload.chiTiet || payload.items || order.items),
  }
}

const chuanHoaPayloadTaoDonHang = (payload = {}) => ({
  danhSachMon: Array.isArray(payload.items)
    ? payload.items.map((item) => ({
        monAnId: item.menuItemId,
        soLuong: item.quantity,
        kichCo: item.kichCoDaChon || item.size || 'M',
        toppingDaChon: Array.isArray(item.toppingDaChon) ? item.toppingDaChon : [],
        ghiChuMon: item.ghiChuRieng || item.note || '',
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

const tachVaChuanHoaChiTiet = (phanHoi) => ({
  ...phanHoi,
  duLieu: chuanHoaChiTietResponse(phanHoi.duLieu),
})

export const layDanhSachDonHangApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang')))
export const layDonHangCuaToiApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang/me')))
export const layChiTietDonHangApi = async (id) => tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.get(`/don-hang/${id}`)))
export const taoDonHangApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/don-hang', chuanHoaPayloadTaoDonHang(payload))))
export const capNhatTrangThaiDonHangApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/don-hang/${id}/status`, { trangThai: status })))
