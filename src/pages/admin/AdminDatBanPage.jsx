import { CalendarOutlined, ClockCircleOutlined, TableOutlined } from '@ant-design/icons'
import { useOutletContext } from 'react-router-dom'
import DatBanTab from '../../components/bangDieuKhienNoiBo/DatBanTab'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'

function AdminDatBanPage() {
  const {
    hangDoiDatBan,
    xuLyGanBan,
    xuLyCheckIn,
    xuLyHoanThanh,
    xuLyTaoDatBanNoiBo,
    xuLyKhachKhongDen,
    xuLyCapNhatDatBanNoiBo,
    layBanPhuHopChoDatBan,
    danhSachBan,
    danhSachDatBanChoXuLy,
    danhSachDatBanSapDienRa,
    danhSachDatBanChuaGanBan,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  const summaryItems = [
    {
      key: 'watching',
      label: 'Booking đang theo dõi',
      value: hangDoiDatBan.length,
      description: phamViLabel,
      icon: <CalendarOutlined />,
      accent: 'from-slate-900 to-slate-700',
    },
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      value: danhSachDatBanChoXuLy.length,
      description: 'Ưu tiên liên hệ sớm để chốt bàn.',
      icon: <ClockCircleOutlined />,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      key: 'unassigned',
      label: 'Chưa gán bàn',
      value: danhSachDatBanChuaGanBan.length,
      description: 'Cần phân bàn trước khi khách đến.',
      icon: <TableOutlined />,
      accent: 'from-rose-500 to-orange-500',
    },
    {
      key: 'arriving',
      label: 'Sắp đến 2 giờ',
      value: danhSachDatBanSapDienRa.length,
      description: 'Kiểm tra vị trí và ghi chú đặc biệt.',
      icon: <ClockCircleOutlined />,
      accent: 'from-emerald-500 to-teal-500',
    },
  ]

  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <article key={item.key} className="relative overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50/90 p-3 shadow-sm">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <strong className="mt-2 block text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-slate-900">{item.value}</strong>
                  <p className="mt-1.5 mb-0 text-xs leading-5 text-slate-500">{item.description}</p>
                </div>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br text-sm text-white shadow-sm ${item.accent}`}>
                  {item.icon}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <DatBanTab
        hangDoiDatBan={hangDoiDatBan}
        getAvailableTablesForBooking={(booking) => layBanPhuHopChoDatBan(booking, danhSachBan)}
        handleAssignTables={xuLyGanBan}
        handleQuickStatusChange={(booking, status) => xuLyCapNhatDatBanNoiBo(booking.id, { status })}
        handleCheckIn={xuLyCheckIn}
        handleComplete={xuLyHoanThanh}
        handleCreateInternalBooking={xuLyTaoDatBanNoiBo}
        xuLyKhachKhongDen={xuLyKhachKhongDen}
        handleUpdateInternalBooking={xuLyCapNhatDatBanNoiBo}
        phamViLabel={phamViLabel}
      />
    </div>
  )
}

export default AdminDatBanPage
