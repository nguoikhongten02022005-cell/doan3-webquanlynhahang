import { NavLink } from 'react-router-dom'
import { layMenuAdminTheoNhom } from '../../features/admin/navigation'

function AdminSidebar({ laAdmin, badges, nguoiDungHienTai, onLogout, onNavigate, isMobileOpen }) {
  const menuTheoNhom = layMenuAdminTheoNhom(laAdmin)
  const nhomKeys = Object.keys(menuTheoNhom)

  return (
    <aside className={`admin-sidebar ${isMobileOpen ? 'is-open' : ''}`} aria-label="Điều hướng quản trị">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-mark">NH</div>
        <div className="admin-sidebar__brand-copy">
          <div className="admin-sidebar__brand-row">
            <strong>Nguyên Vị Admin</strong>
            <span className="admin-sidebar__brand-badge">ADMIN</span>
          </div>
          <p>Operations console</p>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {nhomKeys.map((group) => (
          <div key={group} className="admin-sidebar__group">
            <div className="admin-sidebar__group-items">
              {menuTheoNhom[group].map((item) => {
                const badgeValue = item.badgeKey ? badges?.[item.badgeKey] : 0

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
                    onClick={onNavigate}
                  >
                    <span className="admin-sidebar__icon" aria-hidden="true">{item.glyph}</span>
                    <span className="admin-sidebar__text">{item.label}</span>
                    {badgeValue > 0 ? <span className="admin-sidebar__count">{badgeValue}</span> : null}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</div>
          <div className="admin-sidebar__user-copy">
            <strong>{nguoiDungHienTai?.fullName || 'Admin'}</strong>
            <span>{laAdmin ? 'Quản lý' : 'Nhân viên vận hành'}</span>
          </div>
        </div>
        <button type="button" className="admin-sidebar__logout" onClick={onLogout}>Đăng xuất</button>
      </div>
    </aside>
  )
}

export default AdminSidebar
