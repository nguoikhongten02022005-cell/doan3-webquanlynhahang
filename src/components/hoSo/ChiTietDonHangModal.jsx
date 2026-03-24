import { useEffect } from 'react'
import { dinhDangNgay } from '../../features/bangDieuKhienNoiBo/dinhDang'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'

function ChiTietDonHangModal({ donHang, dangMo, onClose }) {
  useEffect(() => {
    if (!dangMo) {
      return undefined
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
    }
  }, [dangMo, onClose])

  if (!dangMo || !donHang) {
    return null
  }

  return (
    <div className="chi-tiet-mon-hop-thoai-overlay ho-so-order-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ho-so-order-modal-title" onClick={onClose}>
      <div className="chi-tiet-mon-modal ho-so-order-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="chi-tiet-mon-close" onClick={onClose} aria-label="Đóng chi tiết đơn hàng">
          ×
        </button>

        <div className="ho-so-order-modal-content">
          <div className="ho-so-order-modal-header">
            <span className={`nhan-trang-thai tone-${donHang.statusTone}`}>{donHang.statusLabel}</span>
            <h3 id="ho-so-order-modal-title">Chi tiết đơn {donHang.orderCode}</h3>
            <p>{dinhDangNgay(donHang.date)} • {donHang.time}</p>
          </div>

          <div className="ho-so-order-modal-summary">
            <div>
              <span>Số món</span>
              <strong>{donHang.itemCount} món</strong>
            </div>
            <div>
              <span>Tổng tiền</span>
              <strong>{dinhDangTienTeVietNam(donHang.total)}</strong>
            </div>
          </div>

          <div className="ho-so-order-modal-items">
            {donHang.items.map((item) => (
              <div key={item.id} className="ho-so-order-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>Số lượng: {item.quantity}</p>
                </div>
                <span>{dinhDangTienTeVietNam(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChiTietDonHangModal
