import { NHAN_KHU_VUC_DAT_BAN } from '../../data/duLieuDatBan'
import { laySacThaiDonHang as laySacThaiDonHangChuan } from '../../utils/donHang'

export const dinhDangNgay = (giaTri) => {
  if (!giaTri) return '--'

  const chuoiGiaTri = String(giaTri).trim()
  const ketQuaNgay = chuoiGiaTri.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (ketQuaNgay) {
    const [, nam, thang, ngay] = ketQuaNgay
    return `${ngay}/${thang}/${nam}`
  }

  const ngay = new Date(chuoiGiaTri)
  if (Number.isNaN(ngay.getTime())) {
    return '--'
  }

  return ngay.toLocaleDateString('vi-VN')
}

export const dinhDangNgayGio = (ngay, gio) => {
  if (!ngay) return '--'

  const [nam, thang, ngayTrongThang] = String(ngay).split('-')
  if (!nam || !thang || !ngayTrongThang) return `${ngay} ${gio || ''}`.trim()

  return `${ngayTrongThang}/${thang}/${nam} ${gio || ''}`.trim()
}

export const dinhDangSoKhach = (soKhach) => `${soKhach} khách`
export const layNhanChoNgoi = (giaTri) => NHAN_KHU_VUC_DAT_BAN[giaTri] || giaTri || 'Không ưu tiên'

export const laySacThaiTrangThaiDatBan = (trangThai) => {
  if (trangThai === 'DA_HUY' || trangThai === 'TU_CHOI_HET_CHO' || trangThai === 'KHONG_DEN') return 'danger'
  if (trangThai === 'DA_CHECK_IN' || trangThai === 'DA_XEP_BAN') return 'neutral'
  if (trangThai === 'Cancelled') return 'danger'
  if (trangThai === 'Completed') return 'neutral'
  if (trangThai === 'DA_XAC_NHAN' || trangThai === 'DA_GHI_NHAN' || trangThai === 'DA_HOAN_THANH' || trangThai === 'GIU_CHO_TAM' || trangThai === 'Confirmed') return 'success'
  return 'warning'
}

export const layNhanTrangThaiDatBan = (trangThai) => {
  if (!trangThai) return 'Chờ xác nhận'
  const banDo = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Cancelled: 'Đã hủy',
    Completed: 'Đã hoàn thành',
    DA_HUY: 'Đã hủy',
    DA_XAC_NHAN: 'Đã xác nhận',
    DA_HOAN_THANH: 'Đã hoàn thành',
    DA_CHECK_IN: 'Đang phục vụ',
    KHONG_DEN: 'Không đến',
  }

  return banDo[trangThai] || trangThai
}

export const laySacThaiDonHang = (trangThai) => laySacThaiDonHangChuan(trangThai)

export const layNhanKenhXacNhan = (kenh) => {
  if (Array.isArray(kenh) && kenh.length > 0) return kenh.join(' / ')
  return 'SMS'
}
