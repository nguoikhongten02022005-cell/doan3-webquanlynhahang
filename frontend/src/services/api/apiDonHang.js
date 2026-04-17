import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'
import { buildPayloadTaoDon } from '../../features/donHang/buildPayloadTaoDon'
import { chuanHoaPricingSummary, chuanHoaKetQuaVoucher, chuanHoaThongTinNhanHang } from '../../features/donHang/contracts'

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

  const items = chuanHoaDanhSachChiTiet(order.chiTiet || order.ChiTiet || order.items || order.Items)

  const pricingSummary = chuanHoaPricingSummary(order.pricingSummary || order.PricingSummary || order)
  const voucher = chuanHoaKetQuaVoucher(order.voucher || order.Voucher || {})
  const thongTinNhanHang = chuanHoaThongTinNhanHang(order.thongTinNhanHang || order.ThongTinNhanHang || order)

  return {
    ...order,
    id: layGiaTri(order, 'maDonHang', 'MaDonHang'),
    orderCode: layGiaTri(order, 'maDonHang', 'MaDonHang') || '',
    orderDate: layGiaTri(order, 'ngayTao', 'NgayTao') || '',
    total: pricingSummary.tongTien,
    subtotal: pricingSummary.tamTinh,
    serviceFee: pricingSummary.phiDichVu,
    shippingFee: pricingSummary.phiShip,
    discountAmount: pricingSummary.giamGia,
    pricingSummary,
    voucher,
    thongTinNhanHang,
    paymentMethod: '',
    paymentStatus: '',
    note: layGiaTri(order, 'ghiChu', 'GhiChu') || '',
    tableNumber: layGiaTri(order, 'maBan', 'MaBan') || '',
    status: layGiaTri(order, 'trangThai', 'TrangThai') || '',
    customer: {
      code: layGiaTri(order, 'maKH', 'MaKH') || '',
      fullName: layGiaTri(order, 'tenKhachHang', 'TenKhachHang') || '',
      phone: layGiaTri(order, 'soDienThoai', 'SoDienThoai') || '',
      email: layGiaTri(order, 'email', 'Email') || '',
      address: layGiaTri(order, 'diaChiGiao', 'DiaChiGiao', 'diaChiKhachHang', 'DiaChiKhachHang') || '',
    },
    items,
  }
}

const chuanHoaChiTietResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  const order = chuanHoaDonHang(payload.data || payload.donHang || payload.order || payload)
  if (!order) return null
  return { ...order, items: chuanHoaDanhSachChiTiet(payload.chiTiet || payload.items || []) }
}


const tachVaChuanHoa = (phanHoi) => ({
  ...phanHoi,
  duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDonHang).filter(Boolean) : chuanHoaDonHang(phanHoi.duLieu),
})

const chuanHoaDonHangHoSo = (order) => {
  const donHang = chuanHoaDonHang(order)
  if (!donHang) return null

  const danhSachMon = chuanHoaDanhSachChiTiet(order?.chiTiet || order?.ChiTiet || order?.items || order?.Items).map((item) => ({
    tenMon: item.name,
    soLuong: item.quantity,
    donGia: item.price,
    thanhTien: item.thanhTien ?? (item.quantity * item.price),
  }))

  return {
    maDonHang: donHang.orderCode,
    loaiDon: 'MANG_VE_PICKUP',
    trangThai: donHang.status,
    tongTien: donHang.total,
    phiShip: 0,
    diaChiGiao: donHang.customer?.address || '',
    gioLayHang: '',
    gioGiao: '',
    ngayTao: donHang.orderDate,
    danhSachMon,
  }
}

const tachVaChuanHoaHoSo = (phanHoi) => ({
  ...phanHoi,
  duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDonHangHoSo).filter(Boolean) : [],
})

export const layDonHangCuaToiApi = async () => tachVaChuanHoaHoSo(tachPhanHoiApi(await trinhKhachApi.get('/don-hang/me')))

export const layDonHangCoTheDanhGiaApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang/co-the-danh-gia')))

export const layDanhSachDonHangHoSoApi = async () => layDonHangCuaToiApi()

export const chuanHoaDonHangHoSoApi = chuanHoaDonHangHoSo

const tachVaChuanHoaChiTiet = (phanHoi) => ({
  ...phanHoi,
  duLieu: chuanHoaChiTietResponse(phanHoi.duLieu),
})

export const layDanhSachDonHangApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang')))
export const layChiTietDonHangApi = async (id) => tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.get(`/don-hang/${id}`)))
export const taoDonHangApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/don-hang', buildPayloadTaoDon(payload))))
export const capNhatTrangThaiDonHangApi = async (id, status) => tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.patch(`/don-hang/${id}/status`, { trangThai: status })))
