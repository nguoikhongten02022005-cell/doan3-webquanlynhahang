import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ChiTietDonHangModal from '../components/hoSo/ChiTietDonHangModal'
import LichSuDatBanTab from '../components/hoSo/LichSuDatBanTab'
import LichSuDonHangTab from '../components/hoSo/LichSuDonHangTab'
import ThongTinCaNhanTab from '../components/hoSo/ThongTinCaNhanTab'
import { PROFILE_TABS } from '../data/duLieuHoSo'
import { BOOKINGS_HO_SO_MOCK, DON_HANG_HO_SO_MOCK } from '../data/duLieuHoSoMock'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'

const cloneBookings = () => BOOKINGS_HO_SO_MOCK.map((booking) => ({ ...booking }))

const cloneOrders = () => DON_HANG_HO_SO_MOCK.map((order) => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
}))

function HoSoPage() {
  const navigate = useNavigate()
  const { hienThongBao } = useThongBao()
  const { nguoiDungHienTai, dangKhoiTaoXacThuc, dangXuat, capNhatHoSo, capNhatMatKhau } = useXacThuc()
  const [tabDangMo, setTabDangMo] = useState('personal')
  const [lichSuDatBan, setLichSuDatBan] = useState([])
  const [lichSuDonHang, setLichSuDonHang] = useState([])
  const [maDonDangXem, setMaDonDangXem] = useState('')

  useEffect(() => {
    if (!nguoiDungHienTai) {
      setLichSuDatBan([])
      setLichSuDonHang([])
      setMaDonDangXem('')
      return
    }

    // TODO: Replace profile history mocks with the real profile APIs after backend support is ready.
    setLichSuDatBan(cloneBookings())
    setLichSuDonHang(cloneOrders())
    setMaDonDangXem('')
  }, [nguoiDungHienTai])

  const donHangDangXem = useMemo(
    () => lichSuDonHang.find((order) => order.orderCode === maDonDangXem) || null,
    [lichSuDonHang, maDonDangXem],
  )

  const handleCancelBooking = (bookingCode) => {
    // TODO: Replace mock booking cancellation with the real booking cancel API.
    setLichSuDatBan((currentBookings) => currentBookings.map((booking) => (
      booking.bookingCode === bookingCode
        ? {
            ...booking,
            statusLabel: 'Đã hủy',
            statusTone: 'danger',
            rawStatus: 'DA_HUY',
          }
        : booking
    )))

    hienThongBao({
      message: `Đã hủy booking ${bookingCode}.`,
      tone: 'success',
      duration: 3000,
      title: '',
    })
  }

  const handleRebook = () => {
    navigate('/dat-ban')
  }

  const handleOpenOrderDetail = (orderCode) => {
    setMaDonDangXem(orderCode)
  }

  const handleCloseOrderDetail = () => {
    setMaDonDangXem('')
  }

  const handleLogout = async () => {
    await dangXuat()
    navigate('/', { replace: true })
  }

  if (!dangKhoiTaoXacThuc && !nguoiDungHienTai) {
    return <Navigate to="/dang-nhap" replace />
  }

  return (
    <div className="ho-so-page ho-so-page-editorial">
      <div className="container">
        <div className="ho-so-shell">
          <aside className="ho-so-tabs" aria-label="Điều hướng hồ sơ">
            {PROFILE_TABS.map((tab) => (
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

          <section className="ho-so-content-panel">
            {tabDangMo === 'personal' && (
              <ThongTinCaNhanTab
                nguoiDung={nguoiDungHienTai}
                onLogout={handleLogout}
                onCapNhatHoSo={capNhatHoSo}
                onDoiMatKhau={capNhatMatKhau}
              />
            )}

            {tabDangMo === 'bookings' && (
              <LichSuDatBanTab
                bookings={lichSuDatBan}
                onCancelBooking={handleCancelBooking}
                onRebook={handleRebook}
              />
            )}

            {tabDangMo === 'orders' && (
              <LichSuDonHangTab orders={lichSuDonHang} onOpenOrderDetail={handleOpenOrderDetail} />
            )}
          </section>
        </div>
      </div>

      <ChiTietDonHangModal donHang={donHangDangXem} dangMo={Boolean(donHangDangXem)} onClose={handleCloseOrderDetail} />
    </div>
  )
}

export default HoSoPage
