import { dinhDangNgayHienThi, layThongDiepTrangThaiDatBan, layDanhSachChinhSach, layVanBanTomTatChoNgoi } from '../../utils/datBan/index'

function DatBanThanhCong({ bookingCode, bookingStatus, formData, soLuongKhach, successHeading, successStatusLabel, onGoHome, onGoProfile }) {
  return (
    <div className="dat-ban-success dat-ban-success-premium">
      <div className="success-icon">✓</div>
      <p className="dat-ban-side-kicker">Kết quả booking</p>
      <h3>{successHeading}</h3>
      <div className="success-dat-ban-code">
        <span className="code-label">Mã đặt bàn</span>
        <span className="code-value">{bookingCode}</span>
      </div>
      <div className="success-status">
        <span className="status-badge status-pending">{successStatusLabel}</span>
      </div>

      <div className="dat-ban-success-grid">
        <div className="dat-ban-success-item"><span>Ngày dùng bữa</span><strong>{dinhDangNgayHienThi(formData.date)}</strong></div>
        <div className="dat-ban-success-item"><span>Khung giờ phục vụ</span><strong>{formData.time}</strong></div>
        <div className="dat-ban-success-item"><span>Số khách</span><strong>{formData.guests} khách</strong></div>
        <div className="dat-ban-success-item"><span>Khu vực</span><strong>{layVanBanTomTatChoNgoi(formData.seatingArea)}</strong></div>
        <div className="dat-ban-success-item"><span>Khách liên hệ</span><strong>{formData.name}</strong></div>
        <div className="dat-ban-success-item"><span>Số điện thoại</span><strong>{formData.phone}</strong></div>
      </div>

      <p className="success-note success-note-premium">
        {layThongDiepTrangThaiDatBan(bookingStatus, formData.seatingArea)}
      </p>

      <div className="dat-ban-policy-notes dat-ban-policy-notes-premium">
        {layDanhSachChinhSach(soLuongKhach, formData.seatingArea, formData.time).map((item) => (
          <div className="policy-item" key={item.text}>
            <span className="policy-icon">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="dat-ban-success-actions">
        <button type="button" className="dat-ban-secondary-btn" onClick={onGoProfile}>Xem trong hồ sơ</button>
        <button type="button" className="dat-ban-primary-btn" onClick={onGoHome}>Về trang chủ</button>
      </div>
    </div>
  )
}

export default DatBanThanhCong
