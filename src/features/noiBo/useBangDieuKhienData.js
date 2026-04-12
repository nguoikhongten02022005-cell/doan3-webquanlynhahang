import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { taoDuLieuThongKeDoanhThu } from './thongKeNoiBo'

const laCungNgayLich = (trai, phai) => (
  trai.getFullYear() === phai.getFullYear()
  && trai.getMonth() === phai.getMonth()
  && trai.getDate() === phai.getDate()
)

const layDoanhThuHomNay = (danhSachDonHang = []) => {
  const homNay = new Date()

  return danhSachDonHang.reduce((tong, donHang) => {
    const ngayTao = new Date(donHang?.orderDate)

    if (Number.isNaN(ngayTao.getTime()) || !laCungNgayLich(ngayTao, homNay)) {
      return tong
    }

    return tong + (Number(donHang?.total) || 0)
  }, 0)
}

const taoSnapshotDashboard = (duLieuNoiBo = {}) => {
  const thongKeDoanhThu = taoDuLieuThongKeDoanhThu({
    orders: duLieuNoiBo.danhSachDonHang || [],
    bookings: duLieuNoiBo.danhSachDatBan || [],
  })

  return {
    stats: {
      todayRevenue: layDoanhThuHomNay(duLieuNoiBo.danhSachDonHang || []),
      openBookings: duLieuNoiBo.hangDoiDatBan?.length || 0,
      servingTables: duLieuNoiBo.tomTatTonKhoBan?.occupied || 0,
    },
    revenue: {
      summary: thongKeDoanhThu.overview,
      series: thongKeDoanhThu.revenueSeries,
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
  const dauVanTayDuLieu = useMemo(
    () => JSON.stringify({
      bookings: (duLieuNoiBo?.hangDoiDatBan || []).map((datBan) => [
        datBan.id,
        datBan.status,
        datBan.date,
        datBan.time,
        datBan.assignedTableIds?.length || 0,
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

  const { data } = useQuery({
    queryKey: ['noi-bo-bang-dieu-khien', dauVanTayDuLieu],
    queryFn: async () => taoSnapshotDashboard(duLieuNoiBo),
    initialData: () => taoSnapshotDashboard(duLieuNoiBo),
    refetchInterval: 30000,
  })

  return data
}
