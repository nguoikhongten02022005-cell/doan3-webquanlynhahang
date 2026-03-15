import { NHAN_TRANG_THAI_DAT_BAN } from '../../data/duLieuDatBan'
import { dinhDangNgayHienThi, layTrangThaiGuiDatBan, layThoiLuongBuaAnText, layDanhSachChinhSach, layVanBanTomTatChoNgoi } from '../../utils/datBan/index'

function BuocBaDatBan({ formData, soLuongKhach, selectedSeatOperationalNote }) {
  const submissionStatus = layTrangThaiGuiDatBan({
    seatingArea: formData.seatingArea,
    soLuongKhach,
    time: formData.time,
    notes: formData.notes,
  })

  return (
    <div className="dat-ban-step dat-ban-step-premium">
      <section className="dat-ban-review-grid">
        <article className="dat-ban-editorial-card dat-ban-review-card-main">
          <div className="dat-ban-section-head">
            <div>
              <p className="dat-ban-side-kicker">Xác nhận cuối</p>
              <h3>Xem lại đầy đủ thông tin trước khi gửi</h3>
            </div>
          </div>

          <div className="dat-ban-review-list">
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Số khách</span><strong>{formData.guests} khách</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Ngày dùng bữa</span><strong>{dinhDangNgayHienThi(formData.date)}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Khung giờ phục vụ</span><strong>{formData.time}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Dự kiến sử dụng bàn</span><strong>{layThoiLuongBuaAnText(soLuongKhach, formData.time)}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Khu vực ưu tiên</span><strong>{layVanBanTomTatChoNgoi(formData.seatingArea)}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Trạng thái sau khi gửi</span><strong>{NHAN_TRANG_THAI_DAT_BAN[submissionStatus]}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Khách liên hệ</span><strong>{formData.name}</strong></div>
            <div className="dat-ban-review-item dat-ban-review-item-primary"><span>Số điện thoại</span><strong>{formData.phone}</strong></div>
            {formData.email && <div className="dat-ban-review-item"><span>Email</span><strong>{formData.email}</strong></div>}
            {formData.occasion && <div className="dat-ban-review-item"><span>Dịp</span><strong>{formData.occasion}</strong></div>}
            <div className="dat-ban-review-item dat-ban-review-item-note"><span>Lưu ý vận hành</span><strong>{selectedSeatOperationalNote}</strong></div>
            {formData.notes && <div className="dat-ban-review-item dat-ban-review-item-notes"><span>Ghi chú thêm</span><strong>{formData.notes}</strong></div>}
          </div>
        </article>

        <aside className="dat-ban-editorial-card dat-ban-policy-card-premium">
          <div className="dat-ban-section-head compact">
            <div>
              <p className="dat-ban-side-kicker">Điều kiện giữ bàn</p>
              <h3>Chính sách giữ bàn</h3>
            </div>
          </div>

          <div className="dat-ban-keep-ban-note">
            <strong>Giữ bàn 15 phút</strong>
            <span>Nhà hàng giữ bàn tối đa 15 phút kể từ giờ hẹn trước khi cần sắp xếp lại.</span>
          </div>

          <div className="dat-ban-policy-notes dat-ban-policy-notes-premium">
            {layDanhSachChinhSach(soLuongKhach, formData.seatingArea, formData.time).map((item) => (
              <div className="policy-item" key={item.text}>
                <span className="policy-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}

export default BuocBaDatBan
