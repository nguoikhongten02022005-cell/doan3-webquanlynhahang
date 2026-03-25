import { ADMIN_SETTINGS_SECTIONS } from '../../features/admin/mockData'

function AdminCaiDatPage() {
  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tóm tắt cài đặt">
        <article className="admin-summary-strip__card">
          <span>Chế độ vận hành</span>
          <strong>Bình thường</strong>
          <p>Không có hạn chế booking được bật.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Thông báo nội bộ</span>
          <strong>4 quy tắc</strong>
          <p>TODO: đồng bộ từ API cấu hình thông báo.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Chính sách booking</span>
          <strong>Đã cấu hình</strong>
          <p>Kiểm soát bởi mock data trong giai đoạn đầu.</p>
        </article>
      </section>

      <section className="admin-settings-grid">
        {ADMIN_SETTINGS_SECTIONS.map((section) => (
          <article key={section.id} className="admin-panel-card admin-settings-card">
            <div className="admin-panel-card__head">
              <div>
                <p className="admin-section-kicker">{section.title}</p>
                <h2>{section.description}</h2>
              </div>
            </div>

            <div className="admin-settings-list">
              {section.items.map((item) => (
                <div key={item.label} className="admin-settings-list__row">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default AdminCaiDatPage
