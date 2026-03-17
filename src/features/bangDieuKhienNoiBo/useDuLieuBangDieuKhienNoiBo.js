import { useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDanhSachMonAn } from '../../hooks/useDanhSachMonAn'
import { SU_KIEN_THAY_DOI_DU_LIEU_DAT_BAN, useDatBan } from '../../hooks/useDatBan'
import { capNhatTrangThaiBanApi } from '../../services/api/apiBanAn'
import { TRANG_THAI_BAN } from '../../services/dichVuBanAn'
import { khoaQuery } from '../../services/queries/khoaQuery'
import {
  taoTuyChonQueryDanhSachBanNoiBo,
  taoTuyChonQueryDanhSachDatBanNoiBo,
  taoTuyChonQueryDanhSachDonHangNoiBo,
  taoTuyChonQueryDanhSachTaiKhoanNoiBo,
} from '../../services/queries/truyVanNoiBo'
import { CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG, CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN } from './hangSo'
import {
  layTomTatTaiKhoan,
  layTomTatDonHang,
  layTomTatTonKhoBan,
  layTomTatBan,
  layDatBanChuaGanBan,
  laDatBanDaCheckIn,
  laDatBanSapDienRa,
  sapXepDatBanChoVanHanh,
  sapXepDonHangChoVanHanh,
} from './boChon'
import { laySacThaiDonHang } from './dinhDang'

export const useDuLieuBangDieuKhienNoiBo = () => {
  const queryClient = useQueryClient()
  const {
    ganBanChoDatBan,
    taoDatBanNoiBo,
    layBanPhuHopChoDatBan,
    layDanhSachDatBanHost,
    danhDauDaCheckIn,
    danhDauHoanThanh,
    danhDauKhongDen,
    capNhatDatBanNoiBo,
  } = useDatBan()
  const { dishes: danhSachMon, reloadDishes: taiLaiDanhSachMon } = useDanhSachMonAn()

  const truyVanDanhSachDatBan = useQuery(taoTuyChonQueryDanhSachDatBanNoiBo(layDanhSachDatBanHost))
  const truyVanDanhSachDonHang = useQuery(taoTuyChonQueryDanhSachDonHangNoiBo())
  const truyVanDanhSachTaiKhoan = useQuery(taoTuyChonQueryDanhSachTaiKhoanNoiBo())
  const truyVanDanhSachBan = useQuery(taoTuyChonQueryDanhSachBanNoiBo())

  const danhSachDatBan = useMemo(() => truyVanDanhSachDatBan.data ?? [], [truyVanDanhSachDatBan.data])
  const danhSachDonHang = useMemo(() => truyVanDanhSachDonHang.data ?? [], [truyVanDanhSachDonHang.data])
  const danhSachTaiKhoan = useMemo(() => truyVanDanhSachTaiKhoan.data ?? [], [truyVanDanhSachTaiKhoan.data])
  const danhSachBan = useMemo(() => truyVanDanhSachBan.data ?? [], [truyVanDanhSachBan.data])

  const taiLaiDuLieu = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: khoaQuery.noiBo.danhSachDatBan() }),
      queryClient.invalidateQueries({ queryKey: khoaQuery.noiBo.danhSachDonHang() }),
      queryClient.invalidateQueries({ queryKey: khoaQuery.noiBo.danhSachTaiKhoan() }),
      queryClient.invalidateQueries({ queryKey: khoaQuery.noiBo.danhSachBan() }),
    ])
  }, [queryClient])

  useEffect(() => {
    const xuLyLuuTru = () => {
      taiLaiDuLieu()
    }

    window.addEventListener('storage', xuLyLuuTru)
    window.addEventListener(SU_KIEN_THAY_DOI_DU_LIEU_DAT_BAN, taiLaiDuLieu)

    return () => {
      window.removeEventListener('storage', xuLyLuuTru)
      window.removeEventListener(SU_KIEN_THAY_DOI_DU_LIEU_DAT_BAN, taiLaiDuLieu)
    }
  }, [taiLaiDuLieu])

  const hangDoiDatBan = useMemo(
    () => sapXepDatBanChoVanHanh(danhSachDatBan, new Date()),
    [danhSachDatBan],
  )
  const danhSachDatBanDangHoatDong = useMemo(
    () => hangDoiDatBan.filter((booking) => CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG.has(booking.status)),
    [hangDoiDatBan],
  )
  const danhSachDatBanDaXacNhan = useMemo(
    () => danhSachDatBanDangHoatDong.filter((booking) => CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN.has(booking.status)),
    [danhSachDatBanDangHoatDong],
  )
  const danhSachDatBanChoXuLy = useMemo(
    () => hangDoiDatBan.filter((booking) => booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CAN_GOI_LAI' || booking.status === 'CHO_XAC_NHAN'),
    [hangDoiDatBan],
  )
  const danhSachDatBanSapDienRa = useMemo(() => {
    const now = new Date()
    return danhSachDatBanDangHoatDong.filter((booking) => laDatBanSapDienRa(booking, now))
  }, [danhSachDatBanDangHoatDong])
  const soLuongDatBanDaCheckIn = useMemo(
    () => danhSachDatBan.filter((booking) => laDatBanDaCheckIn(booking)).length,
    [danhSachDatBan],
  )
  const tomTatBan = useMemo(() => layTomTatBan(danhSachBan), [danhSachBan])
  const tomTatTonKhoBan = useMemo(() => layTomTatTonKhoBan(danhSachBan), [danhSachBan])
  const danhSachDatBanChuaGanBan = useMemo(() => layDatBanChuaGanBan(danhSachDatBanDangHoatDong), [danhSachDatBanDangHoatDong])
  const tomTatDonHang = useMemo(() => layTomTatDonHang(danhSachDonHang), [danhSachDonHang])
  const danhSachDonHangDangMo = useMemo(
    () => sapXepDonHangChoVanHanh(danhSachDonHang).filter((order) => laySacThaiDonHang(order.status) === 'warning'),
    [danhSachDonHang],
  )
  const danhSachDonHangDaSapXep = useMemo(() => sapXepDonHangChoVanHanh(danhSachDonHang), [danhSachDonHang])
  const tomTatTaiKhoan = useMemo(() => layTomTatTaiKhoan(danhSachTaiKhoan), [danhSachTaiKhoan])

  const xuLyTaoDatBanNoiBo = useCallback(async (duLieuGuiDi) => {
    const ketQua = await taoDatBanNoiBo(duLieuGuiDi)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [taoDatBanNoiBo, taiLaiDuLieu])

  const xuLyCapNhatDatBanNoiBo = useCallback(async (bookingId, duLieuGuiDi) => {
    const ketQua = await capNhatDatBanNoiBo(bookingId, duLieuGuiDi)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [capNhatDatBanNoiBo, taiLaiDuLieu])

  const xuLyGanBan = useCallback(async (bookingId, danhSachIdBan) => {
    const ketQua = await ganBanChoDatBan(bookingId, danhSachIdBan)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [ganBanChoDatBan, taiLaiDuLieu])

  const xuLyCheckIn = useCallback(async (bookingId) => {
    const ketQua = await danhDauDaCheckIn(bookingId)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauDaCheckIn, taiLaiDuLieu])

  const xuLyHoanThanh = useCallback(async (bookingId) => {
    const ketQua = await danhDauHoanThanh(bookingId)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauHoanThanh, taiLaiDuLieu])

  const xuLyKhachKhongDen = useCallback(async (bookingId) => {
    const ketQua = await danhDauKhongDen(bookingId)
    if (ketQua?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauKhongDen, taiLaiDuLieu])

  const xuLyDanhDauBanBan = useCallback(async (tableId) => {
    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.BAN)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  const xuLyDanhDauBanSanSang = useCallback(async (tableId) => {
    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.TRONG)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  return {
    tomTatTaiKhoan,
    danhSachDatBanDangHoatDong,
    hangDoiDatBan,
    soLuongDatBanDaCheckIn,
    danhSachDatBanDaXacNhan,
    danhSachBan,
    danhSachDatBan,
    danhSachDonHang,
    danhSachMon,
    danhSachTaiKhoan,
    xuLyGanBan,
    xuLyCheckIn,
    xuLyHoanThanh,
    xuLyTaoDatBanNoiBo,
    xuLyDanhDauBanBan,
    xuLyDanhDauBanSanSang,
    xuLyKhachKhongDen,
    xuLyCapNhatDatBanNoiBo,
    layBanPhuHopChoDatBan,
    danhSachDonHangDangMo,
    tomTatDonHang,
    danhSachDatBanChoXuLy,
    danhSachDonHangDaSapXep,
    tomTatTonKhoBan,
    tomTatBan,
    taiLaiDanhSachMon,
    taiLaiDuLieu,
    danhSachDatBanSapDienRa,
    danhSachDatBanChuaGanBan,
  }
}
