import { getSeatingLabel } from '../../pages/internalDashboard/formatters'

const TABLE_STATUS_LABELS = {
  AVAILABLE: 'Sẵn sàng',
  HELD: 'Đang giữ chỗ',
  OCCUPIED: 'Đang phục vụ',
  DIRTY: 'Đang dọn',
}

const TABLE_STATUS_TONES = {
  AVAILABLE: 'success',
  HELD: 'warning',
  OCCUPIED: 'danger',
  DIRTY: 'neutral',
}

function TablesTab({ scopeLabel, tableSummary, tables, tableInventorySummary, handleMarkTableReady, handleMarkTableDirty }) {
  return (
    <article className="profile-card">
      <div className="host-board-head">
        <h2>Tình trạng bàn ăn</h2>
        <span>{scopeLabel}</span>
      </div>

      <div className="internal-table-overview-grid">
        <article className="host-stat-card internal-table-card">
          <span>Sẵn sàng</span>
          <strong>{tableInventorySummary.available}</strong>
          <p className="internal-table-note">Bàn có thể nhận khách ngay.</p>
        </article>
        <article className="host-stat-card internal-table-card">
          <span>Giữ chỗ</span>
          <strong>{tableInventorySummary.held}</strong>
          <p className="internal-table-note">Đã gán booking nhưng chưa check-in.</p>
        </article>
        <article className="host-stat-card internal-table-card">
          <span>Đang phục vụ</span>
          <strong>{tableInventorySummary.occupied}</strong>
          <p className="internal-table-note">Đang có khách tại bàn.</p>
        </article>
        <article className="host-stat-card internal-table-card">
          <span>Đang dọn</span>
          <strong>{tableInventorySummary.dirty}</strong>
          <p className="internal-table-note">Cần dọn trước khi nhận khách mới.</p>
        </article>
      </div>

      <div className="internal-table-grid internal-list-top-gap">
        {tableSummary.map((area) => (
          <article key={area.id} className="host-stat-card internal-table-card">
            <span>{area.name}</span>
            <strong>{area.available}/{area.total}</strong>
            <p className="internal-table-note">
              {area.occupied} đang phục vụ · {area.held} giữ chỗ · {area.dirty} đang dọn.
            </p>
          </article>
        ))}
      </div>

      <div className="profile-list internal-list-top-gap">
        {tables.map((table) => (
          <div key={table.id} className="profile-list-item">
            <div className="profile-list-top">
              <strong>{table.code}</strong>
              <span className={`status-chip tone-${TABLE_STATUS_TONES[table.status] || 'neutral'}`}>
                {TABLE_STATUS_LABELS[table.status] || table.status}
              </span>
            </div>

            <div className="profile-list-meta internal-order-meta">
              <p><span>Khu vực</span><strong>{getSeatingLabel(table.areaId)}</strong></p>
              <p><span>Sức chứa</span><strong>{table.capacity} khách</strong></p>
              <p><span>Booking hiện tại</span><strong>{table.activeBookingCode || 'Trống'}</strong></p>
              <p><span>Ghi chú</span><strong>{table.note || '--'}</strong></p>
            </div>

            <div className="internal-dish-item-actions">
              {table.status === 'DIRTY' ? (
                <button type="button" className="internal-quick-btn internal-quick-btn-primary" onClick={() => handleMarkTableReady(table.id)}>
                  Sẵn sàng lại
                </button>
              ) : (
                <button type="button" className="internal-quick-btn" onClick={() => handleMarkTableDirty(table.id)}>
                  Đánh dấu dọn bàn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default TablesTab
