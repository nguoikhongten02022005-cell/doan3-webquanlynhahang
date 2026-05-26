import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import { layNguoiDungHienTai } from '../dichVuXacThuc'
import { chuanHoaMaGiamGia } from './apiMaGiamGia'
import {
  taoPhanHoiOffline,
  layTongQuanDiemTheoKhachHangOffline,
  layLichSuDiemTheoKhachHangOffline,
} from '../offline/dichVuOfflineStore'

const boDauTiengViet = (chuoi) =>
  String(chuoi || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Đđ]/g, (kyTu) => (kyTu === 'Đ' ? 'D' : 'd'))

const chuanHoaKhoaVanBan = (chuoi) =>
  boDauTiengViet(chuoi)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const BAN_DO_MO_TA_DIEM = Object.freeze({
  'manual test': 'Kiểm tra thủ công',
  'doi diem': 'Đổi điểm',
  'doi diem tich luy': 'Đổi điểm tích lũy',
  'cong diem': 'Cộng điểm',
  'tru diem': 'Trừ điểm',
  'hoan diem': 'Hoàn điểm',
  'cong diem tu don goi mon tai ban dh002': 'Cộng điểm từ đơn gọi món tại bàn DH002',
  'tam cong diem cho don goi mon tai ban dh003': 'Tạm cộng điểm cho đơn gọi món tại bàn DH003',
})

const BAN_DO_LOAI_BIEN_DONG_DIEM = Object.freeze({
  CONG: 'Cộng điểm',
  CONG_DIEM: 'Cộng điểm',
  TANG: 'Cộng điểm',
  TANG_DIEM: 'Cộng điểm',
  TRU: 'Trừ điểm',
  TRU_DIEM: 'Trừ điểm',
  GIAM: 'Trừ điểm',
  GIAM_DIEM: 'Trừ điểm',
  HOAN: 'Hoàn điểm',
  HOAN_DIEM: 'Hoàn điểm',
  DOI_DIEM: 'Đổi điểm tích lũy',
})

const chuanHoaTongQuanDiemTichLuy = (duLieu) => ({
  maKH: String(duLieu?.maKH || duLieu?.MaKH || ''),
  tongDiem: Number(duLieu?.tongDiem || duLieu?.TongDiem || 0),
  diemCoTheDoi: Number(duLieu?.diemCoTheDoi || duLieu?.DiemCoTheDoi || 0),
  tiLeQuyDoi: Number(duLieu?.tiLeQuyDoi || duLieu?.TiLeQuyDoi || 0),
  giaTriQuyDoi: Number(duLieu?.giaTriQuyDoi || duLieu?.GiaTriQuyDoi || 0),
})

const layNhanBienDongDiem = (giaoDich) => {
  const loaiBienDong = String(giaoDich?.loaiBienDong || giaoDich?.LoaiBienDong || '').trim().toUpperCase()
  return BAN_DO_LOAI_BIEN_DONG_DIEM[loaiBienDong] || 'Biến động điểm'
}

const layMoTaHienThiDiem = (giaoDich) => {
  const moTa = String(giaoDich?.moTa || giaoDich?.MoTa || '').trim()
  if (!moTa) return layNhanBienDongDiem(giaoDich)

  const khoaMoTa = chuanHoaKhoaVanBan(moTa)
  if (BAN_DO_MO_TA_DIEM[khoaMoTa]) return BAN_DO_MO_TA_DIEM[khoaMoTa]
  if (khoaMoTa.includes('manual test')) return 'Kiểm tra thủ công'
  if (khoaMoTa && khoaMoTa === moTa.toLowerCase()) {
    return layNhanBienDongDiem(giaoDich)
  }

  return moTa
}

const chuanHoaGiaoDichDiem = (giaoDich) => {
  if (!giaoDich || typeof giaoDich !== 'object') return null

  return {
    maGiaoDichDiem: String(giaoDich.maGiaoDichDiem || giaoDich.MaGiaoDichDiem || ''),
    maKH: String(giaoDich.maKH || giaoDich.MaKH || ''),
    maDonHang: String(giaoDich.maDonHang || giaoDich.MaDonHang || ''),
    maVoucher: String(giaoDich.maVoucher || giaoDich.MaVoucher || ''),
    loaiBienDong: String(giaoDich.loaiBienDong || giaoDich.LoaiBienDong || ''),
    soDiem: Number(giaoDich.soDiem || giaoDich.SoDiem || 0),
    soDiemTruoc: Number(giaoDich.soDiemTruoc || giaoDich.SoDiemTruoc || 0),
    soDiemSau: Number(giaoDich.soDiemSau || giaoDich.SoDiemSau || 0),
    moTa: String(giaoDich.moTa || giaoDich.MoTa || ''),
    moTaHienThi: layMoTaHienThiDiem(giaoDich),
    loaiBienDongHienThi: layNhanBienDongDiem(giaoDich),
    ngayTao: giaoDich.ngayTao || giaoDich.NgayTao || '',
    nguoiThucHien: String(giaoDich.nguoiThucHien || giaoDich.NguoiThucHien || ''),
    nguoiThucHienHienThi: String(giaoDich.nguoiThucHienHienThi || giaoDich.NguoiThucHienHienThi || giaoDich.nguoiThucHien || giaoDich.NguoiThucHien || ''),
  }
}

export const layTongQuanDiemTichLuyApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = chuanHoaTongQuanDiemTichLuy(layTongQuanDiemTheoKhachHangOffline(maKH))
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay tong quan diem thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/diem-tich-luy/me'))
  return {
    ...phanHoi,
    duLieu: chuanHoaTongQuanDiemTichLuy(phanHoi.duLieu),
  }
}

export const layLichSuDiemTichLuyApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = layLichSuDiemTheoKhachHangOffline(maKH).map(chuanHoaGiaoDichDiem).filter(Boolean)
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay lich su diem thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/diem-tich-luy/me/history'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaGiaoDichDiem).filter(Boolean) : [],
  }
}

export const doiDiemTichLuyApi = async (soDiem, moTa = 'Đổi điểm tích lũy', maYeuCau = '') => {
  if (!coSuDungMayChu()) {
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(null, 'Che do offline khong ho tro doi diem')),
      duLieu: null,
    }
  }

  const maYeuCauHopLe = String(maYeuCau || '').trim()
  const phanHoi = tachPhanHoiApi(
    await trinhKhachApi.post('/diem-tich-luy/doi-diem', {
      soDiem: Number(soDiem),
      moTa,
      maYeuCau: maYeuCauHopLe || undefined,
    }),
  )
  return {
    ...phanHoi,
    duLieu: phanHoi.duLieu
        ? {
            maGiaoDichDiem: String(phanHoi.duLieu.maGiaoDichDiem || phanHoi.duLieu.MaGiaoDichDiem || ''),
            maKH: String(phanHoi.duLieu.maKH || phanHoi.duLieu.MaKH || ''),
            soDiemDaDoi: Number(phanHoi.duLieu.soDiemDaDoi || phanHoi.duLieu.SoDiemDaDoi || 0),
            soTienGiam: Number(phanHoi.duLieu.soTienGiam || phanHoi.duLieu.SoTienGiam || 0),
            maVoucher: String(phanHoi.duLieu.maVoucher || phanHoi.duLieu.MaVoucher || phanHoi.duLieu.voucher?.maCode || phanHoi.duLieu.Voucher?.maCode || ''),
            diemTruoc: Number(phanHoi.duLieu.diemTruoc || phanHoi.duLieu.DiemTruoc || 0),
            diemSau: Number(phanHoi.duLieu.diemSau || phanHoi.duLieu.DiemSau || 0),
            voucher: chuanHoaMaGiamGia(phanHoi.duLieu.voucher || phanHoi.duLieu.Voucher || null),
          }
      : null,
  }
}
