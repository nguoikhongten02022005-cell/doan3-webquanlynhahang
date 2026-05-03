import { Alert, Avatar, Badge, Button, Drawer, Grid, Layout, Menu, Space, Typography } from 'antd'
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
  TagOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { useNoiBoData } from '../features/noiBo/useNoiBoData'
import { locMenuNoiBoTheoQuyen, timMetaTrangNoiBo } from '../features/noiBo/navigation'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const ICON_MAP = {
  dashboard: <DashboardOutlined />,
  'dat-ban': <CalendarOutlined />,
  'so-do-ban': <TableOutlined />,
  'quan-ly-ban': <ShopOutlined />,
  'thuc-don': <AppstoreOutlined />,
  'ma-giam-gia': <TagOutlined />,
  'don-hang': <OrderedListOutlined />,
  'danh-gia': <AuditOutlined />,
  'thong-ke': <DollarOutlined />,
  'nhan-vien': <UserOutlined />,
  'khach-hang': <TeamOutlined />,
}

function NoiBoLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const manHinh = useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { nguoiDungHienTai, laQuanLy, dangXuat } = useXacThuc()
  const duLieuNoiBo = useNoiBoData()
  const { badges, loiTaiDuLieu, taiLaiDuLieu } = duLieuNoiBo
  const laMobile = manHinh.xs && !manHinh.md
  const laTabletTroLen = !!manHinh.md

  const menuItems = useMemo(() => {
    const danhSach = locMenuNoiBoTheoQuyen(laQuanLy)
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
  }, [badges, laQuanLy])

  const metaTrang = timMetaTrangNoiBo(location.pathname)

  const handleLogout = async () => {
    await dangXuat()
    navigate('/noi-bo/dang-nhap', { replace: true })
  }

  const menuNode = (
    <>
      <div style={{ padding: collapsed && laTabletTroLen ? '16px 8px' : '16px 14px', borderBottom: '1px solid #f0e6dc' }}>
        <Space align="center" size={10}>
          <Avatar style={{ background: '#e96c4a' }}>NH</Avatar>
          {!(collapsed && laTabletTroLen) ? (
            <div>
              <Text strong style={{ fontSize: 14 }}>Nguyên Vị</Text>
              <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Nội bộ</Text>
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
        style={{ borderInlineEnd: 'none', paddingTop: 4 }}
      />

      <div style={{ marginTop: 'auto', padding: collapsed && laTabletTroLen ? 10 : 14, borderTop: '1px solid #f0e6dc' }}>
        <Space align="center" size={10} style={{ width: '100%', justifyContent: collapsed && laTabletTroLen ? 'center' : 'space-between' }}>
          <Space align="center" size={10}>
            <Avatar style={{ background: '#f07d5c', width: 32, height: 32 }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
            {!(collapsed && laTabletTroLen) ? (
              <div>
                <Text strong style={{ display: 'block', fontSize: 13 }}>{nguoiDungHienTai?.fullName || 'NV'}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{laQuanLy ? 'Quản lý' : 'NV'}</Text>
              </div>
            ) : null}
          </Space>
          {!(collapsed && laTabletTroLen) ? <Button icon={<LogoutOutlined />} onClick={handleLogout} size="small">Ra</Button> : null}
        </Space>
        {collapsed && laTabletTroLen ? <Button icon={<LogoutOutlined />} onClick={handleLogout} size="small" style={{ marginTop: 8, width: '100%' }} /> : null}
      </div>
    </>
  )

  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f5f2' }}>
      {laTabletTroLen ? (
        <Sider
          collapsedWidth={64}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          size={220}
          theme="light"
          style={{ borderRight: '1px solid #f0e6dc', position: 'sticky', top: 0, insetInlineStart: 0, height: '100vh', overflow: 'auto' }}
        >
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>{menuNode}</div>
        </Sider>
      ) : null}

      <Drawer placement="left" open={laMobile && drawerOpen} onClose={() => setDrawerOpen(false)} size={280} styles={{ body: { padding: 0 } }}>
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>{menuNode}</div>
      </Drawer>

      <Layout>
        <Header style={{ background: '#fff', borderBottom: '1px solid #f0e6dc', padding: laMobile ? '0 12px' : '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
          <Space align="center" size={10}>
            {laMobile ? <Button type="text" icon={drawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={() => setDrawerOpen(true)} className="noi-bo-mobile-toggle" /> : null}
            <Title level={5} style={{ margin: 0 }}>{metaTrang.label}</Title>
          </Space>
          <Space size={10}>
            <Avatar style={{ background: '#f07d5c', width: 28, height: 28 }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
          </Space>
        </Header>

        <Content style={{ padding: laMobile ? 10 : 16 }}>
          {loiTaiDuLieu ? <Alert type="error" showIcon title={loiTaiDuLieu} style={{ marginBottom: 16 }} action={<Button size="small" onClick={() => taiLaiDuLieu?.()}>Thử lại</Button>} /> : null}
          <Outlet context={duLieuNoiBo} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default NoiBoLayout
