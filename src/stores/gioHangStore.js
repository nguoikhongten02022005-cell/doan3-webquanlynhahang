import { create } from 'zustand'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'
import { phanTichGiaThanhSo } from '../utils/giaTien'

const chuanHoaTopping = (danhSachTopping) => {
  if (!Array.isArray(danhSachTopping)) {
    return []
  }

  return danhSachTopping
    .map((topping) => String(topping).trim())
    .filter(Boolean)
    .sort((giaTriA, giaTriB) => giaTriA.localeCompare(giaTriB, 'vi'))
}

const chuanHoaGhiChu = (ghiChu) => String(ghiChu || '').trim().replace(/\s+/g, ' ')

const taoKhoaBienThe = ({ id, kichCoDaChon, toppingDaChon, ghiChuRieng }) => {
  const phanKichCo = String(kichCoDaChon || 'M').trim().toUpperCase()
  const phanTopping = chuanHoaTopping(toppingDaChon).join('|') || 'none'
  const phanGhiChu = chuanHoaGhiChu(ghiChuRieng) || 'none'

  return `${id}__${phanKichCo}__${phanTopping}__${phanGhiChu}`
}

const layKhoaMon = (mon) => mon.variantKey || taoKhoaBienThe(mon)

const laKhoaBienTheHopLe = (giaTri) => typeof giaTri === 'string' && giaTri.includes('__')

const chuanHoaMonTrongGio = (mon) => {
  const kichCoDaChon = String(mon?.kichCoDaChon || 'M').trim().toUpperCase() || 'M'
  const toppingDaChon = chuanHoaTopping(mon?.toppingDaChon)
  const ghiChuRieng = chuanHoaGhiChu(mon?.ghiChuRieng)

  return {
    ...mon,
    price: phanTichGiaThanhSo(mon?.price),
    quantity: Math.max(1, Number(mon?.quantity) || 1),
    kichCoDaChon,
    toppingDaChon,
    ghiChuRieng,
    variantKey: mon?.variantKey || taoKhoaBienThe({
      id: mon?.id,
      kichCoDaChon,
      toppingDaChon,
      ghiChuRieng,
    }),
  }
}

const layTrangThaiBanDau = () => {
  try {
    const gioHangDaLuu = layJsonLuuTru(STORAGE_KEYS.GIO_HANG, [])

    if (!Array.isArray(gioHangDaLuu)) {
      return []
    }

    return gioHangDaLuu.map((mon) => chuanHoaMonTrongGio(mon))
  } catch {
    return []
  }
}

const luuGioHang = (cartItems) => {
  datJsonLuuTru(STORAGE_KEYS.GIO_HANG, cartItems)
}

export const useGioHangStore = create((set, get) => ({
  cartItems: layTrangThaiBanDau(),
  themVaoGio: (mon) => {
    const monDaChuanHoa = chuanHoaMonTrongGio(mon)
    const khoaMon = layKhoaMon(monDaChuanHoa)

    set((trangThai) => {
      const monTonTai = trangThai.cartItems.find((muc) => layKhoaMon(muc) === khoaMon)

      const cartItems = monTonTai
        ? trangThai.cartItems.map((muc) => (
            layKhoaMon(muc) === khoaMon
              ? { ...muc, quantity: muc.quantity + 1 }
              : muc
          ))
        : [...trangThai.cartItems, monDaChuanHoa]

      luuGioHang(cartItems)
      return { cartItems }
    })
  },
  xoaKhoiGio: (variantKey) => {
    if (!laKhoaBienTheHopLe(variantKey)) {
      return
    }

    set((trangThai) => {
      const cartItems = trangThai.cartItems.filter((muc) => layKhoaMon(muc) !== variantKey)
      luuGioHang(cartItems)
      return { cartItems }
    })
  },
  capNhatSoLuong: (variantKey, delta) => {
    if (!laKhoaBienTheHopLe(variantKey)) {
      return
    }

    set((trangThai) => {
      const cartItems = trangThai.cartItems.map((muc) => {
        if (layKhoaMon(muc) !== variantKey) {
          return muc
        }

        return {
          ...muc,
          quantity: Math.max(1, muc.quantity + delta),
        }
      })

      luuGioHang(cartItems)
      return { cartItems }
    })
  },
  xoaToanBoGio: () => {
    luuGioHang([])
    set({ cartItems: [] })
  },
  layKhoaMonTrongGio: (mon) => layKhoaMon(mon),
  layTuyChonHienThiMon: (mon) => {
    const chiTiet = []

    if (mon?.kichCoDaChon) {
      chiTiet.push(`Size ${mon.kichCoDaChon}`)
    }

    if (Array.isArray(mon?.toppingDaChon) && mon.toppingDaChon.length > 0) {
      chiTiet.push(`Topping: ${mon.toppingDaChon.join(', ')}`)
    }

    if (mon?.ghiChuRieng) {
      chiTiet.push(`Ghi chú: ${mon.ghiChuRieng}`)
    }

    return chiTiet
  },
  dongBoTuLuuTru: () => {
    const cartItems = layTrangThaiBanDau()
    set({ cartItems })
  },
  layTrangThaiHienTai: () => get(),
}))
