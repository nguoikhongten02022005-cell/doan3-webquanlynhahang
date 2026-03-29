import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDanhSachMonAn } from '../../hooks/useDanhSachMonAn'
import { SU_KIEN_THAY_DOI_DU_LIEU_DAT_BAN, useDatBan } from '../../hooks/useDatBan'
import { layDanhSachNguoiDungApi } from '../../services/api/apiXacThuc'
import { layDanhSachDanhGiaApi, duyetDanhGiaApi } from '../../services/api/apiDanhGia'
import { layDanhSachDonHangApi, layChiTietDonHangApi, capNhatTrangThaiDonHangApi } from '../../services/api/apiDonHang'
import { layDanhSachBanApi, capNhatTrangThaiBanApi } from '../../services/api/apiBanAn'
import { TRANG_THAI_BAN } from '../../services/dichVuBanAn.js'
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
import { coSuDungMayChu } from '../../services/trinhKhachApi'
import { taoDuLieuNoiBoDuPhong } from '../admin/mockData'
import { chuanHoaBanChoNoiBo } from '../../services/dichVuBanAn.js'
import { chuanHoaNguoiDungApi } from '../../services/api/apiXacThuc'

const chuanHoaDonHangNoiBo = (order) => {
  if (!order || typeof order !== 'object') return null
  return {
    ...order,
    id: order.id || order.orderCode || order.maDonHang || order.MaDonHang,
    orderCode: order.orderCode || order.maDonHang || order.MaDonHang || '',
    status: order.status || order.trangThai || order.TrangThai || '',
    total: Number(order.total ?? order.tongTien ?? order.TongTien ?? 0),
  }
}

export const useDuLieuBangDieuKhienNoiBo = () => {
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
  const [danhSachDatBan, setDanhSachDatBan] = useState([])
  const [danhSachDonHang, setDanhSachDonHang] = useState([])
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([])
  const [danhSachBan, setDanhSachBan] = useState([])
  const [danhSachDanhGia, setDanhSachDanhGia] = useState([])

  const taiLaiDuLieu = useCallback(async () => {
      const apDungDuLieuDuPhong = () => {
        const duLieuDuPhong = taoDuLieuNoiBoDuPhong()
        setDanhSachDatBan(duLieuDuPhong.bookings)
        setDanhSachDonHang(duLieuDuPhong.orders)
        setDanhSachTaiKhoan(duLieuDuPhong.accounts)
        setDanhSachBan(duLieuDuPhong.tables)
        setDanhSachDanhGia([])
      }

    if (!coSuDungMayChu()) {
      apDungDuLieuDuPhong()
      return
    }

    try {
      const [nextBookings, nextOrdersResponse, nextAccountsResponse, nextTablesResponse, nextReviewsResponse] = await Promise.all([
        layDanhSachDatBanHost(),
        layDanhSachDonHangApi(),
        layDanhSachNguoiDungApi(),
        layDanhSachBanApi(),
        layDanhSachDanhGiaApi(),
      ])

      setDanhSachDatBan(Array.isArray(nextBookings) ? nextBookings : [])
      setDanhSachDonHang(Array.isArray(nextOrdersResponse?.duLieu) ? nextOrdersResponse.duLieu.map(chuanHoaDonHangNoiBo).filter(Boolean) : [])
      setDanhSachTaiKhoan(Array.isArray(nextAccountsResponse?.duLieu) ? nextAccountsResponse.duLieu.map(chuanHoaNguoiDungApi).filter(Boolean) : [])
      setDanhSachBan(Array.isArray(nextTablesResponse?.duLieu) ? nextTablesResponse.duLieu.map(chuanHoaBanChoNoiBo).filter(Boolean) : [])
      setDanhSachDanhGia(Array.isArray(nextReviewsResponse?.duLieu) ? nextReviewsResponse.duLieu : [])
    } catch {
      apDungDuLieuDuPhong()
    }
  }, [layDanhSachDatBanHost])

  useEffect(() => {
    taiLaiDuLieu()

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
  const danhSachDanhGiaChoDuyet = useMemo(
    () => danhSachDanhGia.filter((danhGia) => danhGia.trangThai === 'Pending'),
    [danhSachDanhGia],
  )

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
    if (!coSuDungMayChu()) {
      setDanhSachBan((currentTables) => currentTables.map((table) => (
        table.id === tableId
          ? { ...table, status: TRANG_THAI_BAN.BAN }
          : table
      )))
      return
    }

    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.BAN)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  const xuLyDanhDauBanSanSang = useCallback(async (tableId) => {
    if (!coSuDungMayChu()) {
      setDanhSachBan((currentTables) => currentTables.map((table) => (
        table.id === tableId
          ? { ...table, status: TRANG_THAI_BAN.TRONG }
          : table
      )))
      return
    }

    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.TRONG)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  const layChiTietDonHang = useCallback(async (orderId) => {
    if (!coSuDungMayChu()) {
      return danhSachDonHang.find((order) => String(order.id) === String(orderId)) || null
    }

    const ketQua = await layChiTietDonHangApi(orderId)
    return ketQua?.duLieu || null
  }, [danhSachDonHang])

  const xuLyCapNhatTrangThaiDonHang = useCallback(async (orderId, status) => {
    if (!coSuDungMayChu()) {
      let duLieuCapNhat = null

      setDanhSachDonHang((currentOrders) => currentOrders.map((order) => {
        if (String(order.id) !== String(orderId)) {
          return order
        }

        duLieuCapNhat = { ...order, status }
        return duLieuCapNhat
      }))

      return {
        duLieu: duLieuCapNhat,
        thongDiep: 'Cập nhật trạng thái đơn hàng thành công',
        meta: null,
      }
    }

    const ketQua = await capNhatTrangThaiDonHangApi(orderId, status)
    if (ketQua?.duLieu) {
      await taiLaiDuLieu()
    }
    return ketQua
  }, [taiLaiDuLieu])

  const xuLyDuyetDanhGia = useCallback(async (maDanhGia, trangThai, phanHoi = '') => {
    const ketQua = await duyetDanhGiaApi(maDanhGia, { trangThai, phanHoi })
    if (ketQua?.duLieu) {
      await taiLaiDuLieu()
    }
    return ketQua
  }, [taiLaiDuLieu])

  return {
    tomTatTaiKhoan,
    danhSachDatBanDangHoatDong,
    hangDoiDatBan,
    soLuongDatBanDaCheckIn,
    danhSachDatBanDaXacNhan,
    danhSachBan,
    danhSachDanhGia,
    danhSachDanhGiaChoDuyet,
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
    layChiTietDonHang,
    xuLyCapNhatTrangThaiDonHang,
    xuLyDuyetDanhGia,
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
