import { useEffect, useMemo, useState } from 'react'
import { Tabs } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import ChiTietDonHangModal from '../features/hoSo/components/ChiTietDonHangModal'
import DonHangMangVeTab from '../features/hoSo/components/DonHangMangVeTab'
import LichSuDatBanTab from '../features/hoSo/components/LichSuDatBanTab'
import ThongTinCaNhanTab from '../features/hoSo/components/ThongTinCaNhanTab'
import { PROFILE_TABS } from '../features/hoSo/mocks/duLieuHoSo'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../features/datBan/hooks/useDatBan'
import { huyDonMangVeApi } from '../services/api/apiMangVe'
import { layDanhSachDonHangHoSoApi } from '../services/api/apiDonHang'
import { layLichSuDiemTichLuyApi, layTongQuanDiemTichLuyApi } from '../services/api/apiDiemTichLuy'

function HoSoPage() {
  const navigate = useNavigate()
  const { hienThongBao } = useThongBao()
  const { nguoiDungHienTai, dangKhoiTaoXacThuc, dangXuat, capNhatHoSo, capNhatMatKhau } = useXacThuc()
  const { layLichSuDatBan, huyDatBan } = useDatBan()
  const [tabHienTai, setTabHienTai] = useState('personal')
  const [danhSachDatBan, setDanhSachDatBan] = useState([])
  const [danhSachDonHang, setDanhSachDonHang] = useState([])
  const [tongQuanDiemTichLuy, setTongQuanDiemTichLuy] = useState(null)
  const [danhSachLichSuDiem, setDanhSachLichSuDiem] = useState([])
  const [maDonChiTiet, setMaDonChiTiet] = useState('')
  const [boLocTrangThaiDonHang, setBoLocTrangThaiDonHang] = useState('ALL')

  useEffect(() => {
    document.body.classList.add('ho-so-an-thanh-cuon')

    return () => {
      document.body.classList.remove('ho-so-an-thanh-cuon')
    }
  }, [])

  useEffect(() => {
    if (!nguoiDungHienTai) {
      setDanhSachDatBan([])
      setDanhSachDonHang([])
      setTongQuanDiemTichLuy(null)
      setDanhSachLichSuDiem([])
      setMaDonChiTiet('')
      return
    }

    setMaDonChiTiet('')
    ;(async () => {
      try {
        if (nguoiDungHienTai.maKH) {
          const duLieuDatBan = await layLichSuDatBan()
          setDanhSachDatBan(Array.isArray(duLieuDatBan) ? duLieuDatBan : [])
        } else {
          setDanhSachDatBan([])
        }

        const [phanHoiDonHang, phanHoiTongQuanDiem, phanHoiLichSuDiem] = await Promise.all([
          layDanhSachDonHangHoSoApi(),
          layTongQuanDiemTichLuyApi(),
          layLichSuDiemTichLuyApi(),
        ])

        setDanhSachDonHang(Array.isArray(phanHoiDonHang?.duLieu) ? phanHoiDonHang.duLieu : [])
        setTongQuanDiemTichLuy(phanHoiTongQuanDiem?.duLieu || null)
        setDanhSachLichSuDiem(Array.isArray(phanHoiLichSuDiem?.duLieu) ? phanHoiLichSuDiem.duLieu : [])
      } catch {
        setDanhSachDatBan([])
        setDanhSachDonHang([])
        setTongQuanDiemTichLuy(null)
        setDanhSachLichSuDiem([])
      }
    })()
  }, [layLichSuDatBan, nguoiDungHienTai])

  const donHangChiTiet = useMemo(
    () => danhSachDonHang.find((order) => order.maDonHang === maDonChiTiet) || null,
    [danhSachDonHang, maDonChiTiet],
  )

  const danhSachTabHoSo = useMemo(
    () => PROFILE_TABS.map((tab) => ({ key: tab.key, label: tab.label })),
    [],
  )

  const handleHuyDatBan = async (maDatBan) => {
    const xacNhan = window.confirm(`Bạn có chắc muốn hủy đặt bàn ${maDatBan}?`)
    if (!xacNhan) return

    try {
      const ketQua = await huyDatBan(maDatBan, maDatBan)
      if (!ketQua.success) {
        hienThongBao({
          message: ketQua.error || 'Không thể hủy đặt bàn lúc này.',
          tone: 'error',
          duration: 3000,
          title: '',
        })
        return
      }

      setDanhSachDatBan(Array.isArray(ketQua.lichSuDatBan) ? ketQua.lichSuDatBan : [])
      hienThongBao({
        message: ketQua.message || `Đã hủy đặt bàn ${maDatBan}.`,
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

  const handleDatLai = () => {
    navigate('/dat-ban')
  }

  const handleMoChiTietDonHang = (orderCode) => {
    setMaDonChiTiet(orderCode)
  }

  const handleHuyDonMangVe = async (maDonHang) => {
    const xacNhan = window.confirm('Bạn có chắc muốn hủy đơn này?')
    if (!xacNhan) return

    try {
      await huyDonMangVeApi(maDonHang)
      const { duLieu } = await layDanhSachDonHangHoSoApi()
      setDanhSachDonHang(Array.isArray(duLieu) ? duLieu : [])
      hienThongBao({ message: `Đã hủy đơn ${maDonHang}.`, tone: 'success', duration: 3000, title: '' })
    } catch (error) {
      hienThongBao({ message: error?.message || 'Không thể hủy đơn lúc này.', tone: 'error', duration: 3000, title: '' })
    }
  }

  const handleDongChiTietDonHang = () => {
    setMaDonChiTiet('')
  }

  const handleDangXuat = async () => {
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
            activeKey={tabHienTai}
            items={danhSachTabHoSo}
            onChange={setTabHienTai}
            tabBarGutter={0}
            animated={false}
          />

          <section className="ho-so-content-panel">
            {tabHienTai === 'personal' && (
              <ThongTinCaNhanTab
                nguoiDung={nguoiDungHienTai}
                tongQuanDiemTichLuy={tongQuanDiemTichLuy}
                lichSuDiemTichLuy={danhSachLichSuDiem}
                onLogout={handleDangXuat}
                onCapNhatHoSo={capNhatHoSo}
                onDoiMatKhau={capNhatMatKhau}
              />
            )}

            {tabHienTai === 'bookings' && (
              <LichSuDatBanTab
                bookings={danhSachDatBan}
                onCancelBooking={handleHuyDatBan}
                onRebook={handleDatLai}
              />
            )}

            {tabHienTai === 'orders' && (
              <DonHangMangVeTab
                danhSachDon={danhSachDonHang}
                boLoc={boLocTrangThaiDonHang}
                onDoiBoLoc={setBoLocTrangThaiDonHang}
                onHuyDon={handleHuyDonMangVe}
                onXemChiTiet={handleMoChiTietDonHang}
              />
            )}
          </section>
        </div>
      </div>

      <ChiTietDonHangModal donHang={donHangChiTiet} dangMo={Boolean(donHangChiTiet)} onClose={handleDongChiTietDonHang} />
    </div>
  )
}

export default HoSoPage
