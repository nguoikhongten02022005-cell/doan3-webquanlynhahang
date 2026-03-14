import { NHAN_THU_TRONG_TUAN } from '../../data/duLieuDatBan'

export const SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN = 10
export const SO_KHACH_NHOM_DONG = SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN + 1
export const THONG_DIEP_HOTLINE_NHOM_DONG = `Nhóm trên ${SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN} khách vui lòng gọi hotline để đặt bàn.`
export const GOI_Y_NGAY_KHONG_HOP_LE = 'Vui lòng chọn ngày từ hôm nay trở đi.'
export const GOI_Y_NGAY_DONG_CUA = 'Không nhận đặt bàn vào Thứ 3. Vui lòng chọn ngày khác.'
export const VAN_BAN_DANG_TAI_KHA_DUNG = 'Đang kiểm tra bàn trống...'
export const SO_NGAY_MO_LICH = 10
export const CAC_THU_DONG_CUA = [2]
export const CAC_NGAY_DONG_CUA = []
export const VAN_BAN_THU_DONG_CUA = CAC_THU_DONG_CUA.map((day) => NHAN_THU_TRONG_TUAN[day]).join(', ')
export const PHUT_BAT_DAU_CAO_DIEM = 18 * 60
export const PHUT_KET_THUC_CAO_DIEM = 20 * 60
