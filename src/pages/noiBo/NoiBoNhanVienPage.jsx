import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Avatar, Card, Col, Grid, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const ROLE_LABELS = {
  admin: 'Quản lý',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
}

const TRANG_THAI_LABELS = {
  Active: { label: 'Đang hoạt động', color: 'success' },
  Inactive: { label: 'Tạm ngưng', color: 'default' },
  Banned: { label: 'Đã khóa', color: 'red' },
}

const ROLE_COLORS = {
  admin: 'red',
  staff: 'green',
  customer: 'default',
}

function NoiBoNhanVienPage() {
  const { danhSachTaiKhoan } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  const danhSachNhanVien = useMemo(
    () => danhSachTaiKhoan.filter((account) => account.role === 'admin' || account.role === 'staff'),
    [danhSachTaiKhoan],
  )

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
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Text className="noi-bo-dashboard-kicker">Nhân sự nội bộ</Typography.Text>
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: '4px 0 0' }}>Danh sách quản lý và nhân viên</Typography.Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="Tổng nhân sự nội bộ" value={danhSachNhanVien.length} prefix={<TeamOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Quản lý" value={danhSachNhanVien.filter((item) => item.role === 'admin').length} styles={{ content: { color: '#dc2626' } }} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Nhân viên vận hành" value={danhSachNhanVien.filter((item) => item.role === 'staff').length} styles={{ content: { color: '#16a34a' } }} /></Card></Col>
      </Row>

      <Card title="Danh sách nhân viên" extra={<Typography.Text type="secondary">API thêm/sửa nhân viên sẽ nối ở phase sau.</Typography.Text>}>
        <Table
          rowKey={(record) => String(record.id || record.maND || record.username || record.email || record.fullName)}
          columns={columns}
          dataSource={danhSachNhanVien}
          pagination={{ pageSize: 8, size: laMobile ? 'small' : 'default' }}
          scroll={{ x: 720 }}
        />
      </Card>
    </Space>
  )
}

export default NoiBoNhanVienPage
