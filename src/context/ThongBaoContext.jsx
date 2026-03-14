import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ThongBaoContext = createContext(null)

const NOTIFICATION_DURATION = 2600

export function ThongBaoProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timeoutMapRef = useRef(new Map())

  const removeNotification = useCallback((id) => {
    const timeoutId = timeoutMapRef.current.get(id)

    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutMapRef.current.delete(id)
    }

    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const hienThongBao = useCallback(({ message, tone = 'neutral', duration = NOTIFICATION_DURATION, title = '' }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setNotifications((prev) => [...prev, { id, message, tone, title }])

    const timeoutId = window.setTimeout(() => {
      removeNotification(id)
    }, duration)

    timeoutMapRef.current.set(id, timeoutId)
  }, [removeNotification])

  const giaTriBoiCanh = useMemo(() => ({
    hienThongBao,
    hienThanhCong: (message, title = 'Thành công') => hienThongBao({ message, tone: 'success', title }),
    hienLoi: (message, title = 'Có lỗi xảy ra') => hienThongBao({ message, tone: 'danger', title }),
    hienCanhBao: (message, title = 'Lưu ý') => hienThongBao({ message, tone: 'warning', title }),
    hienThongTin: (message, title = 'Thông báo') => hienThongBao({ message, tone: 'neutral', title }),
  }), [hienThongBao])

  return (
    <ThongBaoContext.Provider value={giaTriBoiCanh}>
      {children}

      <div className="notification-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification-card tone-${notification.tone}`} role="status">
            <div className="notification-copy">
              {notification.title ? <strong>{notification.title}</strong> : null}
              <p>{notification.message}</p>
            </div>

            <button
              type="button"
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ThongBaoContext.Provider>
  )
}

export function useThongBao() {
  const context = useContext(ThongBaoContext)

  if (!context) {
    throw new Error('useThongBao phai duoc dung ben trong ThongBaoProvider')
  }

  return context
}
