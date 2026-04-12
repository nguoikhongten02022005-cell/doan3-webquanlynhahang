function TaiKhoanTab({ accounts }) {
  return (
    <article className="ho-so-card">
      <div className="van-hanh-board-head">
        <h2>Danh sách tài khoản nội bộ</h2>
        <span>{accounts.length} tài khoản</span>
      </div>

      <p className="van-hanh-dat-ban-note">Màn này hiện chỉ dùng để xem nhanh tài khoản và vai trò nội bộ.</p>

      <div className="ho-so-list noi-bo-list-top-gap">
        {accounts.map((account) => (
          <div key={`${account.username}-${account.email}`} className="ho-so-list-item">
            <div className="ho-so-list-top">
              <strong>{account.fullName || account.username}</strong>
              <span className={`nhan-trang-thai tone-${account.role === 'admin' ? 'success' : account.role === 'staff' ? 'warning' : 'neutral'}`}>
                {account.role === 'admin' ? 'Quản lý' : account.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
              </span>
            </div>

            <div className="ho-so-list-meta">
              <p><span>Tài khoản</span><strong>{account.username || '--'}</strong></p>
              <p><span>Email</span><strong>{account.email || '--'}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default TaiKhoanTab
