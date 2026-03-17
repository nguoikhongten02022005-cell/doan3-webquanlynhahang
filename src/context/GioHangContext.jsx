import { useMemo } from 'react'
import { useGioHangStore } from '../stores/gioHangStore'

export function useGioHang() {
  const cartItems = useGioHangStore((trangThai) => trangThai.cartItems)
  const themVaoGio = useGioHangStore((trangThai) => trangThai.themVaoGio)
  const xoaKhoiGio = useGioHangStore((trangThai) => trangThai.xoaKhoiGio)
  const capNhatSoLuong = useGioHangStore((trangThai) => trangThai.capNhatSoLuong)
  const xoaToanBoGio = useGioHangStore((trangThai) => trangThai.xoaToanBoGio)
  const layKhoaMonTrongGio = useGioHangStore((trangThai) => trangThai.layKhoaMonTrongGio)
  const layTuyChonHienThiMon = useGioHangStore((trangThai) => trangThai.layTuyChonHienThiMon)

  return useMemo(() => ({
    cartItems,
    themVaoGio,
    xoaKhoiGio,
    capNhatSoLuong,
    xoaToanBoGio,
    layKhoaMonTrongGio,
    layTuyChonHienThiMon,
  }), [cartItems, themVaoGio, xoaKhoiGio, capNhatSoLuong, xoaToanBoGio, layKhoaMonTrongGio, layTuyChonHienThiMon])
}
