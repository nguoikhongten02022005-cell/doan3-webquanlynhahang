import { useEffect, useMemo, useState } from 'react'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'
import { capNhatTrangThaiDonMangVeApi, layDanhSachDonMangVeChoAdminApi } from '../../services/api/apiMangVe'

const BO_LOC = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'MANG_VE_PICKUP', label: 'Pickup' },
  { value: 'MANG_VE_GIAO_HANG', label: 'Giao hàng' },
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'Paid', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
]

const NHAN = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Preparing: 'Đang chuẩn bị',
  Ready: 'Sẵn sàng lấy',
  Served: 'Đang giao',
  Paid: 'Hoàn thành',
  Cancelled: 'Đã hủy',
}

function AdminDonMangVePage() {
  const [danhSachDon, setDanhSachDon] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [boLoc, setBoLoc] = useState('ALL')
  const [dangXuLy, setDangXuLy] = useState('')

  const taiLai = async () => {
    setDangTai(true)
    try {
      const { duLieu } = await layDanhSachDonMangVeChoAdminApi()
      setDanhSachDon(Array.isArray(duLieu) ? duLieu : [])
    } finally {
      setDangTai(false)
    }
  }

  useEffect(() => { taiLai() }, [])

  const danhSachHienThi = useMemo(() => {
    if (boLoc === 'ALL') return danhSachDon
    if (boLoc === 'MANG_VE_PICKUP' || boLoc === 'MANG_VE_GIAO_HANG') return danhSachDon.filter((don) => don.loaiDon === boLoc)
    if (boLoc === 'PROCESSING') return danhSachDon.filter((don) => ['Pending', 'Confirmed', 'Preparing'].includes(don.trangThai))
    return danhSachDon.filter((don) => don.trangThai === boLoc)
  }, [boLoc, danhSachDon])

  const thongKe = useMemo(() => {
    const homNay = new Date().toLocaleDateString('en-CA')
    const donHomNay = danhSachDon.filter((don) => String(don.ngayTao || '').slice(0, 10) === homNay)
    return {
      tongDonHomNay: donHomNay.length,
      dangXuLy: danhSachDon.filter((don) => ['Pending', 'Confirmed', 'Preparing'].includes(don.trangThai)).length,
      doanhThuHomNay: donHomNay.filter((don) => don.trangThai === 'Paid').reduce((tong, don) => tong + don.tongTien, 0),
    }
  }, [danhSachDon])

  const hanhDong = async (maDonHang, trangThai) => {
    try {
      setDangXuLy(`${maDonHang}-${trangThai}`)
      await capNhatTrangThaiDonMangVeApi(maDonHang, trangThai)
      await taiLai()
    } finally {
      setDangXuLy('')
    }
  }

  const renderAction = (don) => {
    if (don.trangThai === 'Pending') {
      return (
        <div className="flex gap-2">
          <button type="button" className="btn nut-chinh" disabled={dangXuLy === `${don.maDonHang}-Confirmed`} onClick={() => hanhDong(don.maDonHang, 'Confirmed')}>Xác nhận</button>
          <button type="button" className="btn nut-phu" disabled={dangXuLy === `${don.maDonHang}-Cancelled`} onClick={() => hanhDong(don.maDonHang, 'Cancelled')}>Hủy</button>
        </div>
      )
    }
    if (don.trangThai === 'Confirmed') return <button type="button" className="btn nut-chinh" onClick={() => hanhDong(don.maDonHang, 'Preparing')}>Đang chuẩn bị</button>
    if (don.trangThai === 'Preparing') return <button type="button" className="btn nut-chinh" onClick={() => hanhDong(don.maDonHang, don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Served' : 'Ready')}>{don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Đang giao' : 'Sẵn sàng lấy'}</button>
    if (don.trangThai === 'Ready' || don.trangThai === 'Served') return <button type="button" className="btn nut-chinh" onClick={() => hanhDong(don.maDonHang, 'Paid')}>Hoàn thành</button>
    return <span className="text-sm text-slate-400">Không có</span>
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-slate-500">Tổng đơn hôm nay</p><strong className="mt-2 block text-[1.7rem] font-bold text-slate-900">{thongKe.tongDonHomNay}</strong></article>
          <article className="rounded-[18px] border border-amber-200 bg-amber-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-amber-700">Đang xử lý</p><strong className="mt-2 block text-[1.7rem] font-bold text-amber-900">{thongKe.dangXuLy}</strong></article>
          <article className="rounded-[18px] border border-emerald-200 bg-emerald-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-emerald-700">Doanh thu hôm nay</p><strong className="mt-2 block text-[1.7rem] font-bold text-emerald-900">{dinhDangTienTeVietNam(thongKe.doanhThuHomNay)}</strong></article>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="flex flex-wrap gap-2">
          {BO_LOC.map((muc) => (
            <button key={muc.value} type="button" className={`btn ${boLoc === muc.value ? 'nut-chinh' : 'nut-phu'}`} onClick={() => setBoLoc(muc.value)}>{muc.label}</button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3">Mã đơn</th>
                <th className="px-3 py-3">Khách</th>
                <th className="px-3 py-3">SĐT</th>
                <th className="px-3 py-3">Địa chỉ</th>
                <th className="px-3 py-3">Giờ lấy</th>
                <th className="px-3 py-3">Món</th>
                <th className="px-3 py-3">Tổng tiền</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dangTai ? (
                <tr><td colSpan="9" className="px-3 py-6 text-center text-sm text-slate-500">Đang tải đơn mang về...</td></tr>
              ) : danhSachHienThi.length === 0 ? (
                <tr><td colSpan="9" className="px-3 py-6 text-center text-sm text-slate-500">Chưa có đơn mang về phù hợp bộ lọc.</td></tr>
              ) : danhSachHienThi.map((don) => (
                <tr key={don.maDonHang} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3 font-semibold text-slate-900">{don.maDonHang}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{don.hoTen || don.maKH}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{don.soDienThoai || '---'}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{don.diaChiGiao || '---'}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{don.gioGiao || don.gioLayHang || '---'}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{don.danhSachMon.map((muc) => `${muc.tenMon} x${muc.soLuong}`).join(', ')}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-slate-900">{dinhDangTienTeVietNam(don.tongTien)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{NHAN[don.trangThai] || don.trangThai}</td>
                  <td className="px-3 py-3">{renderAction(don)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminDonMangVePage
