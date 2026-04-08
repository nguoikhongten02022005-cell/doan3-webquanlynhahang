import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'
import { buildPayloadTaoDon } from '../../features/donHang/buildPayloadTaoDon'
import { chuanHoaPricingSummary, chuanHoaKetQuaVoucher, chuanHoaThongTinNhanHang } from '../../features/donHang/contracts'

const chuanHoaChiTiet = (muc, index = 0) => ({
  id: muc?.MaChiTiet || muc?.maChiTiet || `CT-${index + 1}`,
  maMon: muc?.MaMon || muc?.maMon || '',
  soLuong: Number(muc?.SoLuong || muc?.soLuong || 0),
  donGia: Number(muc?.DonGia || muc?.donGia || 0),
  thanhTien: Number(muc?.ThanhTien || muc?.thanhTien || 0),
  ghiChu: muc?.GhiChu || muc?.ghiChu || '',
})

const chuanHoaDonMangVe = (duLieu) => {
  const don = duLieu?.DonHang || duLieu?.donHang || duLieu
  if (!don) return null

  const pricingSummary = chuanHoaPricingSummary(don.pricingSummary || don.PricingSummary || don)
  const voucher = chuanHoaKetQuaVoucher(don.voucher || don.Voucher || {})
  const thongTinNhanHang = chuanHoaThongTinNhanHang(don.thongTinNhanHang || don.ThongTinNhanHang || don)

  return {
    maDonHang: don.MaDonHang || don.maDonHang || '',
    maKH: don.MaKH || don.maKH || '',
    loaiDon: don.LoaiDon || don.loaiDon || '',
    diaChiGiao: thongTinNhanHang.diaChiGiao,
    gioLayHang: thongTinNhanHang.gioLayHang,
    gioGiao: thongTinNhanHang.gioGiao,
    phiShip: pricingSummary.phiShip,
    tongTien: pricingSummary.tongTien,
    pricingSummary,
    voucher,
    thongTinNhanHang,
    trangThai: don.TrangThai || don.trangThai || '',
    ghiChu: don.GhiChu || don.ghiChu || '',
    ngayTao: don.NgayTao || don.ngayTao || '',
    chiTiet: Array.isArray(duLieu?.ChiTiet || duLieu?.chiTiet) ? (duLieu.ChiTiet || duLieu.chiTiet).map(chuanHoaChiTiet) : [],
  }
}

export const taoDonMangVeApi = async (payload) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/mang-ve/don-hang', buildPayloadTaoDon(payload)))
  return { ...phanHoi, duLieu: chuanHoaDonMangVe(phanHoi.duLieu) }
}

export const layDonMangVeApi = async (maDonHang) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get(`/mang-ve/don-hang/${maDonHang}`))
  return { ...phanHoi, duLieu: chuanHoaDonMangVe(phanHoi.duLieu) }
}

export const layDanhSachDonMangVeChoAdminApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/mang-ve/admin/don-hang'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDonMangVeChoAdmin).filter(Boolean) : [],
  }
}

export const capNhatTrangThaiDonMangVeApi = async (maDonHang, trangThai) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.patch(`/mang-ve/admin/don-hang/${maDonHang}/trang-thai`, { trangThai }))
  return { ...phanHoi, duLieu: chuanHoaDonMangVe(phanHoi.duLieu) }
}

export const layLichSuDonMangVeApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/mang-ve/lich-su'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDonMangVeLichSu).filter(Boolean) : [],
  }
}

export const huyDonMangVeApi = async (maDonHang) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.patch(`/mang-ve/don-hang/${maDonHang}/huy`, {}))
  return { ...phanHoi, duLieu: chuanHoaDonMangVe(phanHoi.duLieu) }
}

function chuanHoaDonMangVeChoAdmin(duLieu) {
  if (!duLieu || typeof duLieu !== 'object') return null
  return {
    maDonHang: duLieu.MaDonHang || duLieu.maDonHang || '',
    maKH: duLieu.MaKH || duLieu.maKH || '',
    hoTen: duLieu.HoTen || duLieu.hoTen || '',
    soDienThoai: duLieu.SoDienThoai || duLieu.soDienThoai || '',
    loaiDon: duLieu.LoaiDon || duLieu.loaiDon || '',
    gioLayHang: duLieu.GioLayHang || duLieu.gioLayHang || '',
    gioGiao: duLieu.GioGiao || duLieu.gioGiao || '',
    diaChiGiao: duLieu.DiaChiGiao || duLieu.diaChiGiao || '',
    phiShip: Number(duLieu.PhiShip || duLieu.phiShip || 0),
    tongTien: Number(duLieu.TongTien || duLieu.tongTien || 0),
    trangThai: duLieu.TrangThai || duLieu.trangThai || '',
    ngayTao: duLieu.NgayTao || duLieu.ngayTao || '',
    danhSachMon: Array.isArray(duLieu.DanhSachMon || duLieu.danhSachMon) ? (duLieu.DanhSachMon || duLieu.danhSachMon).map((muc) => ({
      maMon: muc.MaMon || muc.maMon || '',
      tenMon: muc.TenMon || muc.tenMon || '',
      soLuong: Number(muc.SoLuong || muc.soLuong || 0),
      thanhTien: Number(muc.ThanhTien || muc.thanhTien || 0),
    })) : [],
  }
}

function chuanHoaDonMangVeLichSu(duLieu) {
  if (!duLieu || typeof duLieu !== 'object') return null
  return {
    maDonHang: duLieu.MaDonHang || duLieu.maDonHang || '',
    loaiDon: duLieu.LoaiDon || duLieu.loaiDon || '',
    trangThai: duLieu.TrangThai || duLieu.trangThai || '',
    tongTien: Number(duLieu.TongTien || duLieu.tongTien || 0),
    phiShip: Number(duLieu.PhiShip || duLieu.phiShip || 0),
    diaChiGiao: duLieu.DiaChiGiao || duLieu.diaChiGiao || '',
    gioLayHang: duLieu.GioLayHang || duLieu.gioLayHang || '',
    gioGiao: duLieu.GioGiao || duLieu.gioGiao || '',
    ngayTao: duLieu.NgayTao || duLieu.ngayTao || '',
    danhSachMon: Array.isArray(duLieu.DanhSachMon || duLieu.danhSachMon) ? (duLieu.DanhSachMon || duLieu.danhSachMon).map((muc) => ({
      tenMon: muc.TenMon || muc.tenMon || '',
      soLuong: Number(muc.SoLuong || muc.soLuong || 0),
      donGia: Number(muc.DonGia || muc.donGia || 0),
      thanhTien: Number(muc.ThanhTien || muc.thanhTien || 0),
    })) : [],
  }
}
