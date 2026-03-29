import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

function AdminDanhGiaPage() {
  const { danhSachDanhGia, danhSachDanhGiaChoDuyet, xuLyDuyetDanhGia } = useOutletContext()
  const [dangXuLy, setDangXuLy] = useState('')
  const [thongBao, setThongBao] = useState('')
  const [loi, setLoi] = useState('')

  const danhSachSapXep = useMemo(() => (
    [...(Array.isArray(danhSachDanhGia) ? danhSachDanhGia : [])]
      .sort((a, b) => new Date(b.ngayDanhGia || 0).getTime() - new Date(a.ngayDanhGia || 0).getTime())
  ), [danhSachDanhGia])

  const xuLyCapNhat = async (maDanhGia, trangThai) => {
    try {
      setDangXuLy(`${maDanhGia}-${trangThai}`)
      setThongBao('')
      setLoi('')
      const ketQua = await xuLyDuyetDanhGia(maDanhGia, trangThai, trangThai === 'Approved' ? 'Đã duyệt hiển thị công khai.' : 'Đã từ chối hiển thị công khai.')

      if (!ketQua?.duLieu) {
        setLoi('Không thể cập nhật trạng thái đánh giá.')
        return
      }

      setThongBao(`Đã cập nhật đánh giá ${maDanhGia} sang trạng thái ${trangThai}.`)
    } catch (error) {
      setLoi(error?.message || 'Không thể cập nhật đánh giá lúc này.')
    } finally {
      setDangXuLy('')
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4">
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Tổng đánh giá</p>
            <strong className="mt-2 block text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-slate-900">{danhSachSapXep.length}</strong>
          </article>
          <article className="rounded-[18px] border border-amber-200 bg-amber-50/90 p-4">
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-700">Chờ duyệt</p>
            <strong className="mt-2 block text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-amber-900">{danhSachDanhGiaChoDuyet.length}</strong>
          </article>
          <article className="rounded-[18px] border border-emerald-200 bg-emerald-50/90 p-4">
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">Đã duyệt</p>
            <strong className="mt-2 block text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-emerald-900">
              {danhSachSapXep.filter((danhGia) => danhGia.trangThai === 'Approved').length}
            </strong>
          </article>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#E5E0DB] bg-white/95 p-4 shadow-[0_18px_40px_rgba(55,39,28,0.08)] md:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="m-0 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-900">Duyệt đánh giá khách hàng</h1>
            <p className="mt-1 mb-0 text-sm leading-6 text-slate-500">Duyệt hoặc từ chối phản hồi trước khi hiển thị trên trang công khai.</p>
          </div>
        </div>

        {thongBao ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{thongBao}</div> : null}
        {loi ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{loi}</div> : null}

        <div className="mt-4 space-y-3">
          {danhSachSapXep.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center text-sm text-slate-500">
              Chưa có đánh giá nào trong hệ thống.
            </div>
          ) : (
            danhSachSapXep.map((danhGia) => {
              const dangChoDuyet = danhGia.trangThai === 'Pending'
              const khoaXuLy = `${danhGia.maDanhGia}-${danhGia.trangThai}`

              return (
                <article key={danhGia.maDanhGia} className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-base font-semibold text-slate-900">{danhGia.maDanhGia}</strong>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${danhGia.trangThai === 'Approved' ? 'bg-emerald-100 text-emerald-700' : danhGia.trangThai === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {danhGia.trangThai}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          {danhGia.soSao}/5 sao
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                        <span>Khách: <strong className="text-slate-900">{danhGia.maKH}</strong></span>
                        <span>Đơn hàng: <strong className="text-slate-900">{danhGia.maDonHang}</strong></span>
                        <span>Ngày: <strong className="text-slate-900">{danhGia.ngayDanhGia ? new Date(danhGia.ngayDanhGia).toLocaleString('vi-VN') : '---'}</strong></span>
                      </div>

                      <p className="mt-3 mb-0 text-sm leading-6 text-slate-700">{danhGia.noiDung || 'Không có nội dung đánh giá.'}</p>
                      {danhGia.phanHoi ? <p className="mt-2 mb-0 text-sm leading-6 text-slate-500"><strong>Phản hồi nội bộ:</strong> {danhGia.phanHoi}</p> : null}
                    </div>

                    <div className="flex w-full gap-2 lg:w-auto lg:flex-col">
                      <button
                        type="button"
                        className="btn nut-chinh"
                        disabled={!dangChoDuyet || dangXuLy === `${danhGia.maDanhGia}-Approved`}
                        onClick={() => xuLyCapNhat(danhGia.maDanhGia, 'Approved')}
                      >
                        {dangXuLy === `${danhGia.maDanhGia}-Approved` ? 'Đang duyệt...' : 'Duyệt'}
                      </button>
                      <button
                        type="button"
                        className="btn nut-phu"
                        disabled={!dangChoDuyet || dangXuLy === `${danhGia.maDanhGia}-Rejected`}
                        onClick={() => xuLyCapNhat(danhGia.maDanhGia, 'Rejected')}
                      >
                        {dangXuLy === `${danhGia.maDanhGia}-Rejected` ? 'Đang từ chối...' : 'Từ chối'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}

export default AdminDanhGiaPage
