function AdminHeader({ title, description, breadcrumb, notificationCount, nguoiDungHienTai, onToggleSidebar }) {
  return (
    <header className="admin-header">
      <div className="admin-header__main">
        <div className="admin-header__left">
          <button type="button" className="admin-header__menu-btn" onClick={onToggleSidebar} aria-label="Mở menu quản trị">
            ☰
          </button>
          <div className="admin-header__copy">
            <p className="admin-header__breadcrumb">{breadcrumb.join(' > ')}</p>
            <h1>{title}</h1>
            {description ? <p className="admin-header__description">{description}</p> : null}
          </div>
        </div>

        <div className="admin-header__right">
          <div className="admin-header__status" aria-label="Trạng thái bảng điều khiển">
            <span className="admin-header__status-dot" aria-hidden="true" />
            <span>Live</span>
          </div>
          <button type="button" className="admin-header__icon-btn" aria-label="Thông báo">
            <span aria-hidden="true">◔</span>
            {notificationCount > 0 ? <span className="admin-header__icon-badge">{notificationCount}</span> : null}
          </button>
          <div className="admin-header__profile">
            <div className="admin-header__profile-avatar">{String(nguoiDungHienTai?.fullName || 'A').charAt(0).toUpperCase()}</div>
            <div className="admin-header__profile-copy">
              <strong>{nguoiDungHienTai?.fullName || 'Admin'}</strong>
              <span>{nguoiDungHienTai?.email || 'internal@nguyenvi.local'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
