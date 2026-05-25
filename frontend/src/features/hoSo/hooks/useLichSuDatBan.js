import { useMemo } from 'react'
import { tachDanhSachDatBan } from '../utils/lichSuDatBanUtils'

export const useLichSuDatBan = (bookings = []) => {
  return useMemo(() => tachDanhSachDatBan(bookings), [bookings])
}