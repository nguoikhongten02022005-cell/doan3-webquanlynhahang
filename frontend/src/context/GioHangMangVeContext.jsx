import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { phanTichGiaThanhSo } from '../utils/giaTien'
import { layJsonLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'

const GioHangMangVeContext = createContext(null)

const chuanHoaTopping = (toppingDaChon) => Array.isArray(toppingDaChon)
  ? toppingDaChon.map((muc) => String(muc).trim()).filter(Boolean).sort((a, b) => a.localeCompare(b, 'vi'))
  : []

const chuanHoaGhiChu = (ghiChu) => String(ghiChu || '').trim().replace(/\s+/g, ' ')

const taoVariantKey = ({ id, kichCoDaChon, toppingDaChon, ghiChuRieng }) => `${String(id)}__${String(kichCoDaChon || 'M').trim().toUpperCase()}__${chuanHoaTopping(toppingDaChon).join('|') || 'none'}__${chuanHoaGhiChu(ghiChuRieng) || 'none'}`

const layVariantKey = (item) => item.variantKey || taoVariantKey(item)

const chuanHoaMonTrongGio = (item) => {
  const kichCoDaChon = String(item?.kichCoDaChon || 'M').trim().toUpperCase() || 'M'
  const toppingDaChon = chuanHoaTopping(item?.toppingDaChon)
  const ghiChuRieng = chuanHoaGhiChu(item?.ghiChuRieng)

  return {
    ...item,
    price: phanTichGiaThanhSo(item?.price),
    quantity: Math.max(1, Number(item?.quantity) || 1),
    kichCoDaChon,
    toppingDaChon,
    ghiChuRieng,
    variantKey: item?.variantKey || taoVariantKey({
      id: item?.id,
      kichCoDaChon,
      toppingDaChon,
      ghiChuRieng,
    }),
  }
}

const layDanhSachBanDau = () => {
  const duLieu = layJsonLuuTru(STORAGE_KEYS.GIO_HANG_MANG_VE, [])
  return Array.isArray(duLieu) ? duLieu.map(chuanHoaMonTrongGio) : []
}

export function GioHangMangVeProvider({ children }) {
  const [cartItems, setCartItems] = useState(layDanhSachBanDau)

  useEffect(() => {
    datJsonLuuTru(STORAGE_KEYS.GIO_HANG_MANG_VE, cartItems)
  }, [cartItems])

  const themVaoGio = (mon) => {
    const monDaChuanHoa = chuanHoaMonTrongGio(mon)
    const variantKey = layVariantKey(monDaChuanHoa)

    setCartItems((current) => {
      const monDaCo = current.find((item) => layVariantKey(item) === variantKey)
      if (!monDaCo) return [...current, monDaChuanHoa]

      return current.map((item) => layVariantKey(item) === variantKey ? { ...item, quantity: item.quantity + 1 } : item)
    })
  }

  const capNhatSoLuong = (variantKey, delta) => {
    setCartItems((current) => current.reduce((ketQua, item) => {
      if (layVariantKey(item) !== variantKey) {
        ketQua.push(item)
        return ketQua
      }

      const soLuongMoi = item.quantity + delta
      if (soLuongMoi > 0) ketQua.push({ ...item, quantity: soLuongMoi })
      return ketQua
    }, []))
  }

  const xoaKhoiGio = (variantKey) => {
    setCartItems((current) => current.filter((item) => layVariantKey(item) !== variantKey))
  }

  const xoaToanBoGio = () => setCartItems([])

  const layTuyChonHienThiMon = (item) => {
    const chiTiet = []
    if (item?.kichCoDaChon) chiTiet.push(`Size ${item.kichCoDaChon}`)
    if (Array.isArray(item?.toppingDaChon) && item.toppingDaChon.length > 0) chiTiet.push(`Topping: ${item.toppingDaChon.join(', ')}`)
    if (item?.ghiChuRieng) chiTiet.push(`Ghi chú: ${item.ghiChuRieng}`)
    return chiTiet
  }

  const giaTri = useMemo(() => ({
    cartItems,
    themVaoGio,
    capNhatSoLuong,
    xoaKhoiGio,
    xoaToanBoGio,
    layKhoaMonTrongGio: layVariantKey,
    layTuyChonHienThiMon,
  }), [cartItems])

  return <GioHangMangVeContext.Provider value={giaTri}>{children}</GioHangMangVeContext.Provider>
}

export function useGioHangMangVe() {
  const context = useContext(GioHangMangVeContext)
  if (!context) throw new Error('useGioHangMangVe phai duoc dung ben trong GioHangMangVeProvider')
  return context
}
