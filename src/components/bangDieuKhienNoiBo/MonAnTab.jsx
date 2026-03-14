import { useMemo, useState } from 'react'
import { CAC_DANH_MUC_CHUAN_THUC_DON, DANH_MUC_MAC_DINH_THUC_DON } from '../../constants/danhMucThucDon'
import { NHAN_MAC_DINH_THUC_DON, SAC_DO_MAC_DINH_THUC_DON, CAC_LUA_CHON_SAC_DO_THUC_DON } from '../../constants/tuyChonThucDon'
import {
  taoMonApi,
  xoaMonApi,
  capNhatMonApi,
} from '../../services/api/apiThucDon'
import { mapDishFormToPayload, mapDishToFormValues, normalizeMenuCategory } from '../../services/mappers/anhXaThucDon'
import { phanTichGiaThanhSo } from '../../utils/giaTien'

const DEFAULT_FORM_VALUES = {
  name: '',
  description: '',
  price: '',
  category: DANH_MUC_MAC_DINH_THUC_DON,
  badge: NHAN_MAC_DINH_THUC_DON,
  tone: SAC_DO_MAC_DINH_THUC_DON,
  image: '',
}

const CATEGORY_OPTIONS = CAC_DANH_MUC_CHUAN_THUC_DON

function MonAnTab({ dishes, reloadDishes }) {
  const [cheDoForm, setCheDoForm] = useState('create')
  const [idMonDangSua, setIdMonDangSua] = useState(null)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [loiForm, setLoiForm] = useState('')

  const sortedDishes = useMemo(
    () => [...dishes].sort((firstDish, secondDish) => (Number(secondDish.id) || 0) - (Number(firstDish.id) || 0)),
    [dishes],
  )

  const resetForm = () => {
    setCheDoForm('create')
    setIdMonDangSua(null)
    setFormValues(DEFAULT_FORM_VALUES)
    setLoiForm('')
  }

  const handleChange = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

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

    if (!CATEGORY_OPTIONS.includes(normalizeMenuCategory(formValues.category))) {
      return 'Danh mục món ăn không hợp lệ.'
    }

    if (phanTichGiaThanhSo(formValues.price) <= 0) {
      return 'Giá món phải là số dương hợp lệ.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextError = validateForm()
    if (nextError) {
      setLoiForm(nextError)
      return
    }

    const duLieuGuiDi = mapDishFormToPayload(formValues)

    try {
      const { duLieu: savedDish } = cheDoForm === 'edit'
        ? await capNhatMonApi(idMonDangSua, payload)
        : await taoMonApi(payload)

      if (!savedDish) {
        setLoiForm('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      await reloadDishes?.()
      resetForm()
    } catch (error) {
      setLoiForm(error?.message || 'Không thể lưu món ăn. Vui lòng thử lại.')
    }
  }

  const handleEditDish = (dish) => {
    setCheDoForm('edit')
    setIdMonDangSua(dish.id)
    setFormValues(mapDishToFormValues(dish))
    setLoiForm('')
  }

  const handleDeleteDish = async (dish) => {
    const shouldDelete = window.confirm(`Xóa món "${dish.name}" khỏi menu?`)

    if (!shouldDelete) {
      return
    }

    try {
      const { duLieu: deletedDish } = await xoaMonApi(dish.id)

      if (deletedDish === undefined) {
        setLoiForm('Không thể xóa món ăn. Vui lòng thử lại.')
        return
      }
      await reloadDishes?.()

      if (idMonDangSua === dish.id) {
        resetForm()
      }
    } catch (error) {
      setLoiForm(error?.message || 'Không thể xóa món ăn. Vui lòng thử lại.')
    }
  }

  return (
    <div className="internal-dashboard-stack">
      <article className="profile-card">
        <div className="host-board-head">
          <h2>{cheDoForm === 'edit' ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
          <span>{cheDoForm === 'edit' ? `Đang sửa #${idMonDangSua}` : 'Đồng bộ trực tiếp với backend menu'}</span>
        </div>

        <form className="internal-dish-form" onSubmit={handleSubmit}>
          <div className="internal-dish-form-grid">
            <label className="form-group internal-dish-field internal-dish-field-wide" htmlFor="dish-name">
              <span className="form-label">Tên món</span>
              <input
                id="dish-name"
                type="text"
                className={`form-input ${loiForm && !formValues.name.trim() ? 'form-input-error' : ''}`}
                placeholder="Ví dụ: Cơm chiên hải sản"
                value={formValues.name}
                onChange={handleChange('name')}
              />
            </label>

            <label className="form-group internal-dish-field internal-dish-field-wide" htmlFor="dish-description">
              <span className="form-label">Mô tả</span>
              <textarea
                id="dish-description"
                className={`form-textarea ${loiForm && !formValues.description.trim() ? 'form-input-error' : ''}`}
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
                className={`form-input ${loiForm && phanTichGiaThanhSo(formValues.price) <= 0 ? 'form-input-error' : ''}`}
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
                {CAC_LUA_CHON_SAC_DO_THUC_DON.map((tone) => (
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
                placeholder="/images/thuc-don/ten-mon.jpg"
                value={formValues.image}
                onChange={handleChange('image')}
              />
            </label>
          </div>

          {loiForm ? <p className="form-error">{loiForm}</p> : null}

          <div className="internal-dish-form-actions">
            <button type="submit" className="btn btn-primary">
              {cheDoForm === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}
            </button>
            {cheDoForm === 'edit' ? (
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

export default MonAnTab
