import { useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { FALLBACK_PROFILE, ORDER_TIMELINE_STEPS, PROFILE_TABS } from '../data/profileData'
import { formatCurrency } from '../utils/currency'
import { getStorageJSON } from '../services/storageService'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { canCancelBooking } from '../hooks/booking/bookingPolicies.js'

const formatDate = (value) => {
  if (!value) {
    return '--'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return date.toLocaleDateString('vi-VN')
}

const getOrderTimelineStep = (status) => {
  const normalized = String(status || '').trim().toLowerCase()

  if (
    normalized.includes('đã thanh toán') ||
    normalized.includes('đã hoàn thành') ||
    normalized.includes('hoàn tất')
  ) {
    return 4
  }

  if (normalized.includes('đang giao') || normalized.includes('đã lên món')) {
    return 3
  }

  if (normalized.includes('bếp đang làm')) {
    return 2
  }

  return 1
}

const getStatusTone = (status) => {
  const text = String(status || '').toLowerCase()

  if (text.includes('hoàn thành') || text.includes('hoàn tất') || text.includes('thanh toán') || text.includes('xác nhận')) {
    return 'success'
  }

  if (text.includes('đang giao') || text.includes('đang xử lý') || text.includes('chờ')) {
    return 'warning'
  }

  if (text.includes('hủy')) {
    return 'danger'
  }

  return 'neutral'
}

function ProfilePage() {
  const { currentUser } = useAuth()
  const { cancelBooking, getBookingHistory } = useBooking()
  const [activeTab, setActiveTab] = useState('personal')
  const [bookingHistory, setBookingHistory] = useState([])
  const [bookingMessage, setBookingMessage] = useState('')

  const profileData = useMemo(() => {
    if (!currentUser) {
      return FALLBACK_PROFILE
    }

    return {
      name: String(currentUser.fullName ?? currentUser.name ?? FALLBACK_PROFILE.name),
      email: String(currentUser.email ?? FALLBACK_PROFILE.email),
      phone: String(currentUser.phone ?? FALLBACK_PROFILE.phone),
    }
  }, [currentUser])

  const orderHistory = useMemo(() => {
    const parsedOrders = getStorageJSON(STORAGE_KEYS.ORDERS, [])
    const normalizedCurrentEmail = String(currentUser?.email ?? '').trim().toLowerCase()

    if (!Array.isArray(parsedOrders) || parsedOrders.length === 0 || !normalizedCurrentEmail) {
      return []
    }

    return parsedOrders
      .filter((order) => String(order?.customer?.email ?? order?.userEmail ?? '').trim().toLowerCase() === normalizedCurrentEmail)
      .map((order) => {
        const status = order.status || 'Đang xử lý'

        return {
          id: `DH-${String(order.id).slice(-6)}`,
          date: formatDate(order.orderDate),
          total: Number(order.total) || 0,
          status,
          timelineStep: getOrderTimelineStep(status),
        }
      })
  }, [currentUser])

  useEffect(() => {
    setBookingHistory(getBookingHistory(currentUser?.email))
    setBookingMessage('')
  }, [currentUser, getBookingHistory])

  const handleCancelBooking = (bookingId, bookingCode) => {
    const result = cancelBooking(bookingId, bookingCode, currentUser?.email)

    if (!result.success) {
      setBookingMessage(result.error)
      return
    }

    setBookingHistory(result.bookingHistory)
    setBookingMessage(result.message)
  }

  return (
    <div className="profile-page">
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
                className={`profile-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="profile-content-panel">
            {activeTab === 'personal' && (
              <article className="profile-card">
                <h2>Thông tin cá nhân</h2>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">
                      Tên
                    </label>
                    <input id="profile-name" className="form-input" value={profileData.name} readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">
                      Email
                    </label>
                    <input id="profile-email" className="form-input" value={profileData.email} readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">
                      Số điện thoại
                    </label>
                    <input id="profile-phone" className="form-input" value={profileData.phone} readOnly />
                  </div>
                </div>
              </article>
            )}

            {activeTab === 'orders' && (
              <article className="profile-card">
                <h2>Lịch sử đơn hàng</h2>

                <div className="profile-list">
                  {orderHistory.length === 0 && (
                    <div className="profile-list-item">
                      <p className="booking-empty">Chưa có lịch sử đơn hàng nào.</p>
                    </div>
                  )}

                  {orderHistory.map((order) => (
                    <div key={order.id} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{order.id}</strong>
                        <span className={`status-chip tone-${getStatusTone(order.status)}`}>{order.status}</span>
                      </div>

                      <div className="order-progress" aria-label={`Tiến trình đơn ${order.id}`}>
                              {ORDER_TIMELINE_STEPS.map((stepLabel, index) => {
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

                      <div className="profile-list-meta">
                        <p>
                          <span>Ngày đặt:</span>
                          <strong>{order.date}</strong>
                        </p>
                        <p>
                          <span>Tổng tiền:</span>
                          <strong>{formatCurrency(order.total)}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}

            {activeTab === 'bookings' && (
              <article className="profile-card">
                <h2>Lịch sử đặt bàn</h2>

                {bookingMessage && <p className="booking-feedback">{bookingMessage}</p>}

                <div className="profile-list">
                  {bookingHistory.length === 0 && (
                    <div className="profile-list-item">
                      <p className="booking-empty">Chưa có lịch sử đặt bàn nào.</p>
                    </div>
                  )}

                  {bookingHistory.map((booking) => (
                    <div key={`${booking.id}-${booking.bookingId ?? booking.id}`} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{booking.id}</strong>
                        <span className={`status-chip tone-${getStatusTone(booking.status)}`}>{booking.status}</span>
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

                      {canCancelBooking(booking.rawStatus) ? (
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

export default ProfilePage
