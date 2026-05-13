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
