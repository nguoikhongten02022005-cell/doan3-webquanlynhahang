import { useEffect } from 'react'
import { dinhDangNgay } from '../../features/bangDieuKhienNoiBo/dinhDang'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'

const NHAN_TRANG_THAI = {
  Pending: { label: 'Chờ xác nhận', tone: 'warning' },
  Confirmed: { label: 'Đã xác nhận', tone: 'success' },
  Preparing: { label: 'Đang chuẩn bị', tone: 'accent' },
  Ready: { label: 'Sẵn sàng lấy', tone: 'success' },
  Served: { label: 'Đang giao', tone: 'info' },
  Paid: { label: 'Hoàn thành', tone: 'neutral' },
  Cancelled: { label: 'Đã hủy', tone: 'danger' },
}

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

  const nhanTrangThai = NHAN_TRANG_THAI[donHang.trangThai] || { label: donHang.statusLabel || donHang.trangThai, tone: donHang.statusTone || 'neutral' }
  const danhSachMon = donHang.danhSachMon || donHang.items || []
  const maDonHang = donHang.maDonHang || donHang.orderCode
  const thoiGianDon = donHang.ngayTao || donHang.date
  const gioDon = donHang.gioGiao || donHang.gioLayHang || donHang.time || ''
  const tongTien = donHang.tongTien || donHang.total || 0

  return (
    <div className="chi-tiet-mon-hop-thoai-overlay ho-so-order-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ho-so-order-modal-title" onClick={onClose}>
      <div className="chi-tiet-mon-modal ho-so-order-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="chi-tiet-mon-close" onClick={onClose} aria-label="Đóng chi tiết đơn hàng">
          ×
        </button>

        <div className="ho-so-order-modal-content">
          <div className="ho-so-order-modal-header">
            <span className={`nhan-trang-thai tone-${nhanTrangThai.tone}`}>{nhanTrangThai.label}</span>
            <h3 id="ho-so-order-modal-title">Chi tiết đơn {maDonHang}</h3>
            <p>{dinhDangNgay(thoiGianDon)}{gioDon ? ` • ${gioDon}` : ''}</p>
          </div>

          <div className="ho-so-order-modal-summary">
            <div>
              <span>Số món</span>
              <strong>{danhSachMon.length} món</strong>
            </div>
            <div>
              <span>Tổng tiền</span>
              <strong>{dinhDangTienTeVietNam(tongTien)}</strong>
            </div>
          </div>

          <div className="ho-so-order-modal-items">
            {danhSachMon.map((item, index) => (
              <div key={item.id || `${item.tenMon}-${index}`} className="ho-so-order-item">
                <div>
                  <strong>{item.tenMon || item.name}</strong>
                  <p>Số lượng: {item.soLuong || item.quantity}</p>
                </div>
                <span>{dinhDangTienTeVietNam(item.donGia || item.price || item.thanhTien || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChiTietDonHangModal
