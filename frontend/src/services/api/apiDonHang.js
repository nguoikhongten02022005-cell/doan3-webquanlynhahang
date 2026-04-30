import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import { layNguoiDungHienTai } from '../dichVuXacThuc'
import {
  taoPhanHoiOffline,
  layDanhSachDonHangOffline,
  timDonHangOfflineTheoMa,
  taoHoacCapNhatDonHangOffline,
  capNhatTrangThaiDonHangOffline,
  layDonHangCoTheDanhGiaOffline,
} from '../offline/dichVuOfflineStore'
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
    customer: null,
    items,
  }
}

const chuanHoaDonHangHoSo = chuanHoaDonHang

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

export const layDonHangCuaToiApi = async () => {
  return { duLieu: [] }
}

export const layDonHangCoTheDanhGiaApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(layDonHangCoTheDanhGiaOffline(maKH), 'Lay don hang co the danh gia thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang/co-the-danh-gia')))
}

export const layDanhSachDonHangHoSoApi = async () => layDonHangCuaToiApi()

export const chuanHoaDonHangHoSoApi = chuanHoaDonHangHoSo

const tachVaChuanHoaChiTiet = (phanHoi) => ({
  ...phanHoi,
  duLieu: chuanHoaChiTietResponse(phanHoi.duLieu),
})

export const layDanhSachDonHangApi = async () => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(layDanhSachDonHangOffline(), 'Lay danh sach don hang thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/don-hang')))
}

export const layChiTietDonHangApi = async (id) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoaChiTiet(tachPhanHoiApi(taoPhanHoiOffline(timDonHangOfflineTheoMa(id), 'Lay chi tiet don hang thanh cong')))
  }

  return tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.get(`/don-hang/${id}`)))
}

export const taoDonHangApi = async (payload) => {
  if (!coSuDungMayChu()) {
    const duLieu = taoHoacCapNhatDonHangOffline(buildPayloadTaoDon(payload))
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Tao don hang thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/don-hang', buildPayloadTaoDon(payload))))
}

export const capNhatTrangThaiDonHangApi = async (id, status) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoaChiTiet(tachPhanHoiApi(taoPhanHoiOffline(capNhatTrangThaiDonHangOffline(id, status), 'Cap nhat trang thai don hang thanh cong')))
  }

  return tachVaChuanHoaChiTiet(tachPhanHoiApi(await trinhKhachApi.patch(`/don-hang/${id}/status`, { trangThai: status })))
}
