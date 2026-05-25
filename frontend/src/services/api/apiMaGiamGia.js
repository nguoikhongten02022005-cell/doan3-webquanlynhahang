import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  timMaGiamGiaOfflineTheoCode,
  layDanhSachMaGiamGiaOffline,
} from '../offline/dichVuOfflineStore'
import { layNguoiDungHienTai } from '../dichVuXacThuc'
import { chuanHoaKetQuaVoucher } from '../../features/donHang/contracts'
import {
  dichThongDiepLoiVoucher,
  getVoucherLoaiMaLabel,
  getVoucherTrangThaiLabel,
  xacDinhTrangThaiVoucher,
  normalizeVoucherTrangThai,
  normalizeVoucherLoaiMa,
} from './voucherTrangThai'

export const chuanHoaMaGiamGia = (ma) => {
  if (!ma || typeof ma !== 'object') return null
  const trangThaiTinhToan = xacDinhTrangThaiVoucher(ma)
  const trangThaiRuntime = normalizeVoucherTrangThai(
    ma.trangThaiRuntime ||
      ma.TrangThaiRuntime ||
      ma.runtimeStatus ||
      ma.RuntimeStatus ||
      trangThaiTinhToan.maTrangThai,
  )
  return {
    ...ma,
    maCode: ma.maCode || ma.MaCode,
    tenCode: ma.tenCode || ma.TenCode,
    giaTri: Number(ma.giaTri ?? ma.GiaTri ?? 0),
    loaiGiam: ma.loaiGiam || ma.LoaiGiam,
    loaiMa: normalizeVoucherLoaiMa(
      ma.loaiMa ||
        ma.LoaiMa ||
        ma.loaiMaHienThi ||
        ma.LoaiMaHienThi ||
        'PUBLIC',
    ),
    loaiMaHienThi: getVoucherLoaiMaLabel(
      ma.loaiMaHienThi ||
        ma.LoaiMaHienThi ||
        ma.nhanLoaiMa ||
        ma.NhanLoaiMa ||
        ma.loaiMa ||
        ma.LoaiMa ||
        'PUBLIC',
    ),
    maKH: ma.maKH || ma.MaKH || '',
    maKhachHang: ma.maKhachHang || ma.MaKhachHang || ma.maKH || ma.MaKH || '',
    diemDaDoi: ma.diemDaDoi != null ? Number(ma.diemDaDoi) : ma.DiemDaDoi != null ? Number(ma.DiemDaDoi) : null,
    giaTriToiDa: ma.giaTriToiDa != null ? Number(ma.giaTriToiDa) : null,
    donHangToiThieu: Number(ma.donHangToiThieu ?? ma.DonHangToiThieu ?? 0),
    ngayBatDau: ma.ngayBatDau || ma.NgayBatDau,
    ngayKetThuc: ma.ngayKetThuc || ma.NgayKetThuc,
    soLanToiDa: ma.soLanToiDa != null ? Number(ma.soLanToiDa) : null,
    soLanDaDung: Number(ma.soLanDaDung ?? ma.SoLanDaDung ?? 0),
    trangThai: ma.trangThai || ma.TrangThai || 'Active',
    trangThaiRuntime,
    runtimeStatus: trangThaiRuntime,
    trangThaiHienThi: getVoucherTrangThaiLabel(
      ma.trangThaiHienThi ||
        ma.TrangThaiHienThi ||
        ma.nhanTrangThai ||
        ma.NhanTrangThai ||
        ma.label ||
        ma.Label ||
        trangThaiTinhToan.nhanTrangThai ||
        trangThaiRuntime,
    ),
    coTheApDung:
      ma.coTheApDung == null
        ? trangThaiTinhToan.coTheApDung
        : Boolean(ma.coTheApDung),
    lyDoTrangThai:
      String(ma.lyDoTrangThai || ma.LyDoTrangThai || trangThaiTinhToan.lyDoTrangThai || '').trim(),
    nguon: ma.nguon || ma.Nguon || ma.nguonTao || ma.NguonTao || ma.source || ma.Source || '',
    nguonTao: ma.nguonTao || ma.NguonTao || ma.nguon || ma.Nguon || ma.source || ma.Source || '',
  }
}

const laVoucherConHieuLucChoCheckout = (voucher) => {
  if (!voucher) return false
  if (voucher.coTheApDung != null) return Boolean(voucher.coTheApDung)
  return xacDinhTrangThaiVoucher(voucher).coTheApDung
}

const LOAI_MA_HOP_LE_CHO_KHACH = new Set(['PUBLIC', 'CUSTOMER', 'LOYALTY', 'VIP', 'BIRTHDAY'])

const laVoucherHopLeChoCheckout = (voucher) => {
  if (!voucher) return false
  if (!LOAI_MA_HOP_LE_CHO_KHACH.has(String(voucher.loaiMa || '').toUpperCase())) return false
  return laVoucherConHieuLucChoCheckout(voucher)
}

const laVoucherHopLeChoHoSo = (voucher) => {
  if (!voucher) return false
  return LOAI_MA_HOP_LE_CHO_KHACH.has(String(voucher.loaiMa || '').toUpperCase()) && String(voucher.loaiMa || '').toUpperCase() !== 'PUBLIC'
}

export const layDanhSachMaGiamGiaApi = async () => {
  if (!coSuDungMayChu()) {
    const duLieu = layDanhSachMaGiamGiaOffline().map(chuanHoaMaGiamGia).filter(Boolean)
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay danh sach ma giam gia thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ma-giam-gia'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu)
      ? phanHoi.duLieu.map(chuanHoaMaGiamGia).filter(Boolean)
      : [],
  }
}

export const layDanhSachMaGiamGiaCongKhaiApi = async () => {
  if (!coSuDungMayChu()) {
    const duLieu = layDanhSachMaGiamGiaOffline()
      .map(chuanHoaMaGiamGia)
      .filter((voucher) => voucher && String(voucher.loaiMa || '').toUpperCase() === 'PUBLIC' && laVoucherHopLeChoCheckout(voucher))
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay voucher cong khai thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ma-giam-gia/public'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu)
      ? phanHoi.duLieu.map(chuanHoaMaGiamGia).filter((voucher) => voucher && laVoucherHopLeChoCheckout(voucher))
      : [],
  }
}

export const layDanhSachMaGiamGiaCuaToiApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = layDanhSachMaGiamGiaOffline()
      .map(chuanHoaMaGiamGia)
      .filter((voucher) =>
        voucher
        && String(voucher.maKH || '').trim() === String(maKH || '').trim()
        && laVoucherHopLeChoHoSo(voucher),
      )
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay voucher cua toi thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ma-giam-gia/me'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu)
      ? phanHoi.duLieu.map(chuanHoaMaGiamGia).filter((voucher) => voucher && laVoucherHopLeChoHoSo(voucher))
      : [],
  }
}

export const layDanhSachMaGiamGiaCuaToiCheckoutApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = layDanhSachMaGiamGiaOffline()
      .map(chuanHoaMaGiamGia)
      .filter((voucher) =>
        voucher
        && String(voucher.maKH || '').trim() === String(maKH || '').trim()
        && laVoucherHopLeChoHoSo(voucher),
      )
      .filter(laVoucherConHieuLucChoCheckout)
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay voucher checkout cua toi thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ma-giam-gia/me/checkout'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu)
      ? phanHoi.duLieu.map(chuanHoaMaGiamGia).filter((voucher) => voucher && laVoucherHopLeChoCheckout(voucher))
      : [],
  }
}

export const taoMaGiamGiaApi = async (payload) => {
  return tachPhanHoiApi(
    await trinhKhachApi.post('/ma-giam-gia', {
      maCode: payload.maCode,
      tenCode: payload.tenCode,
      giaTri: Number(payload.giaTri),
      loaiGiam: payload.loaiGiam,
      loaiMa:
        payload.loaiMa == null || payload.loaiMa === ''
          ? payload.loaiMa
          : normalizeVoucherLoaiMa(payload.loaiMa),
      maKH: payload.maKH || payload.maKhachHang || '',
      diemDaDoi: payload.diemDaDoi != null && payload.diemDaDoi !== '' ? Number(payload.diemDaDoi) : null,
      giaTriToiDa: payload.giaTriToiDa != null && payload.giaTriToiDa !== '' ? Number(payload.giaTriToiDa) : null,
      donHangToiThieu: Number(payload.donHangToiThieu || 0),
      ngayBatDau: payload.ngayBatDau,
      ngayKetThuc: payload.ngayKetThuc,
      soLanToiDa: payload.soLanToiDa != null && payload.soLanToiDa !== '' ? Number(payload.soLanToiDa) : null,
      nguonTao: payload.nguonTao || 'NOI_BO',
      trangThai: payload.trangThai || 'Active',
    }),
  )
}

export const capNhatMaGiamGiaApi = async (maCode, payload) => {
  return tachPhanHoiApi(
    await trinhKhachApi.put(`/ma-giam-gia/${maCode}`, {
      tenCode: payload.tenCode,
      giaTri: Number(payload.giaTri),
      loaiGiam: payload.loaiGiam,
      loaiMa: normalizeVoucherLoaiMa(payload.loaiMa || 'PUBLIC'),
      maKH: payload.maKH || payload.maKhachHang || '',
      diemDaDoi: payload.diemDaDoi != null && payload.diemDaDoi !== '' ? Number(payload.diemDaDoi) : null,
      giaTriToiDa: payload.giaTriToiDa != null && payload.giaTriToiDa !== '' ? Number(payload.giaTriToiDa) : null,
      donHangToiThieu: Number(payload.donHangToiThieu || 0),
      ngayBatDau: payload.ngayBatDau,
      ngayKetThuc: payload.ngayKetThuc,
      soLanToiDa: payload.soLanToiDa != null && payload.soLanToiDa !== '' ? Number(payload.soLanToiDa) : null,
      nguonTao: payload.nguonTao,
      trangThai: payload.trangThai,
    }),
  )
}

export const xoaMaGiamGiaApi = async (maCode) => {
  return tachPhanHoiApi(await trinhKhachApi.delete(`/ma-giam-gia/${maCode}`))
}

const chuanHoaPhieuGiamGia = (phieuGiamGia) => {
  const ketQua = chuanHoaKetQuaVoucher(phieuGiamGia)
  if (!ketQua.maGiamGia) {
    return null
  }

  return {
    ...phieuGiamGia,
    ...ketQua,
    code: ketQua.maGiamGia,
    name: ketQua.tenGiamGia,
    description: ketQua.thongDiep,
    discountType: ketQua.loaiGiam,
    discountValue: ketQua.giaTriGiam,
    minOrderAmount: ketQua.dieuKienToiThieu,
    maxDiscountAmount: ketQua.giamToiDa,
    discountAmount: ketQua.soTienGiamThucTe,
  }
}

export const kiemTraPhieuGiamGiaApi = async (maPhieuGiamGia, tongTienDonHang = 0, loaiDon = '', maKH = '') => {
  if (!coSuDungMayChu()) {
    const voucher = timMaGiamGiaOfflineTheoCode(maPhieuGiamGia)

    if (!voucher) {
      throw new Error('Mã giảm giá không tồn tại hoặc không còn hiệu lực.')
    }

    const trangThaiVoucher = xacDinhTrangThaiVoucher(voucher)
    if (!trangThaiVoucher.coTheApDung) {
      throw new Error(trangThaiVoucher.lyDoTrangThai || 'Mã giảm giá không tồn tại hoặc không còn hiệu lực.')
    }

    const tongTien = Number(tongTienDonHang || 0)
    const dieuKienToiThieu = Number(voucher.minOrderAmount || voucher.dieuKienToiThieu || 0)
    if (tongTien < dieuKienToiThieu) {
      throw new Error('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá.')
    }

    const phanHoi = tachPhanHoiApi(taoPhanHoiOffline({
      ...voucher,
      thongDiep: voucher.description || voucher.thongDiep || '',
      loaiDon,
    }, 'Kiem tra ma giam gia thanh cong'))

    return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
  }

  try {
    const phanHoi = tachPhanHoiApi(
      await trinhKhachApi.post('/ma-giam-gia/validate', {
        maCode: maPhieuGiamGia,
        tongTien: tongTienDonHang,
        maKH,
      }),
    )
    return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
  } catch (loi) {
    const thongDiepDaDich = dichThongDiepLoiVoucher(loi)
    if (thongDiepDaDich && thongDiepDaDich !== loi?.message) {
      const loiDaDich = new Error(thongDiepDaDich)
      loiDaDich.status = loi?.status
      loiDaDich.details = loi?.details
      throw loiDaDich
    }

    throw loi
  }
}

export const layDanhSachVoucherChoCheckoutApi = async () => {
  const maKH = layNguoiDungHienTai()?.maKH || ''
  const publicRes = await layDanhSachMaGiamGiaCongKhaiApi()
  let ownRes = { duLieu: [] }
  if (maKH) {
    try {
      ownRes = await layDanhSachMaGiamGiaCuaToiCheckoutApi()
    } catch {
      ownRes = { duLieu: [] }
    }
  }

  const combined = [
    ...(Array.isArray(publicRes?.duLieu) ? publicRes.duLieu : []),
    ...(Array.isArray(ownRes?.duLieu) ? ownRes.duLieu : []),
  ].filter(laVoucherHopLeChoCheckout)

  const unique = new Map()
  combined.forEach((voucher) => {
    if (voucher?.maCode) {
      unique.set(String(voucher.maCode).toUpperCase(), voucher)
    }
  })

  return {
    success: true,
    duLieu: Array.from(unique.values()),
    thongDiep: 'Lấy voucher checkout thành công',
  }
}
