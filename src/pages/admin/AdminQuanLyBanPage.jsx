import { useEffect, useMemo, useState } from 'react'
import { capNhatBanApi, capNhatTrangThaiBanApi, layDanhSachBanApi, layQrBanApi, taoBanApi, xoaBanApi } from '../../services/api/apiBanAn'

const DANH_SACH_KHU_VUC = ['Tất cả', 'Trong nhà', 'Ngoài sân', 'Khu riêng', 'Tầng 2']
const NHAN_TRANG_THAI = {
  TRONG: { label: 'TRỐNG', tone: 'success' },
  CO_KHACH: { label: 'CÓ KHÁCH', tone: 'accent' },
  CHO_THANH_TOAN: { label: 'CHỜ THANH TOÁN', tone: 'danger' },
  Available: { label: 'TRỐNG', tone: 'success' },
  Occupied: { label: 'CÓ KHÁCH', tone: 'accent' },
  Reserved: { label: 'CHỜ THANH TOÁN', tone: 'danger' },
}

const trangThaiNoiBo = (trangThai) => {
  if (trangThai === 'TRONG' || trangThai === 'Available') return 'TRONG'
  if (trangThai === 'CO_KHACH' || trangThai === 'Occupied') return 'CO_KHACH'
  return 'CHO_THANH_TOAN'
}

function AdminQuanLyBanPage() {
  const [danhSachBan, setDanhSachBan] = useState([])
  const [boLocTrangThai, setBoLocTrangThai] = useState('ALL')
  const [boLocKhuVuc, setBoLocKhuVuc] = useState('Tất cả')
  const [dangTai, setDangTai] = useState(true)
  const [qrDangXem, setQrDangXem] = useState(null)
  const [banDangSua, setBanDangSua] = useState(null)
  const [dangMoForm, setDangMoForm] = useState(false)
  const [formData, setFormData] = useState({ maBan: '', tenBan: '', khuVuc: 'Trong nhà', sucChua: 4, ghiChu: '' })

  const taiLai = async () => {
    setDangTai(true)
    try {
      const { duLieu } = await layDanhSachBanApi()
      setDanhSachBan(Array.isArray(duLieu) ? duLieu : [])
    } finally {
      setDangTai(false)
    }
  }

  useEffect(() => { taiLai() }, [])

  const thongKe = useMemo(() => ({
    tong: danhSachBan.length,
    trong: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'TRONG').length,
    coKhach: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'CO_KHACH').length,
    choThanhToan: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'CHO_THANH_TOAN').length,
  }), [danhSachBan])

  const danhSachHienThi = useMemo(() => danhSachBan.filter((ban) => {
    const matchTrangThai = boLocTrangThai === 'ALL' || trangThaiNoiBo(ban.status) === boLocTrangThai
    const matchKhuVuc = boLocKhuVuc === 'Tất cả' || (ban.rawAreaText || '').includes(boLocKhuVuc)
    return matchTrangThai && matchKhuVuc
  }), [boLocKhuVuc, boLocTrangThai, danhSachBan])

  const moThemBan = () => {
    setBanDangSua(null)
    setFormData({ maBan: '', tenBan: '', khuVuc: 'Trong nhà', sucChua: 4, ghiChu: '' })
    setDangMoForm(true)
  }

  const moSuaBan = (ban) => {
    setBanDangSua(ban)
    setFormData({ maBan: ban.code, tenBan: ban.name, khuVuc: ban.rawAreaText || 'Trong nhà', sucChua: ban.capacity, ghiChu: ban.note || '' })
    setDangMoForm(true)
  }

  const luuBan = async (event) => {
    event.preventDefault()
    const payload = {
      maBan: formData.maBan,
      tenBan: formData.tenBan,
      khuVuc: formData.khuVuc,
      soChoNgoi: Number(formData.sucChua),
      ghiChu: formData.ghiChu,
      soBan: Number(String(formData.tenBan).replace(/\D/g, '')) || 0,
      viTri: formData.khuVuc,
    }
    if (banDangSua) {
      await capNhatBanApi(banDangSua.code, payload)
    } else {
      await taoBanApi(payload)
    }
    setDangMoForm(false)
    await taiLai()
  }

  const moQr = async (ban) => {
    const { duLieu } = await layQrBanApi(ban.code)
    setQrDangXem(duLieu)
  }

  const xoaBan = async (ban) => {
    await xoaBanApi(ban.code)
    await taiLai()
  }

  const taiQrVe = () => {
    if (!qrDangXem?.qrBase64) return
    const a = document.createElement('a')
    a.href = qrDangXem.qrBase64
    a.download = `${qrDangXem.tenBan || qrDangXem.maBan}.png`
    a.click()
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <article className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-slate-500">Tổng bàn</p><strong className="mt-2 block text-[1.7rem] font-bold text-slate-900">{thongKe.tong}</strong></article>
          <article className="rounded-[18px] border border-emerald-200 bg-emerald-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-emerald-700">Trống</p><strong className="mt-2 block text-[1.7rem] font-bold text-emerald-900">{thongKe.trong}</strong></article>
          <article className="rounded-[18px] border border-amber-200 bg-amber-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-amber-700">Đang có khách</p><strong className="mt-2 block text-[1.7rem] font-bold text-amber-900">{thongKe.coKhach}</strong></article>
          <article className="rounded-[18px] border border-rose-200 bg-rose-50/90 p-4"><p className="m-0 text-[11px] uppercase tracking-[0.14em] text-rose-700">Chờ thanh toán</p><strong className="mt-2 block text-[1.7rem] font-bold text-rose-900">{thongKe.choThanhToan}</strong></article>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn nut-chinh" onClick={moThemBan}>Thêm bàn</button>
          <select className="truong-nhap" value={boLocTrangThai} onChange={(e) => setBoLocTrangThai(e.target.value)}>
            <option value="ALL">Tất cả trạng thái</option>
            <option value="TRONG">Trống</option>
            <option value="CO_KHACH">Có khách</option>
            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
          </select>
          <select className="truong-nhap" value={boLocKhuVuc} onChange={(e) => setBoLocKhuVuc(e.target.value)}>
            {DANH_SACH_KHU_VUC.map((muc) => <option key={muc} value={muc}>{muc}</option>)}
          </select>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dangTai ? <div className="text-sm text-slate-500">Đang tải danh sách bàn...</div> : danhSachHienThi.map((ban) => {
            const trangThai = NHAN_TRANG_THAI[trangThaiNoiBo(ban.status)] || NHAN_TRANG_THAI.TRONG
            const coTheXoa = trangThaiNoiBo(ban.status) === 'TRONG'
            return (
              <article key={ban.code} className="rounded-[18px] border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="m-0 text-xl font-semibold text-slate-900">🪑 {ban.name}</h3>
                    <p className="mt-1 mb-0 text-sm text-slate-500">{ban.rawAreaText || 'Trong nhà'} • {ban.capacity} người</p>
                  </div>
                  <span className={`nhan-trang-thai tone-${trangThai.tone}`}>{trangThai.label}</span>
                </div>
                {ban.note ? <p className="mt-3 text-sm text-slate-600">{ban.note}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn nut-phu" onClick={() => moQr(ban)}>QR Code</button>
                  <button type="button" className="btn nut-phu" onClick={() => moSuaBan(ban)}>Sửa</button>
                  <button type="button" className="btn nut-phu" disabled={!coTheXoa} title={coTheXoa ? '' : 'Bàn đang có khách'} onClick={() => xoaBan(ban)}>Xóa</button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {qrDangXem ? (
        <div className="chi-tiet-mon-hop-thoai-overlay" onClick={() => setQrDangXem(null)}>
          <div className="chi-tiet-mon-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="chi-tiet-mon-close" onClick={() => setQrDangXem(null)}>×</button>
            <div className="chi-tiet-mon-content">
              <h3>{qrDangXem.tenBan}</h3>
              <p>{qrDangXem.khuVuc}</p>
              <img src={qrDangXem.qrBase64} alt={qrDangXem.tenBan} style={{ width: '100%', maxWidth: '320px', margin: '1rem auto', display: 'block' }} />
              <p>{qrDangXem.url}</p>
              <div className="chi-tiet-mon-actions">
                <button type="button" className="btn nut-phu" onClick={taiQrVe}>Tải QR về</button>
                <button type="button" className="btn nut-chinh" onClick={() => window.print()}>In QR</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {dangMoForm ? (
        <div className="chi-tiet-mon-hop-thoai-overlay" onClick={() => setDangMoForm(false)}>
          <div className="chi-tiet-mon-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="chi-tiet-mon-close" onClick={() => setDangMoForm(false)}>×</button>
            <form className="chi-tiet-mon-content" onSubmit={luuBan}>
              <h3>{banDangSua ? 'Sửa bàn' : 'Thêm bàn mới'}</h3>
              <div className="nhom-truong"><label className="nhan-truong">Mã bàn</label><input className="truong-nhap" value={formData.maBan} onChange={(e) => setFormData((c) => ({ ...c, maBan: e.target.value }))} readOnly={Boolean(banDangSua)} required /></div>
              <div className="nhom-truong"><label className="nhan-truong">Tên bàn</label><input className="truong-nhap" value={formData.tenBan} onChange={(e) => setFormData((c) => ({ ...c, tenBan: e.target.value }))} required /></div>
              <div className="nhom-truong"><label className="nhan-truong">Khu vực</label><select className="truong-nhap" value={formData.khuVuc} onChange={(e) => setFormData((c) => ({ ...c, khuVuc: e.target.value }))}>{DANH_SACH_KHU_VUC.filter((x) => x !== 'Tất cả').map((muc) => <option key={muc} value={muc}>{muc}</option>)}</select></div>
              <div className="nhom-truong"><label className="nhan-truong">Sức chứa</label><input type="number" min="1" className="truong-nhap" value={formData.sucChua} onChange={(e) => setFormData((c) => ({ ...c, sucChua: e.target.value }))} required /></div>
              <div className="nhom-truong"><label className="nhan-truong">Ghi chú</label><input className="truong-nhap" value={formData.ghiChu} onChange={(e) => setFormData((c) => ({ ...c, ghiChu: e.target.value }))} /></div>
              <div className="chi-tiet-mon-actions"><button type="submit" className="btn nut-chinh">Lưu bàn</button></div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminQuanLyBanPage
