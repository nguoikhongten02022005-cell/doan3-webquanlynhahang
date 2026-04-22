import { useMemo, useState } from 'react'
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined, PictureOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Drawer, Empty, Form, Input, Row, Segmented, Select, Space, Switch, Tag, Typography, Upload } from 'antd'
import { CAC_DANH_MUC_CHUAN_THUC_DON, DANH_MUC_MAC_DINH_THUC_DON } from '../../thucDon/constants/danhMucThucDon'
import { NHAN_MAC_DINH_THUC_DON, SAC_DO_MAC_DINH_THUC_DON } from '../../thucDon/constants/tuyChonThucDon'
import { taoMonApi, xoaMonApi, capNhatMonApi, uploadAnhMonApi } from '../../../services/api/apiThucDon'
import { anhXaFormMonThanhDuLieuGuiDi, anhXaMonThanhGiaTriForm, chuanHoaDanhMucThucDon } from '../../../services/mappers/anhXaThucDon'
import { phanTichGiaThanhSo } from '../../../utils/giaTien'

const { Search, TextArea } = Input
const { Title, Paragraph } = Typography

const TUY_CHON_NHAN = ['Best Seller', 'Món mới', 'Cay', 'Chef Choice', 'Combo', 'Signature']
const TUY_CHON_DANH_MUC = CAC_DANH_MUC_CHUAN_THUC_DON
const BO_LOC_DANH_MUC = ['Tất cả', ...TUY_CHON_DANH_MUC]

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

function dinhDangGiaMon(mon) {
  if (mon.price) return mon.price
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(mon.priceValue) || 0)
}

function taoDanhSachTapTinTaiLen(urlAnh) {
  if (!urlAnh) return []
  return [{ uid: 'dish-image', name: 'dish-image.png', status: 'done', url: urlAnh }]
}

function taoTagsMacDinh(mon) {
  const badge = String(mon?.badge ?? '').trim()
  if (!badge || badge === NHAN_MAC_DINH_THUC_DON) return []
  return [badge]
}

function suyRaTrangThaiHienThi(mon) {
  const giaTriTho = String(mon?.status ?? mon?.availability ?? mon?.visibilityStatus ?? '').trim().toLowerCase()
  return !['hidden', 'inactive', 'soldout', 'out_of_stock', 'tam_an', 'het_hang'].includes(giaTriTho)
}

function layTuyChinhMon(mon, tuyChinhMonTheoId) {
  const tuyChinhDaLuu = tuyChinhMonTheoId[mon.id] || {}
  return {
    isVisible: typeof tuyChinhDaLuu.isVisible === 'boolean' ? tuyChinhDaLuu.isVisible : suyRaTrangThaiHienThi(mon),
    tags: Array.isArray(tuyChinhDaLuu.tags) ? tuyChinhDaLuu.tags : taoTagsMacDinh(mon),
  }
}

function MonAnTab({ dishes: danhSachMonNguon, reloadDishes: taiLaiDanhSachMon, cheDoChiXem = false }) {
  const [nganKeoDangMo, datNganKeoDangMo] = useState(false)
  const [cheDoBieuMau, datCheDoBieuMau] = useState('create')
  const [idMonDangSua, datIdMonDangSua] = useState(null)
  const [giaTriBieuMau, datGiaTriBieuMau] = useState(taoFormMacDinh)
  const [loiBieuMau, datLoiBieuMau] = useState('')
  const [danhMucDangLoc, datDanhMucDangLoc] = useState('Tất cả')
  const [tuKhoaTimKiem, datTuKhoaTimKiem] = useState('')
  const [danhSachTapTinTaiLen, datDanhSachTapTinTaiLen] = useState([])
  const [dangTaiLenAnh, datDangTaiLenAnh] = useState(false)
  const [tuyChinhMonTheoId, datTuyChinhMonTheoId] = useState({})

  const danhSachMonSapXep = useMemo(() => [...danhSachMonNguon].sort((monA, monB) => (Number(monB.id) || 0) - (Number(monA.id) || 0)), [danhSachMonNguon])

  const danhSachMonDaLoc = useMemo(() => {
    const tuKhoaDaChuanHoa = chuanHoaChuoiTimKiem(tuKhoaTimKiem)
    return danhSachMonSapXep.filter((mon) => {
      if (danhMucDangLoc !== 'Tất cả' && chuanHoaDanhMucThucDon(mon.category) !== danhMucDangLoc) return false
      if (!tuKhoaDaChuanHoa) return true
      return chuanHoaChuoiTimKiem(mon.name).includes(tuKhoaDaChuanHoa)
    })
  }, [danhMucDangLoc, tuKhoaTimKiem, danhSachMonSapXep])

  const datLaiBieuMau = () => {
    datCheDoBieuMau('create')
    datIdMonDangSua(null)
    datGiaTriBieuMau(taoFormMacDinh())
    datDanhSachTapTinTaiLen([])
    datLoiBieuMau('')
    datNganKeoDangMo(false)
  }

  const moNganKeoTaoMoi = () => {
    if (cheDoChiXem) return

    datCheDoBieuMau('create')
    datIdMonDangSua(null)
    datGiaTriBieuMau(taoFormMacDinh())
    datDanhSachTapTinTaiLen([])
    datLoiBieuMau('')
    datNganKeoDangMo(true)
  }

  const xuLyDoiTruongNhap = (truong) => (event) => datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, [truong]: event.target.value }))
  const xuLyDoiLuaChon = (truong) => (giaTri) => datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, [truong]: giaTri }))
  const xuLyDoiCongTac = (duocBat) => datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, isVisible: duocBat }))

  const xuLyTaiLenAnhMon = async (tapTin) => {
    if (!tapTin) return false

    try {
      datDangTaiLenAnh(true)
      datLoiBieuMau('')
      const { duLieu } = await uploadAnhMonApi(tapTin)
      const urlAnh = String(duLieu?.url || '').trim()

      if (!urlAnh) {
        throw new Error('Không nhận được URL ảnh từ máy chủ.')
      }

      const danhSachTapTinMoi = [{ uid: `dish-image-${Date.now()}`, name: tapTin.name || 'dish-image.png', status: 'done', url: urlAnh, thumbUrl: urlAnh }]
      datDanhSachTapTinTaiLen(danhSachTapTinMoi)
      datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, image: urlAnh }))
    } catch (error) {
      datLoiBieuMau(error?.message || 'Không thể tải ảnh món lên máy chủ.')
    } finally {
      datDangTaiLenAnh(false)
    }

    return false
  }

  const xuLyXoaAnhDaTai = () => {
    datDanhSachTapTinTaiLen([])
    datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, image: '' }))
  }

  const nutTaiAnh = danhSachTapTinTaiLen.length >= 1
    ? <Button type="default" loading={dangTaiLenAnh}>Đổi ảnh</Button>
    : <div><PictureOutlined /><div style={{ marginTop: 8 }}>{dangTaiLenAnh ? 'Đang tải...' : 'Tải ảnh lên'}</div></div>

  const goiYTaiAnh = danhSachTapTinTaiLen.length >= 1
    ? 'Bấm "Đổi ảnh" để chọn ảnh mới cho món này.'
    : 'Ảnh được upload lên máy chủ và lưu URL ảnh qua API món ăn.'

  const kiemTraBieuMau = () => {
    if (!giaTriBieuMau.name.trim()) return 'Vui lòng nhập tên món.'
    if (!giaTriBieuMau.description.trim()) return 'Vui lòng nhập mô tả món.'
    if (!giaTriBieuMau.price.trim()) return 'Vui lòng nhập giá món.'
    if (!TUY_CHON_DANH_MUC.includes(chuanHoaDanhMucThucDon(giaTriBieuMau.category))) return 'Danh mục món ăn không hợp lệ.'
    if (phanTichGiaThanhSo(giaTriBieuMau.price) <= 0) return 'Giá món phải là số dương hợp lệ.'
    return ''
  }

  const xuLyGuiBieuMau = async (event) => {
    event.preventDefault()

    if (cheDoChiXem) {
      datLoiBieuMau('Bạn không có quyền cập nhật thực đơn.')
      return
    }

    const loiKeTiep = kiemTraBieuMau()
    if (loiKeTiep) {
      datLoiBieuMau(loiKeTiep)
      return
    }

    const duLieuGuiDi = anhXaFormMonThanhDuLieuGuiDi({ ...giaTriBieuMau, badge: giaTriBieuMau.tags[0] || giaTriBieuMau.badge })

    try {
      const { duLieu: monDaLuu } = cheDoBieuMau === 'edit' ? await capNhatMonApi(idMonDangSua, duLieuGuiDi) : await taoMonApi(duLieuGuiDi)
      if (!monDaLuu) {
        datLoiBieuMau('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      const idMonKeTiep = cheDoBieuMau === 'edit' ? idMonDangSua : monDaLuu.id
      if (idMonKeTiep !== undefined && idMonKeTiep !== null) {
        datTuyChinhMonTheoId((tuyChinhHienTai) => ({
          ...tuyChinhHienTai,
          [idMonKeTiep]: { ...(tuyChinhHienTai[idMonKeTiep] || {}), isVisible: giaTriBieuMau.isVisible, tags: giaTriBieuMau.tags },
        }))
      }

      await taiLaiDanhSachMon?.()
      datLaiBieuMau()
    } catch (error) {
      datLoiBieuMau(error?.message || 'Không thể lưu món ăn. Vui lòng thử lại.')
    }
  }

  const xuLySuaMon = (mon) => {
    if (cheDoChiXem) return

    const tuyChinhKeTiep = layTuyChinhMon(mon, tuyChinhMonTheoId)
    const giaTriBieuMauKeTiep = { ...anhXaMonThanhGiaTriForm(mon), isVisible: tuyChinhKeTiep.isVisible, tags: tuyChinhKeTiep.tags }
    datCheDoBieuMau('edit')
    datIdMonDangSua(mon.id)
    datGiaTriBieuMau(giaTriBieuMauKeTiep)
    datDanhSachTapTinTaiLen(taoDanhSachTapTinTaiLen(giaTriBieuMauKeTiep.image))
    datLoiBieuMau('')
    datNganKeoDangMo(true)
  }

  const xuLyBatTatHienThi = (mon) => {
    if (cheDoChiXem) return

    const tuyChinhHienTai = layTuyChinhMon(mon, tuyChinhMonTheoId)
    const hienThiKeTiep = !tuyChinhHienTai.isVisible
    datTuyChinhMonTheoId((tuyChinhHienTaiTheoId) => ({
      ...tuyChinhHienTaiTheoId,
      [mon.id]: { ...(tuyChinhHienTaiTheoId[mon.id] || {}), isVisible: hienThiKeTiep, tags: tuyChinhHienTai.tags },
    }))
    if (idMonDangSua === mon.id) {
      datGiaTriBieuMau((giaTriHienTai) => ({ ...giaTriHienTai, isVisible: hienThiKeTiep }))
    }
  }

  const xuLyXoaMon = async () => {
    if (cheDoChiXem || !idMonDangSua) return
    const monHienTai = danhSachMonNguon.find((mon) => mon.id === idMonDangSua)
    if (!window.confirm(`Xóa món "${monHienTai?.name || 'này'}" khỏi menu?`)) return

    try {
      const { duLieu: monDaXoa } = await xoaMonApi(idMonDangSua)
      if (monDaXoa === undefined) {
        datLoiBieuMau('Không thể xóa món ăn. Vui lòng thử lại.')
        return
      }
      datTuyChinhMonTheoId((tuyChinhHienTai) => {
        const tuyChinhKeTiep = { ...tuyChinhHienTai }
        delete tuyChinhKeTiep[idMonDangSua]
        return tuyChinhKeTiep
      })
      await taiLaiDanhSachMon?.()
      datLaiBieuMau()
    } catch (error) {
      datLoiBieuMau(error?.message || 'Không thể xóa món ăn. Vui lòng thử lại.')
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
                <Search allowClear placeholder="Tìm tên món..." value={tuKhoaTimKiem} onChange={(event) => datTuKhoaTimKiem(event.target.value)} enterButton={<SearchOutlined />} style={{ width: 280 }} />
                {!cheDoChiXem ? <Button type="primary" icon={<PlusOutlined />} onClick={moNganKeoTaoMoi}>Thêm món mới</Button> : null}
              </Space>
              <Segmented options={BO_LOC_DANH_MUC} value={danhMucDangLoc} onChange={datDanhMucDangLoc} block />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title={<span>Hiển thị <strong>{danhSachMonDaLoc.length}</strong> / {danhSachMonNguon.length} món</span>}>
        {danhSachMonDaLoc.length === 0 ? (
          <Empty description="Chưa có món ăn phù hợp với bộ lọc hiện tại." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {danhSachMonDaLoc.map((mon) => {
              const tuyChinhMon = layTuyChinhMon(mon, tuyChinhMonTheoId)
              return (
                <Card
                  key={mon.id}
                  hoverable
                  cover={mon.image ? <img alt={mon.name} src={mon.image} style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} /> : <div style={{ aspectRatio: '1 / 1', display: 'grid', placeItems: 'center', background: '#f1f5f9' }}><PictureOutlined style={{ fontSize: 32, color: '#94a3b8' }} /></div>}
                  actions={cheDoChiXem ? undefined : [
                    <Button key={`sua-${mon.id}`} type="link" icon={<EditOutlined />} onClick={() => xuLySuaMon(mon)}>Sửa</Button>,
                    <Button key={`an-hien-${mon.id}`} type="link" icon={tuyChinhMon.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => xuLyBatTatHienThi(mon)}>{tuyChinhMon.isVisible ? 'Ẩn' : 'Hiện'}</Button>,
                  ]}
                >
                  <Space orientation="vertical" size={10} style={{ width: '100%' }}>
                    <Space wrap>
                      <Tag color={tuyChinhMon.isVisible ? 'green' : 'red'}>{tuyChinhMon.isVisible ? 'Đang bán' : 'Tạm ẩn'}</Tag>
                      {mon.badge ? <Tag color="gold">{mon.badge}</Tag> : null}
                    </Space>
                    <Typography.Text type="secondary">{mon.category || 'Chưa phân loại'}</Typography.Text>
                    <Typography.Title level={5} style={{ margin: 0 }}>{mon.name}</Typography.Title>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Typography.Text strong style={{ color: '#ea580c', fontSize: 18 }}>{dinhDangGiaMon(mon)}</Typography.Text>
                      <Typography.Text type="secondary">#{mon.id}</Typography.Text>
                    </Space>
                    <Space wrap>
                      {tuyChinhMon.tags.slice(0, 2).map((tag) => <Tag key={`${mon.id}-${tag}`}>{tag}</Tag>)}
                      {tuyChinhMon.tags.length > 2 ? <Tag>+{tuyChinhMon.tags.length - 2}</Tag> : null}
                    </Space>
                  </Space>
                </Card>
              )
            })}
          </div>
        )}
      </Card>

      <Drawer
        title={cheDoBieuMau === 'edit' ? `Cập nhật món #${idMonDangSua}` : 'Thêm món ăn mới'}
        placement="right"
        size={520}
        open={nganKeoDangMo && !cheDoChiXem}
        onClose={datLaiBieuMau}
        footer={<Space style={{ width: '100%', justifyContent: 'space-between' }}>{cheDoBieuMau === 'edit' ? <Button danger onClick={xuLyXoaMon}>Xóa món</Button> : <span />}{<Space><Button onClick={datLaiBieuMau}>Hủy</Button><Button form="mon-an-form" htmlType="submit" type="primary">{cheDoBieuMau === 'edit' ? 'Lưu cập nhật' : 'Thêm món'}</Button></Space>}</Space>}
      >
        <Form id="mon-an-form" layout="vertical" onSubmitCapture={xuLyGuiBieuMau}>
          {loiBieuMau ? <Alert type="error" showIcon title={loiBieuMau} style={{ marginBottom: 16 }} /> : null}
          <Form.Item label="Ảnh món">
            <Upload
              accept="image/*"
              listType="picture-card"
              maxCount={1}
              beforeUpload={xuLyTaiLenAnhMon}
              fileList={danhSachTapTinTaiLen}
              onRemove={xuLyXoaAnhDaTai}
              disabled={dangTaiLenAnh}
            >
              {nutTaiAnh}
            </Upload>
            <Typography.Text type="secondary">{goiYTaiAnh}</Typography.Text>
          </Form.Item>
          <Form.Item label="Tên món"><Input value={giaTriBieuMau.name} onChange={xuLyDoiTruongNhap('name')} /></Form.Item>
          <Form.Item label="Mô tả"><TextArea rows={4} value={giaTriBieuMau.description} onChange={xuLyDoiTruongNhap('description')} /></Form.Item>
          <Row gutter={12}>
            <Col span={12}><Form.Item label="Giá"><Input value={giaTriBieuMau.price} onChange={xuLyDoiTruongNhap('price')} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Danh mục"><Select value={giaTriBieuMau.category} options={TUY_CHON_DANH_MUC.map((danhMuc) => ({ value: danhMuc, label: danhMuc }))} onChange={xuLyDoiLuaChon('category')} /></Form.Item></Col>
          </Row>
          <Form.Item label="Trạng thái hiển thị"><Switch checked={giaTriBieuMau.isVisible} onChange={xuLyDoiCongTac} checkedChildren="Bật" unCheckedChildren="Ẩn" /></Form.Item>
          <Form.Item label="Tags"><Select mode="tags" value={giaTriBieuMau.tags} options={TUY_CHON_NHAN.map((tag) => ({ value: tag, label: tag }))} onChange={xuLyDoiLuaChon('tags')} tokenSeparators={[',']} /></Form.Item>
        </Form>
      </Drawer>
    </Space>
  )
}

export default MonAnTab
