import { Avatar, Badge, Button, Drawer, Layout, Menu, Space, Typography } from 'antd'
import {
  AppstoreOutlined,
  AuditOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  ShopOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { useAdminData } from '../features/admin/useAdminData'
import { locMenuAdminTheoQuyen, timMetaTrangAdmin } from '../features/admin/navigation'

const { Header, Sider, Content } = Layout
const { Text, Title } = Typography

const ICON_MAP = {
  dashboard: <DashboardOutlined />,
  'dat-ban': <CalendarOutlined />,
  'so-do-ban': <TableOutlined />,
  'quan-ly-ban': <ShopOutlined />,
  'thuc-don': <AppstoreOutlined />,
  'don-hang': <OrderedListOutlined />,
  'don-mang-ve': <OrderedListOutlined />,
  'danh-gia': <AuditOutlined />,
  'thong-ke': <DollarOutlined />,
  'nhan-vien': <UserOutlined />,
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { nguoiDungHienTai, laAdmin, dangXuat } = useXacThuc()
  const adminData = useAdminData()
  const { badges } = adminData

  const menuItems = useMemo(() => {
    const danhSach = locMenuAdminTheoQuyen(laAdmin)
    return danhSach.map((item) => ({
      key: item.path,
      icon: ICON_MAP[item.key] || <AppstoreOutlined />,
      label: (
        <Space size={8} style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{item.label}</span>
          {item.badgeKey && badges?.[item.badgeKey] > 0 ? <Badge count={badges[item.badgeKey]} size="small" /> : null}
        </Space>
      ),
    }))
  }, [badges, laAdmin])

  const metaTrang = timMetaTrangAdmin(location.pathname)

  const handleLogout = async () => {
    await dangXuat()
    navigate('/admin/dang-nhap', { replace: true })
  }

  const menuNode = (
    <>
      <div style={{ padding: collapsed ? '20px 12px' : '20px 18px', borderBottom: '1px solid #f0e6dc' }}>
        <Space align="center" size={12}>
          <Avatar style={{ background: '#e96c4a' }}>NH</Avatar>
          {!collapsed ? (
            <div>
              <Title level={5} style={{ margin: 0 }}>Nguyên Vị Admin</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Operations Console</Text>
            </div>
          ) : null}
        </Space>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[metaTrang.path]}
        items={menuItems}
        onClick={({ key }) => {
          navigate(key)
          setDrawerOpen(false)
        }}
        style={{ borderInlineEnd: 'none', paddingTop: 8 }}
      />

      <div style={{ marginTop: 'auto', padding: collapsed ? 12 : 18, borderTop: '1px solid #f0e6dc' }}>
        <Space align="center" size={12} style={{ width: '100%', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <Space align="center" size={12}>
            <Avatar style={{ background: '#f07d5c' }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
            {!collapsed ? (
              <div>
                <Text strong style={{ display: 'block' }}>{nguoiDungHienTai?.fullName || 'Admin'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{laAdmin ? 'Quản lý' : 'Nhân viên'}</Text>
              </div>
            ) : null}
          </Space>
          {!collapsed ? <Button icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button> : null}
        </Space>
        {collapsed ? <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 12, width: '100%' }} /> : null}
      </div>
    </>
  )

  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f5f2' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={88}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={280}
        theme="light"
        style={{ borderRight: '1px solid #f0e6dc' }}
      >
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>{menuNode}</div>
      </Sider>

      <Drawer placement="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} size={280} styles={{ body: { padding: 0 } }}>
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>{menuNode}</div>
      </Drawer>

      <Layout>
        <Header style={{ background: '#fff', borderBottom: '1px solid #f0e6dc', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space align="center" size={12}>
            <Button type="text" icon={drawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={() => setDrawerOpen(true)} className="admin-mobile-toggle" />
            <div>
              <Text type="secondary" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Panel</Text>
              <Title level={4} style={{ margin: 0 }}>{metaTrang.label}</Title>
            </div>
          </Space>
          <Space>
            <Avatar style={{ background: '#f07d5c' }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
          </Space>
        </Header>

        <Content style={{ padding: 20 }}>
          <Outlet context={adminData} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
