import { NHAN_KHU_VUC_DAT_BAN } from '../datBan/mocks/duLieuDatBan'
import { laySacThaiDonHang as laySacThaiDonHangChuan } from '../../utils/donHang'

export const dinhDangNgay = (giaTri) => {
  if (!giaTri) return '--'

  const chuoiGiaTri = String(giaTri).trim()
  const khopNamThangNgay = chuoiGiaTri.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (khopNamThangNgay) {
    const [, nam, thang, ngay] = khopNamThangNgay
    return `${ngay}/${thang}/${nam}`
  }

  const doiTuongNgay = new Date(chuoiGiaTri)
  if (Number.isNaN(doiTuongNgay.getTime())) {
    return '--'
  }

  return doiTuongNgay.toLocaleDateString('vi-VN')
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
    YEU_CAU_DAT_BAN: 'Yêu cầu đặt bàn',
    CHO_XAC_NHAN: 'Chờ xác nhận',
    Pending: 'Chờ xác nhận',
    GIU_CHO_TAM: 'Đã giữ chỗ tạm',
    DA_XAC_NHAN: 'Đã xác nhận',
    Confirmed: 'Đã xác nhận',
    CAN_GOI_LAI: 'Cần gọi lại',
    TU_CHOI_HET_CHO: 'Từ chối / hết chỗ',
    DA_CHECK_IN: 'Đang phục vụ',
    DA_XEP_BAN: 'Đã vào bàn',
    DA_HOAN_THANH: 'Đã hoàn thành',
    Completed: 'Đã hoàn thành',
    DA_HUY: 'Đã hủy',
    Cancelled: 'Đã hủy',
    KHONG_DEN: 'Không đến',
    NoShow: 'Không đến',
    DA_GHI_NHAN: 'Đã ghi nhận',
  }

  return banDo[trangThai] || trangThai
}

export const laySacThaiDonHang = (trangThai) => laySacThaiDonHangChuan(trangThai)

export const layNhanKenhXacNhan = (danhSachKenh) => {
  if (Array.isArray(danhSachKenh) && danhSachKenh.length > 0) return danhSachKenh.join(' / ')
  return 'SMS'
}
