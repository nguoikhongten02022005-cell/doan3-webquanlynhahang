import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Avatar, Button, Card, Col, Form, Grid, Input, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const ROLE_LABELS = {
  admin: 'Quản lý',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
}

const VAI_TRO_TUY_CHON = [
  { label: 'Quản lý', value: 'Admin' },
  { label: 'Nhân viên', value: 'NhanVien' },
]

const TRANG_THAI_LABELS = {
  Active: { label: 'Đang hoạt động', color: 'success' },
  Inactive: { label: 'Tạm ngưng', color: 'default' },
  Banned: { label: 'Đã khóa', color: 'red' },
}

const TRANG_THAI_TUY_CHON = [
  { label: 'Đang hoạt động', value: 'Active' },
  { label: 'Tạm ngưng', value: 'Inactive' },
]

const ROLE_COLORS = {
  admin: 'red',
  staff: 'green',
  customer: 'default',
}

function NoiBoNhanVienPage() {
  const {
    danhSachTaiKhoan,
    xuLyTaoNguoiDungNoiBo,
    xuLyCapNhatNguoiDungNoiBo,
    xuLyXoaNguoiDungNoiBo,
  } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md
  const [dangMoForm, setDangMoForm] = useState(false)
  const [taiKhoanDangSua, setTaiKhoanDangSua] = useState(null)
  const [dangLuu, setDangLuu] = useState(false)
  const [form] = Form.useForm()

  const danhSachNhanVien = useMemo(
    () => danhSachTaiKhoan.filter((account) => account.role === 'admin' || account.role === 'staff'),
    [danhSachTaiKhoan],
  )

  const dongForm = () => {
    setTaiKhoanDangSua(null)
    setDangMoForm(false)
    form.resetFields()
  }

  const moFormTao = () => {
    setTaiKhoanDangSua(null)
    form.setFieldsValue({
      hoTen: '',
      email: '',
      soDienThoai: '',
      vaiTro: 'NhanVien',
      trangThai: 'Active',
      chucVu: '',
      matKhau: '',
      xacNhanMatKhau: '',
    })
    setDangMoForm(true)
  }

  const moFormSua = (taiKhoan) => {
    setTaiKhoanDangSua(taiKhoan)
    form.setFieldsValue({
      hoTen: taiKhoan.fullName || '',
      email: taiKhoan.email || '',
      soDienThoai: taiKhoan.phone || '',
      vaiTro: taiKhoan.role === 'admin' ? 'Admin' : 'NhanVien',
      trangThai: taiKhoan.trangThai || 'Active',
      chucVu: taiKhoan.chucVu || '',
      matKhau: '',
      xacNhanMatKhau: '',
    })
    setDangMoForm(true)
  }

  const luuNhanVien = async (values) => {
    try {
      setDangLuu(true)
      if (taiKhoanDangSua?.maND) {
        await xuLyCapNhatNguoiDungNoiBo(taiKhoanDangSua.maND, values)
      } else {
        await xuLyTaoNguoiDungNoiBo(values)
      }
      dongForm()
    } finally {
      setDangLuu(false)
    }
  }

  const xuLyXoa = async (taiKhoan) => {
    await xuLyXoaNguoiDungNoiBo(taiKhoan.maND)
  }

  const columns = [
    {
      title: 'Nhân sự',
      key: 'fullName',
      render: (_, account) => (
        <Space size={12} align="start">
          <Avatar icon={<UserOutlined />} style={{ background: account.role === 'admin' ? '#f97316' : '#22c55e' }} />
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong>{account.fullName || account.username || 'Chưa cập nhật'}</Typography.Text>
            <div><Typography.Text type="secondary" ellipsis>{account.username || '--'}</Typography.Text></div>
          </div>
        </Space>
      ),
    },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (value) => <Tag color={ROLE_COLORS[value] || 'default'}>{ROLE_LABELS[value] || value}</Tag> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (value) => value || '--' },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, account) => {
        const trangThai = TRANG_THAI_LABELS[account.trangThai] || { label: account.trangThai || 'Không rõ', color: 'default' }
        return <Tag color={trangThai.color}>{trangThai.label}</Tag>
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, account) => (
        <Space wrap>
          <Button onClick={() => moFormSua(account)}>Sửa</Button>
          <Popconfirm
            title="Xóa nhân viên này?"
            description="Thao tác này không thể hoàn tác."
            onConfirm={() => xuLyXoa(account)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: 0 }}>Danh sách quản lý và nhân viên</Typography.Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="Tổng nhân sự nội bộ" value={danhSachNhanVien.length} prefix={<TeamOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Quản lý" value={danhSachNhanVien.filter((item) => item.role === 'admin').length} styles={{ content: { color: '#dc2626' } }} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Nhân viên vận hành" value={danhSachNhanVien.filter((item) => item.role === 'staff').length} styles={{ content: { color: '#16a34a' } }} /></Card></Col>
      </Row>

      <Card title="Danh sách nhân viên" extra={<Button type="primary" icon={<PlusOutlined />} onClick={moFormTao}>Thêm nhân viên</Button>}>
        <Table
          rowKey={(record) => String(record.id || record.maND || record.username || record.email || record.fullName)}
          columns={columns}
          dataSource={danhSachNhanVien}
          pagination={{ pageSize: 8, size: laMobile ? 'small' : 'default' }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        open={dangMoForm}
        title={taiKhoanDangSua ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
        onCancel={dongForm}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={luuNhanVien}>
          <Form.Item label="Họ tên" name="hoTen" rules={[{ required: true, message: 'Vui lòng nhập họ tên.' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email.' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="soDienThoai">
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="vaiTro" rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}>
            <Select options={VAI_TRO_TUY_CHON} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}>
            <Select options={TRANG_THAI_TUY_CHON} />
          </Form.Item>
          <Form.Item label="Chức vụ" name="chucVu">
            <Input placeholder="Ví dụ: Quản lý ca, Thu ngân" />
          </Form.Item>
          <Form.Item label={taiKhoanDangSua ? 'Mật khẩu mới' : 'Mật khẩu'} name="matKhau" rules={taiKhoanDangSua ? [] : [{ required: true, message: 'Vui lòng nhập mật khẩu.' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={taiKhoanDangSua ? 'Xác nhận mật khẩu mới' : 'Xác nhận mật khẩu'}
            name="xacNhanMatKhau"
            dependencies={['matKhau']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const matKhau = getFieldValue('matKhau')
                  if (!matKhau && !value) return Promise.resolve()
                  if (value === matKhau) return Promise.resolve()
                  return Promise.reject(new Error('Xác nhận mật khẩu không khớp.'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={dongForm}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={dangLuu}>{taiKhoanDangSua ? 'Lưu cập nhật' : 'Tạo nhân viên'}</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  )
}

export default NoiBoNhanVienPage
