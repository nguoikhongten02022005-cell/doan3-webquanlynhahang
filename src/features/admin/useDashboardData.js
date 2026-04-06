import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { taoDuLieuThongKeDoanhThu } from './thongKeAdmin'

const laCungNgayLich = (left, right) => (
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate()
)

const layDoanhThuHomNay = (orders = []) => {
  const homNay = new Date()

  return orders.reduce((tong, order) => {
    const ngayTao = new Date(order?.orderDate)

    if (Number.isNaN(ngayTao.getTime()) || !laCungNgayLich(ngayTao, homNay)) {
      return tong
    }

    return tong + (Number(order?.total) || 0)
  }, 0)
}

const taoSnapshotDashboard = (duLieuNoiBo = {}) => {
  const revenueStats = taoDuLieuThongKeDoanhThu({
    orders: duLieuNoiBo.danhSachDonHang,
    bookings: duLieuNoiBo.danhSachDatBan,
  })

  return {
    stats: {
      todayRevenue: layDoanhThuHomNay(duLieuNoiBo.danhSachDonHang),
      openBookings: duLieuNoiBo.hangDoiDatBan?.length || 0,
      servingTables: duLieuNoiBo.tomTatTonKhoBan?.occupied || 0,
    },
    revenue: {
      summary: revenueStats.overview,
      series: revenueStats.revenueSeries,
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
    tablePressure: (duLieuNoiBo.tomTatBan || []).map((area) => ({
      ...area,
      percent: Math.round((area.occupancyRate || 0) * 100),
      busyTables: area.occupied + area.held + area.dirty,
    })),
  }
}

export const useDashboardData = (duLieuNoiBo) => {
  const dauVanTayDuLieu = useMemo(
    () => JSON.stringify({
      bookings: (duLieuNoiBo?.hangDoiDatBan || []).map((booking) => [
        booking.id,
        booking.status,
        booking.date,
        booking.time,
        booking.assignedTableIds?.length || 0,
      ]),
      orders: (duLieuNoiBo?.danhSachDonHangDaSapXep || []).map((order) => [
        order.id,
        order.status,
        order.total,
        order.orderDate,
      ]),
      tables: (duLieuNoiBo?.tomTatBan || []).map((area) => [
        area.id,
        area.occupied,
        area.held,
        area.dirty,
        area.available,
      ]),
    }),
    [duLieuNoiBo?.hangDoiDatBan, duLieuNoiBo?.danhSachDonHangDaSapXep, duLieuNoiBo?.tomTatBan],
  )

  const { data } = useQuery({
    queryKey: ['admin-dashboard', dauVanTayDuLieu],
    queryFn: async () => taoSnapshotDashboard(duLieuNoiBo),
    initialData: () => taoSnapshotDashboard(duLieuNoiBo),
    refetchInterval: 30000,
  })

  return data
}
