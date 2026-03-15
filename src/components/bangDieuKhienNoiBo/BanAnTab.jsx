import { layNhanChoNgoi } from '../../features/bangDieuKhienNoiBo/dinhDang'

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

function BanAnTab({ phamViLabel, tomTatBan, tables, tomTatTonKhoBan, xuLyDanhDauBanSanSang, xuLyDanhDauBanBan }) {
  return (
    <article className="ho-so-card">
      <div className="van-hanh-board-head">
        <h2>Tình trạng bàn ăn</h2>
        <span>{phamViLabel}</span>
      </div>

      <div className="noi-bo-ban-overview-grid">
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Sẵn sàng</span>
          <strong>{tomTatTonKhoBan.available}</strong>
          <p className="noi-bo-ban-note">Bàn có thể nhận khách ngay.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Giữ chỗ</span>
          <strong>{tomTatTonKhoBan.held}</strong>
          <p className="noi-bo-ban-note">Đã gán booking nhưng chưa check-in.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Đang phục vụ</span>
          <strong>{tomTatTonKhoBan.occupied}</strong>
          <p className="noi-bo-ban-note">Đang có khách tại bàn.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-ban-card">
          <span>Đang dọn</span>
          <strong>{tomTatTonKhoBan.dirty}</strong>
          <p className="noi-bo-ban-note">Cần dọn trước khi nhận khách mới.</p>
        </article>
      </div>

      <div className="noi-bo-ban-grid noi-bo-list-top-gap">
        {tomTatBan.map((area) => (
          <article key={area.id} className="van-hanh-stat-card noi-bo-ban-card">
            <span>{area.name}</span>
            <strong>{area.available}/{area.total}</strong>
            <p className="noi-bo-ban-note">
              {area.occupied} đang phục vụ · {area.held} giữ chỗ · {area.dirty} đang dọn.
            </p>
          </article>
        ))}
      </div>

      <div className="ho-so-list noi-bo-list-top-gap">
        {tables.map((table) => (
          <div key={table.id} className="ho-so-list-item">
            <div className="ho-so-list-top">
              <strong>{table.code}</strong>
              <span className={`nhan-trang-thai tone-${TABLE_STATUS_TONES[table.status] || 'neutral'}`}>
                {TABLE_STATUS_LABELS[table.status] || table.status}
              </span>
            </div>

            <div className="ho-so-list-meta noi-bo-don-hang-meta">
              <p><span>Khu vực</span><strong>{layNhanChoNgoi(table.areaId)}</strong></p>
              <p><span>Sức chứa</span><strong>{table.capacity} khách</strong></p>
              <p><span>Booking hiện tại</span><strong>{table.activeBookingCode || 'Trống'}</strong></p>
              <p><span>Ghi chú</span><strong>{table.note || '--'}</strong></p>
            </div>

            <div className="noi-bo-mon-item-actions">
              {table.status === 'DIRTY' ? (
                <button type="button" className="noi-bo-quick-btn noi-bo-quick-nut-chinh" onClick={() => xuLyDanhDauBanSanSang(table.id)}>
                  Sẵn sàng lại
                </button>
              ) : (
                <button type="button" className="noi-bo-quick-btn" onClick={() => xuLyDanhDauBanBan(table.id)}>
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

export default BanAnTab
