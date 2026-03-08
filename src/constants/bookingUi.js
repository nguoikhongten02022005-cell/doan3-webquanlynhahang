import { SITE_CONTACT } from './siteContact'

export const BOOKING_HERO_CONTENT = {
  label: 'Đặt bàn trực tuyến',
  title: 'Chọn bàn thật nhanh',
  subtitle: 'Chọn số khách, ngày và giờ để chốt bàn trống ngay trong một flow ngắn gọn.',
  noteLabel: 'Phục vụ đặt online',
  noteText: 'Nhóm trên 10 khách vui lòng gọi hotline để được hỗ trợ nhanh hơn.',
}

export const BOOKING_DRAFT_BANNER = {
  title: 'Đã khôi phục yêu cầu đặt bàn chưa hoàn tất',
  description: 'Bạn có thể tiếp tục hoàn tất thông tin hoặc chỉnh sửa trước khi xác nhận.',
  actionLabel: 'Đã hiểu',
}

export const BOOKING_SIDEBAR_CONTENT = {
  progressTitle: 'Tiến trình đặt bàn',
  summaryTitle: 'Tóm tắt đặt bàn',
  nextStepTitle: 'Bước tiếp theo',
  hoursTitle: 'Khung giờ phục vụ',
  quickContactTitle: 'Liên hệ nhanh',
  hours: SITE_CONTACT.hours,
  contacts: [`✉️ ${SITE_CONTACT.emailDisplay}`, `📍 ${SITE_CONTACT.address}`],
}

export const BOOKING_CALENDAR_WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export const BOOKING_SLOT_LEGEND = [
  { key: 'available', label: 'Còn bàn' },
  { key: 'limited', label: 'Sắp hết' },
  { key: 'full', label: 'Hết chỗ' },
]
