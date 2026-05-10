import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { layTongQuanApi } from '../../services/api/apiThongKe'
import { laCungNgayLich } from './boChon'

const taoDuLieuBangDieuKhien = (duLieuNoiBo = {}) => {
  return {
    stats: {
      todayRevenue: duLieuNoiBo.tongQuan?.tongDoanhThu || 0,
      openBookings: duLieuNoiBo.hangDoiDatBan?.length || 0,
      servingTables: duLieuNoiBo.tomTatTonKhoBan?.occupied || 0,
    },
    revenue: {
      summary: duLieuNoiBo.tongQuan || {},
      series: duLieuNoiBo.doanhThu7Ngay || [],
    },
    urgentTasks: [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: duLieuNoiBo.danhSachDatBanChoXuLy?.length || 0,
        tone: 'warning',
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: duLieuNoiBo.danhSachDatBanChuaGanBan?.length || 0,
        tone: 'danger',
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến',
        value: duLieuNoiBo.danhSachDatBanSapDienRa?.length || 0,
        tone: 'success',
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: duLieuNoiBo.tomTatTonKhoBan?.dirty || 0,
        tone: 'danger',
      },
    ],
    bookings: duLieuNoiBo.hangDoiDatBan || [],
    orders: duLieuNoiBo.danhSachDonHangDaSapXep || [],
    tablePressure: (duLieuNoiBo.tomTatBan || []).map((khuVuc) => ({
      ...khuVuc,
      percent: Math.round((khuVuc.occupancyRate || 0) * 100),
      busyTables: khuVuc.occupied + khuVuc.held + khuVuc.dirty,
    })),
  }
}

export const useBangDieuKhienData = (duLieuNoiBo = {}) => {
  const chuKyDuLieu = useMemo(
    () => JSON.stringify({
      bookings: (duLieuNoiBo?.hangDoiDatBan || []).map((datBan) => [
        datBan.id,
        datBan.status,
        datBan.date,
        datBan.time,
        datBan.danhSachMaBanDaGan?.length || 0,
      ]),
      orders: (duLieuNoiBo?.danhSachDonHangDaSapXep || []).map((donHang) => [
        donHang.id,
        donHang.status,
        donHang.total,
        donHang.orderDate,
      ]),
      tables: (duLieuNoiBo?.tomTatBan || []).map((khuVuc) => [
        khuVuc.id,
        khuVuc.occupied,
        khuVuc.held,
        khuVuc.dirty,
        khuVuc.available,
      ]),
    }),
    [duLieuNoiBo?.hangDoiDatBan, duLieuNoiBo?.danhSachDonHangDaSapXep, duLieuNoiBo?.tomTatBan],
  )

  const { data: duLieuBangDieuKhien } = useQuery({
    queryKey: ['noi-bo-bang-dieu-khien', chuKyDuLieu],
    queryFn: async () => taoDuLieuBangDieuKhien(duLieuNoiBo),
    initialData: () => taoDuLieuBangDieuKhien(duLieuNoiBo),
    refetchInterval: 30000,
  })

  return duLieuBangDieuKhien
}
