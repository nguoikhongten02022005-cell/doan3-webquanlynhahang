import { useEffect, useMemo, useState } from 'react'
import { MENU_SIZE_OPTIONS } from '../constants/menuOptions'
import { parsePriceToNumber } from '../utils/price'

export const useFoodDetailModal = ({ addToCart, sizeOptions = MENU_SIZE_OPTIONS }) => {
  const defaultSize = sizeOptions[0]?.value || 'M'
  const [selectedDish, setSelectedDish] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(defaultSize)
  const [selectedToppings, setSelectedToppings] = useState([])
  const [specialNote, setSpecialNote] = useState('')

  useEffect(() => {
    if (!isDetailOpen) {
      return undefined
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isDetailOpen])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isDetailOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isDetailOpen])

  const getSurchargeBySize = (size) => {
    const selectedOption = sizeOptions.find((option) => option.value === size)
    return selectedOption ? selectedOption.surcharge : 0
  }

  const openDetailModal = (dish) => {
    setSelectedDish(dish)
    setSelectedSize(defaultSize)
    setSelectedToppings([])
    setSpecialNote('')
    setIsDetailOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailOpen(false)
    setSelectedDish(null)
  }

  const handleToggleTopping = (topping) => {
    setSelectedToppings((prev) => (
      prev.includes(topping) ? prev.filter((item) => item !== topping) : [...prev, topping]
    ))
  }

  const handleAddToCart = (dish) => {
    addToCart({
      ...dish,
      selectedSize: defaultSize,
      selectedToppings: [],
      specialNote: '',
    })
    alert(`Đã thêm ${dish.name} vào giỏ`)
  }

  const selectedSurcharge = getSurchargeBySize(selectedSize)

  const detailPrice = useMemo(() => {
    if (!selectedDish) {
      return 0
    }

    return parsePriceToNumber(selectedDish.price) + selectedSurcharge
  }, [selectedDish, selectedSurcharge])

  const handleAddConfiguredDish = () => {
    if (!selectedDish) {
      return
    }

    addToCart({
      ...selectedDish,
      price: parsePriceToNumber(selectedDish.price) + selectedSurcharge,
      selectedSize,
      selectedToppings,
      specialNote,
    })

    alert(`Đã thêm ${selectedDish.name} vào giỏ`)
    closeDetailModal()
  }

  return {
    detailPrice,
    handleAddConfiguredDish,
    handleAddToCart,
    handleToggleTopping,
    isDetailOpen,
    openDetailModal,
    closeDetailModal,
    selectedDish,
    selectedSize,
    selectedSurcharge,
    selectedToppings,
    setSelectedSize,
    setSpecialNote,
    specialNote,
  }
}
