export const WEEKDAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

export const BOOKING_TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

export const BOOKING_SEATING_AREAS = [
  {
    value: 'KHONG_UU_TIEN',
    label: 'Không ưu tiên',
    desc: 'Nhà hàng sẽ xếp bàn phù hợp nhất theo tình trạng trống thực tế.',
    icon: '✦',
    maxGuests: Number.POSITIVE_INFINITY,
  },
  {
    value: 'SANH_CHINH',
    label: 'Sảnh chính',
    desc: 'Phù hợp nhóm bạn và gia đình. Không cam kết 100% đúng vị trí.',
    icon: '🍽️',
    maxGuests: 10,
  },
  {
    value: 'PHONG_VIP',
    label: 'Phòng riêng / VIP',
    desc: 'Cần host xác nhận lại. Có thể áp dụng phụ thu tùy thời điểm.',
    icon: '◆',
    maxGuests: 10,
  },
  {
    value: 'BAN_CONG',
    label: 'Ban công / ngoài trời',
    desc: 'Phụ thuộc thời tiết và tình trạng phục vụ thực tế.',
    icon: '☼',
    maxGuests: 6,
  },
  {
    value: 'QUAY_BAR',
    label: 'Quầy bar',
    desc: 'Phù hợp 1–2 khách. Có thể đổi khu vực nếu quầy bar đã kín.',
    icon: '◈',
    maxGuests: 2,
  },
]

export const BOOKING_OCCASIONS = ['Sinh nhật', 'Kỷ niệm', 'Tiếp khách / công việc', 'Cần không gian yên tĩnh']

export const BOOKING_STEP_ITEMS = [
  { id: 1, eyebrow: 'Bước 1', title: 'Chọn thông tin đặt bàn' },
  { id: 2, eyebrow: 'Bước 2', title: 'Nhập thông tin liên hệ' },
  { id: 3, eyebrow: 'Bước 3', title: 'Xác nhận đặt bàn' },
]

export const BOOKING_GUEST_OPTIONS = [...Array.from({ length: 10 }, (_, index) => index + 1), '10+']

export const BOOKING_NOTE_SUGGESTIONS = ['Sinh nhật', 'Có trẻ em', 'Cần ghế em bé', 'Dị ứng thực phẩm', 'Có thể đến muộn']

export const BOOKING_STATUS_LABELS = {
  YEU_CAU_DAT_BAN: '🟡 Yêu cầu đặt bàn',
  GIU_CHO_TAM: '🟠 Đã giữ chỗ tạm',
  DA_XAC_NHAN: '🟢 Đặt bàn thành công',
  CAN_GOI_LAI: '📞 Cần host gọi lại',
  TU_CHOI_HET_CHO: '🔴 Từ chối / hết chỗ',
}

export const BOOKING_SEATING_LABELS = {
  KHONG_UU_TIEN: 'Không ưu tiên',
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Phòng riêng / VIP',
  BAN_CONG: 'Ban công / ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

export const HOST_BOOKING_STATUS_LABELS = {
  YEU_CAU_DAT_BAN: 'Yêu cầu đặt bàn',
  GIU_CHO_TAM: 'Đã giữ chỗ tạm',
  DA_XAC_NHAN: 'Đã xác nhận',
  CAN_GOI_LAI: 'Cần gọi lại',
  TU_CHOI_HET_CHO: 'Từ chối / hết chỗ',
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_GHI_NHAN: 'Đã ghi nhận',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
}

export const HOST_BOOKING_STATUS_ACTIONS = ['YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'TU_CHOI_HET_CHO']
