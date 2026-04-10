import { TRANG_THAI_BAN } from '../services/dichVuBanAn.js'

export const NHAN_THU_TRONG_TUAN = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

export const CAC_DIP_DAT_BAN = ['Sinh nhật', 'Kỷ niệm', 'Tiếp khách / công việc', 'Cần không gian yên tĩnh']

export const CAC_GOI_Y_GHI_CHU_DAT_BAN = ['Sinh nhật', 'Có trẻ em', 'Cần ghế em bé', 'Dị ứng thực phẩm', 'Có thể đến muộn']

export const CAC_SO_KHACH_DAT_BAN = Array.from({ length: 10 }, (_, index) => index + 1)
export const SO_NGAY_DAT_BAN_HIEN_NHANH = 10
export const SO_NGAY_TOI_DA_NHAN_DAT_BAN = 30
export const THU_DONG_CUA_DAT_BAN = [2]
export const GIO_GIOI_HAN_NHAN_DAT_BAN = '21:45'
export const SO_PHUT_TOI_THIEU_TRUOC_GIO_DAT_BAN = 30

export const CAC_CA_KHUNG_GIO_DAT_BAN = [
  {
    id: 'lunch',
    icon: '🍱',
    label: 'Buổi trưa',
    timeRange: '11:00 - 14:00',
    slots: ['11:00', '12:00', '13:00'],
  },
  {
    id: 'dinner',
    icon: '🍽️',
    label: 'Buổi tối',
    timeRange: '17:00 - 22:00',
    slots: ['17:00', '18:00', '19:00', '20:00', '21:00'],
  },
]

export const NHAN_KHU_VUC_DAT_BAN = {
  KHONG_UU_TIEN: 'Không ưu tiên',
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Khu riêng / VIP',
  BAN_CONG: 'Ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

export const KHU_VUC_DAT_BAN_CONG_KHAI = [
  {
    value: 'SANH_CHINH',
    icon: '🏠',
    label: 'Trong nhà',
    description: 'Điều hoà mát mẻ, yên tĩnh',
  },
  {
    value: 'BAN_CONG',
    icon: '🌿',
    label: 'Ngoài trời',
    description: 'Thoáng gió, view đẹp',
  },
  {
    value: 'PHONG_VIP',
    icon: '👑',
    label: 'Khu riêng / VIP',
    description: 'Riêng tư, phù hợp tiếp khách hoặc nhóm cần không gian tách biệt',
  },
]

export const NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN = {
  AVAILABLE: 'Còn bàn',
  LIMITED: 'Sắp hết',
  FULL: 'Hết chỗ',
}

export const NHAN_GOI_Y_KHU_VUC_DAT_BAN = {
  PHONG_VIP_NHOM_NHO: 'Phù hợp cho nhóm nhỏ',
  PHONG_VIP_KHUYEN_NGHI: 'Khuyến nghị',
}

export const NHAN_TRANG_THAI_DAT_BAN = {
  YEU_CAU_DAT_BAN: '🟡 Yêu cầu đặt bàn',
  GIU_CHO_TAM: '🟠 Đã giữ chỗ tạm',
  DA_XAC_NHAN: '🟢 Đặt bàn thành công',
  CAN_GOI_LAI: '📞 Cần host gọi lại',
  TU_CHOI_HET_CHO: '🔴 Từ chối / hết chỗ',
}

export const HOST_NHAN_TRANG_THAI_DAT_BAN = {
  YEU_CAU_DAT_BAN: 'Yêu cầu đặt bàn',
  Pending: 'Chờ xác nhận',
  GIU_CHO_TAM: 'Đã giữ chỗ tạm',
  DA_XAC_NHAN: 'Đã xác nhận',
  Confirmed: 'Đã xác nhận',
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
