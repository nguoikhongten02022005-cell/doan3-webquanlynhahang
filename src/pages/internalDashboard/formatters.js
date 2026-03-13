import { BOOKING_SEATING_LABELS } from '../../data/bookingData'
import { getOrderStatusTone as getCanonicalOrderStatusTone } from '../../utils/order'

export const formatDate = (value) => {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return date.toLocaleDateString('vi-VN')
}

export const formatDateTime = (date, time) => {
  if (!date) return '--'

  const [year, month, day] = String(date).split('-')
  if (!year || !month || !day) return `${date} ${time || ''}`.trim()

  return `${day}/${month}/${year} ${time || ''}`.trim()
}

export const formatGuests = (guests) => `${guests} khách`
export const getSeatingLabel = (value) => BOOKING_SEATING_LABELS[value] || value || 'Không ưu tiên'

export const getBookingStatusTone = (status) => {
  if (status === 'DA_HUY' || status === 'TU_CHOI_HET_CHO' || status === 'KHONG_DEN') return 'danger'
  if (status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN') return 'neutral'
  if (status === 'DA_XAC_NHAN' || status === 'DA_GHI_NHAN' || status === 'DA_HOAN_THANH' || status === 'GIU_CHO_TAM') return 'success'
  return 'warning'
}

export const getOrderStatusTone = (status) => getCanonicalOrderStatusTone(status)

export const getChannelLabel = (channel) => {
  if (Array.isArray(channel) && channel.length > 0) return channel.join(' / ')
  return 'SMS'
}
