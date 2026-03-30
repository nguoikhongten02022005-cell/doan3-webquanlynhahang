import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ChiTietDonHangModal from '../components/hoSo/ChiTietDonHangModal'
import DonHangMangVeTab from '../components/hoSo/DonHangMangVeTab'
import LichSuDatBanTab from '../components/hoSo/LichSuDatBanTab'
import ThongTinCaNhanTab from '../components/hoSo/ThongTinCaNhanTab'
import { PROFILE_TABS } from '../data/duLieuHoSo'
import { BOOKINGS_HO_SO_MOCK } from '../data/duLieuHoSoMock'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { huyDonMangVeApi, layLichSuDonMangVeApi } from '../services/api/apiMangVe'

const cloneBookings = () => BOOKINGS_HO_SO_MOCK.map((booking) => ({ ...booking }))

function HoSoPage() {
  const navigate = useNavigate()
  const { hienThongBao } = useThongBao()
  const { nguoiDungHienTai, dangKhoiTaoXacThuc, dangXuat, capNhatHoSo, capNhatMatKhau } = useXacThuc()
  const [tabDangMo, setTabDangMo] = useState('personal')
  const [lichSuDatBan, setLichSuDatBan] = useState([])
  const [lichSuDonHang, setLichSuDonHang] = useState([])
  const [maDonDangXem, setMaDonDangXem] = useState('')
  const [boLocDonHang, setBoLocDonHang] = useState('ALL')

  useEffect(() => {
    if (!nguoiDungHienTai) {
      setLichSuDatBan([])
      setLichSuDonHang([])
      setMaDonDangXem('')
      return
    }

    setLichSuDatBan(cloneBookings())
    setMaDonDangXem('')
    ;(async () => {
      try {
        const { duLieu } = await layLichSuDonMangVeApi()
        setLichSuDonHang(Array.isArray(duLieu) ? duLieu : [])
      } catch {
        setLichSuDonHang([])
      }
    })()
  }, [nguoiDungHienTai])

  const donHangDangXem = useMemo(
    () => lichSuDonHang.find((order) => order.maDonHang === maDonDangXem) || null,
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

  const handleHuyDonMangVe = async (maDonHang) => {
    const xacNhan = window.confirm('Bạn có chắc muốn hủy đơn này?')
    if (!xacNhan) return

    try {
      await huyDonMangVeApi(maDonHang)
      const { duLieu } = await layLichSuDonMangVeApi()
      setLichSuDonHang(Array.isArray(duLieu) ? duLieu : [])
      hienThongBao({ message: `Đã hủy đơn ${maDonHang}.`, tone: 'success', duration: 3000, title: '' })
    } catch (error) {
      hienThongBao({ message: error?.message || 'Không thể hủy đơn lúc này.', tone: 'error', duration: 3000, title: '' })
    }
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
              <DonHangMangVeTab
                danhSachDon={lichSuDonHang}
                boLoc={boLocDonHang}
                onDoiBoLoc={setBoLocDonHang}
                onHuyDon={handleHuyDonMangVe}
                onXemChiTiet={handleOpenOrderDetail}
              />
            )}
          </section>
        </div>
      </div>

      <ChiTietDonHangModal donHang={donHangDangXem} dangMo={Boolean(donHangDangXem)} onClose={handleCloseOrderDetail} />
    </div>
  )
}

export default HoSoPage
