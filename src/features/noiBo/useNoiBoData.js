import { useMemo } from 'react'
import { useDuLieuBangDieuKhien } from './useDuLieuBangDieuKhien'
import { taoDuLieuThongKeDoanhThu } from './thongKeNoiBo'
import { useBangDieuKhienData } from './useBangDieuKhienData'

export const useNoiBoData = () => {
  const duLieuNoiBo = useDuLieuBangDieuKhien()
  const bangDieuKhienData = useBangDieuKhienData(duLieuNoiBo)

  const badges = useMemo(() => ({
    bookings: duLieuNoiBo.danhSachDatBanChoXuLy.length,
    orders: duLieuNoiBo.danhSachDonHangDangMo.length,
    reviews: duLieuNoiBo.danhSachDanhGiaChoDuyet.length,
    notifications: duLieuNoiBo.danhSachDatBanChoXuLy.length + duLieuNoiBo.danhSachDonHangDangMo.length + duLieuNoiBo.danhSachDanhGiaChoDuyet.length,
  }), [duLieuNoiBo.danhSachDatBanChoXuLy.length, duLieuNoiBo.danhSachDonHangDangMo.length, duLieuNoiBo.danhSachDanhGiaChoDuyet.length])

  const revenueStats = useMemo(
    () => taoDuLieuThongKeDoanhThu({
      orders: duLieuNoiBo.danhSachDonHang,
      bookings: duLieuNoiBo.danhSachDatBan,
    }),
    [duLieuNoiBo.danhSachDonHang, duLieuNoiBo.danhSachDatBan],
  )

  const urgentItems = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: duLieuNoiBo.danhSachDatBanChoXuLy.length,
        detail: duLieuNoiBo.danhSachDatBanChoXuLy.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có booking chờ xử lý.',
        tone: duLieuNoiBo.danhSachDatBanChoXuLy.length > 0 ? 'warning' : 'neutral',
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: duLieuNoiBo.danhSachDatBanChuaGanBan.length,
        detail: duLieuNoiBo.danhSachDatBanChuaGanBan.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các booking đang có bàn phù hợp.',
        tone: duLieuNoiBo.danhSachDatBanChuaGanBan.length > 0 ? 'danger' : 'neutral',
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: duLieuNoiBo.danhSachDatBanSapDienRa.length,
        detail: duLieuNoiBo.danhSachDatBanSapDienRa.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: duLieuNoiBo.danhSachDatBanSapDienRa.length > 0 ? 'success' : 'neutral',
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: duLieuNoiBo.tomTatTonKhoBan.dirty,
        detail: duLieuNoiBo.tomTatTonKhoBan.dirty > 0 ? 'Cần làm sạch trước khi nhận lượt mới.' : 'Không có bàn đang dọn.',
        tone: duLieuNoiBo.tomTatTonKhoBan.dirty > 0 ? 'warning' : 'neutral',
      },
    ],
    [
      duLieuNoiBo.danhSachDatBanChoXuLy.length,
      duLieuNoiBo.danhSachDatBanChuaGanBan.length,
      duLieuNoiBo.danhSachDatBanSapDienRa.length,
      duLieuNoiBo.tomTatTonKhoBan.dirty,
    ],
  )

  return {
    ...duLieuNoiBo,
    badges,
    revenueStats,
    urgentItems,
    bangDieuKhienData,
  }
}
