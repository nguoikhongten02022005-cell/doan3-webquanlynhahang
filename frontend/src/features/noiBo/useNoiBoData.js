import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDuLieuBangDieuKhien } from './useDuLieuBangDieuKhien'
import { useBangDieuKhienData } from './useBangDieuKhienData'
import { layTongQuanApi, layDoanhThuNgayApi } from '../../services/api/apiThongKe'

const taoChuoi7Ngay = () => {
  const homNay = new Date()
  const denNgay = homNay.toISOString().split('T')[0]
  const tuNgay = new Date(homNay)
  tuNgay.setDate(tuNgay.getDate() - 6)
  return { tuNgay: tuNgay.toISOString().split('T')[0], denNgay }
}

export const useNoiBoData = () => {
  const duLieuNoiBo = useDuLieuBangDieuKhien()

  const { tuNgay, denNgay } = taoChuoi7Ngay()
  const { data: tongQuan } = useQuery({
    queryKey: ['thong-ke-tong-quan'],
    queryFn: async () => {
      const ketQua = await layTongQuanApi()
      return ketQua.duLieu
    },
    refetchInterval: 30000,
    initialData: { tongDoanhThu: 0, tongDon: 0, soBanBan: 0, soDonCho: 0 },
  })

  const { data: doanhThu7Ngay } = useQuery({
    queryKey: ['thong-ke-doanh-thu', tuNgay, denNgay],
    queryFn: async () => {
      const ketQua = await layDoanhThuNgayApi(tuNgay, denNgay)
      return (ketQua.duLieu || []).map((muc) => ({
        label: muc.Ngay ? new Date(muc.Ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '--',
        revenue: Number(muc.DoanhThu || 0),
      }))
    },
    refetchInterval: 30000,
    initialData: [],
  })

  const duLieuNoiBoVoiThongKe = useMemo(() => ({
    ...duLieuNoiBo,
    tongQuan,
    doanhThu7Ngay,
  }), [duLieuNoiBo, tongQuan, doanhThu7Ngay])

  const duLieuBangDieuKhien = useBangDieuKhienData(duLieuNoiBoVoiThongKe)

  const phuHieu = useMemo(() => ({
    bookings: duLieuNoiBo.danhSachDatBanChoXuLy.length,
    orders: duLieuNoiBo.danhSachDonHangDangMo.length,
    reviews: duLieuNoiBo.danhSachDanhGiaChoDuyet.length,
    notifications: duLieuNoiBo.danhSachDatBanChoXuLy.length + duLieuNoiBo.danhSachDonHangDangMo.length + duLieuNoiBo.danhSachDanhGiaChoDuyet.length,
  }), [duLieuNoiBo.danhSachDatBanChoXuLy.length, duLieuNoiBo.danhSachDonHangDangMo.length, duLieuNoiBo.danhSachDanhGiaChoDuyet.length])

  const danhSachUuTien = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: duLieuNoiBo.danhSachDatBanChoXuLy.length,
        detail: duLieuNoiBo.danhSachDatBanChoXuLy.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có đơn đặt bàn chờ xử lý.',
        tone: duLieuNoiBo.danhSachDatBanChoXuLy.length > 0 ? 'warning' : 'neutral',
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: duLieuNoiBo.danhSachDatBanChuaGanBan.length,
        detail: duLieuNoiBo.danhSachDatBanChuaGanBan.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các đơn đặt bàn đang có bàn phù hợp.',
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
    badges: phuHieu,
    urgentItems: danhSachUuTien,
    bangDieuKhienData: duLieuBangDieuKhien,
  }
}
