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
  ReloadOutlined,
  ShopOutlined,
  TableOutlined,
  UserOutlined,
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
  'don-hang': <OrderedListOutlined />,
  'don-mang-ve': <OrderedListOutlined />,
  'danh-gia': <AuditOutlined />,
  'thong-ke': <DollarOutlined />,
  'nhan-vien': <UserOutlined />,
}

function NoiBoLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const manHinh = useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { nguoiDungHienTai, laQuanLy, dangXuat } = useXacThuc()
  const duLieuNoiBo = useNoiBoData()
  const { badges, dangTaiDuLieu, loiTaiDuLieu, taiLaiDuLieu } = duLieuNoiBo
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
      <div style={{ padding: collapsed && laTabletTroLen ? '20px 12px' : '20px 18px', borderBottom: '1px solid #f0e6dc' }}>
        <Space align="center" size={12}>
          <Avatar style={{ background: '#e96c4a' }}>NH</Avatar>
          {!(collapsed && laTabletTroLen) ? (
            <div>
              <Title level={5} style={{ margin: 0 }}>Nguyên Vị Nội bộ</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Trung tâm vận hành</Text>
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

      <div style={{ marginTop: 'auto', padding: collapsed && laTabletTroLen ? 12 : 18, borderTop: '1px solid #f0e6dc' }}>
        <Space align="center" size={12} style={{ width: '100%', justifyContent: collapsed && laTabletTroLen ? 'center' : 'space-between' }}>
          <Space align="center" size={12}>
            <Avatar style={{ background: '#f07d5c' }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
            {!(collapsed && laTabletTroLen) ? (
              <div>
                <Text strong style={{ display: 'block' }}>{nguoiDungHienTai?.fullName || 'Nhân sự nội bộ'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{laQuanLy ? 'Quản lý' : 'Nhân viên'}</Text>
              </div>
            ) : null}
          </Space>
          {!(collapsed && laTabletTroLen) ? <Button icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button> : null}
        </Space>
        {collapsed && laTabletTroLen ? <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 12, width: '100%' }} /> : null}
      </div>
    </>
  )

  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f5f2' }}>
      {laTabletTroLen ? (
        <Sider
          collapsedWidth={88}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={280}
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
        <Header style={{ background: '#fff', borderBottom: '1px solid #f0e6dc', padding: laMobile ? '0 14px' : '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space align="center" size={12}>
            {laMobile ? <Button type="text" icon={drawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={() => setDrawerOpen(true)} className="noi-bo-mobile-toggle" /> : null}
            <div>
              <Text type="secondary" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Khu vực nội bộ</Text>
              <Title level={4} style={{ margin: 0 }}>{metaTrang.label}</Title>
            </div>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} loading={dangTaiDuLieu} onClick={() => taiLaiDuLieu?.()}>Tải lại</Button>
            <Avatar style={{ background: '#f07d5c' }}>{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</Avatar>
          </Space>
        </Header>

        <Content style={{ padding: laMobile ? 14 : 20 }}>
          {loiTaiDuLieu ? <Alert type="error" showIcon title={loiTaiDuLieu} style={{ marginBottom: 16 }} action={<Button size="small" onClick={() => taiLaiDuLieu?.()}>Thử lại</Button>} /> : null}
          <Outlet context={duLieuNoiBo} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default NoiBoLayout
