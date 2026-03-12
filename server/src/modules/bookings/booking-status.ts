import type { BookingStatus } from '@prisma/client'
import { HttpError } from '../../common/http-error.js'

export const maTranTrangThaiBooking: Record<BookingStatus, BookingStatus[]> = {
  YEU_CAU_DAT_BAN: ['CHO_XAC_NHAN', 'GIU_CHO_TAM', 'CAN_GOI_LAI', 'DA_XAC_NHAN', 'DA_HUY', 'TU_CHOI_HET_CHO'],
  CHO_XAC_NHAN: ['GIU_CHO_TAM', 'CAN_GOI_LAI', 'DA_XAC_NHAN', 'DA_HUY', 'TU_CHOI_HET_CHO'],
  GIU_CHO_TAM: ['DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'KHONG_DEN', 'TU_CHOI_HET_CHO'],
  CAN_GOI_LAI: ['CHO_XAC_NHAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'DA_HUY'],
  DA_XAC_NHAN: ['DA_CHECK_IN', 'DA_XEP_BAN', 'KHONG_DEN', 'DA_HUY'],
  DA_GHI_NHAN: ['DA_XAC_NHAN', 'GIU_CHO_TAM', 'CAN_GOI_LAI', 'DA_HUY'],
  DA_CHECK_IN: ['DA_XEP_BAN', 'DA_HOAN_THANH'],
  DA_XEP_BAN: ['DA_HOAN_THANH'],
  DA_HUY: [],
  TU_CHOI_HET_CHO: [],
  KHONG_DEN: [],
  DA_HOAN_THANH: [],
}

export const kiemTraChuyenTrangThaiHopLe = (hienTai: BookingStatus, mucTieu: BookingStatus) => {
  if (hienTai === mucTieu) {
    return
  }

  const dsHopLe = maTranTrangThaiBooking[hienTai] ?? []
  if (dsHopLe.includes(mucTieu)) {
    return
  }

  throw new HttpError(400, `Không thể chuyển booking từ ${hienTai} sang ${mucTieu}.`)
}
