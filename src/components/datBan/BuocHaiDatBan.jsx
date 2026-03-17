import { CAC_GOI_Y_GHI_CHU_DAT_BAN, CAC_DIP_DAT_BAN } from '../../data/duLieuDatBan'
import { dinhDangNgayHienThi, layVanBanTomTatChoNgoi } from '../../utils/datBan/index'

function BuocHaiDatBan({ formData, soLuongKhach, inlineErrors, selectedMealDurationText, onBack, onChange, onNoteSuggestion }) {
  return (
    <div className="dat-ban-step dat-ban-step-premium">
      <section className="dat-ban-editorial-card dat-ban-tom-tat-ribbon">
        <div className="dat-ban-tom-tat-inline">
          <span>{soLuongKhach} khách</span>
          <span>{dinhDangNgayHienThi(formData.date)}</span>
          <span>{formData.time}</span>
          <span>{layVanBanTomTatChoNgoi(formData.seatingArea)}</span>
          {selectedMealDurationText && <span>{selectedMealDurationText}</span>}
        </div>
        <button type="button" className="tom-tat-edit-btn" onClick={onBack}>Quay lại bước chọn bàn</button>
      </section>

      <section className="dat-ban-editorial-card dat-ban-step-soft-note">
        <p>
          Điền thông tin tối thiểu để nhà hàng giữ liên lạc khi cần xác nhận, đổi chỗ ngồi hoặc hỗ trợ giờ đến.
        </p>
      </section>

      <section className="dat-ban-editorial-card">
        <div className="dat-ban-section-head">
          <div>
            <p className="dat-ban-side-kicker">Thông tin liên hệ</p>
            <h3>Ai sẽ đến dùng bữa?</h3>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="nhan-truong" htmlFor="dat-ban-name">Họ và tên</label>
            <input id="dat-ban-name" type="text" name="name" className={`truong-nhap ${inlineErrors.name ? 'truong-nhap-error' : ''}`} placeholder="Nguyễn Văn A" value={formData.name} onChange={onChange} autoFocus />
            {inlineErrors.name && <span className="loi-bieu-mau-inline">{inlineErrors.name}</span>}
          </div>

          <div className="form-field">
            <label className="nhan-truong" htmlFor="dat-ban-phone">Số điện thoại</label>
            <input id="dat-ban-phone" type="tel" name="phone" className={`truong-nhap ${inlineErrors.phone ? 'truong-nhap-error' : ''}`} placeholder="0901 234 567" value={formData.phone} onChange={onChange} />
            {inlineErrors.phone ? <span className="loi-bieu-mau-inline">{inlineErrors.phone}</span> : <span className="dat-ban-field-note">Nhà hàng sẽ dùng số này để xác nhận booking nếu cần.</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="nhan-truong" htmlFor="dat-ban-email">Email (tùy chọn)</label>
            <input id="dat-ban-email" type="email" name="email" className="truong-nhap" placeholder="email@example.com" value={formData.email} onChange={onChange} />
            <span className="dat-ban-field-note">Tùy chọn, dùng để nhận thông tin nếu cần.</span>
          </div>

          <div className="form-field">
            <label className="nhan-truong" htmlFor="dat-ban-occasion">Dịp dùng bữa (tùy chọn)</label>
            <select id="dat-ban-occasion" name="occasion" className="truong-nhap" value={formData.occasion} onChange={onChange}>
              <option value="">Không có</option>
              {CAC_DIP_DAT_BAN.map((occ) => <option key={occ} value={occ}>{occ}</option>)}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="nhan-truong" htmlFor="dat-ban-notes">Ghi chú (tùy chọn)</label>
          <div className="dat-ban-note-chips">
            {CAC_GOI_Y_GHI_CHU_DAT_BAN.map((suggestion) => (
              <button key={suggestion} type="button" className="dat-ban-note-chip" onClick={() => onNoteSuggestion(suggestion)}>{suggestion}</button>
            ))}
          </div>
          <textarea id="dat-ban-notes" name="notes" className="truong-van-ban" placeholder="VD: Dị ứng thực phẩm, cần ghế em bé, muốn chỗ yên tĩnh, đến trễ khoảng 10 phút..." value={formData.notes} onChange={onChange} rows="4" />
        </div>
      </section>
    </div>
  )
}

export default BuocHaiDatBan
