import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
]

const occasions = [
  'Ăn thường',
  'Sinh nhật',
  'Kỷ niệm',
  'Họp mặt gia đình',
  'Tiệc công ty',
  'Hẹn hò',
  'Khác'
]

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseTimeToMinutes = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function BookingPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    notes: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const userDataString = localStorage.getItem('restaurant_current_user')

    if (!userDataString) {
      setCurrentUser(null)
      return
    }

    try {
      const userData = JSON.parse(userDataString)
      setCurrentUser(userData)

      setFormData((prev) => ({
        ...prev,
        name: String(userData.fullName ?? userData.name ?? prev.name ?? ''),
        email: String(userData.email ?? prev.email ?? '')
      }))
    } catch (error) {
      setCurrentUser(null)
    }
  }, [])

  const isTimeValidForDate = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) {
      return true
    }

    const today = getLocalDateString()

    if (dateValue < today) {
      return false
    }

    if (dateValue > today) {
      return true
    }

    const now = new Date()
    const minimumMinutes = now.getHours() * 60 + now.getMinutes() + 30
    return parseTimeToMinutes(timeValue) >= minimumMinutes
  }

  const getAvailableTimeSlots = (dateValue) => {
    const today = getLocalDateString()

    if (dateValue !== today) {
      return timeSlots
    }

    const now = new Date()
    const minimumMinutes = now.getHours() * 60 + now.getMinutes() + 30
    return timeSlots.filter((slot) => parseTimeToMinutes(slot) >= minimumMinutes)
  }

  const todayString = getLocalDateString()
  const availableTimeSlots = getAvailableTimeSlots(formData.date)
  const noAvailableSlotsToday = formData.date === todayString && availableTimeSlots.length === 0
  const invalidPastDate = Boolean(formData.date && formData.date < todayString)
  const invalidSelectedTime = Boolean(
    formData.date && formData.time && !isTimeValidForDate(formData.date, formData.time)
  )

  const realtimeValidationError = invalidPastDate
    ? 'Bạn không thể chọn ngày trong quá khứ.'
    : invalidSelectedTime
      ? 'Khung giờ đã chọn không hợp lệ. Vui lòng chọn giờ cách hiện tại ít nhất 30 phút.'
      : noAvailableSlotsToday
        ? 'Hôm nay không còn khung giờ hợp lệ. Vui lòng chọn ngày khác.'
        : ''

  const disableSubmit = Boolean(realtimeValidationError)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSubmitError('')

    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [name]: value
      }

      if (name === 'date' && prev.time) {
        const nextAvailableSlots = getAvailableTimeSlots(value)
        if (!nextAvailableSlots.includes(prev.time)) {
          nextFormData.time = ''
        }
      }

      return nextFormData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')

    const today = getLocalDateString()

    if (formData.date < today) {
      setSubmitError('Ngày đặt bàn không hợp lệ. Vui lòng chọn ngày từ hôm nay.')
      return
    }

    if (!isTimeValidForDate(formData.date, formData.time)) {
      setSubmitError('Khung giờ đã chọn không còn hợp lệ. Vui lòng chọn giờ cách hiện tại ít nhất 30 phút.')
      return
    }

    const newBooking = {
      id: Date.now(),
      userEmail: currentUser?.email ?? null,
      ...formData,
      status: 'CHO_XAC_NHAN',
      createdAt: new Date().toISOString()
    }

    let bookings = []
    const storedBookings = localStorage.getItem('restaurant_bookings')

    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings)
        if (Array.isArray(parsedBookings)) {
          bookings = parsedBookings
        }
      } catch (error) {
        bookings = []
      }
    }

    bookings.push(newBooking)
    localStorage.setItem('restaurant_bookings', JSON.stringify(bookings))

    setSubmitted(true)

    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="container">
          <div className="booking-hero-content">
            <span className="booking-label">Reservation</span>
            <h1 className="booking-title">
              Đặt Bàn<br />
              <span className="booking-title-accent">Trải Nghiệm</span>
            </h1>
            <p className="booking-subtitle">
              Mỗi bữa ăn là một câu chuyện. Hãy để chúng tôi viết nên khoảnh khắc đáng nhớ của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="booking-form-section">
        <div className="container">
          <div className="booking-grid">
            <aside className="booking-info">
              <div className="info-card">
                <h3>Giờ Phục Vụ</h3>
                <div className="info-item">
                  <span className="info-day">Thứ 2 - Thứ 6</span>
                  <span className="info-time">11:00 - 14:00<br />17:00 - 22:00</span>
                </div>
                <div className="info-item">
                  <span className="info-day">Thứ 7 - Chủ Nhật</span>
                  <span className="info-time">11:00 - 22:00</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Liên Hệ</h3>
                <div className="info-contact">
                  <p>📞 (028) 3825 6789</p>
                  <p>✉️ booking@restaurant.vn</p>
                  <p>📍 123 Nguyễn Huệ, Q.1, TP.HCM</p>
                </div>
              </div>

              <div className="info-note">
                <p>
                  <strong>Lưu ý:</strong> Đặt bàn cho nhóm trên 8 người vui lòng gọi điện trực tiếp.
                  Chúng tôi giữ bàn trong 15 phút sau giờ đặt.
                </p>
              </div>
            </aside>

            <div className="booking-form-wrapper">
              {submitted && (
                <div className="booking-success">
                  <div className="success-icon">✓</div>
                  <h3>Đặt Bàn Thành Công!</h3>
                  <p>Chúng tôi đã nhận được yêu cầu của bạn. Nhân viên sẽ liên hệ xác nhận trong vòng 30 phút.</p>
                </div>
              )}

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h2 className="form-section-title">Thông Tin Khách Hàng</h2>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Họ và Tên *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Số Điện Thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        placeholder="0901 234 567"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h2 className="form-section-title">Chi Tiết Đặt Bàn</h2>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Ngày *</label>
                      <input
                        type="date"
                        name="date"
                        className="form-input"
                        value={formData.date}
                        onChange={handleChange}
                        min={todayString}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Giờ *</label>
                      <select
                        name="time"
                        className="form-input"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn giờ</option>
                        {availableTimeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Số Khách *</label>
                      <select
                        name="guests"
                        className="form-input"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} người</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Dịp Đặc Biệt</label>
                    <select
                      name="occasion"
                      className="form-input"
                      value={formData.occasion}
                      onChange={handleChange}
                    >
                      <option value="">Chọn dịp (nếu có)</option>
                      {occasions.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Ghi Chú</label>
                    <textarea
                      name="notes"
                      className="form-textarea"
                      placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm, vị trí ngồi..."
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                </div>

                {realtimeValidationError && (
                  <p className="form-error" role="alert">
                    {realtimeValidationError}
                  </p>
                )}

                {submitError && (
                  <p className="form-error" role="alert">
                    {submitError}
                  </p>
                )}

                <button type="submit" className="booking-submit-btn" disabled={disableSubmit}>
                  <span>Xác Nhận Đặt Bàn</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-decoration">
        <div className="deco-circle deco-circle-1"></div>
        <div className="deco-circle deco-circle-2"></div>
        <div className="deco-line deco-line-1"></div>
        <div className="deco-line deco-line-2"></div>
      </div>
    </div>
  )
}

export default BookingPage
