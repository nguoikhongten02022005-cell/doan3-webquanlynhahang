export const TRANG_THAI_DON_HANG = Object.freeze({
  MOI_TAO: 'Pending',
  DA_XAC_NHAN: 'Confirmed',
  DANG_CHUAN_BI: 'Preparing',
  SAN_SANG: 'Ready',
  DANG_PHUC_VU: 'Served',
  HOAN_THANH: 'Paid',
  DA_HUY: 'Cancelled',
})

export const NHAN_TRANG_THAI_DON_HANG = Object.freeze({
  [TRANG_THAI_DON_HANG.MOI_TAO]: 'Mới tạo',
  [TRANG_THAI_DON_HANG.DA_XAC_NHAN]: 'Đã xác nhận',
  [TRANG_THAI_DON_HANG.DANG_CHUAN_BI]: 'Đang chuẩn bị',
  [TRANG_THAI_DON_HANG.SAN_SANG]: 'Sẵn sàng',
  [TRANG_THAI_DON_HANG.DANG_PHUC_VU]: 'Đang phục vụ',
  [TRANG_THAI_DON_HANG.HOAN_THANH]: 'Đã hoàn thành',
  [TRANG_THAI_DON_HANG.DA_HUY]: 'Đã hủy',
})
