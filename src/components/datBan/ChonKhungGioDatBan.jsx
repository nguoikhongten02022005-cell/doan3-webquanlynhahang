import { CHU_THICH_KHUNG_GIO_DAT_BAN } from '../../constants/giaoDienDatBan'
import { GOI_Y_NGAY_KHONG_HOP_LE, THONG_DIEP_HOTLINE_NHOM_DONG, SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN } from '../../utils/datBan/index'

function ChonKhungGioDatBan({
  availabilityPanelRef,
  firstAvailableSlotRef,
  firstAvailableSlotTime,
  formData,
  soLuongKhach,
  handleSelectSuggestedTime,
  handleTimeSelect,
  inlineErrors,
  invalidPastDate,
  recommendedSlotTime,
  selectedTimeSuggestions,
  slotGroups,
  slotsLoading,
}) {
  return (
    <div className="dat-ban-availability-panel" ref={availabilityPanelRef}>
      <div className="dat-ban-availability-head">
        <div>
          <p className="dat-ban-side-kicker">Khung giờ phục vụ khả dụng</p>
          <h4>Khung giờ phục vụ khả dụng</h4>
        </div>
        <div className="dat-ban-slot-legend">
          {CHU_THICH_KHUNG_GIO_DAT_BAN.map((item) => (
            <span key={item.key}><i className={`dot ${item.key}`} />{item.label}</span>
          ))}
        </div>
      </div>

      {!formData.guests ? (
        <div className="dat-ban-slot-awaiting-card" aria-live="polite">
          <span className="dat-ban-slot-awaiting-kicker">Sẵn sàng khi bạn bắt đầu</span>
          <strong>Chọn số khách trước để xem giờ trống.</strong>
        </div>
      ) : !formData.date ? (
        <div className="dat-ban-slot-awaiting-card" aria-live="polite">
          <span className="dat-ban-slot-awaiting-kicker">Bước tiếp theo</span>
          <strong>Chọn ngày dùng bữa để mở danh sách khung giờ.</strong>
        </div>
      ) : slotsLoading ? (
        <div className="khung-gio-loading dat-ban-placeholder-large"><div className="slot-loading-spinner" /><span>Đang kiểm tra khung giờ trống...</span></div>
      ) : invalidPastDate ? (
        <div className="khung-gio-empty dat-ban-placeholder-large"><span className="placeholder-icon">⚠️</span><span>{GOI_Y_NGAY_KHONG_HOP_LE}</span></div>
      ) : soLuongKhach > SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN ? (
        <div className="khung-gio-empty dat-ban-placeholder-large"><span className="placeholder-icon">📞</span><span>{THONG_DIEP_HOTLINE_NHOM_DONG}</span></div>
      ) : (
        <>
          {slotGroups.map((group) => (
            <div key={group.key} className="khung-gio-group dat-ban-khung-gio-group-premium">
              <span className="khung-gio-group-label">{group.label}</span>
              <div className="khung-gio-grid dat-ban-khung-gio-grid-premium">
                {group.slots.map((slot) => (
                  <button
                    key={slot.time}
                    ref={slot.time === firstAvailableSlotTime ? firstAvailableSlotRef : null}
                    type="button"
                    className={`khung-gio-btn dat-ban-slot-card ${formData.time === slot.time ? 'selected' : ''} ${slot.time === recommendedSlotTime && !formData.time ? 'recommended' : ''} ${slot.status}`}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={slot.status === 'full'}
                  >
                    <span className="khung-gio-time">{slot.time}</span>
                    <span className="khung-gio-badge dat-ban-slot-badge">{slot.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {inlineErrors.time && <p className="loi-bieu-mau-inline dat-ban-inline-alert">{inlineErrors.time}</p>}

          {selectedTimeSuggestions.length > 0 && inlineErrors.time && (
            <div className="dat-ban-slot-suggestions">
              <span>Gợi ý khung giờ thay thế gần nhất:</span>
              <div>
                {selectedTimeSuggestions.map((timeValue) => <button key={timeValue} type="button" onClick={() => handleSelectSuggestedTime(timeValue)}>{timeValue}</button>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ChonKhungGioDatBan
