import { useMemo, useState } from 'react'
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Alert, Button, Drawer, Empty, Input, Select, Space, Switch, Tag, Upload } from 'antd'
import { CAC_DANH_MUC_CHUAN_THUC_DON, DANH_MUC_MAC_DINH_THUC_DON } from '../../constants/danhMucThucDon'
import { NHAN_MAC_DINH_THUC_DON, SAC_DO_MAC_DINH_THUC_DON } from '../../constants/tuyChonThucDon'
import { taoMonApi, xoaMonApi, capNhatMonApi } from '../../services/api/apiThucDon'
import { anhXaFormMonThanhDuLieuGuiDi, anhXaMonThanhGiaTriForm, chuanHoaDanhMucThucDon } from '../../services/mappers/anhXaThucDon'
import { phanTichGiaThanhSo } from '../../utils/giaTien'

const { Search, TextArea } = Input
const { CheckableTag } = Tag

const TAG_OPTIONS = ['Best Seller', 'Món mới', 'Cay', 'Chef Choice', 'Combo', 'Signature']
const CATEGORY_OPTIONS = CAC_DANH_MUC_CHUAN_THUC_DON
const CATEGORY_FILTERS = ['Tất cả', ...CATEGORY_OPTIONS]
const TONE_BADGE_CLASS_MAP = {
  'tone-red': 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
  'tone-green': 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  'tone-amber': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'tone-gold': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

function taoFormMacDinh() {
  return {
    name: '',
    description: '',
    price: '',
    category: DANH_MUC_MAC_DINH_THUC_DON,
    badge: NHAN_MAC_DINH_THUC_DON,
    tone: SAC_DO_MAC_DINH_THUC_DON,
    image: '',
    isVisible: true,
    tags: [],
  }
}

function chuanHoaChuoiTimKiem(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function dinhDangGiaMon(dish) {
  if (dish.price) {
    return dish.price
  }

  const numericPrice = Number(dish.priceValue) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

function PlaceholderImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="M20.5 16l-4.6-4.6a1 1 0 0 0-1.4 0L8 18" />
    </svg>
  )
}

function taoUploadFileList(imageUrl) {
  if (!imageUrl) {
    return []
  }

  return [{
    uid: 'dish-image',
    name: 'dish-image.png',
    status: 'done',
    url: imageUrl,
  }]
}

function taoTagsMacDinh(mon) {
  const badge = String(mon?.badge ?? '').trim()

  if (!badge || badge === NHAN_MAC_DINH_THUC_DON) {
    return []
  }

  return [badge]
}

function suyRaTrangThaiHienThi(mon) {
  const rawValue = String(mon?.status ?? mon?.availability ?? mon?.visibilityStatus ?? '').trim().toLowerCase()
  return !['hidden', 'inactive', 'soldout', 'out_of_stock', 'tam_an', 'het_hang'].includes(rawValue)
}

function layMetaMon(mon, dishMetaById) {
  const override = dishMetaById[mon.id] || {}

  return {
    isVisible: typeof override.isVisible === 'boolean' ? override.isVisible : suyRaTrangThaiHienThi(mon),
    tags: Array.isArray(override.tags) ? override.tags : taoTagsMacDinh(mon),
  }
}

function DishCard({ dish, meta, onEdit, onToggleVisibility }) {
  const [imageFailed, setImageFailed] = useState(false)
  const toneClass = TONE_BADGE_CLASS_MAP[dish.tone] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  const hasImage = Boolean(dish.image) && !imageFailed

  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.isVisible ? 'border-slate-200' : 'border-slate-200/80 opacity-90'}`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {hasImage ? (
          <img
            src={dish.image}
            alt={dish.name}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${meta.isVisible ? '' : 'grayscale-[0.4]'}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
            <PlaceholderImageIcon />
          </div>
        )}

        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 backdrop-blur ${meta.isVisible ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 'bg-rose-50 text-rose-600 ring-rose-200'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.isVisible ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {meta.isVisible ? 'Đang bán' : 'Tạm ẩn'}
        </span>

        {dish.badge ? (
          <span className={`absolute right-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${toneClass}`}>
            {dish.badge}
          </span>
        ) : null}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-all duration-200 group-hover:bg-slate-950/35">
          <div className="pointer-events-auto flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              onClick={() => onEdit(dish)}
            >
              <EditOutlined />
              Sửa
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              onClick={() => onToggleVisibility(dish)}
            >
              {meta.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              {meta.isVisible ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-3.5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{dish.category || 'Chưa phân loại'}</p>
          <h3
            className="min-h-[3.25rem] text-sm font-semibold leading-6 text-slate-900"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {dish.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <strong className="text-lg font-bold text-orange-600">{dinhDangGiaMon(dish)}</strong>
          <span className="text-xs text-slate-400">#{dish.id}</span>
        </div>

        {meta.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {meta.tags.slice(0, 2).map((tag) => (
              <span key={`${dish.id}-${tag}`} className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                {tag}
              </span>
            ))}
            {meta.tags.length > 2 ? (
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">+{meta.tags.length - 2}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

function MonAnTab({ dishes, reloadDishes }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cheDoForm, setCheDoForm] = useState('create')
  const [idMonDangSua, setIdMonDangSua] = useState(null)
  const [formValues, setFormValues] = useState(taoFormMacDinh)
  const [loiForm, setLoiForm] = useState('')
  const [danhMucDangLoc, setDanhMucDangLoc] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadFileList, setUploadFileList] = useState([])
  const [dishMetaById, setDishMetaById] = useState({})

  const sortedDishes = useMemo(
    () => [...dishes].sort((firstDish, secondDish) => (Number(secondDish.id) || 0) - (Number(firstDish.id) || 0)),
    [dishes],
  )

  const filteredDishes = useMemo(() => {
    const normalizedQuery = chuanHoaChuoiTimKiem(searchQuery)

    return sortedDishes.filter((dish) => {
      if (danhMucDangLoc !== 'Tất cả' && chuanHoaDanhMucThucDon(dish.category) !== danhMucDangLoc) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return chuanHoaChuoiTimKiem(dish.name).includes(normalizedQuery)
    })
  }, [danhMucDangLoc, searchQuery, sortedDishes])

  const resetForm = () => {
    setCheDoForm('create')
    setIdMonDangSua(null)
    setFormValues(taoFormMacDinh())
    setUploadFileList([])
    setLoiForm('')
    setDrawerOpen(false)
  }

  const moDrawerTaoMoi = () => {
    setCheDoForm('create')
    setIdMonDangSua(null)
    setFormValues(taoFormMacDinh())
    setUploadFileList([])
    setLoiForm('')
    setDrawerOpen(true)
  }

  const handleInputChange = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  const handleSelectChange = (field) => (value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  const handleSwitchChange = (checked) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      isVisible: checked,
    }))
  }

  const handleUploadChange = ({ fileList }) => {
    const latestFileList = fileList.slice(-1).map((file) => {
      if (file.originFileObj) {
        return {
          ...file,
          url: URL.createObjectURL(file.originFileObj),
        }
      }

      return file
    })

    setUploadFileList(latestFileList)
    setFormValues((currentValues) => ({
      ...currentValues,
      image: latestFileList[0]?.url || latestFileList[0]?.thumbUrl || '',
    }))
  }

  const handleRemoveUpload = () => {
    setUploadFileList([])
    setFormValues((currentValues) => ({
      ...currentValues,
      image: '',
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

    const duLieuGuiDi = anhXaFormMonThanhDuLieuGuiDi({
      ...formValues,
      badge: formValues.tags[0] || formValues.badge,
    })

    try {
      const { duLieu: savedDish } = cheDoForm === 'edit'
        ? await capNhatMonApi(idMonDangSua, duLieuGuiDi)
        : await taoMonApi(duLieuGuiDi)

      if (!savedDish) {
        setLoiForm('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      const nextDishId = cheDoForm === 'edit' ? idMonDangSua : savedDish.id
      if (nextDishId !== undefined && nextDishId !== null) {
        setDishMetaById((currentMeta) => ({
          ...currentMeta,
          [nextDishId]: {
            ...(currentMeta[nextDishId] || {}),
            isVisible: formValues.isVisible,
            tags: formValues.tags,
          },
        }))
      }

      await reloadDishes?.()
      resetForm()
    } catch (error) {
      setLoiForm(error?.message || 'Không thể lưu món ăn. Vui lòng thử lại.')
    }
  }

  const handleEditDish = (dish) => {
    const nextMeta = layMetaMon(dish, dishMetaById)
    const nextFormValues = {
      ...anhXaMonThanhGiaTriForm(dish),
      isVisible: nextMeta.isVisible,
      tags: nextMeta.tags,
    }

    setCheDoForm('edit')
    setIdMonDangSua(dish.id)
    setFormValues(nextFormValues)
    setUploadFileList(taoUploadFileList(nextFormValues.image))
    setLoiForm('')
    setDrawerOpen(true)
  }

  const handleToggleVisibility = (dish) => {
    const currentMeta = layMetaMon(dish, dishMetaById)
    const nextVisible = !currentMeta.isVisible

    setDishMetaById((currentMetaById) => ({
      ...currentMetaById,
      [dish.id]: {
        ...(currentMetaById[dish.id] || {}),
        isVisible: nextVisible,
        tags: currentMeta.tags,
      },
    }))

    if (idMonDangSua === dish.id) {
      setFormValues((currentValues) => ({
        ...currentValues,
        isVisible: nextVisible,
      }))
    }
  }

  const handleDeleteDish = async () => {
    if (!idMonDangSua) {
      return
    }

    const currentDish = dishes.find((dish) => dish.id === idMonDangSua)
    const shouldDelete = window.confirm(`Xóa món "${currentDish?.name || 'này'}" khỏi menu?`)

    if (!shouldDelete) {
      return
    }

    try {
      const { duLieu: deletedDish } = await xoaMonApi(idMonDangSua)

      if (deletedDish === undefined) {
        setLoiForm('Không thể xóa món ăn. Vui lòng thử lại.')
        return
      }

      setDishMetaById((currentMeta) => {
        const nextMeta = { ...currentMeta }
        delete nextMeta[idMonDangSua]
        return nextMeta
      })

      await reloadDishes?.()
      resetForm()
    } catch (error) {
      setLoiForm(error?.message || 'Không thể xóa món ăn. Vui lòng thử lại.')
    }
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">POS Menu Studio</p>
              <h2 className="text-2xl font-bold text-slate-900">Danh sách món ăn</h2>
              <p className="text-sm text-slate-500">Tìm nhanh, lọc theo danh mục và điều khiển trạng thái hiển thị món theo chuẩn POS hiện đại.</p>
            </div>

            <div className="flex w-full flex-col gap-3 2xl:max-w-[920px] 2xl:flex-row 2xl:items-center 2xl:justify-end">
              <Search
                allowClear
                placeholder="Tìm tên món..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                enterButton={<SearchOutlined />}
                className="2xl:max-w-[280px]"
              />

              <Space size={[8, 12]} wrap>
                {CATEGORY_FILTERS.map((category) => (
                  <CheckableTag
                    key={category}
                    checked={danhMucDangLoc === category}
                    onChange={() => setDanhMucDangLoc(category)}
                    className={`!m-0 rounded-full border px-4 py-2 text-sm font-medium transition ${danhMucDangLoc === category ? '!border-orange-500 !bg-orange-500 !text-white' : '!border-slate-200 !bg-white !text-slate-600 hover:!border-orange-300 hover:!text-orange-500'}`}
                  >
                    {category}
                  </CheckableTag>
                ))}
              </Space>

              <Button type="primary" size="large" onClick={moDrawerTaoMoi} icon={<PlusOutlined />}>
                Thêm món mới
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="text-sm text-slate-500">
            Hiển thị <strong className="text-slate-900">{filteredDishes.length}</strong> / {dishes.length} món
          </div>

          {filteredDishes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12">
              <Empty description="Chưa có món ăn phù hợp với bộ lọc hiện tại." />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  meta={layMetaMon(dish, dishMetaById)}
                  onEdit={handleEditDish}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Drawer
        title={
          <div>
            <div className="text-lg font-semibold text-slate-900">{cheDoForm === 'edit' ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</div>
            <div className="text-sm text-slate-500">{cheDoForm === 'edit' ? `Đang chỉnh sửa món #${idMonDangSua}` : 'Tạo món mới với trải nghiệm quản trị premium ngay trong Drawer'}</div>
          </div>
        }
        placement="right"
        width={480}
        open={drawerOpen}
        onClose={resetForm}
        destroyOnClose={false}
        footer={
          <div className="flex items-center justify-between gap-3">
            <div>
              {cheDoForm === 'edit' ? (
                <Button danger onClick={handleDeleteDish}>
                  Xóa món
                </Button>
              ) : null}
            </div>

            <Space>
              <Button onClick={resetForm}>Hủy</Button>
              <Button form="mon-an-form" htmlType="submit" type="primary">
                {cheDoForm === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}
              </Button>
            </Space>
          </div>
        }
      >
        <form id="mon-an-form" className="space-y-4" onSubmit={handleSubmit}>
          {loiForm ? <Alert type="error" showIcon message={loiForm} /> : null}

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Ảnh món</span>
            <Upload
              accept="image/*"
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              fileList={uploadFileList}
              onChange={handleUploadChange}
              onRemove={handleRemoveUpload}
            >
              {uploadFileList.length >= 1 ? null : (
                <div>
                  <PictureOutlined className="text-lg text-slate-500" />
                  <div className="mt-2 text-xs font-medium text-slate-600">Tải ảnh lên</div>
                </div>
              )}
            </Upload>
            <p className="m-0 text-xs text-slate-400">UI upload demo sẵn sàng, chưa kết nối API upload thật.</p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Tên món</span>
            <Input size="middle" placeholder="Ví dụ: Cơm chiên hải sản" value={formValues.name} onChange={handleInputChange('name')} />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <TextArea size="middle" rows={4} placeholder="Mô tả ngắn về món ăn" value={formValues.description} onChange={handleInputChange('description')} />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Giá</span>
              <Input size="middle" placeholder="Ví dụ: 125.000đ" value={formValues.price} onChange={handleInputChange('price')} />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Danh mục</span>
              <Select
                size="middle"
                value={formValues.category}
                options={CATEGORY_OPTIONS.map((category) => ({ value: category, label: category }))}
                onChange={handleSelectChange('category')}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
            <div className="flex min-h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div>
                <div className="text-sm font-semibold text-slate-800">{formValues.isVisible ? 'Đang bán' : 'Tạm ẩn'}</div>
                <div className="text-xs text-slate-500">Điều khiển hiển thị món ngay trên grid POS</div>
              </div>
              <Switch checked={formValues.isVisible} onChange={handleSwitchChange} checkedChildren="Bật" unCheckedChildren="Ẩn" />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Tags</span>
            <Select
              mode="tags"
              size="middle"
              value={formValues.tags}
              options={TAG_OPTIONS.map((tag) => ({ value: tag, label: tag }))}
              placeholder="Best Seller, Món mới, Cay..."
              onChange={handleSelectChange('tags')}
              tokenSeparators={[',']}
            />
          </label>
        </form>
      </Drawer>
    </div>
  )
}

export default MonAnTab
