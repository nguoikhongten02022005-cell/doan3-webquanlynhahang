import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_STORAGE_KEY = 'restaurant_cart'

const CartContext = createContext(null)

const parsePriceToNumber = (price) => {
  if (typeof price === 'number') {
    return price
  }

  if (typeof price === 'string') {
    const numeric = Number(price.replace(/[^\d]/g, ''))
    return Number.isNaN(numeric) ? 0 : numeric
  }

  return 0
}

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

const normalizeCartItem = (item) => {
  const normalizedSize = String(item?.selectedSize || 'M').trim().toUpperCase() || 'M'
  const normalizedToppings = normalizeToppings(item?.selectedToppings)
  const normalizedNote = normalizeNote(item?.specialNote)

  return {
    ...item,
    price: parsePriceToNumber(item?.price),
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
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) {
      return []
    }

    const parsedCart = JSON.parse(savedCart)
    if (!Array.isArray(parsedCart)) {
      return []
    }

    return parsedCart.map((item) => normalizeCartItem(item))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCartItems)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (dish) => {
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

  const removeFromCart = (itemIdentifier) => {
    const isVariantKey = typeof itemIdentifier === 'string' && itemIdentifier.includes('__')

    setCartItems((prevItems) =>
      prevItems.filter((item) =>
        isVariantKey ? getItemKey(item) !== itemIdentifier : item.id !== itemIdentifier,
      ),
    )
  }

  const updateQuantity = (itemIdentifier, delta) => {
    const isVariantKey = typeof itemIdentifier === 'string' && itemIdentifier.includes('__')

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const isTarget = isVariantKey ? getItemKey(item) === itemIdentifier : item.id === itemIdentifier

        if (!isTarget) {
          return item
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta),
        }
      }),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartItemKey = (item) => getItemKey(item)

  const getItemDisplayOptions = (item) => {
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

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemKey,
      getItemDisplayOptions,
    }),
    [cartItems],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
