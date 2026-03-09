import { WEEKDAY_LABELS } from '../../data/bookingData'

export const ONLINE_BOOKING_MAX_GUESTS = 10
export const LARGE_GROUP_GUEST_COUNT = ONLINE_BOOKING_MAX_GUESTS + 1
export const LARGE_GROUP_HOTLINE_MESSAGE = `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng gọi hotline để đặt bàn.`
export const INVALID_DATE_HINT = 'Vui lòng chọn ngày từ hôm nay trở đi.'
export const CLOSED_DATE_HINT = 'Không nhận đặt bàn vào Thứ 3. Vui lòng chọn ngày khác.'
export const AVAILABILITY_LOADING_TEXT = 'Đang kiểm tra bàn trống...'
export const OPEN_DATE_PICKER_DAYS = 10
export const RESTAURANT_CLOSED_WEEKDAYS = [2]
export const RESTAURANT_CLOSED_DATES = []
export const CLOSED_WEEKDAY_TEXT = RESTAURANT_CLOSED_WEEKDAYS.map((day) => WEEKDAY_LABELS[day]).join(', ')
export const PEAK_HOUR_START = 18 * 60
export const PEAK_HOUR_END = 20 * 60
