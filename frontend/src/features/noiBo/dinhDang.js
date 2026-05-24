import { NHAN_KHU_VUC_DAT_BAN } from '../datBan/constants/duLieuDatBan'
import { laySacThaiDonHang as laySacThaiDonHangChuan } from '../../utils/donHang'
import { chuanHoaTrangThaiDatBan } from './hangSo'

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
  const trangThaiDaChuanHoa = chuanHoaTrangThaiDatBan(trangThai)

  if (trangThaiDaChuanHoa === 'DA_HUY' || trangThaiDaChuanHoa === 'TU_CHOI_HET_CHO' || trangThaiDaChuanHoa === 'KHONG_DEN' || trangThaiDaChuanHoa === 'NO_SHOW' || trangThaiDaChuanHoa === 'CANCELLED') return 'danger'
  if (trangThaiDaChuanHoa === 'DA_CHECK_IN' || trangThaiDaChuanHoa === 'DA_XEP_BAN' || trangThaiDaChuanHoa === 'COMPLETED') return 'neutral'
  if (trangThaiDaChuanHoa === 'DA_XAC_NHAN' || trangThaiDaChuanHoa === 'DA_GHI_NHAN' || trangThaiDaChuanHoa === 'DA_HOAN_THANH' || trangThaiDaChuanHoa === 'GIU_CHO_TAM' || trangThaiDaChuanHoa === 'CONFIRMED') return 'success'
  return 'warning'
}

export const layNhanTrangThaiDatBan = (trangThai) => {
  if (!trangThai) return 'Chờ xác nhận'
  const trangThaiDaChuanHoa = chuanHoaTrangThaiDatBan(trangThai)
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
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SEATED: 'Đã vào bàn',
    COMPLETED: 'Đã hoàn thành',
    CANCELLED: 'Đã hủy',
    NO_SHOW: 'Không đến',
  }

  return banDo[trangThai] || banDo[trangThaiDaChuanHoa] || trangThai
}

export const laySacThaiDonHang = (trangThai) => laySacThaiDonHangChuan(trangThai)

export const layNhanKenhXacNhan = (danhSachKenh) => {
  if (Array.isArray(danhSachKenh) && danhSachKenh.length > 0) return danhSachKenh.join(' / ')
  return 'SMS'
}
