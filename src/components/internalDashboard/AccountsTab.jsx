function AccountsTab({ accounts }) {
  return (
    <article className="profile-card">
      <div className="host-board-head">
        <h2>Danh sách tài khoản nội bộ</h2>
        <span>{accounts.length} tài khoản</span>
      </div>

      <p className="host-booking-note">Màn này hiện chỉ dùng để xem nhanh tài khoản và vai trò nội bộ.</p>

      <div className="profile-list internal-list-top-gap">
        {accounts.map((account) => (
          <div key={`${account.username}-${account.email}`} className="profile-list-item">
            <div className="profile-list-top">
              <strong>{account.fullName || account.username}</strong>
              <span className={`status-chip tone-${account.role === 'admin' ? 'success' : account.role === 'staff' ? 'warning' : 'neutral'}`}>
                {account.role === 'admin' ? 'Admin' : account.role === 'staff' ? 'Staff' : 'Customer'}
              </span>
            </div>

            <div className="profile-list-meta">
              <p><span>Tài khoản</span><strong>{account.username || '--'}</strong></p>
              <p><span>Email</span><strong>{account.email || '--'}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default AccountsTab
