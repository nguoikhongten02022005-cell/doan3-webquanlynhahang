import { useEffect, useMemo, useState } from 'react'
import { PROFILE_TABS } from '../data/duLieuHoSo'
import { dinhDangTienTe } from '../utils/tienTe'
import { layDonHangCuaToiApi } from '../services/api/apiDonHang'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../hooks/useDatBan'
import { coTheHuyDatBan } from '../hooks/datBan/chinhSachDatBan.js'
import {
  layNhanTrangThaiDonHang,
  laySacThaiDonHang,
  layBuocTienTrinhDonHang,
  laTrangThaiDonHangDaHuy,
  CAC_BUOC_TIEN_TRINH_DON_HANG,
} from '../utils/donHang'
import { laySacThaiTrangThaiDatBan } from '../features/bangDieuKhienNoiBo/dinhDang'

const dinhDangNgay = (value) => {
  if (!value) {
    return '--'
  }

  const ngay = new Date(giaTri)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return date.toLocaleDateString('vi-VN')
}

function HoSoPage() {
  const { nguoiDungHienTai } = useXacThuc()
  const { huyDatBan, layLichSuDatBan } = useDatBan()
  const [tabDangMo, setTabDangMo] = useState('personal')
  const [lichSuDatBan, setLichSuDatBan] = useState([])
  const [lichSuDonHang, setLichSuDonHang] = useState([])
  const [thongBaoDatBan, setThongBaoDatBan] = useState('')

  const thongTinHoSo = useMemo(() => ({
    name: String(nguoiDungHienTai?.fullName ?? nguoiDungHienTai?.name ?? ''),
    email: String(nguoiDungHienTai?.email ?? ''),
    phone: String(nguoiDungHienTai?.phone ?? ''),
  }), [nguoiDungHienTai])

  const lichSuDonHangDaChuanHoa = useMemo(() => lichSuDonHang.map((order) => {
    const rawStatus = String(order?.status || '').trim()

    return {
      id: `DH-${String(order.id).slice(-6)}`,
      date: dinhDangNgay(order.orderDate),
      total: Number(order.total) || 0,
      rawStatus,
      statusLabel: layNhanTrangThaiDonHang(rawStatus),
      statusTone: laySacThaiDonHang(rawStatus),
      timelineStep: layBuocTienTrinhDonHang(rawStatus),
      isCancelled: laTrangThaiDonHangDaHuy(rawStatus),
    }
  }), [lichSuDonHang])

  useEffect(() => {
    const loadProfileData = async () => {
      if (!nguoiDungHienTai) {
        setLichSuDatBan([])
        setLichSuDonHang([])
        setThongBaoDatBan('')
        return
      }

      const [bookings, orders] = await Promise.all([
        layLichSuDatBan(),
        layDonHangCuaToiApi(),
      ])

      setLichSuDatBan(Array.isArray(bookings) ? bookings : [])
      setLichSuDonHang(Array.isArray(orders?.duLieu) ? orders.duLieu : [])
      setThongBaoDatBan('')
    }

    loadProfileData()
  }, [nguoiDungHienTai, layLichSuDatBan])

  const handleCancelBooking = async (bookingId, bookingCode) => {
    const ketQua = await huyDatBan(bookingId, bookingCode)

    if (!result.success) {
      setThongBaoDatBan(result.error)
      return
    }

    setLichSuDatBan(result.lichSuDatBan)
    setThongBaoDatBan(result.message)
  }

  return (
    <div className="ho-so-page ho-so-page-editorial">
      <div className="container">
        <header className="ho-so-header">
          <p className="ho-so-kicker">Tài khoản</p>
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin cá nhân, theo dõi đơn hàng và lịch sử đặt bàn của bạn.</p>
        </header>

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
              <article className="ho-so-card">
                <h2>Thông tin cá nhân</h2>
                <div className="ho-so-form-grid">
                  <div className="nhom-truong">
                    <label className="nhan-truong" htmlFor="ho-so-name">
                      Tên
                    </label>
                    <input id="ho-so-name" className="truong-nhap" value={thongTinHoSo.name} readOnly />
                  </div>

                  <div className="nhom-truong">
                    <label className="nhan-truong" htmlFor="ho-so-email">
                      Email
                    </label>
                    <input id="ho-so-email" className="truong-nhap" value={thongTinHoSo.email} readOnly />
                  </div>

                  <div className="nhom-truong">
                    <label className="nhan-truong" htmlFor="ho-so-phone">
                      Số điện thoại
                    </label>
                    <input id="ho-so-phone" className="truong-nhap" value={thongTinHoSo.phone} readOnly />
                  </div>
                </div>
              </article>
            )}

            {tabDangMo === 'orders' && (
              <article className="ho-so-card">
                <h2>Lịch sử đơn hàng</h2>

                <div className="ho-so-list">
                  {lichSuDonHangDaChuanHoa.length === 0 && (
                    <div className="ho-so-list-item">
                      <p className="dat-ban-empty">Chưa có lịch sử đơn hàng nào.</p>
                    </div>
                  )}

                  {lichSuDonHangDaChuanHoa.map((order) => (
                    <div key={order.id} className="ho-so-list-item">
                      <div className="ho-so-list-top">
                        <strong>{order.id}</strong>
                        <span className={`nhan-trang-thai tone-${order.statusTone}`}>{order.statusLabel}</span>
                      </div>

                      {order.isCancelled ? (
                        <div className="don-hang-progress don-hang-progress-cancelled" aria-label={`Tiến trình đơn ${order.id}`}>
                          <div className="don-hang-progress-step active">
                            <span className="don-hang-progress-dot" aria-hidden="true" />
                            <span className="don-hang-progress-label">Đơn hàng đã hủy</span>
                          </div>
                        </div>
                      ) : (
                        <div className="don-hang-progress" aria-label={`Tiến trình đơn ${order.id}`}>
                          {CAC_BUOC_TIEN_TRINH_DON_HANG.map((stepLabel, index) => {
                            const stepNumber = index + 1
                            const isActive = order.timelineStep >= stepNumber

                            return (
                              <div key={stepLabel} className={`don-hang-progress-step ${isActive ? 'active' : ''}`}>
                                <span className="don-hang-progress-dot" aria-hidden="true" />
                                <span className="don-hang-progress-label">{stepLabel}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="ho-so-list-meta">
                        <p>
                          <span>Ngày đặt:</span>
                          <strong>{order.date}</strong>
                        </p>
                        <p>
                          <span>Tổng tiền:</span>
                          <strong>{dinhDangTienTe(order.total)}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}

            {tabDangMo === 'bookings' && (
              <article className="ho-so-card">
                <h2>Lịch sử đặt bàn</h2>

                {thongBaoDatBan && <p className="dat-ban-feedback">{thongBaoDatBan}</p>}

                <div className="ho-so-list">
                  {lichSuDatBan.length === 0 && (
                    <div className="ho-so-list-item">
                      <p className="dat-ban-empty">Chưa có lịch sử đặt bàn nào.</p>
                    </div>
                  )}

                  {lichSuDatBan.map((booking) => (
                    <div key={`${booking.id}-${booking.bookingId ?? booking.id}`} className="ho-so-list-item">
                      <div className="ho-so-list-top">
                        <strong>{booking.id}</strong>
                        <span className={`nhan-trang-thai tone-${laySacThaiTrangThaiDatBan(booking.rawStatus)}`}>{booking.status}</span>
                      </div>

                      <div className="ho-so-list-meta">
                        <p>
                          <span>Ngày giờ:</span>
                          <strong>{booking.dateTime}</strong>
                        </p>
                        <p>
                          <span>Số người:</span>
                          <strong>{booking.guests} khách</strong>
                        </p>
                        {booking.seatingArea && (
                          <p>
                            <span>Khu vực:</span>
                            <strong>{booking.seatingArea}</strong>
                          </p>
                        )}
                      </div>

                      {coTheHuyDatBan(booking.rawStatus) ? (
                        <div className="dat-ban-actions">
                          <button
                            type="button"
                            className="btn nut-phu dat-ban-cancel-btn"
                            onClick={() => handleCancelBooking(booking.bookingId, booking.id)}
                            aria-label={`Hủy đặt bàn ${booking.id}`}
                          >
                            Hủy đặt bàn
                          </button>
                        </div>
                      ) : (
                        booking.rawStatus === 'DA_XAC_NHAN' && (
                          <p className="dat-ban-hotline-hint">Đặt bàn đã xác nhận. Vui lòng gọi hotline để hỗ trợ hủy.</p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </article>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default HoSoPage
