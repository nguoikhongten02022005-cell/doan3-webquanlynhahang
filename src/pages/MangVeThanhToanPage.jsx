import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHangMangVe } from '../context/GioHangMangVeContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useThongBao } from '../context/ThongBaoContext'
import { layJsonLuuTru, xoaMucLuuTru } from '../services/dichVuLuuTru'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import { taoDonMangVeApi } from '../services/api/apiMangVe'

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)
const PHI_SHIP_CO_DINH = 30000

function MangVeThanhToanPage() {
  const navigate = useNavigate()
  const { nguoiDungHienTai } = useXacThuc()
  const { hienThanhCong, hienLoi } = useThongBao()
  const { cartItems, xoaToanBoGio } = useGioHangMangVe()
  const draft = layJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE, null)

  const [formData, setFormData] = useState({
    hoTen: nguoiDungHienTai?.fullName || '',
    soDienThoai: nguoiDungHienTai?.phone || '',
    loaiNhanHang: draft?.loaiNhanHang || 'MANG_VE_PICKUP',
    gioLayHang: draft?.gioLayHang || '',
    gioGiao: draft?.gioGiao || '',
    diaChiGiao: draft?.diaChiGiao || '',
    ghiChu: draft?.ghiChu || '',
  })

  const tamTinh = useMemo(() => cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0), [cartItems])
  const phiDichVu = tinhPhiDichVu(tamTinh)
  const phiShip = formData.loaiNhanHang === 'MANG_VE_GIAO_HANG' ? PHI_SHIP_CO_DINH : 0
  const tongTien = tamTinh + phiDichVu + phiShip

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const ketQua = await taoDonMangVeApi({
        maKH: nguoiDungHienTai?.maKH || null,
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        loaiDon: formData.loaiNhanHang,
        gioLayHang: formData.gioLayHang,
        gioGiao: formData.gioGiao,
        diaChiGiao: formData.diaChiGiao,
        phiShip,
        ghiChu: formData.ghiChu,
        maGiamGia: draft?.voucherCode || '',
        danhSachMon: cartItems.map((item, index) => ({
          maChiTiet: `CTMV_${Date.now()}_${index}`,
          maMon: item.id,
          soLuong: item.quantity,
          donGia: item.price,
          ghiChu: item.ghiChuRieng || '',
        })),
      })

      const maDonHangMoi = ketQua?.duLieu?.maDonHang
      if (!maDonHangMoi) {
        throw new Error('Khong nhan duoc ma don hang sau khi tao don mang ve.')
      }

      xoaToanBoGio()
      xoaMucLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_MANG_VE)
      hienThanhCong('Đã tạo đơn mang về. Vui lòng chuyển khoản theo QR để nhà hàng xác nhận.')
      navigate(`/mang-ve/don-hang/${maDonHangMoi}`)
    } catch (error) {
      hienLoi(error?.message || 'Không thể tạo đơn mang về.')
    }
  }

  return (
    <div className="thanh-toan-page thanh-toan-page-editorial">
      <div className="container">
        <div className="thanh-toan-header">
          <p className="thanh-toan-kicker">Mang về - chuyển khoản</p>
          <h1>Thanh toán đơn mang về</h1>
        </div>
        <form className="thanh-toan-layout" onSubmit={handleSubmit}>
          <section className="thanh-toan-form-panel">
            <h2>Thông tin nhận đơn</h2>
            <div className="thanh-toan-form-grid">
              <div className="nhom-truong full"><label className="nhan-truong">Họ tên</label><input className="truong-nhap" value={formData.hoTen} onChange={(e) => setFormData((c) => ({ ...c, hoTen: e.target.value }))} required /></div>
              <div className="nhom-truong full"><label className="nhan-truong">Số điện thoại</label><input className="truong-nhap" value={formData.soDienThoai} onChange={(e) => setFormData((c) => ({ ...c, soDienThoai: e.target.value }))} required /></div>
              <div className="nhom-truong full"><label className="nhan-truong">Hình thức</label><input className="truong-nhap" value={formData.loaiNhanHang === 'MANG_VE_GIAO_HANG' ? 'Giao hàng' : 'Tự đến lấy'} readOnly /></div>
              {formData.loaiNhanHang === 'MANG_VE_GIAO_HANG' ? (
                <>
                  <div className="nhom-truong full"><label className="nhan-truong">Địa chỉ giao</label><input className="truong-nhap" value={formData.diaChiGiao} onChange={(e) => setFormData((c) => ({ ...c, diaChiGiao: e.target.value }))} required /></div>
                  <div className="nhom-truong full"><label className="nhan-truong">Giờ giao</label><input className="truong-nhap" value={formData.gioGiao} onChange={(e) => setFormData((c) => ({ ...c, gioGiao: e.target.value }))} required /></div>
                </>
              ) : (
                <div className="nhom-truong full"><label className="nhan-truong">Giờ đến lấy</label><input className="truong-nhap" value={formData.gioLayHang} onChange={(e) => setFormData((c) => ({ ...c, gioLayHang: e.target.value }))} required /></div>
              )}
              <div className="nhom-truong full"><label className="nhan-truong">Ghi chú</label><textarea className="truong-van-ban" rows="4" value={formData.ghiChu} onChange={(e) => setFormData((c) => ({ ...c, ghiChu: e.target.value.slice(0, 300) }))} /></div>
            </div>
          </section>

          <aside className="thanh-toan-tom-tat-panel">
            <div className="thanh-toan-tom-tat-card">
              <h2>Chuyển khoản</h2>
              <div className="thanh-toan-voucher-xem-item active">
                <div>
                  <strong>Ngân hàng MB Bank</strong>
                  <p>STK: 123456789 - NGUYEN VI RESTAURANT</p>
                  <p>Nội dung CK: tạo sau khi bấm xác nhận đơn</p>
                </div>
                <span>{dinhDangTienTeVietNam(tongTien)}</span>
              </div>
              <div className="thanh-toan-empty">QR chuyển khoản tĩnh sẽ được thay bằng ảnh ngân hàng thật ở bước hoàn thiện.</div>
              <div className="tom-tat-row"><span>Tạm tính</span><span>{dinhDangTienTeVietNam(tamTinh)}</span></div>
              <div className="tom-tat-row"><span>Phí dịch vụ (5%)</span><span>{dinhDangTienTeVietNam(phiDichVu)}</span></div>
              {formData.loaiNhanHang === 'MANG_VE_GIAO_HANG' ? <div className="tom-tat-row"><span>Phí ship</span><span>{dinhDangTienTeVietNam(phiShip)}</span></div> : null}
              <div className="tom-tat-row tom-tat-total"><span>Số tiền cần chuyển</span><strong>{dinhDangTienTeVietNam(tongTien)}</strong></div>
              <button type="submit" className="btn gio-hang-checkout-btn w-full" disabled={cartItems.length === 0}>Tôi đã chuyển khoản</button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default MangVeThanhToanPage
