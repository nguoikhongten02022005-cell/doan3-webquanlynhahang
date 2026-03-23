function BuocBaDatBan({ summary, contactSummary, reviewNotice, submitError, isSubmitting, onBack, onSubmit }) {
  return (
    <article className="dat-ban-customer-card dat-ban-customer-card-soft dat-ban-customer-flow-card">

      <div className="dat-ban-review-grid">
        <section className="dat-ban-review-card">
          <p className="eyebrow">Thông tin đặt bàn</p>
          <div className="dat-ban-review-list">
            <div><span>👥 Số khách</span><strong>{summary.guests}</strong></div>
            <div><span>📅 Ngày</span><strong>{summary.date}</strong></div>
            <div><span>🕕 Giờ</span><strong>{summary.time}</strong></div>
            <div><span>📍 Khu vực</span><strong>{summary.area}</strong></div>
          </div>
        </section>

        <section className="dat-ban-review-card">
          <p className="eyebrow">Thông tin liên hệ</p>
          <div className="dat-ban-review-list">
            <div><span>👤 Họ tên</span><strong>{contactSummary.name}</strong></div>
            <div><span>📞 SĐT</span><strong>{contactSummary.phone}</strong></div>
            <div><span>📧 Email</span><strong>{contactSummary.email}</strong></div>
            <div><span>📝 Ghi chú</span><strong>{contactSummary.notes}</strong></div>
            <div><span>🎟️ Voucher</span><strong>{contactSummary.voucher}</strong></div>
          </div>
        </section>
      </div>

      <section className="dat-ban-review-notes">
        <p className="eyebrow">Lưu ý quan trọng</p>
        <ul>
          {reviewNotice.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      {submitError ? <p className="dat-ban-customer-error">{submitError}</p> : null}

      <div className="dat-ban-review-actions">
        <button type="button" className="btn nut-phu" onClick={onBack}>← Quay lại</button>
        <button type="button" className="btn nut-chinh" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý đặt bàn...' : '✅ Xác nhận'}
        </button>
      </div>
    </article>
  )
}

export default BuocBaDatBan
