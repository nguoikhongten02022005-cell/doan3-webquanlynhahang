import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Avatar, Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'

const ROLE_LABELS = {
  admin: 'Quản lý',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
}

const ROLE_COLORS = {
  admin: 'red',
  staff: 'green',
  customer: 'default',
}

function AdminNhanVienPage() {
  const { danhSachTaiKhoan } = useOutletContext()

  const danhSachNhanVien = useMemo(
    () => danhSachTaiKhoan.filter((account) => account.role === 'admin' || account.role === 'staff'),
    [danhSachTaiKhoan],
  )

  const columns = [
    {
      title: 'Nhân sự',
      key: 'fullName',
      render: (_, account) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: account.role === 'admin' ? '#f97316' : '#22c55e' }} />
          <div>
            <Typography.Text strong>{account.fullName || account.username || 'Chưa cập nhật'}</Typography.Text>
            <div><Typography.Text type="secondary">{account.username || '--'}</Typography.Text></div>
          </div>
        </Space>
      ),
    },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (value) => <Tag color={ROLE_COLORS[value] || 'default'}>{ROLE_LABELS[value] || value}</Tag> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (value) => value || '--' },
    { title: 'Trạng thái', key: 'status', render: () => <Tag color="success">Đang hoạt động</Tag> },
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="Tổng nhân sự nội bộ" value={danhSachNhanVien.length} prefix={<TeamOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Quản lý" value={danhSachNhanVien.filter((item) => item.role === 'admin').length} valueStyle={{ color: '#dc2626' }} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Nhân viên vận hành" value={danhSachNhanVien.filter((item) => item.role === 'staff').length} valueStyle={{ color: '#16a34a' }} /></Card></Col>
      </Row>

      <Card title="Danh sách nhân viên" extra={<Typography.Text type="secondary">API thêm/sửa nhân viên sẽ nối ở phase sau.</Typography.Text>}>
        <Table rowKey={(record, index) => `${record.username}-${index}`} columns={columns} dataSource={danhSachNhanVien} pagination={{ pageSize: 8 }} />
      </Card>
    </Space>
  )
}

export default AdminNhanVienPage
