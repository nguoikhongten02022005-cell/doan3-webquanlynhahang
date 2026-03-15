import { CAC_KHU_VUC_DAT_BAN } from '../../data/duLieuDatBan'
import { layGoiYVoHieuHoaChoNgoi, layGhiChuVanHanhChoNgoi, nenVoHieuHoaLuaChonChoNgoi } from '../../utils/datBan/index'

function ChonChoNgoiDatBan({ formData, soLuongKhach, handleSeatingSelect, selectedSeatOperationalNote }) {
  return (
    <section className={`dat-ban-editorial-card dat-ban-seating-section ${formData.time ? '' : 'is-disabled'}`}>
      <div className="dat-ban-section-head">
        <div>
          <p className="dat-ban-side-kicker">Ưu tiên chỗ ngồi</p>
          <h3>Ưu tiên chỗ ngồi</h3>
        </div>
        <span className="dat-ban-inline-note">Tùy chọn</span>
      </div>

      <p className="dat-ban-field-note dat-ban-seat-disclaimer">Nhà hàng sẽ cố gắng sắp xếp theo yêu cầu, tùy tình trạng bàn thực tế tại thời điểm xác nhận.</p>

      {!formData.time ? (
        <div className="dat-ban-seat-note-banner"><strong>Chọn giờ trước:</strong> Chọn giờ trước để xem ưu tiên chỗ ngồi khả dụng.</div>
      ) : (
        <>
          <div className="dat-ban-seat-note-banner"><strong>Lưu ý vận hành:</strong> {selectedSeatOperationalNote}</div>

          <div className="dat-ban-seating-grid-premium">
            {CAC_KHU_VUC_DAT_BAN.map((area) => {
              const disabled = nenVoHieuHoaLuaChonChoNgoi(area.value, soLuongKhach)
              const isSelected = formData.seatingArea === area.value
              const disabledHint = layGoiYVoHieuHoaChoNgoi(area.value, soLuongKhach)

              return (
                <label key={area.value} className={`seating-area-option dat-ban-seat-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}>
                  <input type="radio" name="seatingArea" value={area.value} checked={isSelected} onChange={() => handleSeatingSelect(area.value)} disabled={disabled} />
                  <div className="dat-ban-seat-card-top">
                    <span className="seating-area-icon">{area.icon}</span>
                    <span className="dat-ban-seat-status">{isSelected ? 'Đang ưu tiên' : 'Có thể chọn'}</span>
                  </div>
                  <span className="seating-area-name">{area.label}</span>
                  <span className="seating-area-desc">{area.desc}</span>
                  <span className="dat-ban-seat-note">{layGhiChuVanHanhChoNgoi(area.value)}</span>
                  {disabled && <span className="seating-area-limit">{disabledHint}</span>}
                </label>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

export default ChonChoNgoiDatBan
