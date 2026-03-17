import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaiKhoanTab from '../features/bangDieuKhienNoiBo/components/TaiKhoanTab'
import DatBanTab from '../features/bangDieuKhienNoiBo/components/DatBanTab'
import MonAnTab from '../features/bangDieuKhienNoiBo/components/MonAnTab'
import DonHangTab from '../features/bangDieuKhienNoiBo/components/DonHangTab'
import TongQuanTab from '../features/bangDieuKhienNoiBo/components/TongQuanTab'
import BanAnTab from '../features/bangDieuKhienNoiBo/components/BanAnTab'
import { useXacThuc } from '../hooks/useXacThuc'
import { CAC_BO_LOC_NGAY, CAC_TAB_NOI_BO, CAC_BO_LOC_CA } from '../features/bangDieuKhienNoiBo/hangSo'
import { layNhanPhamViTongQuan, khopBoLocNgay, khopBoLocCa } from '../features/bangDieuKhienNoiBo/boChon'
import { useDuLieuBangDieuKhienNoiBo } from '../features/bangDieuKhienNoiBo/useDuLieuBangDieuKhienNoiBo'

function BangDieuKhienNoiBoPage() {
  const navigate = useNavigate()
  const { nguoiDungHienTai, laAdmin } = useXacThuc()
  const [tabDangMo, setTabDangMo] = useState('overview')
  const [boLocNgay, setBoLocNgay] = useState('all')
  const [boLocCa, setBoLocCa] = useState('all')
  const {
    tomTatTaiKhoan,
    danhSachDatBanDangHoatDong,
    hangDoiDatBan,
    danhSachDatBanDaXacNhan,
    danhSachBan,
    danhSachDatBan,
    danhSachMon,
    danhSachTaiKhoan,
    xuLyGanBan,
    xuLyCheckIn,
    xuLyHoanThanh,
    xuLyTaoDatBanNoiBo,
    xuLyDanhDauBanBan,
    xuLyDanhDauBanSanSang,
    xuLyKhachKhongDen,
    xuLyCapNhatDatBanNoiBo,
    layBanPhuHopChoDatBan,
    danhSachDonHangDangMo,
    tomTatDonHang,
    danhSachDatBanChoXuLy,
    danhSachDonHangDaSapXep,
    tomTatTonKhoBan,
    tomTatBan,
    taiLaiDanhSachMon,
    danhSachDatBanSapDienRa,
    danhSachDatBanChuaGanBan,
  } = useDuLieuBangDieuKhienNoiBo()

  useEffect(() => {
    if (!laAdmin && (tabDangMo === 'accounts' || tabDangMo === 'dishes')) {
      setTabDangMo('overview')
    }
  }, [tabDangMo, laAdmin])

  const cacTabHienThi = useMemo(
    () => CAC_TAB_NOI_BO.filter((tab) => !tab.adminOnly || laAdmin),
    [laAdmin],
  )

  const phamViLabel = useMemo(() => layNhanPhamViTongQuan(boLocNgay, boLocCa), [boLocNgay, boLocCa])

  const danhSachDatBanDaLoc = useMemo(() => {
    const now = new Date()
    return danhSachDatBan.filter((booking) => khopBoLocNgay(booking, boLocNgay, now) && khopBoLocCa(booking, boLocCa))
  }, [danhSachDatBan, boLocCa, boLocNgay])

  const hangDoiDatBanDaLoc = useMemo(
    () => hangDoiDatBan.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [hangDoiDatBan, danhSachDatBanDaLoc],
  )

  const danhSachDatBanDangHoatDongDaLoc = useMemo(
    () => danhSachDatBanDangHoatDong.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [danhSachDatBanDangHoatDong, danhSachDatBanDaLoc],
  )

  const danhSachDatBanDaXacNhanDaLoc = useMemo(
    () => danhSachDatBanDaXacNhan.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [danhSachDatBanDaXacNhan, danhSachDatBanDaLoc],
  )

  const danhSachDatBanChoXuLyDaLoc = useMemo(
    () => danhSachDatBanChoXuLy.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [danhSachDatBanChoXuLy, danhSachDatBanDaLoc],
  )

  const danhSachDatBanSapDienRaDaLoc = useMemo(
    () => danhSachDatBanSapDienRa.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [danhSachDatBanSapDienRa, danhSachDatBanDaLoc],
  )

  const soLuongDatBanDaCheckInDaLoc = useMemo(
    () => danhSachDatBanDaLoc.filter((booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN').length,
    [danhSachDatBanDaLoc],
  )

  const danhSachDatBanChuaGanBanDaLoc = useMemo(
    () => danhSachDatBanChuaGanBan.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [danhSachDatBanChuaGanBan, danhSachDatBanDaLoc],
  )

  const urgentItems = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: danhSachDatBanChoXuLyDaLoc.length,
        detail: danhSachDatBanChoXuLyDaLoc.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có booking chờ xử lý.',
        tone: danhSachDatBanChoXuLyDaLoc.length > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: danhSachDatBanChuaGanBanDaLoc.length,
        detail: danhSachDatBanChuaGanBanDaLoc.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các booking đang có bàn phù hợp.',
        tone: danhSachDatBanChuaGanBanDaLoc.length > 0 ? 'danger' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: danhSachDatBanSapDienRaDaLoc.length,
        detail: danhSachDatBanSapDienRaDaLoc.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: danhSachDatBanSapDienRaDaLoc.length > 0 ? 'success' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: tomTatTonKhoBan.dirty,
        detail: tomTatTonKhoBan.dirty > 0 ? 'Cần làm sạch trước khi nhận lượt mới.' : 'Không có bàn đang dọn.',
        tone: tomTatTonKhoBan.dirty > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo('tables'),
      },
    ],
    [danhSachDatBanChoXuLyDaLoc.length, tomTatTonKhoBan.dirty, danhSachDatBanChuaGanBanDaLoc.length, danhSachDatBanSapDienRaDaLoc.length],
  )

  const canhBaoVanHanh = danhSachDatBanChoXuLyDaLoc.length + danhSachDatBanChuaGanBanDaLoc.length + danhSachDatBanSapDienRaDaLoc.length + tomTatTonKhoBan.dirty

  const xuLyTaoDatBan = () => {
    setTabDangMo('bookings')
  }

  const xuLyTaoDonHang = () => {
    navigate('/thuc-don')
  }

  return (
    <div className="noi-bo-dashboard-page">
      <div className="container">
        <div className="noi-bo-toolbar ho-so-card">
          <div className="noi-bo-toolbar-main">
            <div>
              <p className="ho-so-kicker">Điều hành ca</p>
              <h1>Dashboard vận hành</h1>
              <p>
                Theo dõi booking, bàn ăn và đơn đang mở theo nhịp vận hành thực tế.
              </p>
            </div>
            <div className="noi-bo-operator-badge">
              <strong>{nguoiDungHienTai?.fullName || 'Nhân sự nội bộ'}</strong>
              <span>{laAdmin ? 'Quản trị viên' : 'Nhân viên vận hành'}</span>
            </div>
          </div>

          <div className="noi-bo-toolbar-controls">
            <div className="noi-bo-filter-cluster">
              <span>Bộ lọc ngày</span>
              <div className="noi-bo-pill-group">
                {CAC_BO_LOC_NGAY.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`noi-bo-pill ${boLocNgay === filter.key ? 'active' : ''}`}
                    onClick={() => setBoLocNgay(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="noi-bo-filter-cluster">
              <span>Theo ca</span>
              <div className="noi-bo-pill-group">
                {CAC_BO_LOC_CA.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`noi-bo-pill ${boLocCa === filter.key ? 'active' : ''}`}
                    onClick={() => setBoLocCa(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="noi-bo-filter-cluster">
              <span>Thao tác nhanh</span>
              <div className="noi-bo-quick-actions">
                <button type="button" className="noi-bo-quick-btn noi-bo-quick-nut-chinh" onClick={xuLyTaoDatBan}>
                  Tạo booking
                </button>
                <button type="button" className="noi-bo-quick-btn" onClick={() => setTabDangMo('tables')}>
                  Mở sơ đồ bàn
                </button>
                <button type="button" className="noi-bo-quick-btn" onClick={xuLyTaoDonHang}>
                  Tạo đơn mới
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ho-so-shell">
          <aside className="ho-so-tabs noi-bo-dashboard-tabs" aria-label="Điều hướng nội bộ">
            {cacTabHienThi.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`ho-so-tab-btn ${tabDangMo === tab.key ? 'active' : ''}`}
                onClick={() => setTabDangMo(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="noi-bo-dashboard-content">
            {tabDangMo === 'overview' && (
              <TongQuanTab
                tomTatTaiKhoan={tomTatTaiKhoan}
                danhSachDatBanDangHoatDong={danhSachDatBanDangHoatDongDaLoc}
                hangDoiDatBan={hangDoiDatBanDaLoc}
                soLuongDatBanDaCheckIn={soLuongDatBanDaCheckInDaLoc}
                danhSachDatBanDaXacNhan={danhSachDatBanDaXacNhanDaLoc}
                isAdmin={laAdmin}
                danhSachDonHangDangMo={danhSachDonHangDangMo}
                canhBaoVanHanh={canhBaoVanHanh}
                tomTatDonHang={tomTatDonHang}
                danhSachDatBanChoXuLy={danhSachDatBanChoXuLyDaLoc}
                phamViLabel={phamViLabel}
                tomTatTonKhoBan={tomTatTonKhoBan}
                tomTatBan={tomTatBan}
                danhSachDatBanSapDienRa={danhSachDatBanSapDienRaDaLoc}
                danhSachDatBanChuaGanBan={danhSachDatBanChuaGanBanDaLoc}
                urgentItems={urgentItems}
              />
            )}

            {tabDangMo === 'bookings' && (
              <DatBanTab
                hangDoiDatBan={hangDoiDatBanDaLoc}
                getAvailableTablesForBooking={(booking) => layBanPhuHopChoDatBan(booking, danhSachBan)}
                handleAssignTables={xuLyGanBan}
                handleCheckIn={xuLyCheckIn}
                handleComplete={xuLyHoanThanh}
                handleCreateInternalBooking={xuLyTaoDatBanNoiBo}
                xuLyKhachKhongDen={xuLyKhachKhongDen}
                handleUpdateInternalBooking={xuLyCapNhatDatBanNoiBo}
                phamViLabel={phamViLabel}
              />
            )}

            {tabDangMo === 'orders' && (
              <DonHangTab orders={danhSachDonHangDaSapXep} />
            )}

            {tabDangMo === 'tables' && (
              <BanAnTab
                xuLyDanhDauBanBan={xuLyDanhDauBanBan}
                xuLyDanhDauBanSanSang={xuLyDanhDauBanSanSang}
                phamViLabel={phamViLabel}
                tomTatTonKhoBan={tomTatTonKhoBan}
                tomTatBan={tomTatBan}
                tables={danhSachBan}
              />
            )}

            {tabDangMo === 'dishes' && laAdmin && (
              <MonAnTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} />
            )}

            {tabDangMo === 'accounts' && laAdmin && (
              <TaiKhoanTab accounts={danhSachTaiKhoan} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default BangDieuKhienNoiBoPage
