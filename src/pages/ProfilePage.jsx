import { useMemo, useState } from 'react'

const tabs = [
  { key: 'personal', label: 'Thông tin cá nhân' },
  { key: 'orders', label: 'Lịch sử đơn hàng' },
  { key: 'bookings', label: 'Lịch sử đặt bàn' },
]

const orderTimelineSteps = ['Mới đặt', 'Bếp làm món', 'Đang giao', 'Hoàn tất']

const fallbackProfile = {
  name: 'Nguyễn Văn Minh',
  email: 'minh.nguyen@example.com',
  phone: '0901 234 567',
}

const fallbackOrders = [
  {
    id: 'DH-1001',
    date: '04/03/2026',
    total: 525000,
    status: 'Đang giao',
  },
  {
    id: 'DH-0995',
    date: '01/03/2026',
    total: 760000,
    status: 'Đã hoàn thành',
  },
  {
    id: 'DH-0988',
    date: '27/02/2026',
    total: 345000,
    status: 'Đang xử lý',
  },
]

const fallbackBookings = [
  {
    id: 'DB-2301',
    dateTime: '10/03/2026 19:00',
    guests: 4,
    status: '🟢 Đã xác nhận',
    rawStatus: 'DA_XAC_NHAN',
  },
  {
    id: 'DB-2294',
    dateTime: '03/03/2026 18:30',
    guests: 2,
    status: '⚪ Đã hoàn thành',
    rawStatus: 'DA_HOAN_THANH',
  },
  {
    id: 'DB-2288',
    dateTime: '26/02/2026 20:00',
    guests: 6,
    status: '⚪ Đã hoàn thành',
    rawStatus: 'DA_HOAN_THANH',
  },
]

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')}₫`

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

const mapBookingStatus = (status) => {
  if (!status) {
    return '🟡 Yêu cầu đặt bàn'
  }

  if (status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN') {
    return '🟡 Yêu cầu đặt bàn'
  }

  if (status === 'GIU_CHO_TAM') {
    return '🟠 Đã giữ chỗ tạm'
  }

  if (status === 'DA_XAC_NHAN') {
    return '🟢 Đã xác nhận'
  }

  if (status === 'CAN_GOI_LAI') {
    return '📞 Cần gọi lại'
  }

  if (status === 'TU_CHOI_HET_CHO' || status === 'DA_HUY') {
    return '🔴 Từ chối / hết chỗ'
  }

  if (status === 'DA_HOAN_THANH') {
    return '⚪ Đã hoàn thành'
  }

  return status
}

const canCancelBooking = (status) => status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN' || status === 'GIU_CHO_TAM' || status === 'CAN_GOI_LAI'

const formatBookingId = (bookingId) => `DB-${String(bookingId).slice(-6)}`

const formatBookingDateTime = (booking) => `${formatDate(booking.date)} ${booking.time || ''}`.trim()

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

const readBookings = () => {
  const bookingsString = localStorage.getItem('restaurant_bookings')

  if (!bookingsString) {
    return null
  }

  try {
    const parsedBookings = JSON.parse(bookingsString)
    if (!Array.isArray(parsedBookings) || parsedBookings.length === 0) {
      return null
    }
    return parsedBookings
  } catch {
    return null
  }
}

const seatingAreaLabels = {
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Phòng VIP',
  BAN_CONG: 'Ban công / Ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

const mapBookingItem = (booking) => ({
  bookingId: booking.id,
  id: formatBookingId(booking.id),
  dateTime: formatBookingDateTime(booking),
  guests: Number(booking.guests) || 0,
  seatingArea: seatingAreaLabels[booking.seatingArea] || '',
  rawStatus: booking.status || 'CHO_XAC_NHAN',
  status: mapBookingStatus(booking.status),
})

const loadBookingHistory = () => {
  const parsedBookings = readBookings()

  if (!parsedBookings) {
    return fallbackBookings
  }

  return [...parsedBookings]
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .map(mapBookingItem)
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [bookingHistory, setBookingHistory] = useState(() => loadBookingHistory())
  const [bookingMessage, setBookingMessage] = useState('')

  const profileData = useMemo(() => {
    const userDataString = localStorage.getItem('restaurant_current_user')

    if (!userDataString) {
      return fallbackProfile
    }

    try {
      const userData = JSON.parse(userDataString)
      return {
        name: String(userData.fullName ?? userData.name ?? fallbackProfile.name),
        email: String(userData.email ?? fallbackProfile.email),
        phone: String(userData.phone ?? fallbackProfile.phone),
      }
    } catch {
      return fallbackProfile
    }
  }, [])

  const orderHistory = useMemo(() => {
    const ordersString = localStorage.getItem('restaurant_orders')

    if (!ordersString) {
      return fallbackOrders.map((order) => ({
        ...order,
        timelineStep: getOrderTimelineStep(order.status),
      }))
    }

    try {
      const parsedOrders = JSON.parse(ordersString)

      if (!Array.isArray(parsedOrders) || parsedOrders.length === 0) {
        return fallbackOrders.map((order) => ({
          ...order,
          timelineStep: getOrderTimelineStep(order.status),
        }))
      }

      return parsedOrders.map((order) => {
        const status = order.status || 'Đang xử lý'

        return {
          id: `DH-${String(order.id).slice(-6)}`,
          date: formatDate(order.orderDate),
          total: Number(order.total) || 0,
          status,
          timelineStep: getOrderTimelineStep(status),
        }
      })
    } catch {
      return fallbackOrders.map((order) => ({
        ...order,
        timelineStep: getOrderTimelineStep(order.status),
      }))
    }
  }, [])

  const handleCancelBooking = (bookingId, bookingCode) => {
    const bookingsString = localStorage.getItem('restaurant_bookings')

    if (!bookingsString) {
      setBookingMessage('Không thể hủy đặt bàn này. Vui lòng thử lại.')
      return
    }

    try {
      const parsedBookings = JSON.parse(bookingsString)

      if (!Array.isArray(parsedBookings)) {
        setBookingMessage('Không thể hủy đặt bàn này. Vui lòng thử lại.')
        return
      }

      const bookingIndex = parsedBookings.findIndex((item) => String(item.id) === String(bookingId))

      if (bookingIndex === -1) {
        setBookingMessage('Không thể hủy đặt bàn này. Vui lòng thử lại.')
        return
      }

      if (!canCancelBooking(parsedBookings[bookingIndex].status)) {
        setBookingMessage('Đặt bàn đã xác nhận. Vui lòng gọi hotline để được hỗ trợ hủy.')
        return
      }

      parsedBookings[bookingIndex] = {
        ...parsedBookings[bookingIndex],
        status: 'DA_HUY',
      }

      localStorage.setItem('restaurant_bookings', JSON.stringify(parsedBookings))
      setBookingHistory(loadBookingHistory())
      setBookingMessage(`Đã hủy đặt bàn ${bookingCode} thành công.`)
    } catch {
      setBookingMessage('Không thể hủy đặt bàn này. Vui lòng thử lại.')
    }
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
            {tabs.map((tab) => (
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
                  {orderHistory.map((order) => (
                    <div key={order.id} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{order.id}</strong>
                        <span className={`status-chip tone-${getStatusTone(order.status)}`}>{order.status}</span>
                      </div>

                      <div className="order-progress" aria-label={`Tiến trình đơn ${order.id}`}>
                        {orderTimelineSteps.map((stepLabel, index) => {
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
