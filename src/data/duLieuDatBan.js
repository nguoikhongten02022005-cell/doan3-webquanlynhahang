export const NHAN_THU_TRONG_TUAN = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

export const CAC_KHUNG_GIO_DAT_BAN = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

export const CAC_KHU_VUC_DAT_BAN = [
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

export const CAC_DIP_DAT_BAN = ['Sinh nhật', 'Kỷ niệm', 'Tiếp khách / công việc', 'Cần không gian yên tĩnh']

export const CAC_BUOC_DAT_BAN = [
  { id: 1, eyebrow: 'Bước 1', title: 'Chọn thông tin đặt bàn' },
  { id: 2, eyebrow: 'Bước 2', title: 'Nhập thông tin liên hệ' },
  { id: 3, eyebrow: 'Bước 3', title: 'Xác nhận đặt bàn' },
]

export const CAC_LUA_CHON_SO_KHACH_DAT_BAN = [...Array.from({ length: 10 }, (_, index) => index + 1), '10+']

export const CAC_GOI_Y_GHI_CHU_DAT_BAN = ['Sinh nhật', 'Có trẻ em', 'Cần ghế em bé', 'Dị ứng thực phẩm', 'Có thể đến muộn']

export const NHAN_TRANG_THAI_DAT_BAN = {
  YEU_CAU_DAT_BAN: '🟡 Yêu cầu đặt bàn',
  GIU_CHO_TAM: '🟠 Đã giữ chỗ tạm',
  DA_XAC_NHAN: '🟢 Đặt bàn thành công',
  CAN_GOI_LAI: '📞 Cần host gọi lại',
  TU_CHOI_HET_CHO: '🔴 Từ chối / hết chỗ',
}

export const NHAN_KHU_VUC_DAT_BAN = {
  KHONG_UU_TIEN: 'Không ưu tiên',
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Phòng riêng / VIP',
  BAN_CONG: 'Ban công / ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

export const HOST_NHAN_TRANG_THAI_DAT_BAN = {
  YEU_CAU_DAT_BAN: 'Yêu cầu đặt bàn',
  GIU_CHO_TAM: 'Đã giữ chỗ tạm',
  DA_XAC_NHAN: 'Đã xác nhận',
  CAN_GOI_LAI: 'Cần gọi lại',
  TU_CHOI_HET_CHO: 'Từ chối / hết chỗ',
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_GHI_NHAN: 'Đã ghi nhận',
  DA_CHECK_IN: 'Đã check-in',
  DA_XEP_BAN: 'Đã vào bàn',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
  KHONG_DEN: 'Không đến',
}

export const CAC_THAO_TAC_TRANG_THAI_DAT_BAN_HOST = [
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
]

export const CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO = [
  'CHO_XAC_NHAN',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
]
