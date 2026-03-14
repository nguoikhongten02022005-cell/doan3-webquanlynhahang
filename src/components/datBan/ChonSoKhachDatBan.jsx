import { CAC_LUA_CHON_SO_KHACH_DAT_BAN } from '../../data/duLieuDatBan'
import { SO_KHACH_NHOM_DONG, THONG_DIEP_HOTLINE_NHOM_DONG, SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN } from '../../utils/datBan/index'

function ChonSoKhachDatBan({ formData, guestCount, guestWarning, inlineErrors, onGuestSelect, serviceHotlineLink }) {
  return (
    <section className="booking-editorial-card booking-editorial-card-highlight">
      <div className="booking-section-head">
        <div>
          <p className="booking-side-kicker">Số lượng khách</p>
          <h3>Chọn số khách</h3>
        </div>
        <span className="booking-inline-note">Đặt online tối đa {SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN} khách</span>
      </div>

      <div className="booking-guest-grid">
        {CAC_LUA_CHON_SO_KHACH_DAT_BAN.map((num) => (
          <button
            key={num}
            type="button"
            className={`booking-guest-card ${formData.guests === String(num === '10+' ? SO_KHACH_NHOM_DONG : num) ? 'selected' : ''} ${num !== '10+' && num >= 8 ? 'is-large' : ''} ${num === '10+' ? 'is-hotline' : ''}`}
            onClick={() => onGuestSelect(num)}
          >
            <strong>{num}</strong>
            <span>{num === '10+' ? 'liên hệ hotline' : 'khách'}</span>
          </button>
        ))}
      </div>

      {inlineErrors.guests && <p className="form-error-inline booking-inline-alert">{inlineErrors.guests}</p>}
      {guestWarning && !inlineErrors.guests && <p className="booking-field-note">{guestWarning}</p>}

      {guestCount > SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN && (
        <div className="booking-hotline-hint booking-hotline-panel">
          <strong>Online booking đang tạm dừng cho nhóm trên {SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN} khách</strong>
          <p>{THONG_DIEP_HOTLINE_NHOM_DONG}</p>
          <a href={serviceHotlineLink} className="btn btn-primary">Gọi hotline đặt bàn</a>
        </div>
      )}
    </section>
  )
}

export default ChonSoKhachDatBan
