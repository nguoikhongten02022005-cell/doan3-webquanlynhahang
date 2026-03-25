import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'
import { timMetaTrangAdmin } from '../features/admin/navigation'
import { useXacThuc } from '../hooks/useXacThuc'
import { useAdminData } from '../features/admin/useAdminData'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { nguoiDungHienTai, laAdmin, dangXuat } = useXacThuc()
  const adminData = useAdminData()
  const { badges } = adminData

  const thongTinTrang = useMemo(() => timMetaTrangAdmin(location.pathname), [location.pathname])

  const breadcrumb = useMemo(() => {
    if (!thongTinTrang) {
      return ['Trang chủ', 'Admin']
    }

    return ['Trang chủ', thongTinTrang.group, thongTinTrang.label]
  }, [thongTinTrang])

  const handleLogout = async () => {
    await dangXuat()
    navigate('/admin/dang-nhap', { replace: true })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="admin-shell">
      <div
        className={`admin-shell__overlay ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <AdminSidebar
        laAdmin={laAdmin}
        badges={badges}
        nguoiDungHienTai={nguoiDungHienTai}
        onLogout={handleLogout}
        onNavigate={closeMobileMenu}
        isMobileOpen={mobileMenuOpen}
      />

      <div className="admin-shell__content">
        <AdminHeader
          title={thongTinTrang?.label || 'Admin'}
          description={thongTinTrang?.group === 'QUẢN LÝ' ? 'Điều phối vận hành và theo dõi trạng thái nhà hàng theo thời gian thực.' : 'Bảng quản trị nội bộ cho hệ thống nhà hàng Nguyên Vị.'}
          breadcrumb={breadcrumb}
          notificationCount={badges.notifications}
          nguoiDungHienTai={nguoiDungHienTai}
          onToggleSidebar={() => setMobileMenuOpen((current) => !current)}
        />

        <main className="admin-shell__main" id="main-content">
          <Outlet context={adminData} />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
