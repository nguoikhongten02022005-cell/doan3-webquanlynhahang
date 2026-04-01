import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const layGiaTri = (nguon, ...khoa) => {
  for (const key of khoa) {
    if (nguon?.[key] !== undefined && nguon?.[key] !== null) return nguon[key]
  }
  return undefined
}

const chuanHoaChiTietDonHang = (item, index = 0) => {
  if (!item || typeof item !== 'object') return null
  return {
    ...item,
    id: layGiaTri(item, 'maChiTiet', 'MaChiTiet') ?? `order-item-${index + 1}`,
    menuItemId: layGiaTri(item, 'maMon', 'MaMon'),
    name: layGiaTri(item, 'tenMon', 'TenMon') || `Món ${index + 1}`,
    quantity: Number(layGiaTri(item, 'soLuong', 'SoLuong') || 0),
    price: Number(layGiaTri(item, 'donGia', 'DonGia') || 0),
    note: layGiaTri(item, 'ghiChu', 'GhiChu') || '',
    status: layGiaTri(item, 'trangThai', 'TrangThai') || '',
  }
}

const chuanHoaDanhSachChiTiet = (items) => Array.isArray(items) ? items.map((item, index) => chuanHoaChiTietDonHang(item, index)).filter(Boolean) : []

const chuanHoaDonHang = (order) => {
  if (!order || typeof order !== 'object') return null

  return {
    ...order,
    id: layGiaTri(order, 'maDonHang', 'MaDonHang'),
    orderCode: layGiaTri(order, 'maDonHang', 'MaDonHang') || '',
    orderDate: layGiaTri(order, 'ngayTao', 'NgayTao') || '',
    total: Number(layGiaTri(order, 'tongTien', 'TongTien') || 0),
    subtotal: Number(layGiaTri(order, 'tongTien', 'TongTien') || 0),
    serviceFee: 0,
    discountAmount: 0,
    paymentMethod: '',
    paymentStatus: '',
    note: layGiaTri(order, 'ghiChu', 'GhiChu') || '',
    tableNumber: layGiaTri(order, 'maBan', 'MaBan') || '',
    status: layGiaTri(order, 'trangThai', 'TrangThai') || '',
    customer: {
      code: layGiaTri(order, 'maKH', 'MaKH') || '',
      fullName: '',
      phone: '',
      email: '',
      address: '',
    },
    items: [],
  }
}

const chuanHoaChiTietResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  const order = chuanHoaDonHang(payload.data || payload.donHang || payload.order || payload)
  if (!order) return null
  return { ...order, items: chuanHoaDanhSachChiTiet(payload.chiTiet || payload.items || []) }
}

const sinhMa = (prefix) => `${prefix}_${Date.now()}`

const chuanHoaPayloadTaoDonHang = (payload = {}) => ({
  maDonHang: payload.maDonHang || payload.orderCode || sinhMa('DH'),
  maKH: payload.maKH || payload.customerCode || null,
  maBan: payload.maBan || payload.tableCode || payload.tableNumber || null,
  maNV: payload.maNV || payload.staffCode || null,
  maDatBan: payload.maDatBan || payload.bookingCode || null,
  nguonTao: payload.nguonTao || payload.source || 'Online',
  ghiChu: payload.ghiChu || payload.note || '',
  chiTiet: Array.isArray(payload.items)
    ? payload.items.map((item, index) => ({
        maChiTiet: item.maChiTiet || item.id || sinhMa(`CT${index + 1}`),
        maMon: item.maMon || item.menuItemId,
        soLuong: Number(item.soLuong || item.quantity || 0),
        donGia: item.donGia ?? item.price ?? null,
        ghiChu: item.ghiChu || item.note || '',
      }))
    : [],
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
export const layDonHangCuaToiApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang')))
export const layChiTietDonHangApi = async (id) => tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.get(`/don-hang/${id}`)))
export const taoDonHangApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/don-hang', chuanHoaPayloadTaoDonHang(payload))))
export const capNhatTrangThaiDonHangApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/don-hang/${id}/status`, { trangThai: status })))
