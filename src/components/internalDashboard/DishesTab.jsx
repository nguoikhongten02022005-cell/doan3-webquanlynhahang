import { useEffect, useMemo, useState } from 'react'
import { MENU_CATEGORIES } from '../../data/menuData'
import {
  createMenuDish,
  deleteMenuDish,
  MENU_DISHES_CONFLICT_ERROR,
  updateMenuDish,
} from '../../services/menuService'
import { parsePriceToNumber } from '../../utils/price'

const DEFAULT_FORM_VALUES = {
  name: '',
  description: '',
  price: '',
  category: MENU_CATEGORIES[1] || '',
  badge: 'Mới',
  tone: 'tone-amber',
  image: '',
}

const DISH_TONE_OPTIONS = [
  'tone-amber',
  'tone-red',
  'tone-gold',
  'tone-cool',
  'tone-green',
  'tone-mint',
  'tone-brown',
  'tone-violet',
]

const CATEGORY_OPTIONS = MENU_CATEGORIES.filter((category) => category !== 'Tất cả')

const formatPriceInput = (price) => {
  const normalizedPrice = parsePriceToNumber(price)
  return normalizedPrice > 0 ? `${normalizedPrice.toLocaleString('vi-VN')}đ` : ''
}

function DishesTab({ dishes }) {
  const [formMode, setFormMode] = useState('create')
  const [editingDishId, setEditingDishId] = useState(null)
  const [editingDishSnapshot, setEditingDishSnapshot] = useState(null)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [formError, setFormError] = useState('')

  const sortedDishes = useMemo(
    () => [...dishes].sort((firstDish, secondDish) => secondDish.id - firstDish.id),
    [dishes],
  )

  const editingDish = useMemo(
    () => (editingDishId === null ? null : dishes.find((dish) => dish.id === editingDishId) ?? null),
    [dishes, editingDishId],
  )

  const resetForm = () => {
    setFormMode('create')
    setEditingDishId(null)
    setEditingDishSnapshot(null)
    setFormValues(DEFAULT_FORM_VALUES)
    setFormError('')
  }

  const handleChange = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  useEffect(() => {
    if (formMode !== 'edit' || editingDishId === null || !editingDishSnapshot) {
      return
    }

    if (!editingDish) {
      resetForm()
      setFormError('Món đang sửa đã bị thay đổi hoặc xóa ở tab khác. Form đã được làm mới.')
      return
    }

    const hasExternalChange = (
      editingDish.name !== editingDishSnapshot.name
      || editingDish.description !== editingDishSnapshot.description
      || editingDish.price !== editingDishSnapshot.price
      || editingDish.category !== editingDishSnapshot.category
      || (editingDish.badge || '') !== editingDishSnapshot.badge
      || editingDish.tone !== editingDishSnapshot.tone
      || (editingDish.image || '') !== editingDishSnapshot.image
    )

    if (hasExternalChange) {
      resetForm()
      setFormError('Món đang sửa đã được cập nhật ở tab khác. Form đã được làm mới để tránh ghi đè.')
    }
  }, [editingDish, editingDishId, editingDishSnapshot, formMode])

  const validateForm = () => {
    if (!formValues.name.trim()) {
      return 'Vui lòng nhập tên món.'
    }

    if (!formValues.description.trim()) {
      return 'Vui lòng nhập mô tả món.'
    }

    if (!formValues.price.trim()) {
      return 'Vui lòng nhập giá món.'
    }

    if (!CATEGORY_OPTIONS.includes(formValues.category)) {
      return 'Danh mục món ăn không hợp lệ.'
    }

    if (parsePriceToNumber(formValues.price) <= 0) {
      return 'Giá món phải là số dương hợp lệ.'
    }

    return ''
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextError = validateForm()
    if (nextError) {
      setFormError(nextError)
      return
    }

    const payload = {
      ...formValues,
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      price: formatPriceInput(formValues.price),
      category: formValues.category,
      badge: formValues.badge.trim(),
      tone: formValues.tone.trim() || 'tone-amber',
      image: formValues.image.trim(),
    }

    try {
      const savedDish = formMode === 'edit'
        ? updateMenuDish(editingDishId, payload)
        : createMenuDish(payload)

      if (!savedDish) {
        setFormError('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      resetForm()
    } catch (error) {
      if (error?.code === MENU_DISHES_CONFLICT_ERROR) {
        setFormError('Menu vừa được cập nhật ở tab khác. Vui lòng tải dữ liệu mới và thử lại.')
        return
      }

      throw error
    }
  }

  const handleEditDish = (dish) => {
    const nextSnapshot = {
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      badge: dish.badge || '',
      tone: dish.tone,
      image: dish.image || '',
    }

    setFormMode('edit')
    setEditingDishId(dish.id)
    setEditingDishSnapshot(nextSnapshot)
    setFormValues(nextSnapshot)
    setFormError('')
  }

  const handleDeleteDish = (dish) => {
    const shouldDelete = window.confirm(`Xóa món "${dish.name}" khỏi menu?`)

    if (!shouldDelete) {
      return
    }

    try {
      deleteMenuDish(dish.id)

      if (editingDishId === dish.id) {
        resetForm()
      }
    } catch (error) {
      if (error?.code === MENU_DISHES_CONFLICT_ERROR) {
        setFormError('Menu vừa được cập nhật ở tab khác. Vui lòng tải dữ liệu mới và thử lại.')
        return
      }

      throw error
    }
  }

  return (
    <div className="internal-dashboard-stack">
      <article className="profile-card">
        <div className="host-board-head">
          <h2>{formMode === 'edit' ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
          <span>{formMode === 'edit' ? `Đang sửa #${editingDishId}` : 'Cập nhật dữ liệu menu cho bản demo nội bộ'}</span>
        </div>

        <form className="internal-dish-form" onSubmit={handleSubmit}>
          <div className="internal-dish-form-grid">
            <label className="form-group internal-dish-field internal-dish-field-wide" htmlFor="dish-name">
              <span className="form-label">Tên món</span>
              <input
                id="dish-name"
                type="text"
                className={`form-input ${formError && !formValues.name.trim() ? 'form-input-error' : ''}`}
                placeholder="Ví dụ: Cơm chiên hải sản"
                value={formValues.name}
                onChange={handleChange('name')}
              />
            </label>

            <label className="form-group internal-dish-field internal-dish-field-wide" htmlFor="dish-description">
              <span className="form-label">Mô tả</span>
              <textarea
                id="dish-description"
                className={`form-textarea ${formError && !formValues.description.trim() ? 'form-input-error' : ''}`}
                rows="3"
                placeholder="Mô tả ngắn về món ăn"
                value={formValues.description}
                onChange={handleChange('description')}
              />
            </label>

            <label className="form-group internal-dish-field" htmlFor="dish-price">
              <span className="form-label">Giá</span>
              <input
                id="dish-price"
                type="text"
                className={`form-input ${formError && parsePriceToNumber(formValues.price) <= 0 ? 'form-input-error' : ''}`}
                placeholder="Ví dụ: 125.000đ"
                value={formValues.price}
                onChange={handleChange('price')}
              />
            </label>

            <label className="form-group internal-dish-field" htmlFor="dish-category">
              <span className="form-label">Danh mục</span>
              <select
                id="dish-category"
                className="form-input"
                value={formValues.category}
                onChange={handleChange('category')}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-group internal-dish-field" htmlFor="dish-badge">
              <span className="form-label">Badge</span>
              <input
                id="dish-badge"
                type="text"
                className="form-input"
                placeholder="Ví dụ: Best Seller"
                value={formValues.badge}
                onChange={handleChange('badge')}
              />
            </label>

            <label className="form-group internal-dish-field" htmlFor="dish-tone">
              <span className="form-label">Tone</span>
              <select
                id="dish-tone"
                className="form-input"
                value={formValues.tone}
                onChange={handleChange('tone')}
              >
                {DISH_TONE_OPTIONS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-group internal-dish-field internal-dish-field-wide" htmlFor="dish-image">
              <span className="form-label">Ảnh món</span>
              <input
                id="dish-image"
                type="text"
                className="form-input"
                placeholder="/images/menu/ten-mon.jpg"
                value={formValues.image}
                onChange={handleChange('image')}
              />
            </label>
          </div>

          {formError ? <p className="form-error">{formError}</p> : null}

          <div className="internal-dish-form-actions">
            <button type="submit" className="btn btn-primary">
              {formMode === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}
            </button>
            {formMode === 'edit' ? (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Hủy sửa
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="profile-card">
        <div className="host-board-head">
          <h2>Danh sách món hiện có</h2>
          <span>{dishes.length} món</span>
        </div>

        <div className="profile-list internal-list-top-gap">
          {sortedDishes.length === 0 ? (
            <div className="profile-list-item">
              <p className="booking-empty">Chưa có món ăn nào trong menu.</p>
            </div>
          ) : null}

          {sortedDishes.map((dish) => (
            <div key={dish.id} className="profile-list-item">
              <div className="profile-list-top">
                <strong>{dish.name}</strong>
                <span className={`status-chip tone-${dish.tone === 'tone-red' ? 'danger' : dish.tone === 'tone-green' ? 'success' : dish.tone === 'tone-amber' || dish.tone === 'tone-gold' ? 'warning' : 'neutral'}`}>
                  {dish.badge || 'Không badge'}
                </span>
              </div>

              <div className="profile-list-meta internal-dish-meta">
                <p><span>ID</span><strong>#{dish.id}</strong></p>
                <p><span>Giá</span><strong>{dish.price}</strong></p>
                <p><span>Danh mục</span><strong>{dish.category}</strong></p>
                <p><span>Tone</span><strong>{dish.tone}</strong></p>
              </div>

              <p className="host-booking-note">{dish.description}</p>
              {dish.image ? <p className="host-booking-note">Ảnh: {dish.image}</p> : null}

              <div className="internal-dish-item-actions">
                <button type="button" className="internal-quick-btn internal-quick-btn-primary" onClick={() => handleEditDish(dish)}>
                  Sửa
                </button>
                <button type="button" className="internal-quick-btn" onClick={() => handleDeleteDish(dish)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default DishesTab
