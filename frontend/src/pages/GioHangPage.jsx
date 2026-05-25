import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useThongBao } from '../context/ThongBaoContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import {
  xoaBanNhapTamThanhToan,
  layBanNhapTamThanhToan,
  luuBanNhapTamThanhToan,
} from '../services/dichVuBanNhapTamThanhToan'
import {
  xoaPhieuGiamGiaDaApDung as xoaPhieuGiamGiaDaLuu,
  layPhieuGiamGiaDaApDung as layPhieuGiamGiaDaLuu,
  luuPhieuGiamGiaDaApDung as luuPhieuGiamGiaDaLuu,
  tinhSoTienGiamTheoPhieuGiamGia,
} from '../services/dichVuPhieuGiamGia'
import {
  kiemTraPhieuGiamGiaApi,
  layDanhSachVoucherChoCheckoutApi,
} from '../services/api/apiMaGiamGia'
import {
  dichThongDiepLoiVoucher,
  getVoucherLoaiMaLabel,
  xacDinhTrangThaiVoucher,
} from '../services/api/voucherTrangThai'

import { tinhPhiDichVu } from '../utils/phiDichVu'

const dinhDangThoiGian = (giaTri) => {
  if (!giaTri) return '--'
  const thoiGian = new Date(giaTri)
  if (Number.isNaN(thoiGian.getTime())) return String(giaTri)
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(thoiGian)
}

const dinhDangSoTien = (giaTri) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(giaTri || 0))

const layNhanLoaiMa = (voucher) => voucher?.loaiMaHienThi || getVoucherLoaiMaLabel(voucher)

const layNhanLoaiGiam = (loaiGiam) => {
  const giaTri = String(loaiGiam || '').trim().toLowerCase()
  if (giaTri === 'percentage') return 'Phần trăm'
  if (giaTri === 'fixed_amount') return 'Số tiền cố định'
  return giaTri || '--'
}

const tinhTrangVoucher = (voucher, tongTienXetPhieuGiamGia) => {
  const tongTien = Number(tongTienXetPhieuGiamGia || 0)

  if (!voucher?.maCode) {
    return { coTheApDung: false, lyDo: 'Mã không hợp lệ' }
  }
  const trangThaiTinhToan = xacDinhTrangThaiVoucher(voucher)
  if (!trangThaiTinhToan.coTheApDung) {
    return { ...trangThaiTinhToan, lyDo: trangThaiTinhToan.lyDoTrangThai || 'Mã không hợp lệ hoặc đã hết hạn' }
  }
  if (voucher.soLanToiDa != null && Number(voucher.soLanDaDung || 0) >= Number(voucher.soLanToiDa)) {
    return { coTheApDung: false, lyDo: 'Đã hết lượt dùng' }
  }
  if (tongTien < Number(voucher.donHangToiThieu || 0)) {
    return { coTheApDung: false, lyDo: `Cần đơn từ ${dinhDangSoTien(voucher.donHangToiThieu || 0)}` }
  }

  return { coTheApDung: true, lyDo: 'Có thể dùng' }
}

function GioHangPage() {
  const navigate = useNavigate()
  const { cartItems, capNhatSoLuong, xoaKhoiGio, layKhoaMonTrongGio, layTuyChonHienThiMon } = useGioHang()
  const { hienCanhBao } = useThongBao()
  const { nguoiDungHienTai } = useXacThuc()

  const [ghiChu, setGhiChu] = useState('')
  const [maPhieuGiamGiaNhap, setMaPhieuGiamGiaNhap] = useState('')
  const [phieuGiamGiaDaApDung, setPhieuGiamGiaDaApDung] = useState(null)
  const [loiPhieuGiamGia, setLoiPhieuGiamGia] = useState('')
  const [dangApDungPhieuGiamGia, setDangApDungPhieuGiamGia] = useState(false)
  const [danhSachVoucherCheckout, setDanhSachVoucherCheckout] = useState([])
  const [dangTaiVoucherCheckout, setDangTaiVoucherCheckout] = useState(false)

  const tongSoLuongMon = cartItems.reduce((tong, item) => tong + item.quantity, 0)
  const tamTinh = cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0)
  const phiDichVu = tinhPhiDichVu(tamTinh)
  const tongTienXetPhieuGiamGia = tamTinh + phiDichVu
  const soTienGiam = tinhSoTienGiamTheoPhieuGiamGia(phieuGiamGiaDaApDung, tongTienXetPhieuGiamGia)
  const tongTien = Math.max(0, tongTienXetPhieuGiamGia - soTienGiam)

  useEffect(() => {
    const phieuGiamGiaDaLuu = layPhieuGiamGiaDaLuu()
    if (phieuGiamGiaDaLuu) {
      setPhieuGiamGiaDaApDung(phieuGiamGiaDaLuu)
      setMaPhieuGiamGiaNhap(phieuGiamGiaDaLuu.code)
    }

    const banNhapTam = layBanNhapTamThanhToan()
    if (banNhapTam) {
      setGhiChu(String(banNhapTam.note ?? '').slice(0, 300))
    }
  }, [])

  useEffect(() => {
    let daHuy = false

    const taiVoucherCheckout = async () => {
      setDangTaiVoucherCheckout(true)
      try {
        const phanHoi = await layDanhSachVoucherChoCheckoutApi()
        if (!daHuy) {
          setDanhSachVoucherCheckout(Array.isArray(phanHoi?.duLieu) ? phanHoi.duLieu : [])
        }
      } catch {
        if (!daHuy) {
          setDanhSachVoucherCheckout([])
        }
      } finally {
        if (!daHuy) {
          setDangTaiVoucherCheckout(false)
        }
      }
    }

    taiVoucherCheckout()
    return () => {
      daHuy = true
    }
  }, [nguoiDungHienTai?.maKH])

  useEffect(() => {
    if (tamTinh === 0 && phieuGiamGiaDaApDung) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia('')
      xoaPhieuGiamGiaDaLuu()
    }
  }, [tamTinh, phieuGiamGiaDaApDung])

  const handleDiDenThanhToan = () => {
    if (cartItems.length === 0) {
      hienCanhBao('Giỏ hàng đang trống. Hãy chọn món trước khi sang bước thanh toán.')
      xoaBanNhapTamThanhToan()
      return
    }

    if (phieuGiamGiaDaApDung) {
      luuPhieuGiamGiaDaLuu({
        ...phieuGiamGiaDaApDung,
        amount: soTienGiam,
      })
    } else {
      xoaPhieuGiamGiaDaLuu()
    }

    luuBanNhapTamThanhToan({ note: ghiChu, tableNumber: '' })
    navigate('/thanh-toan')
  }

  const handleApDungPhieuGiamGia = async (maCodeDeXuat) => {
    if (tamTinh <= 0) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia('❌ Mã không hợp lệ hoặc đã hết hạn')
      xoaPhieuGiamGiaDaLuu()
      return
    }

    const maPhieuGiamGia = String(maCodeDeXuat || maPhieuGiamGiaNhap).trim().toUpperCase()

    if (!maPhieuGiamGia) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia('❌ Mã không hợp lệ hoặc đã hết hạn')
      xoaPhieuGiamGiaDaLuu()
      return
    }

    setDangApDungPhieuGiamGia(true)

    try {
      const { duLieu } = await kiemTraPhieuGiamGiaApi(
        maPhieuGiamGia,
        tongTienXetPhieuGiamGia,
        '',
        nguoiDungHienTai?.maKH || '',
      )
      if (!duLieu) {
        setPhieuGiamGiaDaApDung(null)
        setLoiPhieuGiamGia('❌ Mã không hợp lệ hoặc đã hết hạn')
        xoaPhieuGiamGiaDaLuu()
        return
      }

      const phieuGiamGiaHopLe = luuPhieuGiamGiaDaLuu(duLieu)

      if (!phieuGiamGiaHopLe) {
        setPhieuGiamGiaDaApDung(null)
        setLoiPhieuGiamGia('❌ Mã không hợp lệ hoặc đã hết hạn')
        xoaPhieuGiamGiaDaLuu()
        return
      }

      setPhieuGiamGiaDaApDung(phieuGiamGiaHopLe)
      setMaPhieuGiamGiaNhap(phieuGiamGiaHopLe.code)
      setLoiPhieuGiamGia('')
    } catch (error) {
      setPhieuGiamGiaDaApDung(null)
      setLoiPhieuGiamGia(`❌ ${dichThongDiepLoiVoucher(error, 'Mã giảm giá không hợp lệ hoặc đã hết hạn.')}`)
      xoaPhieuGiamGiaDaLuu()
    } finally {
      setDangApDungPhieuGiamGia(false)
    }
  }

  const handleApDungVoucherTrongDanhSach = async (voucher) => {
    if (!voucher?.maCode) return
    setMaPhieuGiamGiaNhap(voucher.maCode)
    if (loiPhieuGiamGia) {
      setLoiPhieuGiamGia('')
    }
    await handleApDungPhieuGiamGia(voucher.maCode)
  }

  const handleBoPhieuGiamGia = () => {
    setPhieuGiamGiaDaApDung(null)
    setMaPhieuGiamGiaNhap('')
    setLoiPhieuGiamGia('')
    xoaPhieuGiamGiaDaLuu()
  }

  const renderThongBaoPhieuGiamGia = () => {
    if (loiPhieuGiamGia) {
      return <p className="phieu-giam-gia-message error">{loiPhieuGiamGia}</p>
    }

    if (phieuGiamGiaDaApDung) {
      const nhanGiamGia = phieuGiamGiaDaApDung.discountPercent > 0
        ? `${phieuGiamGiaDaApDung.discountPercent}%`
        : dinhDangTienTeVietNam(phieuGiamGiaDaApDung.amount || 0)

      return (
        <p className="phieu-giam-gia-message success">
          ✅ Áp dụng thành công — Giảm {nhanGiamGia}
        </p>
      )
    }

    return null
  }

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-layout">
          <div className="gio-hang-items-section">
            <div className="gio-hang-list-head">
              <h2>Giỏ hàng của bạn</h2>
              <span>{tongSoLuongMon > 0 ? `${tongSoLuongMon} món` : 'Giỏ hàng trống'}</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="gio-hang-empty">
                <p>Giỏ hàng trống</p>
                <button type="button" className="btn nut-chinh" onClick={() => navigate('/thuc-don')}>
                  Xem thực đơn
                </button>
              </div>
            ) : (
              <div className="gio-hang-item-list">
                {cartItems.map((item) => {
                  const itemKey = typeof layKhoaMonTrongGio === 'function' ? layKhoaMonTrongGio(item) : item.id
                  const optionLines = typeof layTuyChonHienThiMon === 'function' ? layTuyChonHienThiMon(item) : []
                  const coAnh = typeof item.image === 'string' && item.image.trim().length > 0
                  const moTaNgan = String(optionLines.join(' • ') || item.description || 'Món sẽ được chuẩn bị ngay sau khi bạn xác nhận đơn.')
                    .trim()
                  const tongTienMon = item.price * item.quantity

                  return (
                    <article key={itemKey} className="gio-hang-item">
                      <div className="gio-hang-item-media">
                        {coAnh ? (
                          <img className="gio-hang-item-image" src={item.image} alt={item.name} loading="lazy" />
                        ) : (
                          <div className="gio-hang-item-image gio-hang-item-image-placeholder" aria-hidden="true">
                            {item.name?.slice(0, 1) || 'M'}
                          </div>
                        )}
                      </div>

                      <div className="gio-hang-item-content">
                        <div className="gio-hang-item-top">
                          <div className="gio-hang-item-copy">
                            <h3>{item.name}</h3>
                            <p className="gio-hang-item-description" title={moTaNgan}>{moTaNgan}</p>
                          </div>

                          <button
                            type="button"
                            className="remove-btn gio-hang-remove-btn"
                            onClick={() => xoaKhoiGio(itemKey)}
                            aria-label={`Xóa nhanh ${item.name}`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path
                                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="gio-hang-item-bottom">
                          <div className="quantity-control" aria-label={`Số lượng món ${item.name}`}>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => capNhatSoLuong(itemKey, -1)}
                              aria-label="Giảm số lượng"
                            >
                              -
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => capNhatSoLuong(itemKey, 1)}
                              aria-label="Tăng số lượng"
                            >
                              +
                            </button>
                          </div>

                          <strong className="gio-hang-item-total">{dinhDangTienTeVietNam(tongTienMon)}</strong>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>

          <div className="gio-hang-summary">
            <div className="tom-tat-card gio-hang-tom-tat-card">
              <h2>Tổng kết đơn</h2>

              <div className="phieu-giam-gia-block">
                <div className="phieu-giam-gia-header">
                  <h3>Voucher của tôi</h3>
                  <p>Mã công khai và voucher riêng còn hiệu lực sẽ tự hiện ở đây.</p>
                </div>
                <div className="thanh-toan-voucher-xem-list" style={{ marginBottom: '0.75rem' }}>
                  {dangTaiVoucherCheckout ? (
                    <div className="gio-hang-voucher-loading">Đang tải voucher...</div>
                  ) : danhSachVoucherCheckout.length ? (
                    danhSachVoucherCheckout.map((voucher) => {
                      const daApDung = phieuGiamGiaDaApDung?.code === voucher.maCode
                      const trangThaiVoucher = tinhTrangVoucher(voucher, tongTienXetPhieuGiamGia)
                      const nhanLoaiMa = layNhanLoaiMa(voucher)
                      const nhanLoaiGiam = layNhanLoaiGiam(voucher.loaiGiam)
                      const moTaGiaTri = String(voucher.loaiGiam || '').toLowerCase() === 'percentage'
                        ? `${Number(voucher.giaTri || 0)}%`
                        : dinhDangTienTeVietNam(Number(voucher.giaTri || 0))
                      const hanDung = dinhDangThoiGian(voucher.ngayKetThuc)

                      return (
                        <div
                          key={voucher.maCode}
                          className={`thanh-toan-voucher-xem-item ${daApDung ? 'active' : ''}`}
                        >
                        <div>
                          <strong>{voucher.maCode}</strong>
                          <p>Tên mã: {voucher.tenCode || 'Voucher của bạn'}</p>
                          <p>Loại mã: {nhanLoaiMa}</p>
                          <p>Loại giảm: {nhanLoaiGiam}</p>
                          <p>Giá trị giảm: {moTaGiaTri}</p>
                          <p>Đơn tối thiểu: {voucher.donHangToiThieu > 0 ? dinhDangTienTeVietNam(voucher.donHangToiThieu) : 'không yêu cầu'}</p>
                          <p>Hạn dùng: {hanDung}</p>
                        </div>
                        <div style={{ display: 'grid', justifyItems: 'end', gap: '0.5rem' }}>
                          <span>
                            {daApDung
                              ? 'Đang áp dụng'
                              : trangThaiVoucher.coTheApDung
                                ? 'Có thể dùng'
                                : `Chưa đủ điều kiện: ${trangThaiVoucher.lyDo}`}
                          </span>
                          <button
                            type="button"
                            className="btn nut-chinh"
                            onClick={() => handleApDungVoucherTrongDanhSach(voucher)}
                            disabled={!trangThaiVoucher.coTheApDung || daApDung || dangApDungPhieuGiamGia}
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    )
                    })
                  ) : (
                    <div className="gio-hang-voucher-empty">Chưa có voucher phù hợp.</div>
                  )}
                </div>
                <div className="phieu-giam-gia-controls">
                  <input
                    type="text"
                    className="truong-nhap phieu-giam-gia-input"
                    placeholder="Nhập mã giảm giá"
                    value={maPhieuGiamGiaNhap}
                    onChange={(event) => {
                      setMaPhieuGiamGiaNhap(event.target.value)
                      if (loiPhieuGiamGia) {
                        setLoiPhieuGiamGia('')
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn nut-chinh phieu-giam-gia-apply-btn"
                    onClick={handleApDungPhieuGiamGia}
                    disabled={dangApDungPhieuGiamGia}
                  >
                    {dangApDungPhieuGiamGia ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                  {phieuGiamGiaDaApDung && (
                    <button type="button" className="btn nut-phu phieu-giam-gia-clear-btn" onClick={handleBoPhieuGiamGia}>
                      Bỏ mã
                    </button>
                  )}
                </div>
                {renderThongBaoPhieuGiamGia()}
              </div>

              <div className="tom-tat-row">
                <span>Tạm tính</span>
                <span>{dinhDangTienTeVietNam(tamTinh)}</span>
              </div>

              <div className="tom-tat-row">
                <span>Phí dịch vụ (5%)</span>
                <span>{dinhDangTienTeVietNam(phiDichVu)}</span>
              </div>

              {phieuGiamGiaDaApDung && (
                <div className="tom-tat-row tom-tat-discount">
                  <span>Giảm giá ({phieuGiamGiaDaApDung.code})</span>
                  <span>-{dinhDangTienTeVietNam(soTienGiam)}</span>
                </div>
              )}

              <div className="tom-tat-divider"></div>

              <div className="tom-tat-row tom-tat-total">
                <span>Tổng cộng</span>
                <strong>{dinhDangTienTeVietNam(tongTien)}</strong>
              </div>

              <div className="tom-tat-form">
                <div className="nhom-truong">
                  <label className="nhan-truong" htmlFor="gio-hang-note">Ghi chú cho quán</label>
                  <textarea
                    id="gio-hang-note"
                    className="truong-van-ban"
                    placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt về món ăn, hoặc ghi chú khác cho bếp..."
                    rows="3"
                    maxLength={300}
                    value={ghiChu}
                    onChange={(event) => setGhiChu(event.target.value.slice(0, 300))}
                  ></textarea>
                  <div className="gio-hang-note-counter">{ghiChu.length}/300</div>
                </div>
              </div>

              <button
                type="button"
                className="btn gio-hang-checkout-btn w-full"
                onClick={handleDiDenThanhToan}
                disabled={cartItems.length === 0}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GioHangPage
