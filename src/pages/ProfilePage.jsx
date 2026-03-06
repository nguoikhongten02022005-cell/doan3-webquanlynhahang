import { useMemo, useState } from 'react'

const tabs = [
  { key: 'personal', label: 'Thông tin cá nhân' },
  { key: 'orders', label: 'Lịch sử đơn hàng' },
  { key: 'bookings', label: 'Lịch sử đặt bàn' },
]

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
    status: 'Đã hoàn thành',
  },
]

const fallbackBookings = [
  {
    id: 'DB-2301',
    dateTime: '10/03/2026 19:00',
    guests: 4,
    status: 'Đã xác nhận',
  },
  {
    id: 'DB-2294',
    dateTime: '03/03/2026 18:30',
    guests: 2,
    status: 'Đã hoàn thành',
  },
  {
    id: 'DB-2288',
    dateTime: '26/02/2026 20:00',
    guests: 6,
    status: 'Đã hoàn thành',
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
    return 'Đang xử lý'
  }

  if (status === 'CHO_XAC_NHAN') {
    return 'Chờ xác nhận'
  }

  return status
}

const getStatusTone = (status) => {
  const text = status.toLowerCase()

  if (text.includes('hoàn thành') || text.includes('hoàn tất')) {
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
  const [activeTab, setActiveTab] = useState('personal')

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
      return fallbackOrders
    }

    try {
      const parsedOrders = JSON.parse(ordersString)

      if (!Array.isArray(parsedOrders) || parsedOrders.length === 0) {
        return fallbackOrders
      }

      return parsedOrders.map((order) => ({
        id: `DH-${String(order.id).slice(-6)}`,
        date: formatDate(order.orderDate),
        total: Number(order.total) || 0,
        status: order.status || 'Đang xử lý',
      }))
    } catch {
      return fallbackOrders
    }
  }, [])

  const bookingHistory = useMemo(() => {
    const bookingsString = localStorage.getItem('restaurant_bookings')

    if (!bookingsString) {
      return fallbackBookings
    }

    try {
      const parsedBookings = JSON.parse(bookingsString)

      if (!Array.isArray(parsedBookings) || parsedBookings.length === 0) {
        return fallbackBookings
      }

      return parsedBookings.map((booking) => ({
        id: `DB-${String(booking.id).slice(-6)}`,
        dateTime: `${formatDate(booking.date)} ${booking.time || ''}`.trim(),
        guests: Number(booking.guests) || 0,
        status: mapBookingStatus(booking.status),
      }))
    } catch {
      return fallbackBookings
    }
  }, [])

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

                <div className="profile-list">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="profile-list-item">
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
                      </div>
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
