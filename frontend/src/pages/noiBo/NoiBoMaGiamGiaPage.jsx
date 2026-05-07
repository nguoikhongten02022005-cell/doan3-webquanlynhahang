import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { dinhDangNgay } from '../../features/noiBo/dinhDang.js'
import {
  layDanhSachMaGiamGiaApi,
  taoMaGiamGiaApi,
  capNhatMaGiamGiaApi,
  xoaMaGiamGiaApi,
} from '../../services/api/apiMaGiamGia'

const { Title } = Typography
const { RangePicker } = DatePicker

const TRANG_THAI_OPTIONS = [
  { value: 'Active', label: 'Hoạt động' },
  { value: 'Inactive', label: 'Tạm tắt' },
  { value: 'HetHan', label: 'Hết hạn' },
]

const LOAI_GIAM_OPTIONS = [
  { value: 'PhanTram', label: 'Phần trăm (%)' },
  { value: 'SoTien', label: 'Số tiền (VNĐ)' },
]

const CHON_TRANG_THAI = {
  Active: { color: 'green', text: 'Hoạt động' },
  Inactive: { color: 'orange', text: 'Tạm tắt' },
  HetHan: { color: 'red', text: 'Hết hạn' },
}

function taoFormMacDinh() {
  return {
    maCode: '',
    tenCode: '',
    giaTri: 0,
    loaiGiam: 'PhanTram',
    giaTriToiDa: null,
    donHangToiThieu: 0,
    ngayApDung: null,
    soLanToiDa: null,
    trangThai: 'Active',
  }
}

function chuanHoaDuLieuForm(ma) {
  if (!ma) return taoFormMacDinh()
  return {
    ...ma,
    ngayApDung: ma.ngayBatDau && ma.ngayKetThuc ? [dayjs(ma.ngayBatDau), dayjs(ma.ngayKetThuc)] : null,
  }
}

function chuanHoaDuLieuGuiDi(giaTri) {
  const ngayApDung = Array.isArray(giaTri.ngayApDung) ? giaTri.ngayApDung : []
  return {
    ...giaTri,
    ngayBatDau: ngayApDung[0] ? ngayApDung[0].format('YYYY-MM-DD') : null,
    ngayKetThuc: ngayApDung[1] ? ngayApDung[1].format('YYYY-MM-DD') : null,
  }
}

function dinhDangGia(giaTri, loaiGiam) {
  if (loaiGiam === 'PhanTram') {
    return `${Number(giaTri || 0)}%`
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(giaTri || 0))
}

function NoiBoMaGiamGiaPage() {
  const [danhSach, datDanhSach] = useState([])
  const [dangTai, datDangTai] = useState(false)
  const [dangXuLy, datDangXuLy] = useState(false)
  const [nganKeoDangMo, datNganKeoDangMo] = useState(false)
  const [cheDoBieuMau, datCheDoBieuMau] = useState('create')
  const [maDangSua, datMaDangSua] = useState(null)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const taiDanhSach = async () => {
    datDangTai(true)
    try {
      const phanHoi = await layDanhSachMaGiamGiaApi()
      datDanhSach(Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu : [])
    } catch (loi) {
      messageApi.error(loi?.message || 'Khong the tai danh sach ma giam gia.')
    } finally {
      datDangTai(false)
    }
  }

  useEffect(() => {
    taiDanhSach()
  }, [])

  const datLaiBieuMau = () => {
    datCheDoBieuMau('create')
    datMaDangSua(null)
    form.resetFields()
    datNganKeoDangMo(false)
  }

  const moNganKeoTaoMoi = () => {
    datLaiBieuMau()
    datCheDoBieuMau('create')
    datNganKeoDangMo(true)
  }

  const moNganKeoSua = (record) => {
    datCheDoBieuMau('edit')
    datMaDangSua(record.maCode)
    const duLieu = chuanHoaDuLieuForm(record)
    form.setFieldsValue(duLieu)
    datNganKeoDangMo(true)
  }

  const xuLyLuu = async () => {
    try {
      const giaTri = await form.validateFields()
      datDangXuLy(true)
      const duLieuGui = chuanHoaDuLieuGuiDi(giaTri)

      if (cheDoBieuMau === 'create') {
        await taoMaGiamGiaApi(duLieuGui)
        messageApi.success('Tao ma giam gia thanh cong.')
      } else {
        await capNhatMaGiamGiaApi(maDangSua, duLieuGui)
        messageApi.success('Cap nhat ma giam gia thanh cong.')
      }

      datLaiBieuMau()
      taiDanhSach()
    } catch (loi) {
      if (loi?.errorFields) return
      messageApi.error(loi?.message || 'Da xay ra loi khi luu.')
    } finally {
      datDangXuLy(false)
    }
  }

  const xuLyXoa = (record) => {
    Modal.confirm({
      title: 'Xac nhan xoa',
      content: `Ban co chan muon xoa ma giam gia "${record.tenCode}" (${record.maCode}) khong?`,
      okText: 'Xoa',
      okType: 'danger',
      cancelText: 'Huy',
      onOk: async () => {
        try {
          await xoaMaGiamGiaApi(record.maCode)
          messageApi.success('Xoa ma giam gia thanh cong.')
          taiDanhSach()
        } catch (loi) {
          messageApi.error(loi?.message || 'Da xay ra loi khi xoa.')
        }
      },
    })
  }

  const cotBang = useMemo(
    () => [
      {
        title: 'Ma code',
        dataIndex: 'maCode',
        key: 'maCode',
        width: 140,
        fixed: 'left',
        render: (val) => <code style={{ fontSize: 12 }}>{val}</code>,
      },
      {
        title: 'Ten ma',
        dataIndex: 'tenCode',
        key: 'tenCode',
        width: 200,
        ellipsis: true,
      },
      {
        title: 'Loai giam',
        dataIndex: 'loaiGiam',
        key: 'loaiGiam',
        width: 130,
        render: (val) => LOAI_GIAM_OPTIONS.find((o) => o.value === val)?.label || val,
      },
      {
        title: 'Gia tri',
        dataIndex: 'giaTri',
        key: 'giaTri',
        width: 110,
        align: 'right',
        render: (giaTri, record) => dinhDangGia(giaTri, record.loaiGiam),
      },
      {
        title: 'Giam toi da',
        dataIndex: 'giaTriToiDa',
        key: 'giaTriToiDa',
        width: 130,
        align: 'right',
        render: (val, record) =>
          record.loaiGiam === 'PhanTram' && val != null
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(val))
            : '--',
      },
      {
        title: 'Don toi thieu',
        dataIndex: 'donHangToiThieu',
        key: 'donHangToiThieu',
        width: 130,
        align: 'right',
        render: (val) =>
          val > 0
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(val))
            : '--',
      },
      {
        title: 'Ngay ap dung',
        key: 'ngayApDung',
        width: 160,
        render: (_, record) =>
          record.ngayBatDau && record.ngayKetThuc
            ? `${dinhDangNgay(record.ngayBatDau)} - ${dinhDangNgay(record.ngayKetThuc)}`
            : '--',
      },
      {
        title: 'Luot dung',
        key: 'luotDung',
        width: 110,
        align: 'center',
        render: (_, record) => {
          const daDung = Number(record.soLanDaDung || 0)
          const toiDa = record.soLanToiDa
          return toiDa != null ? `${daDung} / ${toiDa}` : `${daDung}`
        },
      },
      {
        title: 'Trang thai',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 110,
        render: (val) => {
          const tt = CHON_TRANG_THAI[val] || { color: 'default', text: val }
          return <Tag color={tt.color}>{tt.text}</Tag>
        },
      },
      {
        title: 'Thao tac',
        key: 'thaoTac',
        width: 110,
        fixed: 'right',
        render: (_, record) => (
          <Space size={4}>
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => moNganKeoSua(record)} />
            <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => xuLyXoa(record)} />
          </Space>
        ),
      },
    ],
    [],
  )

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      {contextHolder}
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>Quan ly ma giam gia</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={moNganKeoTaoMoi}>
            Them ma moi
          </Button>
        </Space>
      </Space>

      {danhSach.length === 0 && !dangTai ? (
        <Alert
          type="info"
          showIcon
          message="Chua co ma giam gia nao."
          description="Nhan 'Them ma moi' de tao ma giam gia dau tien."
        />
      ) : (
        <Table
          columns={cotBang}
          dataSource={danhSach}
          rowKey="maCode"
          loading={dangTai}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (tong) => `Tong ${tong} ma` }}
        />
      )}

      <Drawer
        title={cheDoBieuMau === 'create' ? 'Tao ma giam gia moi' : `Sua ma giam gia: ${maDangSua}`}
        placement="right"
        size={480}
        open={nganKeoDangMo}
        onClose={datLaiBieuMau}
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={datLaiBieuMau}>Huy</Button>
            <Button type="primary" loading={dangXuLy} onClick={xuLyLuu}>
              {cheDoBieuMau === 'create' ? 'Tao ma' : 'Luu thay doi'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maCode"
            label="Ma code"
            rules={[{ required: true, message: 'Vui long nhap ma code.' }]}
          >
            <Input
              placeholder="VD: SUMMER2025"
              disabled={cheDoBieuMau === 'edit'}
              maxLength={50}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="tenCode"
            label="Ten ma giam gia"
            rules={[{ required: true, message: 'Vui long nhap ten ma giam gia.' }]}
          >
            <Input placeholder="VD: Giam gia mua he 2025" maxLength={100} showCount />
          </Form.Item>

          <Form.Item name="loaiGiam" label="Loai giam" rules={[{ required: true }]}>
            <Select options={LOAI_GIAM_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="giaTri"
            label="Gia tri giam"
            rules={[{ required: true, message: 'Vui long nhap gia tri giam.' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>

          <Form.Item name="giaTriToiDa" label="Giam toi da (VND)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="De trong = khong gioi han" />
          </Form.Item>

          <Form.Item name="donHangToiThieu" label="Don hang toi thieu (VND)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0 = khong yeu cau" />
          </Form.Item>

          <Form.Item
            name="ngayApDung"
            label="Ngay ap dung"
            rules={[{ required: true, message: 'Vui long chon ngay ap dung.' }]}
          >
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="soLanToiDa" label="So lan su dung toi da">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="De trong = khong gioi han" />
          </Form.Item>

          <Form.Item name="trangThai" label="Trang thai" rules={[{ required: true }]}>
            <Select options={TRANG_THAI_OPTIONS} />
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  )
}

export default NoiBoMaGiamGiaPage