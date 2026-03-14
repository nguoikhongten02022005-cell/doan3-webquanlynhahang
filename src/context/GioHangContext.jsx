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

const createVariantKey = ({ id, selectedSize, selectedToppings, specialNote }) => {
  const sizePart = String(selectedSize || 'M').trim().toUpperCase()
  const toppingsPart = normalizeToppings(selectedToppings).join('|') || 'none'
  const notePart = normalizeNote(specialNote) || 'none'

  return `${id}__${sizePart}__${toppingsPart}__${notePart}`
}

const getItemKey = (item) => item.variantKey || createVariantKey(item)

const isVariantKey = (value) => typeof value === 'string' && value.includes('__')

const normalizeCartItem = (item) => {
  const normalizedSize = String(item?.selectedSize || 'M').trim().toUpperCase() || 'M'
  const normalizedToppings = normalizeToppings(item?.selectedToppings)
  const normalizedNote = normalizeNote(item?.specialNote)

  return {
    ...item,
    price: phanTichGiaThanhSo(item?.price),
    quantity: Math.max(1, Number(item?.quantity) || 1),
    selectedSize: normalizedSize,
    selectedToppings: normalizedToppings,
    specialNote: normalizedNote,
    variantKey: item?.variantKey || createVariantKey({
      id: item?.id,
      selectedSize: normalizedSize,
      selectedToppings: normalizedToppings,
      specialNote: normalizedNote,
    }),
  }
}

const getInitialCartItems = () => {
  try {
    const parsedCart = layJsonLuuTru(STORAGE_KEYS.CART, [])
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
    datJsonLuuTru(STORAGE_KEYS.CART, cartItems)
  }, [cartItems])

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

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (getItemKey(item) !== variantKey) {
          return item
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta),
        }
      }),
    )
  }

  const xoaToanBoGio = () => {
    setCartItems([])
  }

  const layKhoaMonTrongGio = (item) => getItemKey(item)

  const layTuyChonHienThiMon = (item) => {
    const details = []

    if (item?.selectedSize) {
      details.push(`Size ${item.selectedSize}`)
    }

    if (Array.isArray(item?.selectedToppings) && item.selectedToppings.length > 0) {
      details.push(`Topping: ${item.selectedToppings.join(', ')}`)
    }

    if (item?.specialNote) {
      details.push(`Ghi chú: ${item.specialNote}`)
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
