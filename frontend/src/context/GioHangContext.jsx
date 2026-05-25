import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { phanTichGiaThanhSo } from '../utils/giaTien'
import { layJsonLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'

const GioHangContext = createContext(null)

const normalizeToppings = (toppings) => {
  if (!Array.isArray(toppings)) {
    return []
  }

  return toppings
    .map((topping) => String(topping).trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'vi'))
}

const normalizeNote = (note) =>
  String(note || '')
    .trim()
    .replace(/\s+/g, ' ')

const createVariantKey = ({ id, kichCoDaChon, toppingDaChon, ghiChuRieng }) => {
  const sizePart = String(kichCoDaChon || 'M').trim().toUpperCase()
  const toppingsPart = normalizeToppings(toppingDaChon).join('|') || 'none'
  const notePart = normalizeNote(ghiChuRieng) || 'none'

  return `${id}__${sizePart}__${toppingsPart}__${notePart}`
}

const getItemKey = (item) => item.variantKey || createVariantKey(item)

const isVariantKey = (value) => typeof value === 'string' && value.includes('__')

const normalizeCartItem = (item) => {
  const normalizedSize = String(item?.kichCoDaChon || 'M').trim().toUpperCase() || 'M'
  const normalizedToppings = normalizeToppings(item?.toppingDaChon)
  const normalizedNote = normalizeNote(item?.ghiChuRieng)

  return {
    ...item,
    price: phanTichGiaThanhSo(item?.price),
    quantity: Math.max(1, Number(item?.quantity) || 1),
    kichCoDaChon: normalizedSize,
    toppingDaChon: normalizedToppings,
    ghiChuRieng: normalizedNote,
    variantKey: item?.variantKey || createVariantKey({
      id: item?.id,
      kichCoDaChon: normalizedSize,
      toppingDaChon: normalizedToppings,
      ghiChuRieng: normalizedNote,
    }),
  }
}

const getInitialCartItems = () => {
  try {
    const parsedCart = layJsonLuuTru(STORAGE_KEYS.GIO_HANG, [])
    if (!Array.isArray(parsedCart)) {
      return []
    }

    return parsedCart.map((item) => normalizeCartItem(item))
  } catch {
    return []
  }
}


export function GioHangProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCartItems)

  useEffect(() => {
    datJsonLuuTru(STORAGE_KEYS.GIO_HANG, cartItems)
  }, [cartItems])

  useEffect(() => {
    const dongBoGioHang = (event) => {
      if (event.key !== STORAGE_KEYS.GIO_HANG) {
        return
      }

      setCartItems(getInitialCartItems())
    }

    window.addEventListener('storage', dongBoGioHang)
    return () => window.removeEventListener('storage', dongBoGioHang)
  }, [])

  const themVaoGio = (dish) => {
    const normalizedDish = normalizeCartItem(dish)
    const dishKey = getItemKey(normalizedDish)

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => getItemKey(item) === dishKey)

      if (existingItem) {
        return prevItems.map((item) =>
          getItemKey(item) === dishKey
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      }

      return [...prevItems, normalizedDish]
    })
  }

  const xoaKhoiGio = (variantKey) => {
    if (!isVariantKey(variantKey)) {
      return
    }

    setCartItems((prevItems) => prevItems.filter((item) => getItemKey(item) !== variantKey))
  }

  const capNhatSoLuong = (variantKey, delta) => {
    if (!isVariantKey(variantKey)) {
      return
    }

    setCartItems((prevItems) => prevItems.reduce((danhSachMoi, item) => {
      if (getItemKey(item) !== variantKey) {
        danhSachMoi.push(item)
        return danhSachMoi
      }

      const soLuongMoi = item.quantity + delta
      if (soLuongMoi > 0) {
        danhSachMoi.push({
          ...item,
          quantity: soLuongMoi,
        })
      }

      return danhSachMoi
    }, []))
  }

  const xoaToanBoGio = () => {
    setCartItems([])
  }

  const layKhoaMonTrongGio = (item) => getItemKey(item)

  const layTuyChonHienThiMon = (item) => {
    const details = []

    if (item?.kichCoDaChon) {
      details.push(`Size ${item.kichCoDaChon}`)
    }

    if (Array.isArray(item?.toppingDaChon) && item.toppingDaChon.length > 0) {
      details.push(`Topping: ${item.toppingDaChon.join(', ')}`)
    }

    if (item?.ghiChuRieng) {
      details.push(`Ghi chú: ${item.ghiChuRieng}`)
    }

    return details
  }

  const giaTriBoiCanh = useMemo(
    () => ({
      cartItems,
      themVaoGio,
      xoaKhoiGio,
      capNhatSoLuong,
      xoaToanBoGio,
      layKhoaMonTrongGio,
      layTuyChonHienThiMon,
    }),
    [cartItems],
  )

  return <GioHangContext.Provider value={giaTriBoiCanh}>{children}</GioHangContext.Provider>
}

export function useGioHang() {
  const context = useContext(GioHangContext)

  if (!context) {
    throw new Error('useGioHang phai duoc dung ben trong GioHangProvider')
  }

  return context
}
