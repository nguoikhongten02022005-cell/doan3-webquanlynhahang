import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHangMangVe } from '../context/GioHangMangVeContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import { layJsonLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { xoaPhieuGiamGiaDaApDung as clearStoredVoucher, layPhieuGiamGiaDaApDung as getStoredVoucher, luuPhieuGiamGiaDaApDung as saveVoucher } from '../services/dichVuPhieuGiamGia'

const VOUCHER_MOCK_DATA = Object.freeze({ SUMMER30: 30, WELCOME10: 10, FREESHIP: 20 })
const DANH_SACH_GIO_LAY = ['10:30', '11:00', '11:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
const DANH_SACH_GIO_GIAO = ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.ceil((tamTinh * 0.05) / 1000) * 1000 : 0)
const PHI_SHIP_CO_DINH = 30000
const tinhSoTienGiam = (voucher, tamTinh) => {
  if (!voucher) return 0
  const phanTramGiam = Number(voucher.discountPercent || 0)
  const soTienGiamTamTinh = phanTramGiam > 0 ? Math.round((tamTinh * phanTramGiam) / 100) : Number(voucher.amount || 0)
  return Math.min(Math.max(0, soTienGiamTamTinh), tamTinh)
}

function MangVeGioHangPage() {
  const navigate = useNavigate()
  const { cartItems, capNhatSoLuong, xoaKhoiGio, layKhoaMonTrongGio, layTuyChonHienThiMon } = useGioHangMangVe()
  const [gioLayHang, setGioLayHang] = useState('')
  const [loaiNhanHang, setLoaiNhanHang] = useState('MANG_VE_PICKUP')
  const [diaChiGiao, setDiaChiGiao] = useState('')
  const [gioGiao, setGioGiao] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [maVoucherNhap, setMaVoucherNhap] = useState('')
  const [voucherDaApDung, setVoucherDaApDung] = useState(null)
  const [loiVoucher, setLoiVoucher] = useState('')

  const tamTinh = useMemo(() => cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0), [cartItems])
  const phiDichVu = tinhPhiDichVu(tamTinh)
  const soTienGiam = tinhSoTienGiam(voucherDaApDung, tamTinh)
  const phiShip = loaiNhanHang === 'MANG_VE_GIAO_HANG' ? PHI_SHIP_CO_DINH : 0
  const tongTien = Math.max(0, tamTinh + phiDichVu + phiShip - soTienGiam)

  useEffect(() => {
    const draft = layJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE, null)
    if (draft) {
      setLoaiNhanHang(String(draft.loaiNhanHang || 'MANG_VE_PICKUP'))
      setGioLayHang(String(draft.gioLayHang || ''))
      setGioGiao(String(draft.gioGiao || ''))
      setDiaChiGiao(String(draft.diaChiGiao || ''))
      setGhiChu(String(draft.ghiChu || ''))
    }
    const voucher = getStoredVoucher()
    if (voucher) {
      setVoucherDaApDung(voucher)
      setMaVoucherNhap(voucher.code)
    }
  }, [])

  const handleApplyVoucher = () => {
    const maVoucher = maVoucherNhap.trim().toUpperCase()
    const phanTramGiam = VOUCHER_MOCK_DATA[maVoucher]
    if (!maVoucher || !phanTramGiam) {
      setVoucherDaApDung(null)
      setLoiVoucher('Mã không hợp lệ hoặc đã hết hạn.')
      clearStoredVoucher()
      return
    }
    const voucher = saveVoucher({ code: maVoucher, discountPercent: phanTramGiam, amount: Math.round((tamTinh * phanTramGiam) / 100) })
    setVoucherDaApDung(voucher)
    setLoiVoucher('')
  }

  const diTiep = () => {
    datJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE, {
      loaiNhanHang,
      gioLayHang,
      gioGiao,
      diaChiGiao,
      ghiChu,
      voucherCode: voucherDaApDung?.code || '',
    })
    navigate('/mang-ve/thanh-toan')
  }

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-layout">
          <div className="gio-hang-items-section">
            <div className="gio-hang-list-head"><h2>Giỏ mang về</h2><span>{cartItems.length} món</span></div>
            <div className="gio-hang-item-list">
              {cartItems.map((item) => {
                const itemKey = layKhoaMonTrongGio(item)
                const coAnh = typeof item.image === 'string' && item.image.trim().length > 0
                return (
                  <article key={itemKey} className="gio-hang-item">
                    <div className="gio-hang-item-media">
                      {coAnh ? <img className="gio-hang-item-image" src={item.image} alt={item.name} /> : null}
                    </div>
                    <div className="gio-hang-item-content">
                      <div className="gio-hang-item-top">
                        <div className="gio-hang-item-copy">
                          <h3>{item.name}</h3>
                          <p className="gio-hang-item-description">{layTuyChonHienThiMon(item).join(' • ') || item.description}</p>
                        </div>
                        <button type="button" className="remove-btn gio-hang-remove-btn" onClick={() => xoaKhoiGio(itemKey)}>×</button>
                      </div>
                      <div className="gio-hang-item-bottom">
                        <div className="quantity-control">
                          <button type="button" className="qty-btn" onClick={() => capNhatSoLuong(itemKey, -1)}>-</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button type="button" className="qty-btn" onClick={() => capNhatSoLuong(itemKey, 1)}>+</button>
                        </div>
                        <strong className="gio-hang-item-total">{dinhDangTienTeVietNam(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          <div className="gio-hang-summary">
            <div className="tom-tat-card gio-hang-tom-tat-card">
              <h2>Đơn mang về</h2>
              <div className="nhom-truong">
                <label className="nhan-truong">Hình thức nhận hàng</label>
                <div className="thanh-toan-voucher-xem-list">
                  <label className={`chi-tiet-mon-option ${loaiNhanHang === 'MANG_VE_PICKUP' ? 'selected' : ''}`}>
                    <input type="radio" checked={loaiNhanHang === 'MANG_VE_PICKUP'} onChange={() => setLoaiNhanHang('MANG_VE_PICKUP')} />
                    <span className="chi-tiet-mon-option-label">Tự đến lấy</span>
                  </label>
                  <label className={`chi-tiet-mon-option ${loaiNhanHang === 'MANG_VE_GIAO_HANG' ? 'selected' : ''}`}>
                    <input type="radio" checked={loaiNhanHang === 'MANG_VE_GIAO_HANG'} onChange={() => setLoaiNhanHang('MANG_VE_GIAO_HANG')} />
                    <span className="chi-tiet-mon-option-label">Giao hàng</span>
                  </label>
                </div>
              </div>
              <div className="nhom-truong">
                <label className="nhan-truong" htmlFor="gio-lay-hang">{loaiNhanHang === 'MANG_VE_GIAO_HANG' ? 'Thời gian giao' : 'Giờ đến lấy'}</label>
                <select id="gio-lay-hang" className="truong-nhap" value={loaiNhanHang === 'MANG_VE_GIAO_HANG' ? gioGiao : gioLayHang} onChange={(e) => loaiNhanHang === 'MANG_VE_GIAO_HANG' ? setGioGiao(e.target.value) : setGioLayHang(e.target.value)}>
                  <option value="">{loaiNhanHang === 'MANG_VE_GIAO_HANG' ? 'Chọn giờ giao' : 'Chọn giờ đến lấy'}</option>
                  {(loaiNhanHang === 'MANG_VE_GIAO_HANG' ? DANH_SACH_GIO_GIAO : DANH_SACH_GIO_LAY).map((gio) => <option key={gio} value={gio}>{gio}</option>)}
                </select>
              </div>
              {loaiNhanHang === 'MANG_VE_GIAO_HANG' ? (
                <>
                  <div className="nhom-truong">
                    <label className="nhan-truong" htmlFor="dia-chi-giao">Địa chỉ giao</label>
                    <input id="dia-chi-giao" className="truong-nhap" placeholder="Nhập địa chỉ đầy đủ..." value={diaChiGiao} onChange={(e) => setDiaChiGiao(e.target.value)} />
                  </div>
                  <p className="thanh-toan-tom-tat-note">Chỉ giao trong nội thành TP.HCM.</p>
                </>
              ) : null}
              <div className="voucher-block">
                <div className="voucher-header"><h3>Mã giảm giá</h3></div>
                <div className="voucher-controls">
                  <input className="truong-nhap voucher-input" placeholder="Nhập mã giảm giá" value={maVoucherNhap} onChange={(e) => setMaVoucherNhap(e.target.value)} />
                  <button type="button" className="btn nut-chinh voucher-apply-btn" onClick={handleApplyVoucher}>Áp dụng</button>
                </div>
                {loiVoucher ? <p className="voucher-message error">{loiVoucher}</p> : null}
              </div>
              <div className="nhom-truong">
                <label className="nhan-truong" htmlFor="ghi-chu-mang-ve">Ghi chú</label>
                <textarea id="ghi-chu-mang-ve" className="truong-van-ban" rows="3" value={ghiChu} onChange={(e) => setGhiChu(e.target.value.slice(0, 300))} />
              </div>
              <div className="tom-tat-row"><span>Tạm tính</span><span>{dinhDangTienTeVietNam(tamTinh)}</span></div>
              <div className="tom-tat-row"><span>Phí dịch vụ (5%)</span><span>{dinhDangTienTeVietNam(phiDichVu)}</span></div>
              {loaiNhanHang === 'MANG_VE_GIAO_HANG' ? <div className="tom-tat-row"><span>Phí ship</span><span>{dinhDangTienTeVietNam(phiShip)}</span></div> : null}
              <div className="tom-tat-row tom-tat-discount"><span>Giảm giá</span><span>-{dinhDangTienTeVietNam(soTienGiam)}</span></div>
              <div className="tom-tat-row tom-tat-total"><span>Tổng cộng</span><strong>{dinhDangTienTeVietNam(tongTien)}</strong></div>
              <button type="button" className="btn gio-hang-checkout-btn w-full" disabled={!(loaiNhanHang === 'MANG_VE_GIAO_HANG' ? (gioGiao && diaChiGiao.trim()) : gioLayHang) || cartItems.length === 0} onClick={diTiep}>Tiếp tục thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangVeGioHangPage
