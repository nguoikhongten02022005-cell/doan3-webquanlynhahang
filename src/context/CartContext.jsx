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

const getInitialCartItems = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) {
      return []
    }

    const parsedCart = JSON.parse(savedCart)
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch (error) {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCartItems)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (dish) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === dish.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      }

      return [
        ...prevItems,
        {
          ...dish,
          price: parsePriceToNumber(dish.price),
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
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
