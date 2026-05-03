import { dinhDangTienTe } from './tienTe'
import { dinhDangNgay } from '../features/noiBo/dinhDang'
import { layNhanTrangThaiDonHang, layNhanPhuongThucThanhToan } from './donHang'

const maHoaHtmlIn = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const dinhDangNhanBan = (tableNumber) => {
  const normalized = String(tableNumber || '').trim()
  return normalized ? `BÀN ${normalized.toUpperCase()}` : 'BÀN WALK-IN'
}

const dinhDangMaDonHang = (order) => order.orderCode || order.code || `DH-${order.id}`

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

export const taoTongKetTienDonHang = (order) => {
  const items = Array.isArray(order?.items) ? order.items : []
  const subtotalFromItems = items.reduce(
    (tong, item) => tong + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )
  const subtotalValue = Number(order?.subtotal)
  const serviceFeeValue = Number(order?.serviceFee)
  const discountValue = Number(order?.discountAmount)

  const subtotal = Number.isFinite(subtotalValue) ? subtotalValue : subtotalFromItems
  const serviceFee = Number.isFinite(serviceFeeValue) ? serviceFeeValue : tinhPhiDichVu(subtotal)
  const discountAmount = Number.isFinite(discountValue) ? Math.max(0, discountValue) : 0
  const total = Math.max(0, subtotal + serviceFee - discountAmount)

  return { subtotal, serviceFee, discountAmount, total }
}

const taoHangMucMons = (items) => {
  if (!items.length) {
    return '<tr><td colspan="4" class="invoice-empty">Chưa có dữ liệu món để in hóa đơn.</td></tr>'
  }

  return items.map((item, index) => {
    const soLuong = Number(item.quantity) || 0
    const donGia = Number(item.price) || 0
    const thanhTien = soLuong * donGia
    const ghiChu = item.note ? `<div class="invoice-note">${maHoaHtmlIn(item.note)}</div>` : ''
    const size = item.size ? ` <span class="invoice-size">(Size ${maHoaHtmlIn(item.size)})</span>` : ''

    return `
      <tr>
        <td>
          <div class="invoice-item-name">${index + 1}. ${maHoaHtmlIn(item.name || `Món ${index + 1}`)}${size}</div>
          ${ghiChu}
        </td>
        <td>${soLuong}</td>
        <td>${maHoaHtmlIn(dinhDangTienTe(donGia))}</td>
        <td>${maHoaHtmlIn(dinhDangTienTe(thanhTien))}</td>
      </tr>
    `
  }).join('')
}

const cssHoaDon = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #ffffff; }
  .invoice { max-width: 820px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 18px; padding: 28px; }
  .invoice-header { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 2px solid #e2e8f0; }
  .invoice-kicker { margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #64748b; }
  .invoice-title { margin: 0; font-size: 28px; line-height: 1.2; }
  .invoice-subtitle, .invoice-meta p, .invoice-note, .invoice-footer { margin: 0; color: #475569; font-size: 14px; line-height: 1.6; }
  .invoice-meta { text-align: right; }
  .invoice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 22px; }
  .invoice-panel { border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; background: #f8fafc; }
  .invoice-panel h2 { margin: 0 0 10px; font-size: 14px; }
  .invoice-table { width: 100%; border-collapse: collapse; margin-top: 22px; }
  .invoice-table th, .invoice-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; text-align: left; font-size: 14px; }
  .invoice-table th:nth-child(2), .invoice-table th:nth-child(3), .invoice-table th:nth-child(4),
  .invoice-table td:nth-child(2), .invoice-table td:nth-child(3), .invoice-table td:nth-child(4) { width: 110px; text-align: right; }
  .invoice-item-name { font-weight: 700; color: #0f172a; }
  .invoice-size { font-weight: 400; color: #475569; }
  .invoice-empty { text-align: center !important; color: #64748b; }
  .invoice-summary { width: 320px; margin-top: 20px; margin-left: auto; }
  .invoice-summary-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; font-size: 14px; }
  .invoice-summary-row.total { margin-top: 8px; padding-top: 14px; border-top: 1px solid #cbd5e1; font-size: 16px; font-weight: 700; }
  .invoice-footer { margin-top: 28px; padding-top: 18px; border-top: 1px dashed #cbd5e1; text-align: center; }
  @media print { body { padding: 0; } .invoice { border: none; border-radius: 0; padding: 0; } }
`

export const taoNoiDungInHoaDon = (order) => {
  const items = Array.isArray(order?.items) ? order.items : []
  const tongKetTien = taoTongKetTienDonHang(order)

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Hóa đơn #${maHoaHtmlIn(dinhDangMaDonHang(order))}</title>
    <style>${cssHoaDon}</style>
  </head>
  <body>
    <main class="invoice">
      <header class="invoice-header">
        <div>
          <p class="invoice-kicker">Hóa đơn thanh toán</p>
          <h1 class="invoice-title">${maHoaHtmlIn(dinhDangNhanBan(order.tableNumber))}</h1>
          <p class="invoice-subtitle">Mã đơn #${maHoaHtmlIn(dinhDangMaDonHang(order))}</p>
        </div>
        <div class="invoice-meta">
          <p><strong>Thời gian:</strong> ${maHoaHtmlIn(dinhDangNgay(order.orderDate))}</p>
          <p><strong>Trạng thái:</strong> ${maHoaHtmlIn(layNhanTrangThaiDonHang(order.status))}</p>
          <p><strong>Thanh toán:</strong> ${maHoaHtmlIn(layNhanPhuongThucThanhToan(order.paymentMethod))}</p>
        </div>
      </header>

      <section class="invoice-grid">
        <div class="invoice-panel">
          <h2>Khách hàng</h2>
          <p>${maHoaHtmlIn(order.customer?.fullName || 'Khách lẻ')}</p>
          <p>${maHoaHtmlIn(order.customer?.phone || 'Không có số điện thoại')}</p>
        </div>
        <div class="invoice-panel">
          <h2>Ghi chú</h2>
          <p>${maHoaHtmlIn(order.note || 'Không có ghi chú cho đơn này.')}</p>
        </div>
      </section>

      <table class="invoice-table">
        <thead>
          <tr><th>Món</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
        </thead>
        <tbody>${taoHangMucMons(items)}</tbody>
      </table>

      <section class="invoice-summary">
        <div class="invoice-summary-row"><span>Tạm tính</span><span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.subtotal))}</span></div>
        <div class="invoice-summary-row"><span>Phí dịch vụ</span><span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.serviceFee))}</span></div>
        ${tongKetTien.discountAmount > 0 ? `<div class="invoice-summary-row"><span>Voucher</span><span>-${maHoaHtmlIn(dinhDangTienTe(tongKetTien.discountAmount))}</span></div>` : ''}
        <div class="invoice-summary-row total"><span>Tổng cộng</span><span>${maHoaHtmlIn(dinhDangTienTe(tongKetTien.total))}</span></div>
      </section>

      <p class="invoice-footer">Cảm ơn quý khách đã sử dụng dịch vụ của nhà hàng.</p>
    </main>
    <script>
      window.addEventListener('load', () => { window.print(); window.onafterprint = () => window.close(); });
    </script>
  </body>
</html>`
}

export const moCuaSoInHoaDon = (order, onError) => {
  if (!order || !Array.isArray(order.items) || !order.items.length) {
    onError?.('Cần tải đầy đủ chi tiết món trước khi in hóa đơn.')
    return false
  }

  const cuaSoIn = window.open('', '_blank', 'width=960,height=720')
  if (!cuaSoIn) {
    onError?.('Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra chặn popup của trình duyệt.')
    return false
  }

  cuaSoIn.document.write(taoNoiDungInHoaDon(order))
  cuaSoIn.document.close()
  cuaSoIn.focus()
  return true
}
