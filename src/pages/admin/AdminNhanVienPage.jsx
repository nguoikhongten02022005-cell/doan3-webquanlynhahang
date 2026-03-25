import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'

const ROLE_LABELS = {
  admin: 'Quản lý',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
}

const ROLE_TONES = {
  admin: 'danger',
  staff: 'success',
  customer: 'neutral',
}

function AdminNhanVienPage() {
  const { danhSachTaiKhoan } = useOutletContext()

  const danhSachNhanVien = useMemo(
    () => danhSachTaiKhoan.filter((account) => account.role === 'admin' || account.role === 'staff'),
    [danhSachTaiKhoan],
  )

  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tóm tắt nhân viên">
        <article className="admin-summary-strip__card">
          <span>Tổng nhân sự nội bộ</span>
          <strong>{danhSachNhanVien.length}</strong>
          <p>TODO: nối thêm API trạng thái ca làm việc.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Quản lý</span>
          <strong>{danhSachNhanVien.filter((item) => item.role === 'admin').length}</strong>
          <p>Nhóm có quyền hệ thống đầy đủ.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Nhân viên vận hành</span>
          <strong>{danhSachNhanVien.filter((item) => item.role === 'staff').length}</strong>
          <p>Truy cập các màn hình vận hành.</p>
        </article>
      </section>

      <section className="admin-panel-card">
        <div className="admin-panel-card__head">
          <div>
            <p className="admin-section-kicker">Nhân sự nội bộ</p>
            <h2>Danh sách nhân viên</h2>
          </div>
          <span className="admin-inline-note">TODO: bổ sung modal thêm/sửa nhân viên sau khi có API tương ứng.</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {danhSachNhanVien.map((account, index) => (
                <tr key={`${account.username}-${account.email}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{account.fullName || account.username || 'Chưa cập nhật'}</td>
                  <td>
                    <span className={`nhan-trang-thai tone-${ROLE_TONES[account.role] || 'neutral'}`}>
                      {ROLE_LABELS[account.role] || account.role}
                    </span>
                  </td>
                  <td>{account.username || '--'}</td>
                  <td>{account.email || '--'}</td>
                  <td><span className="nhan-trang-thai tone-success">Đang hoạt động</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminNhanVienPage
