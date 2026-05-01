import { useEffect, useMemo, useState } from 'react'
import { Tabs } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import LichSuDatBanTab from '../features/hoSo/components/LichSuDatBanTab'
import ThongTinCaNhanTab from '../features/hoSo/components/ThongTinCaNhanTab'
import { PROFILE_TABS } from '../features/hoSo/mocks/duLieuHoSo'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../features/datBan/hooks/useDatBan'
import { layLichSuDiemTichLuyApi, layTongQuanDiemTichLuyApi } from '../services/api/apiDiemTichLuy'

function HoSoPage() {
  const navigate = useNavigate()
  const { hienThongBao } = useThongBao()
  const { nguoiDungHienTai, dangKhoiTaoXacThuc, dangXuat, capNhatHoSo, capNhatMatKhau } = useXacThuc()
  const { layLichSuDatBan, huyDatBan } = useDatBan()
  const [tabHienTai, setTabHienTai] = useState('personal')
  const [danhSachDatBan, setDanhSachDatBan] = useState([])
  const [tongQuanDiemTichLuy, setTongQuanDiemTichLuy] = useState(null)
  const [danhSachLichSuDiem, setDanhSachLichSuDiem] = useState([])

  useEffect(() => {
    document.body.classList.add('ho-so-an-thanh-cuon')

    return () => {
      document.body.classList.remove('ho-so-an-thanh-cuon')
    }
  }, [])

  useEffect(() => {
    if (!nguoiDungHienTai) {
      setDanhSachDatBan([])
      setTongQuanDiemTichLuy(null)
      setDanhSachLichSuDiem([])
      return
    }

    ;(async () => {
      try {
        if (nguoiDungHienTai.maKH) {
          const duLieuDatBan = await layLichSuDatBan()
          setDanhSachDatBan(Array.isArray(duLieuDatBan) ? duLieuDatBan : [])
        } else {
          setDanhSachDatBan([])
        }

        const [phanHoiTongQuanDiem, phanHoiLichSuDiem] = await Promise.all([
          layTongQuanDiemTichLuyApi(),
          layLichSuDiemTichLuyApi(),
        ])

        setTongQuanDiemTichLuy(phanHoiTongQuanDiem?.duLieu || null)
        setDanhSachLichSuDiem(Array.isArray(phanHoiLichSuDiem?.duLieu) ? phanHoiLichSuDiem.duLieu : [])
      } catch {
        setDanhSachDatBan([])
        setTongQuanDiemTichLuy(null)
        setDanhSachLichSuDiem([])
      }
    })()
  }, [layLichSuDatBan, nguoiDungHienTai])

  const danhSachTabHoSo = useMemo(
    () => PROFILE_TABS.map((tab) => ({ key: tab.key, label: tab.label })),
    [],
  )

  const lamMoiDiemTichLuy = async () => {
    try {
      const [phanHoiTongQuanDiem, phanHoiLichSuDiem] = await Promise.all([
        layTongQuanDiemTichLuyApi(),
        layLichSuDiemTichLuyApi(),
      ])

      setTongQuanDiemTichLuy(phanHoiTongQuanDiem?.duLieu || null)
      setDanhSachLichSuDiem(Array.isArray(phanHoiLichSuDiem?.duLieu) ? phanHoiLichSuDiem.duLieu : [])
    } catch {
      setTongQuanDiemTichLuy(null)
      setDanhSachLichSuDiem([])
    }
  }

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
                onRefreshDiemTichLuy={lamMoiDiemTichLuy}
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
              <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                <p>Dịch vụ đặt hàng mang về hiện không khả dụng.</p>
              </div>
            )}
          </section>
        </div>
      </div>

    </div>
  )
}

export default HoSoPage
