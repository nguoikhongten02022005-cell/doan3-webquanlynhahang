import { useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, PictureOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Badge, Button, Card, Col, Drawer, Empty, Form, Input, Row, Segmented, Select, Space, Switch, Tag, Typography, Upload } from 'antd'
import { CAC_DANH_MUC_CHUAN_THUC_DON, DANH_MUC_MAC_DINH_THUC_DON } from '../../thucDon/constants/danhMucThucDon'
import { NHAN_MAC_DINH_THUC_DON, SAC_DO_MAC_DINH_THUC_DON, ANH_DU_PHONG_THUC_DON } from '../../thucDon/constants/tuyChonThucDon'
import { taoMonApi, xoaMonApi, capNhatMonApi, uploadAnhMonApi } from '../../../services/api/apiThucDon'
import { anhXaFormMonThanhDuLieuGuiDi, anhXaMonThanhGiaTriForm, chuanHoaDanhMucThucDon } from '../../../services/mappers/anhXaThucDon'
import { phanTichGiaThanhSo } from '../../../utils/giaTien'

const { Search, TextArea } = Input
const { Title, Paragraph, Text } = Typography

const TAG_OPTIONS = ['Best Seller', 'Món mới', 'Cay', 'Chef Choice', 'Combo', 'Signature']
const CATEGORY_OPTIONS = CAC_DANH_MUC_CHUAN_THUC_DON
const CATEGORY_FILTERS = ['Tất cả', ...CATEGORY_OPTIONS]

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
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function dinhDangGiaMon(dish) {
  if (dish.price) return dish.price
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(dish.priceValue) || 0)
}

function taoUploadFileList(imageUrl) {
  if (!imageUrl) return []
  return [{ uid: 'dish-image', name: 'dish-image.png', status: 'done', url: imageUrl }]
}

function taoTagsMacDinh(mon) {
  const badge = String(mon?.badge ?? '').trim()
  if (!badge || badge === NHAN_MAC_DINH_THUC_DON) return []
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

function MonAnTab({ dishes, reloadDishes, cheDoChiXem = false }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cheDoForm, setCheDoForm] = useState('create')
  const [idMonDangSua, setIdMonDangSua] = useState(null)
  const [formValues, setFormValues] = useState(taoFormMacDinh)
  const [loiForm, setLoiForm] = useState('')
  const [danhMucDangLoc, setDanhMucDangLoc] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadFileList, setUploadFileList] = useState([])
  const [dangUploadAnh, setDangUploadAnh] = useState(false)
  const [dishMetaById, setDishMetaById] = useState({})

  const sortedDishes = useMemo(() => [...dishes].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [dishes])

  const filteredDishes = useMemo(() => {
    const normalizedQuery = chuanHoaChuoiTimKiem(searchQuery)
    return sortedDishes.filter((dish) => {
      if (danhMucDangLoc !== 'Tất cả' && chuanHoaDanhMucThucDon(dish.category) !== danhMucDangLoc) return false
      if (!normalizedQuery) return true
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
    if (cheDoChiXem) return

    setCheDoForm('create')
    setIdMonDangSua(null)
    setFormValues(taoFormMacDinh())
    setUploadFileList([])
    setLoiForm('')
    setDrawerOpen(true)
  }

  const handleInputChange = (field) => (event) => setFormValues((cur) => ({ ...cur, [field]: event.target.value }))
  const handleSelectChange = (field) => (value) => setFormValues((cur) => ({ ...cur, [field]: value }))
  const handleSwitchChange = (checked) => setFormValues((cur) => ({ ...cur, isVisible: checked }))

  const xuLyTaiAnhMon = async (tapTin) => {
    if (!tapTin) return false

    try {
      setDangUploadAnh(true)
      setLoiForm('')
      const { duLieu } = await uploadAnhMonApi(tapTin)
      const urlAnh = String(duLieu?.url || '').trim()

      if (!urlAnh) {
        throw new Error('Không nhận được URL ảnh từ máy chủ.')
      }

      const danhSachTapTinMoi = [{ uid: `dish-image-${Date.now()}`, name: tapTin.name || 'dish-image.png', status: 'done', url: urlAnh, thumbUrl: urlAnh }]
      setUploadFileList(danhSachTapTinMoi)
      setFormValues((cur) => ({ ...cur, image: urlAnh }))
    } catch (error) {
      setLoiForm(error?.message || 'Không thể tải ảnh món lên máy chủ.')
    } finally {
      setDangUploadAnh(false)
    }

    return false
  }

  const handleRemoveUpload = () => {
    setUploadFileList([])
    setFormValues((cur) => ({ ...cur, image: '' }))
  }

  const customUploadTrigger = uploadFileList.length >= 1
    ? <Button type="default" loading={dangUploadAnh}>Đổi ảnh</Button>
    : <div><PictureOutlined /><div style={{ marginTop: 8 }}>{dangUploadAnh ? 'Đang tải...' : 'Tải ảnh lên'}</div></div>

  const customUploadHint = uploadFileList.length >= 1
    ? 'Bấm "Đổi ảnh" để chọn ảnh mới cho món này.'
    : 'Ảnh được upload lên máy chủ và lưu URL ảnh qua API món ăn.'

  const validateForm = () => {
    if (!formValues.name.trim()) return 'Vui lòng nhập tên món.'
    if (!formValues.description.trim()) return 'Vui lòng nhập mô tả món.'
    if (!formValues.price.trim()) return 'Vui lòng nhập giá món.'
    if (!CATEGORY_OPTIONS.includes(chuanHoaDanhMucThucDon(formValues.category))) return 'Danh mục món ăn không hợp lệ.'
    if (phanTichGiaThanhSo(formValues.price) <= 0) return 'Giá món phải là số dương hợp lệ.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (cheDoChiXem) {
      setLoiForm('Bạn không có quyền cập nhật thực đơn.')
      return
    }

    const nextError = validateForm()
    if (nextError) {
      setLoiForm(nextError)
      return
    }

    const duLieuGuiDi = anhXaFormMonThanhDuLieuGuiDi({ ...formValues, badge: formValues.tags[0] || formValues.badge })

    try {
      const { duLieu: savedDish } = cheDoForm === 'edit' ? await capNhatMonApi(idMonDangSua, duLieuGuiDi) : await taoMonApi(duLieuGuiDi)
      if (!savedDish) {
        setLoiForm('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      const nextDishId = cheDoForm === 'edit' ? idMonDangSua : savedDish.id
      if (nextDishId !== undefined && nextDishId !== null) {
        setDishMetaById((currentMeta) => ({
          ...currentMeta,
          [nextDishId]: { ...(currentMeta[nextDishId] || {}), isVisible: formValues.isVisible, tags: formValues.tags },
        }))
      }

      await reloadDishes?.()
      resetForm()
    } catch (error) {
      setLoiForm(error?.message || 'Không thể lưu món ăn. Vui lòng thử lại.')
    }
  }

  const handleEditDish = (dish) => {
    if (cheDoChiXem) return

    const nextMeta = layMetaMon(dish, dishMetaById)
    const nextFormValues = { ...anhXaMonThanhGiaTriForm(dish), isVisible: nextMeta.isVisible, tags: nextMeta.tags }
    setCheDoForm('edit')
    setIdMonDangSua(dish.id)
    setFormValues(nextFormValues)
    setUploadFileList(taoUploadFileList(nextFormValues.image))
    setLoiForm('')
    setDrawerOpen(true)
  }

  const handleToggleVisibility = (dish) => {
    if (cheDoChiXem) return

    const currentMeta = layMetaMon(dish, dishMetaById)
    const nextVisible = !currentMeta.isVisible
    setDishMetaById((currentMetaById) => ({
      ...currentMetaById,
      [dish.id]: { ...(currentMetaById[dish.id] || {}), isVisible: nextVisible, tags: currentMeta.tags },
    }))
    if (idMonDangSua === dish.id) {
      setFormValues((currentValues) => ({ ...currentValues, isVisible: nextVisible }))
    }
  }

  const handleDeleteDish = async () => {
    if (cheDoChiXem || !idMonDangSua) return
    const currentDish = dishes.find((dish) => dish.id === idMonDangSua)
    if (!window.confirm(`Xóa món "${currentDish?.name || 'này'}" khỏi menu?`)) return

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
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} xl={8}>
            <Title level={3} style={{ margin: 0 }}>Danh sách món ăn</Title>
            <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>Tìm nhanh, lọc theo danh mục và điều khiển trạng thái hiển thị món theo chuẩn POS hiện đại.</Paragraph>
          </Col>
          <Col xs={24} xl={16}>
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Search allowClear placeholder="Tìm tên món..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} enterButton={<SearchOutlined />} style={{ width: 280 }} />
                {!cheDoChiXem ? <Button type="primary" icon={<PlusOutlined />} onClick={moDrawerTaoMoi}>Thêm món mới</Button> : null}
              </Space>
              <Segmented options={CATEGORY_FILTERS} value={danhMucDangLoc} onChange={setDanhMucDangLoc} block />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title={<span>Hiển thị <strong>{filteredDishes.length}</strong> / {dishes.length} món</span>}>
        {filteredDishes.length === 0 ? (
          <Empty description="Chưa có món ăn phù hợp với bộ lọc hiện tại." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredDishes.map((dish) => {
              const meta = layMetaMon(dish, dishMetaById)
              return (
                <Card
                  key={dish.id}
                  hoverable
                  cover={dish.image ? <img alt={dish.name} src={dish.image} style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} /> : <div style={{ aspectRatio: '1 / 1', display: 'grid', placeItems: 'center', background: '#f1f5f9' }}><PictureOutlined style={{ fontSize: 32, color: '#94a3b8' }} /></div>}
                  actions={cheDoChiXem ? undefined : [
                    <Button key={`sua-${dish.id}`} type="link" icon={<EditOutlined />} onClick={() => handleEditDish(dish)}>Sửa</Button>,
                    <Button key={`an-hien-${dish.id}`} type="link" icon={meta.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => handleToggleVisibility(dish)}>{meta.isVisible ? 'Ẩn' : 'Hiện'}</Button>,
                  ]}
                >
                  <Space orientation="vertical" size={10} style={{ width: '100%' }}>
                    <Space wrap>
                      <Tag color={meta.isVisible ? 'green' : 'red'}>{meta.isVisible ? 'Đang bán' : 'Tạm ẩn'}</Tag>
                      {dish.badge ? <Tag color="gold">{dish.badge}</Tag> : null}
                    </Space>
                    <Typography.Text type="secondary">{dish.category || 'Chưa phân loại'}</Typography.Text>
                    <Typography.Title level={5} style={{ margin: 0 }}>{dish.name}</Typography.Title>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Typography.Text strong style={{ color: '#ea580c', fontSize: 18 }}>{dinhDangGiaMon(dish)}</Typography.Text>
                      <Typography.Text type="secondary">#{dish.id}</Typography.Text>
                    </Space>
                    <Space wrap>
                      {meta.tags.slice(0, 2).map((tag) => <Tag key={`${dish.id}-${tag}`}>{tag}</Tag>)}
                      {meta.tags.length > 2 ? <Tag>+{meta.tags.length - 2}</Tag> : null}
                    </Space>
                  </Space>
                </Card>
              )
            })}
          </div>
        )}
      </Card>

      <Drawer
        title={cheDoForm === 'edit' ? `Cập nhật món #${idMonDangSua}` : 'Thêm món ăn mới'}
        placement="right"
        size={520}
        open={drawerOpen && !cheDoChiXem}
        onClose={resetForm}
        footer={<Space style={{ width: '100%', justifyContent: 'space-between' }}>{cheDoForm === 'edit' ? <Button danger onClick={handleDeleteDish}>Xóa món</Button> : <span />}{<Space><Button onClick={resetForm}>Hủy</Button><Button form="mon-an-form" htmlType="submit" type="primary">{cheDoForm === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}</Button></Space>}</Space>}
      >
        <Form id="mon-an-form" layout="vertical" onSubmitCapture={handleSubmit}>
          {loiForm ? <Alert type="error" showIcon title={loiForm} style={{ marginBottom: 16 }} /> : null}
          <Form.Item label="Ảnh món">
            <Upload
              accept="image/*"
              listType="picture-card"
              maxCount={1}
              beforeUpload={xuLyTaiAnhMon}
              fileList={uploadFileList}
              onRemove={handleRemoveUpload}
              disabled={dangUploadAnh}
            >
              {customUploadTrigger}
            </Upload>
            <Typography.Text type="secondary">{customUploadHint}</Typography.Text>
          </Form.Item>
          <Form.Item label="Tên món"><Input value={formValues.name} onChange={handleInputChange('name')} /></Form.Item>
          <Form.Item label="Mô tả"><TextArea rows={4} value={formValues.description} onChange={handleInputChange('description')} /></Form.Item>
          <Row gutter={12}>
            <Col span={12}><Form.Item label="Giá"><Input value={formValues.price} onChange={handleInputChange('price')} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Danh mục"><Select value={formValues.category} options={CATEGORY_OPTIONS.map((category) => ({ value: category, label: category }))} onChange={handleSelectChange('category')} /></Form.Item></Col>
          </Row>
          <Form.Item label="Trạng thái hiển thị"><Switch checked={formValues.isVisible} onChange={handleSwitchChange} checkedChildren="Bật" unCheckedChildren="Ẩn" /></Form.Item>
          <Form.Item label="Tags"><Select mode="tags" value={formValues.tags} options={TAG_OPTIONS.map((tag) => ({ value: tag, label: tag }))} onChange={handleSelectChange('tags')} tokenSeparators={[',']} /></Form.Item>
        </Form>
      </Drawer>
    </Space>
  )
}

export default MonAnTab
