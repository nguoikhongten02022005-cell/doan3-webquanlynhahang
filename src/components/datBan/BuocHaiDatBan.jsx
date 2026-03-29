import { CAC_GOI_Y_GHI_CHU_DAT_BAN, CAC_DIP_DAT_BAN } from '../../data/duLieuDatBan'

function BuocHaiDatBan({
  formData,
  fieldErrors,
  onFieldChange,
  onFieldBlur,
  onSuggestionClick,
}) {
  const noteLength = formData.notes.length

  return (
    <article className="dat-ban-customer-card dat-ban-customer-card-soft dat-ban-customer-flow-card">
      <div className="dat-ban-customer-form-grid">
        <label className="dat-ban-customer-field">
          <span>Họ và tên *</span>
          <input
            type="text"
            className={`truong-nhap dat-ban-step-two-input ${fieldErrors.name ? 'truong-nhap-error' : ''}`}
            placeholder="Nguyễn Văn A"
            value={formData.name}
            onChange={onFieldChange('name')}
            onBlur={onFieldBlur('name')}
          />
          {fieldErrors.name ? <small className="dat-ban-customer-error-inline">{fieldErrors.name}</small> : null}
        </label>

        <label className="dat-ban-customer-field">
          <span>Số điện thoại *</span>
          <input
            type="tel"
            className={`truong-nhap dat-ban-step-two-input ${fieldErrors.phone ? 'truong-nhap-error' : ''}`}
            placeholder="0901 234 567"
            value={formData.phone}
            onChange={onFieldChange('phone')}
            onBlur={onFieldBlur('phone')}
          />
          {fieldErrors.phone ? <small className="dat-ban-customer-error-inline">{fieldErrors.phone}</small> : null}
        </label>

        <label className="dat-ban-customer-field dat-ban-customer-field-wide">
          <span>Email</span>
          <input
            type="email"
            className={`truong-nhap dat-ban-step-two-input ${fieldErrors.email ? 'truong-nhap-error' : ''}`}
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={onFieldChange('email')}
            onBlur={onFieldBlur('email')}
          />
          {fieldErrors.email ? <small className="dat-ban-customer-error-inline">{fieldErrors.email}</small> : null}
        </label>

        <label className="dat-ban-customer-field">
          <span>Dịp dùng bữa</span>
          <select className="truong-nhap dat-ban-step-two-input" value={formData.occasion} onChange={onFieldChange('occasion')}>
            <option value="">Không có</option>
            {CAC_DIP_DAT_BAN.map((occasion) => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
        </label>

        <label className="dat-ban-customer-field dat-ban-customer-field-wide">
          <span>Ghi chú cho nhà hàng</span>
          <textarea
            className={`truong-van-ban dat-ban-step-two-textarea ${fieldErrors.notes ? 'truong-nhap-error' : ''}`}
            rows="4"
            placeholder="VD: Có trẻ em, cần ghế cao, muốn bàn gần cửa sổ..."
            value={formData.notes}
            onChange={onFieldChange('notes')}
            onBlur={onFieldBlur('notes')}
          />
          <div className="dat-ban-field-meta-row">
            {fieldErrors.notes ? <small className="dat-ban-customer-error-inline">{fieldErrors.notes}</small> : <small className="dat-ban-customer-help-text">Tối đa 200 ký tự.</small>}
            <small className="dat-ban-customer-counter">{noteLength}/200</small>
          </div>
        </label>
      </div>

      <div className="dat-ban-customer-chip-row">
        {CAC_GOI_Y_GHI_CHU_DAT_BAN.map((item) => (
          <button key={item} type="button" className="dat-ban-customer-note-chip" onClick={() => onSuggestionClick(item)}>
            {item}
          </button>
        ))}
      </div>
    </article>
  )
}

export default BuocHaiDatBan
