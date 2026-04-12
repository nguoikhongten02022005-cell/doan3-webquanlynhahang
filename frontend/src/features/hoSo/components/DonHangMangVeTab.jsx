import { Link } from 'react-router-dom'
import { Button, Empty, Segmented } from 'antd'
import { dinhDangNgay } from '../../noiBo/dinhDang'
import { dinhDangTienTeVietNam } from '../../../utils/tienTe'

const BO_LOC = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'DONE', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
]

const NHAN_TRANG_THAI = {
  Pending: { label: 'Chờ xác nhận', tone: 'warning' },
  Confirmed: { label: 'Đã xác nhận', tone: 'success' },
  Preparing: { label: 'Đang chuẩn bị', tone: 'accent' },
  Ready: { label: 'Sẵn sàng lấy', tone: 'success' },
  Served: { label: 'Đang giao', tone: 'info' },
  Paid: { label: 'Hoàn thành', tone: 'neutral' },
  Cancelled: { label: 'Đã hủy', tone: 'danger' },
}

function DonHangMangVeTab({ danhSachDon, boLoc, onDoiBoLoc, onHuyDon, onXemChiTiet }) {
  const danhSachHienThi = danhSachDon.filter((don) => {
    const trangThai = don.trangThai || don.status
    if (boLoc === 'ALL') return true
    if (boLoc === 'PROCESSING') return ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Served'].includes(trangThai)
    if (boLoc === 'DONE') return trangThai === 'Paid'
    if (boLoc === 'CANCELLED') return trangThai === 'Cancelled'
    return true
  })

  return (
    <article className="ho-so-card ho-so-don-hang-ant-hybrid">
      <div className="ho-so-section-heading">
        <div>
          <h2>Đơn hàng của tôi</h2>
          <p>Theo dõi toàn bộ đơn mang về gồm pickup và giao hàng của bạn.</p>
        </div>
      </div>

      <div className="ho-so-filter-row">
        <Segmented options={BO_LOC.map((muc) => ({ label: muc.label, value: muc.key }))} value={boLoc} onChange={onDoiBoLoc} />
      </div>

      {danhSachHienThi.length === 0 ? (
        <div className="ho-so-empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={(
              <div className="ho-so-empty-copy">
                <h3>Bạn chưa có đơn hàng nào</h3>
                <p>Hãy vào menu mang về để tạo đơn đầu tiên.</p>
              </div>
            )}
          />
          <Link to="/mang-ve/thuc-don" className="btn nut-chinh ho-so-empty-action">Đặt ngay</Link>
        </div>
      ) : (
        <div className="ho-so-history-grid">
          {danhSachHienThi.map((don) => {
            const trangThai = don.trangThai || don.status
            const nhanTrangThai = NHAN_TRANG_THAI[trangThai] || { label: trangThai, tone: 'neutral' }
            const danhSachMon = don.danhSachMon || don.items || []
            const monThuNhat = danhSachMon.slice(0, 2).map((muc) => `${muc.tenMon} x${muc.soLuong}`)
            const soMonConLai = Math.max(0, danhSachMon.length - 2)
            return (
              <div key={don.maDonHang} className="ho-so-history-card">
                <div className="ho-so-history-header">
                  <strong>{don.maDonHang}</strong>
                  <div className="flex flex-wrap gap-2">
                    <span className={`nhan-trang-thai tone-${don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'info' : 'accent'}`}>{don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Giao hàng' : 'Pickup'}</span>
                    <span className={`nhan-trang-thai tone-${nhanTrangThai.tone}`}>{nhanTrangThai.label}</span>
                  </div>
                </div>

                <div className="ho-so-history-meta-grid">
                  <div className="ho-so-history-meta-item"><div><span>Ngày tạo</span><strong>{dinhDangNgay(don.ngayTao)}</strong></div></div>
                  <div className="ho-so-history-meta-item"><div><span>Tổng tiền</span><strong>{dinhDangTienTeVietNam(don.tongTien)}</strong></div></div>
                  <div className="ho-so-history-meta-item"><div><span>Thời gian</span><strong>{don.gioGiao || don.gioLayHang || '---'}</strong></div></div>
                </div>

                <div className="ho-so-order-preview">
                  {monThuNhat.map((dong) => <p key={dong}>{dong}</p>)}
                  {soMonConLai > 0 ? <p>...và {soMonConLai} món khác</p> : null}
                </div>

                <div className="ho-so-history-actions">
                  {trangThai === 'Pending' ? (
                    <Button htmlType="button" className="btn ho-so-action-btn ho-so-action-btn--danger" onClick={() => onHuyDon(don.maDonHang)}>
                      Hủy đơn
                    </Button>
                  ) : null}
                  <Button htmlType="button" className="btn nut-phu ho-so-action-btn ho-so-action-btn--accent" onClick={() => onXemChiTiet(don.maDonHang)}>
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

export default DonHangMangVeTab
