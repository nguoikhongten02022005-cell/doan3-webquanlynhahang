import { useEffect, useMemo, useState } from 'react'
import { layDanhSachDanhGiaApi, taoDanhGiaApi } from '../services/api/apiDanhGia'
import { layDonHangCoTheDanhGiaApi } from '../services/api/apiDonHang'
import { useXacThuc } from '../hooks/useXacThuc'
import { useThongBao } from '../context/ThongBaoContext'

const TAN_SO = [5, 4, 3, 2, 1]

const NHAN_SAO = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Xuất sắc',
}

const BO_LOC_SAO = [
  { value: 'all', label: 'Tất cả' },
  { value: 5, label: '5★' },
  { value: 4, label: '4★' },
  { value: 3, label: '3★' },
  { value: 2, label: '2★' },
  { value: 1, label: '1★' },
]

const BO_LOC_SAP_XEP = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'helpful', label: 'Hữu ích nhất' },
]

const BO_LOC_ANH = [
  { value: 'all', label: 'Tất cả' },
  { value: 'with-image', label: 'Có ảnh' },
]

const textBoDau = (giaTri) => String(giaTri || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')

const dinhDangNgay = (giaTri) => {
  if (!giaTri) return 'Vừa xong'
  const ngay = new Date(giaTri)
  if (Number.isNaN(ngay.getTime())) return String(giaTri)
  const chenhLech = Date.now() - ngay.getTime()
  const phut = Math.round(chenhLech / 60000)
  const gio = Math.round(phut / 60)
  const ngayTruoc = Math.round(gio / 24)
  if (phut < 1) return 'Vừa xong'
  if (phut < 60) return `${phut} phút trước`
  if (gio < 24) return `${gio} giờ trước`
  if (ngayTruoc < 7) return `${ngayTruoc} ngày trước`
  return ngay.toLocaleDateString('vi-VN')
}

const taoChuCaiDaiDien = (ten) => {
  const chuoi = textBoDau(ten).trim()
  if (!chuoi) return 'KH'
  const phan = chuoi.split(/\s+/).filter(Boolean)
  return phan.slice(0, 2).map((item) => item[0]?.toUpperCase()).join('') || 'KH'
}

const tinhTyLe = (soLuong, tong) => (tong ? Math.round((soLuong / tong) * 100) : 0)

const docTapTinThanhDataUrl = (tapTin) => new Promise((resolve, reject) => {
  const boDoc = new FileReader()
  boDoc.onload = () => resolve(String(boDoc.result || ''))
  boDoc.onerror = () => reject(new Error('Không thể đọc ảnh.'))
  boDoc.readAsDataURL(tapTin)
})

function IconNgoiSao({ active = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2.75l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.3l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93L12 2.75Z" />
    </svg>
  )
}

function IconMayAnh() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5h3l1.2-2h7.6l1.2 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17v-8A1.5 1.5 0 0 1 4 7.5Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function IconLoading() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  )
}

function DanhGiaPage() {
  const { nguoiDungHienTai } = useXacThuc()
  const { hienThanhCong, hienLoi, hienThongTin } = useThongBao()
  const [danhGia, setDanhGia] = useState([])
  const [donHangCoTheDanhGia, setDonHangCoTheDanhGia] = useState([])
  const [dangTaiDanhGia, setDangTaiDanhGia] = useState(true)
  const [dangTaiDonHang, setDangTaiDonHang] = useState(true)
  const [dangGui, setDangGui] = useState(false)
  const [loi, setLoi] = useState('')
  const [locSao, setLocSao] = useState('all')
  const [locAnh, setLocAnh] = useState('all')
  const [sapXep, setSapXep] = useState('newest')
  const [mucSaoHover, setMucSaoHover] = useState(0)
  const [maDonHangDangChon, setMaDonHangDangChon] = useState('')
  const [moRongDanhGia, setMoRongDanhGia] = useState(null)
  const [hienCamOn, setHienCamOn] = useState(false)
  const [formDanhGia, setFormDanhGia] = useState({
    soSao: 0,
    noiDung: '',
    hinhAnh: [],
  })

  const taiDanhSach = async () => {
    try {
      setDangTaiDanhGia(true)
      setLoi('')
      const { duLieu } = await layDanhSachDanhGiaApi()
      setDanhGia(Array.isArray(duLieu) ? duLieu.filter((item) => item.trangThai === 'Approved') : [])
    } catch (error) {
      const thongDiepLoi = String(error?.message || '').toLowerCase()
      setDanhGia([])
      setLoi(thongDiepLoi.includes('failed to fetch')
        ? 'Không thể kết nối máy chủ đánh giá lúc này. Vui lòng thử lại sau ít phút.'
        : (error?.message || 'Không thể tải đánh giá lúc này.'))
    } finally {
      setDangTaiDanhGia(false)
    }
  }

  const taiDonHangDanhGia = async () => {
    try {
      setDangTaiDonHang(true)
      const { duLieu } = await layDonHangCoTheDanhGiaApi()
      const danhSach = Array.isArray(duLieu) ? duLieu : []
      setDonHangCoTheDanhGia(danhSach)
      setMaDonHangDangChon((hienTai) => {
        if (hienTai && danhSach.some((don) => don.maDonHang === hienTai)) return hienTai
        return danhSach[0]?.maDonHang || ''
      })
      return danhSach
    } catch (error) {
      setDonHangCoTheDanhGia([])
      setMaDonHangDangChon('')
      hienLoi(error?.message || 'Không thể tải danh sách đơn hàng đủ điều kiện đánh giá.')
      return []
    } finally {
      setDangTaiDonHang(false)
    }
  }

  useEffect(() => {
    taiDanhSach()
    if (nguoiDungHienTai?.maKH) {
      taiDonHangDanhGia()
    } else {
      setDangTaiDonHang(false)
      setDonHangCoTheDanhGia([])
      setMaDonHangDangChon('')
    }
  }, [nguoiDungHienTai?.maKH])

  useEffect(() => {
    if (!hienCamOn) return undefined
    const timeoutId = window.setTimeout(() => setHienCamOn(false), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [hienCamOn])

  const reviewStats = useMemo(() => {
    const tong = danhGia.length
    const diemTrungBinh = tong ? danhGia.reduce((tongDiem, item) => tongDiem + Number(item.soSao || 0), 0) / tong : 0
    const phanBo = TAN_SO.map((soSao) => {
      const soLuong = danhGia.filter((item) => Number(item.soSao || 0) === soSao).length
      return { soSao, soLuong, phanTram: tinhTyLe(soLuong, tong) }
    })
    const coAnh = danhGia.filter((item) => Array.isArray(item.hinhAnh) && item.hinhAnh.length > 0).length

    return { tong, diemTrungBinh, phanBo, coAnh }
  }, [danhGia])

  const danhGiaHienThi = useMemo(() => {
    let ketQua = [...danhGia]

    if (locSao !== 'all') {
      ketQua = ketQua.filter((item) => Number(item.soSao || 0) === Number(locSao))
    }

    if (locAnh === 'with-image') {
      ketQua = ketQua.filter((item) => Array.isArray(item.hinhAnh) && item.hinhAnh.length > 0)
    }

    ketQua.sort((a, b) => {
      if (sapXep === 'helpful') {
        return Number(b.soLuotHuuIch || 0) - Number(a.soLuotHuuIch || 0)
      }
      return new Date(b.ngayDanhGia || 0) - new Date(a.ngayDanhGia || 0)
    })

    return ketQua
  }, [danhGia, locSao, locAnh, sapXep])

  const donHangDangChon = useMemo(() => donHangCoTheDanhGia.find((item) => item.maDonHang === maDonHangDangChon) || null, [donHangCoTheDanhGia, maDonHangDangChon])
  const monDangDanhGia = donHangDangChon?.chiTiet?.[0]?.name || donHangDangChon?.chiTiet?.[0]?.tenMon || 'đơn hàng gần nhất'

  const coDonHangHopLe = Boolean(donHangDangChon)
  const formHopLe = Boolean(nguoiDungHienTai?.maKH && coDonHangHopLe && formDanhGia.soSao > 0 && formDanhGia.noiDung.trim())

  const capNhatTruong = (truong, giaTri) => {
    setFormDanhGia((prev) => ({ ...prev, [truong]: giaTri }))
  }

  const xuLyTaiAnh = async (files) => {
    const danhSachFile = Array.from(files || []).slice(0, Math.max(0, 5 - formDanhGia.hinhAnh.length))
    if (!danhSachFile.length) return

    const moi = await Promise.all(danhSachFile.map(async (file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ten: file.name,
      url: await docTapTinThanhDataUrl(file),
    })))

    setFormDanhGia((prev) => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, ...moi].slice(0, 5),
    }))
  }

  const xuLySubmit = async (event) => {
    event.preventDefault()

    if (!nguoiDungHienTai?.maKH) {
      hienThongTin('Bạn cần đăng nhập để gửi đánh giá.', 'Cần đăng nhập')
      return
    }

    if (!coDonHangHopLe) {
      hienThongTin('Bạn cần có đơn hàng đã hoàn thành để đánh giá.', 'Không có đơn phù hợp')
      return
    }

    if (!formHopLe) {
      hienThongTin('Vui lòng chọn số sao và nhập nội dung đánh giá.', 'Thiếu thông tin')
      return
    }

    try {
      setDangGui(true)
      await taoDanhGiaApi({
        maDanhGia: `DG_${Date.now()}`,
        maKH: nguoiDungHienTai.maKH,
        maDonHang: maDonHangDangChon,
        soSao: formDanhGia.soSao,
        noiDung: formDanhGia.noiDung.trim(),
        hinhAnh: formDanhGia.hinhAnh.map((item) => item.url),
      })

      const danhSachConLai = await taiDonHangDanhGia()
      await taiDanhSach()
      hienThanhCong('Cảm ơn bạn đã đánh giá!', 'Gửi thành công')
      setHienCamOn(true)
      setFormDanhGia({ soSao: 0, noiDung: '', hinhAnh: [] })
      setMucSaoHover(0)
      setMaDonHangDangChon(danhSachConLai[0]?.maDonHang || '')
    } catch (error) {
      hienLoi(error?.message || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.')
    } finally {
      setDangGui(false)
    }
  }

  return (
    <div className="danh-gia-modern-page">
      <section className="danh-gia-modern-hero">
        <div className="container danh-gia-modern-hero__inner">
          <div className="danh-gia-modern-hero__copy">
            <p className="eyebrow">Phản hồi từ khách hàng</p>
            <h1>Đánh giá trải nghiệm thật, minh bạch và hiện đại</h1>
            <p>
              Tổng hợp nhận xét đã xác thực từ khách hàng, hiển thị theo chuẩn UX/UI hiện đại như Google Maps, Shopee và GrabFood.
            </p>
            <div className="danh-gia-modern-hero__badges">
              <span className="danh-gia-modern-badge danh-gia-modern-badge--primary">Đã xác thực</span>
              <span className="danh-gia-modern-badge">{reviewStats.tong} lượt đánh giá</span>
              <span className="danh-gia-modern-badge">{reviewStats.coAnh} đánh giá có ảnh</span>
            </div>
          </div>

          <div className="danh-gia-modern-summary-card">
            <div className="danh-gia-modern-summary-score">
              <strong>{reviewStats.diemTrungBinh ? reviewStats.diemTrungBinh.toFixed(1) : '0.0'}</strong>
              <span>/ 5.0</span>
            </div>
            <div className="danh-gia-modern-summary-note">
              <p>Điểm trung bình</p>
              <div className="danh-gia-modern-summary-stars">{'★'.repeat(Math.max(0, Math.round(reviewStats.diemTrungBinh)))}{'☆'.repeat(Math.max(0, 5 - Math.round(reviewStats.diemTrungBinh)))}</div>
              <small>{reviewStats.tong} đánh giá đã duyệt</small>
            </div>
            <div className="danh-gia-modern-summary-bars">
              {reviewStats.phanBo.map((muc) => (
                <div key={muc.soSao} className="danh-gia-modern-bar-row">
                  <span>{muc.soSao}★</span>
                  <div className="danh-gia-modern-bar-track">
                    <div className="danh-gia-modern-bar-fill" style={{ width: `${muc.phanTram}%` }} />
                  </div>
                  <strong>{muc.soLuong}</strong>
                  <small>{muc.phanTram}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="danh-gia-modern-list">
        <div className="container">
          <div className="danh-gia-modern-toolbar">
            <div className="danh-gia-modern-toolbar__group">
              {BO_LOC_SAO.map((muc) => (
                <button
                  key={muc.value}
                  type="button"
                  className={`danh-gia-modern-chip ${String(locSao) === String(muc.value) ? 'active' : ''}`}
                  onClick={() => setLocSao(muc.value)}
                >
                  {muc.label}
                </button>
              ))}
            </div>

            <div className="danh-gia-modern-toolbar__group">
              {BO_LOC_ANH.map((muc) => (
                <button
                  key={muc.value}
                  type="button"
                  className={`danh-gia-modern-chip ${locAnh === muc.value ? 'active' : ''}`}
                  onClick={() => setLocAnh(muc.value)}
                >
                  {muc.label}
                </button>
              ))}
              {BO_LOC_SAP_XEP.map((muc) => (
                <button
                  key={muc.value}
                  type="button"
                  className={`danh-gia-modern-chip ${sapXep === muc.value ? 'active' : ''}`}
                  onClick={() => setSapXep(muc.value)}
                >
                  {muc.label}
                </button>
              ))}
            </div>
          </div>

          {dangTaiDanhGia ? (
            <div className="danh-gia-modern-empty">Đang tải đánh giá...</div>
          ) : loi ? (
            <div className="danh-gia-modern-empty">{loi}</div>
          ) : danhGiaHienThi.length === 0 ? (
            <div className="danh-gia-modern-empty">Hiện chưa có đánh giá phù hợp với bộ lọc.</div>
          ) : (
            <div className="danh-gia-modern-grid">
              {danhGiaHienThi.map((review) => {
                const avatar = taoChuCaiDaiDien(review.tenKhachHang || review.maKH)
                const coAnh = Array.isArray(review.hinhAnh) && review.hinhAnh.length > 0
                const noiDungDayDu = String(review.noiDung || '').trim()
                const biRutGon = noiDungDayDu.length > 180 && moRongDanhGia !== review.maDanhGia

                return (
                  <article key={review.maDanhGia} className="danh-gia-modern-card">
                    <div className="danh-gia-modern-card__head">
                      <div className="danh-gia-modern-card__identity">
                        <div className="danh-gia-modern-avatar">{avatar}</div>
                        <div>
                          <div className="danh-gia-modern-name-row">
                            <strong>{review.tenKhachHang || review.maKH || 'Khách hàng'}</strong>
                            <span className="danh-gia-modern-verified">Đã mua hàng ✓</span>
                          </div>
                          <div className="danh-gia-modern-meta">{dinhDangNgay(review.ngayDanhGia)} · Đơn {review.maDonHang || '—'}</div>
                        </div>
                      </div>

                      <div className="danh-gia-modern-card__rating">
                        <span>{'★'.repeat(Math.max(1, Math.min(5, Number(review.soSao || 0))))}</span>
                        <small>{NHAN_SAO[Number(review.soSao || 0)] || 'Đánh giá'}</small>
                      </div>
                    </div>

                    <p className="danh-gia-modern-content">
                      {biRutGon ? `${noiDungDayDu.slice(0, 180).trim()}...` : noiDungDayDu || 'Khách hàng đã để lại phản hồi về trải nghiệm tại nhà hàng.'}
                    </p>
                    {noiDungDayDu.length > 180 ? (
                      <button
                        type="button"
                        className="danh-gia-modern-link-btn"
                        onClick={() => setMoRongDanhGia((hienTai) => (hienTai === review.maDanhGia ? null : review.maDanhGia))}
                      >
                        {moRongDanhGia === review.maDanhGia ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    ) : null}

                    {coAnh ? (
                      <div className="danh-gia-modern-image-grid">
                        {review.hinhAnh.slice(0, 6).map((anh, index) => (
                          <button
                            key={`${review.maDanhGia}-img-${index}`}
                            type="button"
                            className="danh-gia-modern-image-item"
                            onClick={() => window.open(anh, '_blank', 'noopener,noreferrer')}
                          >
                            <img src={anh} alt={`Ảnh đánh giá ${index + 1}`} />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <div className="danh-gia-modern-actions">
                      <button type="button" className="danh-gia-modern-like-btn">
                        👍 Hữu ích <span>{Number(review.soLuotHuuIch || 0)}</span>
                      </button>
                    </div>

                    {review.phanHoi ? (
                      <div className="danh-gia-modern-reply">
                        <div className="danh-gia-modern-reply__label">Phản hồi từ nhà hàng</div>
                        <p>{review.phanHoi}</p>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="danh-gia-modern-form-section">
        <div className="container">
          {!nguoiDungHienTai?.maKH ? (
            <div className="danh-gia-modern-login-note">
              Bạn cần đăng nhập bằng tài khoản khách hàng để gửi đánh giá.
            </div>
          ) : dangTaiDonHang ? (
            <div className="danh-gia-modern-login-note">Đang tìm đơn hàng đủ điều kiện để đánh giá...</div>
          ) : !coDonHangHopLe ? (
            <div className="danh-gia-modern-login-note">Bạn cần có đơn hàng đã hoàn thành để đánh giá.</div>
          ) : (
            <div className="danh-gia-modern-form-shell">
                <div className="danh-gia-modern-form-head">
                  <div>
                    <p className="eyebrow">Gửi đánh giá</p>
                    <h2>Chia sẻ trải nghiệm của bạn</h2>
                    <p>Bạn đang đánh giá cho đơn hàng <strong>#{donHangDangChon?.maDonHang || '—'}</strong> - <strong>{monDangDanhGia}</strong>.</p>
                  </div>
                  <div className="danh-gia-modern-form-order">
                    <span>Đơn vừa hoàn tất gần nhất</span>
                    <strong>{donHangDangChon?.maDonHang || '—'}</strong>
                    <small>{dinhDangNgay(donHangDangChon?.ngayTao)} · {donHangDangChon?.chiTiet?.length || 0} món</small>
                  </div>
                </div>

              <div className="danh-gia-modern-order-strip">
                {donHangCoTheDanhGia.map((don) => {
                  const dangChon = maDonHangDangChon === don.maDonHang
                  return (
                    <button
                      key={don.maDonHang}
                      type="button"
                      className={`danh-gia-modern-order-chip ${dangChon ? 'active' : ''}`}
                      onClick={() => setMaDonHangDangChon(don.maDonHang)}
                    >
                      <strong>{don.maDonHang}</strong>
                      <span>{dinhDangNgay(don.ngayTao)}</span>
                      <small>{don.chiTiet?.length || 0} món · {don.trangThai}</small>
                    </button>
                  )
                })}
              </div>

              <form className="danh-gia-modern-form" onSubmit={xuLySubmit}>
                <div className="danh-gia-modern-stars-wrap">
                  <span>Chọn số sao</span>
                  <div className="danh-gia-modern-stars" role="group" aria-label="Chọn số sao đánh giá">
                    {[1, 2, 3, 4, 5].map((mucSao) => {
                      const duocChon = (mucSaoHover || formDanhGia.soSao) >= mucSao
                      return (
                        <button
                          key={mucSao}
                          type="button"
                          className={`danh-gia-modern-star ${duocChon ? 'active' : ''}`}
                          onMouseEnter={() => setMucSaoHover(mucSao)}
                          onMouseLeave={() => setMucSaoHover(0)}
                          onClick={() => capNhatTruong('soSao', mucSao)}
                          aria-label={`${mucSao} sao`}
                        >
                          <IconNgoiSao active={duocChon} />
                        </button>
                      )
                    })}
                  </div>
                  <small>{formDanhGia.soSao ? `${formDanhGia.soSao} sao - ${NHAN_SAO[formDanhGia.soSao]}` : 'Chọn số sao phù hợp'}</small>
                </div>

                <label className="danh-gia-modern-textarea">
                  <span>Nhận xét của bạn</span>
                  <textarea
                    rows="5"
                    value={formDanhGia.noiDung}
                    onChange={(event) => capNhatTruong('noiDung', event.target.value)}
                    placeholder="Món ăn, phục vụ, không gian, thời gian ra món..."
                  />
                </label>

                <div className="danh-gia-modern-upload">
                  <span>Ảnh đính kèm</span>
                  <label
                    className="danh-gia-modern-dropzone"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={async (event) => {
                      event.preventDefault()
                      await xuLyTaiAnh(event.dataTransfer.files)
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (event) => {
                        await xuLyTaiAnh(event.target.files)
                        event.target.value = ''
                      }}
                    />
                    <div className="danh-gia-modern-dropzone__icon"><IconMayAnh /></div>
                    <strong>Kéo thả ảnh hoặc bấm để chọn</strong>
                    <span>Tối đa 5 ảnh · JPEG, PNG, WEBP</span>
                  </label>

                  {formDanhGia.hinhAnh.length > 0 ? (
                    <div className="danh-gia-modern-preview-grid">
                      {formDanhGia.hinhAnh.map((anh) => (
                        <div key={anh.id} className="danh-gia-modern-preview-item">
                          <img src={anh.url} alt={anh.ten} />
                          <button
                            type="button"
                            className="danh-gia-modern-remove-btn"
                            onClick={() => setFormDanhGia((prev) => ({
                              ...prev,
                              hinhAnh: prev.hinhAnh.filter((item) => item.id !== anh.id),
                            }))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button type="submit" className="btn nut-chinh danh-gia-modern-submit" disabled={!formHopLe || dangGui}>
                  {dangGui ? (
                    <>
                      <span className="danh-gia-modern-spinner" aria-hidden="true"><IconLoading /></span>
                      Đang gửi...
                    </>
                  ) : 'Gửi đánh giá'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {hienCamOn ? (
        <div className="danh-gia-modern-success-overlay" role="status" aria-live="polite">
          <div className="danh-gia-modern-success-card">
            <div className="danh-gia-modern-confetti" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <strong>Cảm ơn bạn đã đánh giá!</strong>
            <p>Phản hồi của bạn đã được ghi nhận và sẽ sớm hiển thị sau khi duyệt.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DanhGiaPage
