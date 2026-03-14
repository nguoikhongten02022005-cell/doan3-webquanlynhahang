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

    setLichSuDatBan(result.bookingHistory)
    setThongBaoDatBan(result.message)
  }

  return (
    <div className="profile-page profile-page-editorial">
      <div className="container">
        <header className="profile-header">
          <p className="profile-kicker">Tài khoản</p>
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin cá nhân, theo dõi đơn hàng và lịch sử đặt bàn của bạn.</p>
        </header>

        <div className="profile-shell">
          <aside className="profile-tabs" aria-label="Điều hướng hồ sơ">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`profile-tab-btn ${tabDangMo === tab.key ? 'active' : ''}`}
                onClick={() => setTabDangMo(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="profile-content-panel">
            {tabDangMo === 'personal' && (
              <article className="profile-card">
                <h2>Thông tin cá nhân</h2>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">
                      Tên
                    </label>
                    <input id="profile-name" className="form-input" value={thongTinHoSo.name} readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">
                      Email
                    </label>
                    <input id="profile-email" className="form-input" value={thongTinHoSo.email} readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">
                      Số điện thoại
                    </label>
                    <input id="profile-phone" className="form-input" value={thongTinHoSo.phone} readOnly />
                  </div>
                </div>
              </article>
            )}

            {tabDangMo === 'orders' && (
              <article className="profile-card">
                <h2>Lịch sử đơn hàng</h2>

                <div className="profile-list">
                  {lichSuDonHangDaChuanHoa.length === 0 && (
                    <div className="profile-list-item">
                      <p className="booking-empty">Chưa có lịch sử đơn hàng nào.</p>
                    </div>
                  )}

                  {lichSuDonHangDaChuanHoa.map((order) => (
                    <div key={order.id} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{order.id}</strong>
                        <span className={`status-chip tone-${order.statusTone}`}>{order.statusLabel}</span>
                      </div>

                      {order.isCancelled ? (
                        <div className="order-progress order-progress-cancelled" aria-label={`Tiến trình đơn ${order.id}`}>
                          <div className="order-progress-step active">
                            <span className="order-progress-dot" aria-hidden="true" />
                            <span className="order-progress-label">Đơn hàng đã hủy</span>
                          </div>
                        </div>
                      ) : (
                        <div className="order-progress" aria-label={`Tiến trình đơn ${order.id}`}>
                          {CAC_BUOC_TIEN_TRINH_DON_HANG.map((stepLabel, index) => {
                            const stepNumber = index + 1
                            const isActive = order.timelineStep >= stepNumber

                            return (
                              <div key={stepLabel} className={`order-progress-step ${isActive ? 'active' : ''}`}>
                                <span className="order-progress-dot" aria-hidden="true" />
                                <span className="order-progress-label">{stepLabel}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="profile-list-meta">
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
              <article className="profile-card">
                <h2>Lịch sử đặt bàn</h2>

                {thongBaoDatBan && <p className="booking-feedback">{thongBaoDatBan}</p>}

                <div className="profile-list">
                  {lichSuDatBan.length === 0 && (
                    <div className="profile-list-item">
                      <p className="booking-empty">Chưa có lịch sử đặt bàn nào.</p>
                    </div>
                  )}

                  {lichSuDatBan.map((booking) => (
                    <div key={`${booking.id}-${booking.bookingId ?? booking.id}`} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{booking.id}</strong>
                        <span className={`status-chip tone-${laySacThaiTrangThaiDatBan(booking.rawStatus)}`}>{booking.status}</span>
                      </div>

                      <div className="profile-list-meta">
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
                        <div className="booking-actions">
                          <button
                            type="button"
                            className="btn btn-ghost booking-cancel-btn"
                            onClick={() => handleCancelBooking(booking.bookingId, booking.id)}
                            aria-label={`Hủy đặt bàn ${booking.id}`}
                          >
                            Hủy đặt bàn
                          </button>
                        </div>
                      ) : (
                        booking.rawStatus === 'DA_XAC_NHAN' && (
                          <p className="booking-hotline-hint">Đặt bàn đã xác nhận. Vui lòng gọi hotline để hỗ trợ hủy.</p>
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
