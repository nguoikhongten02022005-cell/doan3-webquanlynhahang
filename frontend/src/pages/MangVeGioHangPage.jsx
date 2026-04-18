import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHangMangVe } from '../context/GioHangMangVeContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import { layJsonLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { xoaPhieuGiamGiaDaApDung as xoaPhieuGiamGiaDaLuu, layPhieuGiamGiaDaApDung as layPhieuGiamGiaDaLuu, luuPhieuGiamGiaDaApDung as luuPhieuGiamGiaDaLuu, tinhSoTienGiamTheoPhieuGiamGia } from '../services/dichVuPhieuGiamGia'
import { kiemTraPhieuGiamGiaApi } from '../services/api/apiPhieuGiamGia'
import { DANH_SACH_PHIEU_GIAM_GIA_GOI_Y } from '../features/gioHang/constants/phieuGiamGia'

const DANH_SACH_GIO_LAY = ['10:30', '11:00', '11:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
const DANH_SACH_GIO_GIAO = ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)
const PHI_SHIP_CO_DINH = 30000

function MangVeGioHangPage() {
  const navigate = useNavigate()
  const { cartItems, capNhatSoLuong, xoaKhoiGio, layKhoaMonTrongGio, layTuyChonHienThiMon } = useGioHangMangVe()
  const [gioLayHang, setGioLayHang] = useState('')
  const [loaiNhanHang, setLoaiNhanHang] = useState('MANG_VE_PICKUP')
  const [diaChiGiao, setDiaChiGiao] = useState('')
  const [gioGiao, setGioGiao] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [maPhieuGiamGiaNhap, setMaPhieuGiamGiaNhap] = useState('')
  const [phieuGiamGiaDaApDung, setPhieuGiamGiaDaApDung] = useState(null)
  const [loiPhieuGiamGia, setLoiPhieuGiamGia] = useState('')
  const [dangApDungPhieuGiamGia, setDangApDungPhieuGiamGia] = useState(false)

  const tamTinh = useMemo(() => cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0), [cartItems])
  const phiDichVu = tinhPhiDichVu(tamTinh)
  const phiShip = loaiNhanHang === 'MANG_VE_GIAO_HANG' ? PHI_SHIP_CO_DINH : 0
  const tongTienXetPhieuGiamGia = tamTinh + phiDichVu + phiShip
  const soTienGiam = tinhSoTienGiamTheoPhieuGiamGia(phieuGiamGiaDaApDung, tongTienXetPhieuGiamGia)
  const tongTien = Math.max(0, tongTienXetPhieuGiamGia - soTienGiam)

  useEffect(() => {
    const draft = layJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE, null)
    if (draft) {
      setLoaiNhanHang(String(draft.loaiNhanHang || 'MANG_VE_PICKUP'))
      setGioLayHang(String(draft.gioLayHang || ''))
      setGioGiao(String(draft.gioGiao || ''))
      setDiaChiGiao(String(draft.diaChiGiao || ''))
      setGhiChu(String(draft.ghiChu || ''))
    }
    const phieuGiamGiaDaLuu = layPhieuGiamGiaDaLuu()
    if (phieuGiamGiaDaLuu) {
      setPhieuGiamGiaDaApDung(phieuGiamGiaDaLuu)
      setMaPhieuGiamGiaNhap(phieuGiamGiaDaLuu.code)
    }
  }, [])

  const handleApDungPhieuGiamGia = async () => {
    const maPhieuGiamGia = maPhieuGiamGiaNhap.trim().toUpperCase()

    if (!maPhieuGiamGia || tamTinh <= 0) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia('Mã không hợp lệ hoặc chưa đủ điều kiện áp dụng.')
      xoaPhieuGiamGiaDaLuu()
      return
    }

    setDangApDungPhieuGiamGia(true)

    try {
      const { duLieu } = await kiemTraPhieuGiamGiaApi(maPhieuGiamGia, tongTienXetPhieuGiamGia, loaiNhanHang)

      if (!duLieu?.code) {
        setPhieuGiamGiaDaApDung(null)
        setLoiPhieuGiamGia('Mã không hợp lệ hoặc đã hết hạn.')
        xoaPhieuGiamGiaDaLuu()
        return
      }

      const phieuGiamGiaHopLe = luuPhieuGiamGiaDaLuu(duLieu)

      setPhieuGiamGiaDaApDung(phieuGiamGiaHopLe)
      setMaPhieuGiamGiaNhap(phieuGiamGiaHopLe.code)
      setLoiPhieuGiamGia('')
    } catch (error) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia(error?.message || 'Mã không hợp lệ hoặc đã hết hạn.')
      xoaPhieuGiamGiaDaLuu()
    } finally {
      setDangApDungPhieuGiamGia(false)
    }
  }

  const handleDiTiep = () => {
    datJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE, {
      loaiNhanHang,
      gioLayHang,
      gioGiao,
      diaChiGiao,
      ghiChu,
      voucherCode: phieuGiamGiaDaApDung?.code || '',
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
                <label className="nhan-truong" id="mang-ve-loai-nhan-hang-label">Hình thức nhận hàng</label>
                <div className="thanh-toan-voucher-xem-list" role="radiogroup" aria-labelledby="mang-ve-loai-nhan-hang-label">
                  <label className={`chi-tiet-mon-option ${loaiNhanHang === 'MANG_VE_PICKUP' ? 'selected' : ''}`}>
                    <input type="radio" name="loaiNhanHang" checked={loaiNhanHang === 'MANG_VE_PICKUP'} onChange={() => setLoaiNhanHang('MANG_VE_PICKUP')} />
                    <span className="chi-tiet-mon-option-label">Tự đến lấy</span>
                  </label>
                  <label className={`chi-tiet-mon-option ${loaiNhanHang === 'MANG_VE_GIAO_HANG' ? 'selected' : ''}`}>
                    <input type="radio" name="loaiNhanHang" checked={loaiNhanHang === 'MANG_VE_GIAO_HANG'} onChange={() => setLoaiNhanHang('MANG_VE_GIAO_HANG')} />
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
                    <input id="dia-chi-giao" className="truong-nhap" autoComplete="street-address" placeholder="Nhập địa chỉ đầy đủ..." value={diaChiGiao} onChange={(e) => setDiaChiGiao(e.target.value)} />
                  </div>
                  <p className="thanh-toan-tom-tat-note">Chỉ giao trong nội thành TP.HCM.</p>
                </>
              ) : null}
              <div className="phieu-giam-gia-block">
                <div className="phieu-giam-gia-header">
                  <h3>Mã giảm giá</h3>
                  <p>{DANH_SACH_PHIEU_GIAM_GIA_GOI_Y.length} mã đang khả dụng theo cấu hình hiện tại.</p>
                </div>
                <div className="thanh-toan-voucher-xem-list" style={{ marginBottom: '0.75rem' }}>
                  {DANH_SACH_PHIEU_GIAM_GIA_GOI_Y.map((phieuGiamGia) => {
                    const dangDuocApDung = phieuGiamGiaDaApDung?.code === phieuGiamGia.code

                    return (
                      <button
                        key={phieuGiamGia.code}
                        type="button"
                        className={`thanh-toan-voucher-xem-item ${dangDuocApDung ? 'active' : ''}`}
                        onClick={() => {
                          setMaPhieuGiamGiaNhap(phieuGiamGia.code)
                          if (loiPhieuGiamGia) setLoiPhieuGiamGia('')
                        }}
                      >
                        <div>
                          <strong>{phieuGiamGia.code}</strong>
                          <p>{phieuGiamGia.moTa}</p>
                        </div>
                        <span>{dangDuocApDung ? 'Đang áp dụng' : phieuGiamGia.giaTri}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="phieu-giam-gia-controls">
                  <input className="truong-nhap phieu-giam-gia-input" aria-label="Nhập mã giảm giá" placeholder="Nhập mã giảm giá" value={maPhieuGiamGiaNhap} onChange={(e) => setMaPhieuGiamGiaNhap(e.target.value)} />
                  <button type="button" className="btn nut-chinh phieu-giam-gia-apply-btn" onClick={handleApDungPhieuGiamGia} disabled={dangApDungPhieuGiamGia}>{dangApDungPhieuGiamGia ? 'Đang kiểm tra...' : 'Áp dụng'}</button>
                </div>
                {loiPhieuGiamGia ? <p className="phieu-giam-gia-message error">{loiPhieuGiamGia}</p> : null}
                {!loiPhieuGiamGia && phieuGiamGiaDaApDung ? <p className="phieu-giam-gia-message success">Đã áp dụng mã {phieuGiamGiaDaApDung.code}.</p> : null}
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
              <button type="button" className="btn gio-hang-checkout-btn w-full" disabled={!(loaiNhanHang === 'MANG_VE_GIAO_HANG' ? (gioGiao && diaChiGiao.trim()) : gioLayHang) || cartItems.length === 0} onClick={handleDiTiep}>Tiếp tục thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangVeGioHangPage
