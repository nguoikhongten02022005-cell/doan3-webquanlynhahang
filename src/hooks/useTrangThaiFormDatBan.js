import { useMemo, useRef, useState } from 'react'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import {
  THONG_DIEP_HOTLINE_NHOM_DONG,
  SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN,
  dinhDangNgayHienThi,
  layChuoiNgayDiaPhuong,
  layVanBanTomTatChoNgoi,
  laNgayDongCua,
  laNhomDongChiDatQuaHotline,
  laSoDienThoaiHopLe,
} from '../utils/datBan/index'

export const useTrangThaiFormDatBan = ({ nguoiDungHienTai, getDraft }) => {
  const [step, setStep] = useState(1)
  const [draftRestored, setDraftRestored] = useState(false)
  const dateSectionRef = useRef(null)
  const customerIdentity = nguoiDungHienTai?.role === VAI_TRO_XAC_THUC.KHACH_HANG ? nguoiDungHienTai : null
  const [formData, setFormData] = useState(() => {
    const draftData = getDraft()

    return {
      guests: String(draftData?.guests ?? ''),
      date: String(draftData?.date ?? ''),
      time: String(draftData?.time ?? ''),
      seatingArea: String(draftData?.seatingArea ?? 'KHONG_UU_TIEN'),
      occasion: String(draftData?.occasion ?? ''),
      notes: String(draftData?.notes ?? ''),
      name: String(draftData?.name ?? customerIdentity?.fullName ?? customerIdentity?.name ?? ''),
      phone: String(draftData?.phone ?? customerIdentity?.phone ?? ''),
      email: String(draftData?.email ?? customerIdentity?.email ?? ''),
    }
  })
  const restoredDraft = useMemo(() => getDraft(), [getDraft])

  const soLuongKhach = Number(formData.guests) || 0
  const todayString = useMemo(() => layChuoiNgayDiaPhuong(), [])
  const invalidPastDate = Boolean(formData.date && formData.date < todayString)
  const closedDate = Boolean(formData.date && laNgayDongCua(formData.date))

  const bookingSelectionSummary = useMemo(() => ({
    guests: soLuongKhach ? `${soLuongKhach} khách` : 'Chưa chọn số khách',
    date: formData.date ? dinhDangNgayHienThi(formData.date) : 'Chưa chọn ngày',
    time: formData.time || 'Chưa chọn giờ',
    seatingArea: formData.time ? layVanBanTomTatChoNgoi(formData.seatingArea) : 'Chưa chọn khu vực',
  }), [formData.date, formData.seatingArea, formData.time, soLuongKhach])

  const stepOneProgress = useMemo(() => ({
    hasGuests: Boolean(soLuongKhach),
    hasDate: Boolean(formData.date && !invalidPastDate && !closedDate),
    hasTime: Boolean(formData.time),
    hasSeating: Boolean(formData.time && formData.seatingArea),
  }), [closedDate, formData.date, formData.seatingArea, formData.time, soLuongKhach, invalidPastDate])

  const guestWarning = useMemo(() => {
    if (soLuongKhach === SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN) return 'Nhóm 10 khách có thể cần host gọi lại để xác nhận cách xếp bàn.'
    if (soLuongKhach >= 6) return 'Nhóm từ 6 khách nên đặt sớm để ưu tiên bàn phù hợp hơn.'
    return ''
  }, [soLuongKhach])

  const nextStepHint = useMemo(() => {
    if (step === 1) {
      if (!stepOneProgress.hasGuests) return 'Chọn số khách để bắt đầu.'
      if (laNhomDongChiDatQuaHotline(soLuongKhach)) return THONG_DIEP_HOTLINE_NHOM_DONG
      if (!stepOneProgress.hasDate) return 'Chọn ngày dùng bữa để mở danh sách khung giờ phục vụ.'
      if (!stepOneProgress.hasTime) return 'Chọn khung giờ phù hợp trước khi tiếp tục.'
      return 'Bạn có thể tiếp tục sang bước nhập thông tin liên hệ.'
    }

    if (step === 2) {
      if (!formData.name.trim() || !formData.phone.trim() || !laSoDienThoaiHopLe(formData.phone)) {
        return 'Điền đủ họ tên và số điện thoại để tiếp tục xác nhận booking.'
      }
      return 'Kiểm tra lại thông tin và chuyển sang bước xác nhận cuối.'
    }

    return 'Kiểm tra lại toàn bộ thông tin rồi gửi yêu cầu đặt bàn.'
  }, [formData.name, formData.phone, soLuongKhach, step, stepOneProgress])

  const activeBookingSection = useMemo(() => {
    if (!stepOneProgress.hasGuests) return 'guests'
    if (!stepOneProgress.hasDate) return 'date'
    if (!stepOneProgress.hasTime) return 'time'
    if (!stepOneProgress.hasSeating) return 'seating'
    return 'contact'
  }, [stepOneProgress])

  return {
    activeBookingSection,
    bookingSelectionSummary,
    closedDate,
    dateSectionRef,
    draftRestored,
    formData,
    restoredDraft,
    soLuongKhach,
    guestWarning,
    invalidPastDate,
    nextStepHint,
    setDraftRestored,
    setFormData,
    setStep,
    step,
    stepOneProgress,
    todayString,
  }
}
