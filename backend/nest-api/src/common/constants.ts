/**
 * Hằng số dùng chung cho hệ thống tích điểm và quy đổi điểm.
 *
 * --- Phân biệt TÍCH ĐIỂM và QUY ĐỔI ---
 *
 * TÍCH ĐIỂM (TiLeTichDiem):
 *   - Xảy ra khi khách hàng thanh toán đơn hàng.
 *   - Số điểm được cộng = Tổng tiền / TiLeTichDiem.
 *   - Điểm thưởng, không ảnh hưởng đến số tiền phải trả.
 *
 * QUY ĐỔI ĐIỂM (TiLeQuyDoiDiem, GiaTriQuyDoi):
 *   - Xảy ra khi khách hàng dùng điểm để giảm trừ tiền mặt.
 *   - Số tiền được giảm = Số điểm * GiaTriQuyDoi.
 *   - TiLeQuyDoiDiem là số điểm tối thiểu để được quy đổi.
 */

/** Cứ 10.000 VNĐ chi tiêu → tích được 1 điểm */
export const TI_LE_TICH_DIEM_MAC_DINH = 10000;

/** Số điểm tối thiểu để được quy đổi (100 điểm) */
export const TI_LE_QUY_DOI_DIEM = 100;

/** Quy đổi điểm: cứ TI_LE_QUY_DOI_DIEM (100) điểm = GIA_TRI_QUY_DOI (10000) VNĐ */
export const GIA_TRI_QUY_DOI = 10000;

// ========== Trạng thái bàn ăn ==========

export const TRANG_THAI_BAN = {
  TRONG: 'Available',
  GIU_CHO: 'Reserved',
  DANG_SU_DUNG: 'Occupied',
  BAN: 'Maintenance',
} as const;

export const TRANG_THAI_DAT_BAN = {
  PENDING: 'Pending',
  CHO_XAC_NHAN: 'CHO_XAC_NHAN',
  DA_XAC_NHAN: 'DA_XAC_NHAN',
  DA_GHI_NHAN: 'DA_GHI_NHAN',
  GIU_CHO_TAM: 'GIU_CHO_TAM',
  DA_CHECK_IN: 'DA_CHECK_IN',
  DA_XEP_BAN: 'DA_XEP_BAN',
  DA_HOAN_THANH: 'DA_HOAN_THANH',
  DA_HUY: 'DA_HUY',
  CANCELLED: 'Cancelled',
  KHONG_DEN: 'KHONG_DEN',
  TU_CHOI_HET_CHO: 'TU_CHOI_HET_CHO',
  CAN_GOI_LAI: 'CAN_GOI_LAI',
} as const;

export const TRANG_THAI_BAN_KHONG_THE_DAT = [
  TRANG_THAI_BAN.DANG_SU_DUNG,
  TRANG_THAI_BAN.GIU_CHO,
  TRANG_THAI_BAN.BAN,
];

export function chuanHoaTrangThaiBan(trangThai: string): string {
  const gt = (trangThai || '').trim().toUpperCase();
  if (['TRONG', 'AVAILABLE'].includes(gt)) return TRANG_THAI_BAN.TRONG;
  if (['GIU_CHO', 'RESERVED', 'CHO_THANH_TOAN'].includes(gt)) return TRANG_THAI_BAN.GIU_CHO;
  if (['DANG_SU_DUNG', 'CO_KHACH', 'OCCUPIED'].includes(gt)) return TRANG_THAI_BAN.DANG_SU_DUNG;
  if (['BAN', 'CAN_DON', 'MAINTENANCE', 'DIRTY'].includes(gt)) return TRANG_THAI_BAN.BAN;
  // Fallback an toàn: coi là chờ dọn
  return TRANG_THAI_BAN.BAN;
}
