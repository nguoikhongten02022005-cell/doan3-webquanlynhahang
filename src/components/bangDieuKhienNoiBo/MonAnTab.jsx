import { useMemo, useState } from 'react'
import { CAC_DANH_MUC_CHUAN_THUC_DON, DANH_MUC_MAC_DINH_THUC_DON } from '../../constants/danhMucThucDon'
import { NHAN_MAC_DINH_THUC_DON, SAC_DO_MAC_DINH_THUC_DON, CAC_LUA_CHON_SAC_DO_THUC_DON } from '../../constants/tuyChonThucDon'
import {
  taoMonApi,
  xoaMonApi,
  capNhatMonApi,
} from '../../services/api/apiThucDon'
import { anhXaFormMonThanhDuLieuGuiDi, anhXaMonThanhGiaTriForm, chuanHoaDanhMucThucDon } from '../../services/mappers/anhXaThucDon'
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

    if (!CATEGORY_OPTIONS.includes(chuanHoaDanhMucThucDon(formValues.category))) {
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

    const duLieuGuiDi = anhXaFormMonThanhDuLieuGuiDi(formValues)

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
    setFormValues(anhXaMonThanhGiaTriForm(dish))
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
    <div className="noi-bo-dashboard-stack">
      <article className="ho-so-card">
        <div className="van-hanh-board-head">
          <h2>{cheDoForm === 'edit' ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
          <span>{cheDoForm === 'edit' ? `Đang sửa #${idMonDangSua}` : 'Đồng bộ trực tiếp với backend menu'}</span>
        </div>

        <form className="noi-bo-mon-form" onSubmit={handleSubmit}>
          <div className="noi-bo-mon-form-grid">
            <label className="nhom-truong noi-bo-mon-field noi-bo-mon-field-wide" htmlFor="mon-name">
              <span className="nhan-truong">Tên món</span>
              <input
                id="mon-name"
                type="text"
                className={`truong-nhap ${loiForm && !formValues.name.trim() ? 'truong-nhap-error' : ''}`}
                placeholder="Ví dụ: Cơm chiên hải sản"
                value={formValues.name}
                onChange={handleChange('name')}
              />
            </label>

            <label className="nhom-truong noi-bo-mon-field noi-bo-mon-field-wide" htmlFor="mon-description">
              <span className="nhan-truong">Mô tả</span>
              <textarea
                id="mon-description"
                className={`truong-van-ban ${loiForm && !formValues.description.trim() ? 'truong-nhap-error' : ''}`}
                rows="3"
                placeholder="Mô tả ngắn về món ăn"
                value={formValues.description}
                onChange={handleChange('description')}
              />
            </label>

            <label className="nhom-truong noi-bo-mon-field" htmlFor="mon-price">
              <span className="nhan-truong">Giá</span>
              <input
                id="mon-price"
                type="text"
                className={`truong-nhap ${loiForm && phanTichGiaThanhSo(formValues.price) <= 0 ? 'truong-nhap-error' : ''}`}
                placeholder="Ví dụ: 125.000đ"
                value={formValues.price}
                onChange={handleChange('price')}
              />
            </label>

            <label className="nhom-truong noi-bo-mon-field" htmlFor="mon-category">
              <span className="nhan-truong">Danh mục</span>
              <select
                id="mon-category"
                className="truong-nhap"
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

            <label className="nhom-truong noi-bo-mon-field" htmlFor="mon-badge">
              <span className="nhan-truong">Badge</span>
              <input
                id="mon-badge"
                type="text"
                className="truong-nhap"
                placeholder="Ví dụ: Best Seller"
                value={formValues.badge}
                onChange={handleChange('badge')}
              />
            </label>

            <label className="nhom-truong noi-bo-mon-field" htmlFor="mon-tone">
              <span className="nhan-truong">Tone</span>
              <select
                id="mon-tone"
                className="truong-nhap"
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

            <label className="nhom-truong noi-bo-mon-field noi-bo-mon-field-wide" htmlFor="mon-image">
              <span className="nhan-truong">Ảnh món</span>
              <input
                id="mon-image"
                type="text"
                className="truong-nhap"
                placeholder="/images/thuc-don/ten-mon.jpg"
                value={formValues.image}
                onChange={handleChange('image')}
              />
            </label>
          </div>

          {loiForm ? <p className="loi-bieu-mau">{loiForm}</p> : null}

          <div className="noi-bo-mon-form-actions">
            <button type="submit" className="btn nut-chinh">
              {cheDoForm === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}
            </button>
            {cheDoForm === 'edit' ? (
              <button type="button" className="btn nut-phu" onClick={resetForm}>
                Hủy sửa
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="ho-so-card">
        <div className="van-hanh-board-head">
          <h2>Danh sách món hiện có</h2>
          <span>{dishes.length} món</span>
        </div>

        <div className="ho-so-list noi-bo-list-top-gap">
          {sortedDishes.length === 0 ? (
            <div className="ho-so-list-item">
              <p className="dat-ban-empty">Chưa có món ăn nào trong menu.</p>
            </div>
          ) : null}

          {sortedDishes.map((dish) => (
            <div key={dish.id} className="ho-so-list-item">
              <div className="ho-so-list-top">
                <strong>{dish.name}</strong>
                <span className={`nhan-trang-thai tone-${dish.tone === 'tone-red' ? 'danger' : dish.tone === 'tone-green' ? 'success' : dish.tone === 'tone-amber' || dish.tone === 'tone-gold' ? 'warning' : 'neutral'}`}>
                  {dish.badge || 'Không badge'}
                </span>
              </div>

              <div className="ho-so-list-meta noi-bo-mon-meta">
                <p><span>ID</span><strong>#{dish.id}</strong></p>
                <p><span>Giá</span><strong>{dish.price}</strong></p>
                <p><span>Danh mục</span><strong>{dish.category}</strong></p>
                <p><span>Tone</span><strong>{dish.tone}</strong></p>
              </div>

              <p className="van-hanh-dat-ban-note">{dish.description}</p>
              {dish.image ? <p className="van-hanh-dat-ban-note">Ảnh: {dish.image}</p> : null}

              <div className="noi-bo-mon-item-actions">
                <button type="button" className="noi-bo-quick-btn noi-bo-quick-nut-chinh" onClick={() => handleEditDish(dish)}>
                  Sửa
                </button>
                <button type="button" className="noi-bo-quick-btn" onClick={() => handleDeleteDish(dish)}>
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
