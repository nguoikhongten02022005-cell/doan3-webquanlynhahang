import { useEffect, useMemo, useState } from 'react'
import { CAC_LUA_CHON_KICH_CO_THUC_DON } from '../constants/tuyChonThucDon'
import { useThongBao } from '../context/ThongBaoContext'
import { phanTichGiaThanhSo } from '../utils/giaTien'

export const useChiTietMonAnModal = ({ themVaoGio, sizeOptions = CAC_LUA_CHON_KICH_CO_THUC_DON }) => {
  const { hienThanhCong } = useThongBao()
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
    themVaoGio({
      ...dish,
      selectedSize: defaultSize,
      selectedToppings: [],
      specialNote: '',
    })
    hienThanhCong(`Đã thêm ${dish.name} vào giỏ hàng.`)
  }

  const selectedSurcharge = getSurchargeBySize(selectedSize)

  const detailPrice = useMemo(() => {
    if (!selectedDish) {
      return 0
    }

    return phanTichGiaThanhSo(selectedDish.price) + selectedSurcharge
  }, [selectedDish, selectedSurcharge])

  const handleAddConfiguredDish = () => {
    if (!selectedDish) {
      return
    }

    themVaoGio({
      ...selectedDish,
      price: phanTichGiaThanhSo(selectedDish.price) + selectedSurcharge,
      selectedSize,
      selectedToppings,
      specialNote,
    })

    hienThanhCong(`Đã thêm ${selectedDish.name} vào giỏ hàng.`)
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
