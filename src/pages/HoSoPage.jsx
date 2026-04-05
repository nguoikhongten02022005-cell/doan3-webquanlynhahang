import { useEffect, useMemo, useState } from 'react'
import { Tabs } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import ChiTietDonHangModal from '../components/hoSo/ChiTietDonHangModal'
import DonHangMangVeTab from '../components/hoSo/DonHangMangVeTab'
import LichSuDatBanTab from '../components/hoSo/LichSuDatBanTab'
import ThongTinCaNhanTab from '../components/hoSo/ThongTinCaNhanTab'
import { PROFILE_TABS } from '../data/duLieuHoSo'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../hooks/useDatBan'
import { huyDonMangVeApi } from '../services/api/apiMangVe'
import { layDanhSachDonHangHoSoApi } from '../services/api/apiDonHang'

function HoSoPage() {
  const navigate = useNavigate()
  const { hienThongBao } = useThongBao()
  const { nguoiDungHienTai, dangKhoiTaoXacThuc, dangXuat, capNhatHoSo, capNhatMatKhau } = useXacThuc()
  const { layLichSuDatBan, huyDatBan } = useDatBan()
  const [tabDangMo, setTabDangMo] = useState('personal')
  const [lichSuDatBan, setLichSuDatBan] = useState([])
  const [lichSuDonHang, setLichSuDonHang] = useState([])
  const [maDonDangXem, setMaDonDangXem] = useState('')
  const [boLocDonHang, setBoLocDonHang] = useState('ALL')

  useEffect(() => {
    document.body.classList.add('ho-so-an-thanh-cuon')

    return () => {
      document.body.classList.remove('ho-so-an-thanh-cuon')
    }
  }, [])

  useEffect(() => {
    if (!nguoiDungHienTai) {
      setLichSuDatBan([])
      setLichSuDonHang([])
      setMaDonDangXem('')
      return
    }

    setMaDonDangXem('')
    ;(async () => {
      try {
        if (nguoiDungHienTai.maKH) {
          const danhSachDatBan = await layLichSuDatBan()
          setLichSuDatBan(Array.isArray(danhSachDatBan) ? danhSachDatBan : [])
        } else {
          setLichSuDatBan([])
        }

        const { duLieu } = await layDanhSachDonHangHoSoApi()
        setLichSuDonHang(Array.isArray(duLieu) ? duLieu : [])
      } catch {
        setLichSuDatBan([])
        setLichSuDonHang([])
      }
    })()
  }, [layLichSuDatBan, nguoiDungHienTai])

  const donHangDangXem = useMemo(
    () => lichSuDonHang.find((order) => order.maDonHang === maDonDangXem) || null,
    [lichSuDonHang, maDonDangXem],
  )

  const danhSachTabHoSo = useMemo(
    () => PROFILE_TABS.map((tab) => ({ key: tab.key, label: tab.label })),
    [],
  )

  const handleCancelBooking = async (bookingCode) => {
    const xacNhan = window.confirm(`Bạn có chắc muốn hủy booking ${bookingCode}?`)
    if (!xacNhan) return

    try {
      const ketQua = await huyDatBan(bookingCode, bookingCode)
      if (!ketQua.success) {
        hienThongBao({
          message: ketQua.error || 'Không thể hủy đặt bàn lúc này.',
          tone: 'error',
          duration: 3000,
          title: '',
        })
        return
      }

      setLichSuDatBan(Array.isArray(ketQua.lichSuDatBan) ? ketQua.lichSuDatBan : [])
      hienThongBao({
        message: ketQua.message || `Đã hủy booking ${bookingCode}.`,
        tone: 'success',
        duration: 3000,
        title: '',
      })
    } catch (error) {
      hienThongBao({
        message: error?.message || 'Không thể hủy đặt bàn lúc này.',
        tone: 'error',
        duration: 3000,
        title: '',
      })
    }
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
      const { duLieu } = await layDanhSachDonHangHoSoApi()
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
          <Tabs
            className="ho-so-tabs ho-so-tabs-ant-hybrid"
            activeKey={tabDangMo}
            items={danhSachTabHoSo}
            onChange={setTabDangMo}
            tabBarGutter={0}
            animated={false}
          />

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
