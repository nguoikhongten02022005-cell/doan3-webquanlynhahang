import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaiKhoanTab from '../components/bangDieuKhienNoiBo/TaiKhoanTab'
import DatBanTab from '../components/bangDieuKhienNoiBo/DatBanTab'
import MonAnTab from '../components/bangDieuKhienNoiBo/MonAnTab'
import DonHangTab from '../components/bangDieuKhienNoiBo/DonHangTab'
import TongQuanTab from '../components/bangDieuKhienNoiBo/TongQuanTab'
import BanAnTab from '../components/bangDieuKhienNoiBo/BanAnTab'
import { useXacThuc } from '../hooks/useXacThuc'
import { CAC_BO_LOC_NGAY, CAC_TAB_NOI_BO, CAC_BO_LOC_CA, TAB_NOI_BO } from '../features/bangDieuKhienNoiBo/hangSo'
import { layNhanPhamViTongQuan, khopBoLocNgay, khopBoLocCa } from '../features/bangDieuKhienNoiBo/boChon'
import { useDuLieuBangDieuKhienNoiBo } from '../features/bangDieuKhienNoiBo/useDuLieuBangDieuKhienNoiBo'

function BangDieuKhienNoiBoPage() {
  const navigate = useNavigate()
  const { nguoiDungHienTai, laAdmin } = useXacThuc()
  const [tabDangMo, setTabDangMo] = useState(TAB_NOI_BO.TONG_QUAN)
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
    if (!laAdmin && (tabDangMo === TAB_NOI_BO.TAI_KHOAN || tabDangMo === TAB_NOI_BO.MON_AN)) {
      setTabDangMo(TAB_NOI_BO.TONG_QUAN)
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

  const danhSachDatBanDaLocIds = useMemo(() => new Set(danhSachDatBanDaLoc.map((booking) => booking.id)), [danhSachDatBanDaLoc])

  const locDatBanTheoPhamVi = useCallback(
    (bookings) => bookings.filter((booking) => danhSachDatBanDaLocIds.has(booking.id)),
    [danhSachDatBanDaLocIds],
  )

  const hangDoiDatBanDaLoc = useMemo(() => locDatBanTheoPhamVi(hangDoiDatBan), [hangDoiDatBan, locDatBanTheoPhamVi])

  const danhSachDatBanDangHoatDongDaLoc = useMemo(
    () => locDatBanTheoPhamVi(danhSachDatBanDangHoatDong),
    [danhSachDatBanDangHoatDong, locDatBanTheoPhamVi],
  )

  const danhSachDatBanDaXacNhanDaLoc = useMemo(
    () => locDatBanTheoPhamVi(danhSachDatBanDaXacNhan),
    [danhSachDatBanDaXacNhan, locDatBanTheoPhamVi],
  )

  const danhSachDatBanChoXuLyDaLoc = useMemo(
    () => locDatBanTheoPhamVi(danhSachDatBanChoXuLy),
    [danhSachDatBanChoXuLy, locDatBanTheoPhamVi],
  )

  const danhSachDatBanSapDienRaDaLoc = useMemo(
    () => locDatBanTheoPhamVi(danhSachDatBanSapDienRa),
    [danhSachDatBanSapDienRa, locDatBanTheoPhamVi],
  )

  const soLuongDatBanDaCheckInDaLoc = useMemo(
    () => danhSachDatBanDaLoc.filter((booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN').length,
    [danhSachDatBanDaLoc],
  )

  const danhSachDatBanChuaGanBanDaLoc = useMemo(
    () => locDatBanTheoPhamVi(danhSachDatBanChuaGanBan),
    [danhSachDatBanChuaGanBan, locDatBanTheoPhamVi],
  )

  const urgentItems = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: danhSachDatBanChoXuLyDaLoc.length,
        detail: danhSachDatBanChoXuLyDaLoc.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có booking chờ xử lý.',
        tone: danhSachDatBanChoXuLyDaLoc.length > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo(TAB_NOI_BO.DAT_BAN),
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: danhSachDatBanChuaGanBanDaLoc.length,
        detail: danhSachDatBanChuaGanBanDaLoc.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các booking đang có bàn phù hợp.',
        tone: danhSachDatBanChuaGanBanDaLoc.length > 0 ? 'danger' : 'neutral',
        action: () => setTabDangMo(TAB_NOI_BO.DAT_BAN),
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: danhSachDatBanSapDienRaDaLoc.length,
        detail: danhSachDatBanSapDienRaDaLoc.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: danhSachDatBanSapDienRaDaLoc.length > 0 ? 'success' : 'neutral',
        action: () => setTabDangMo(TAB_NOI_BO.DAT_BAN),
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: tomTatTonKhoBan.dirty,
        detail: tomTatTonKhoBan.dirty > 0 ? 'Cần làm sạch trước khi nhận lượt mới.' : 'Không có bàn đang dọn.',
        tone: tomTatTonKhoBan.dirty > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo(TAB_NOI_BO.BAN_AN),
      },
    ],
    [danhSachDatBanChoXuLyDaLoc.length, tomTatTonKhoBan.dirty, danhSachDatBanChuaGanBanDaLoc.length, danhSachDatBanSapDienRaDaLoc.length],
  )

  const canhBaoVanHanh = danhSachDatBanChoXuLyDaLoc.length + danhSachDatBanChuaGanBanDaLoc.length + danhSachDatBanSapDienRaDaLoc.length + tomTatTonKhoBan.dirty

  const xuLyTaoDatBan = () => {
    setTabDangMo(TAB_NOI_BO.DAT_BAN)
  }

  const xuLyTaoDonHang = () => {
    navigate('/thuc-don')
  }

  return (
    <div className="noi-bo-dashboard-page">
      <div className="container">
        <header className="ho-so-header noi-bo-dashboard-header">
          <div className="ho-so-header-copy noi-bo-dashboard-header-copy">
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
        </header>

        <section className="ho-so-card noi-bo-toolbar" aria-label="Bộ lọc và thao tác nhanh">
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

            <div className="noi-bo-filter-cluster noi-bo-filter-cluster-actions">
              <span>Thao tác nhanh</span>
              <div className="noi-bo-quick-actions">
                <button type="button" className="noi-bo-quick-btn noi-bo-quick-nut-chinh" onClick={xuLyTaoDatBan}>
                  Tạo booking
                </button>
                <button type="button" className="noi-bo-quick-btn" onClick={() => setTabDangMo(TAB_NOI_BO.BAN_AN)}>
                  Mở sơ đồ bàn
                </button>
                <button type="button" className="noi-bo-quick-btn" onClick={xuLyTaoDonHang}>
                  Tạo đơn mới
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="ho-so-shell noi-bo-dashboard-shell">
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

          <section className="ho-so-content-panel noi-bo-dashboard-content">
            {tabDangMo === TAB_NOI_BO.TONG_QUAN && (
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

            {tabDangMo === TAB_NOI_BO.DAT_BAN && (
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

            {tabDangMo === TAB_NOI_BO.DON_HANG && (
              <DonHangTab orders={danhSachDonHangDaSapXep} />
            )}

            {tabDangMo === TAB_NOI_BO.BAN_AN && (
              <BanAnTab
                variant="legacy"
                xuLyDanhDauBanBan={xuLyDanhDauBanBan}
                xuLyDanhDauBanSanSang={xuLyDanhDauBanSanSang}
                phamViLabel={phamViLabel}
                tomTatTonKhoBan={tomTatTonKhoBan}
                tomTatBan={tomTatBan}
                tables={danhSachBan}
              />
            )}

            {tabDangMo === TAB_NOI_BO.MON_AN && laAdmin && (
              <MonAnTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} />
            )}

            {tabDangMo === TAB_NOI_BO.TAI_KHOAN && laAdmin && (
              <TaiKhoanTab accounts={danhSachTaiKhoan} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default BangDieuKhienNoiBoPage
