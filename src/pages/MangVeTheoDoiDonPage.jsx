import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { layDonMangVeApi } from '../services/api/apiMangVe'
import { dinhDangTienTeVietNam } from '../utils/tienTe'

const CAC_BUOC_PICKUP = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Paid']
const CAC_BUOC_GIAO_HANG = ['Pending', 'Confirmed', 'Preparing', 'Served', 'Paid']
const NHAN_TRANG_THAI = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Preparing: 'Đang chuẩn bị',
  Ready: 'Sẵn sàng lấy',
  Served: 'Đang giao',
  Paid: 'Hoàn thành',
  Cancelled: 'Đã hủy',
}

function MangVeTheoDoiDonPage() {
  const { id } = useParams()
  const [donHang, setDonHang] = useState(null)

  useEffect(() => {
    ;(async () => {
      const ketQua = await layDonMangVeApi(id)
      setDonHang(ketQua.duLieu)
    })()
  }, [id])

  if (!donHang) {
    return <div className="gio-hang-page"><div className="container"><div className="gio-hang-empty">Đang tải đơn mang về...</div></div></div>
  }

  const chiTietMoRong = String(donHang.ghiChu || '')
    .split(' | ')
    .filter((dong) => !dong.toLowerCase().startsWith('dia chi giao:'))
  const danhSachBuoc = donHang.loaiDon === 'MANG_VE_GIAO_HANG' ? CAC_BUOC_GIAO_HANG : CAC_BUOC_PICKUP
  const buocHienTai = danhSachBuoc.indexOf(donHang.trangThai)

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="thanh-toan-header">
          <p className="thanh-toan-kicker">Theo dõi đơn mang về</p>
          <h1>{donHang.maDonHang}</h1>
        </div>
        <div className="thanh-toan-layout">
          <section className="thanh-toan-form-panel">
            <h2>Tiến trình đơn {donHang.loaiDon === 'MANG_VE_GIAO_HANG' ? 'giao hàng' : 'pickup'}</h2>
            <div className="thanh-toan-voucher-xem-list">
              {danhSachBuoc.map((buoc, index) => (
                <div key={buoc} className={`thanh-toan-voucher-xem-item ${index <= buocHienTai ? 'active' : ''}`}>
                  <div><strong>{index + 1}. {NHAN_TRANG_THAI[buoc]}</strong></div>
                  <span>{index <= buocHienTai ? 'Đã tới' : 'Chờ'}</span>
                </div>
              ))}
            </div>
            <div className="thanh-toan-item-list" style={{ marginTop: '1rem' }}>
              {donHang.chiTiet.map((item) => (
                <div key={item.id} className="thanh-toan-item">
                  <div>
                    <p className="thanh-toan-item-name">{item.maMon}</p>
                    <p className="thanh-toan-item-qty">x{item.soLuong}</p>
                  </div>
                  <strong>{dinhDangTienTeVietNam(item.thanhTien)}</strong>
                </div>
              ))}
            </div>
          </section>
          <aside className="thanh-toan-tom-tat-panel">
            <div className="thanh-toan-tom-tat-card">
              <h2>Thông tin đơn</h2>
              <div className="tom-tat-row"><span>Trạng thái</span><strong>{NHAN_TRANG_THAI[donHang.trangThai] || donHang.trangThai}</strong></div>
              <div className="tom-tat-row"><span>Loại đơn</span><strong>{donHang.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Giao hàng' : 'Tự đến lấy'}</strong></div>
              {donHang.loaiDon === 'MANG_VE_GIAO_HANG' ? <div className="tom-tat-row"><span>Phí ship</span><strong>{dinhDangTienTeVietNam(donHang.phiShip)}</strong></div> : null}
              <div className="tom-tat-row"><span>Tổng tiền</span><strong>{dinhDangTienTeVietNam(donHang.tongTien)}</strong></div>
              {donHang.loaiDon === 'MANG_VE_GIAO_HANG' && donHang.diaChiGiao ? <p className="thanh-toan-tom-tat-note">Địa chỉ giao: {donHang.diaChiGiao}</p> : null}
              {chiTietMoRong.map((dong) => <p key={dong} className="thanh-toan-tom-tat-note">{dong}</p>)}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default MangVeTheoDoiDonPage
