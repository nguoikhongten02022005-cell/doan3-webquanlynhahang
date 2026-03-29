import { useEffect, useMemo, useState } from 'react'
import { layDanhSachDanhGiaApi, taoDanhGiaApi } from '../services/api/apiDanhGia'
import { useXacThuc } from '../hooks/useXacThuc'

const NHAN_SAO = {
  1: '1 - Rất tệ',
  2: '2 - Tệ',
  3: '3 - Bình thường',
  4: '4 - Tốt',
  5: '5 - Xuất sắc',
}

function DanhGiaPage() {
  const { nguoiDungHienTai } = useXacThuc()
  const [danhGia, setDanhGia] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const [thongBaoGui, setThongBaoGui] = useState('')
  const [loiGui, setLoiGui] = useState('')
  const [saoHover, setSaoHover] = useState(0)
  const [formDanhGia, setFormDanhGia] = useState({
    maDanhGia: `DG_${Date.now()}`,
    hoTen: nguoiDungHienTai?.fullName || '',
    maDonHang: '',
    soSao: 0,
    noiDung: '',
  })

  useEffect(() => {
    let active = true

    const taiDuLieu = async () => {
      try {
        setDangTai(true)
        setLoi('')
        const { duLieu } = await layDanhSachDanhGiaApi()
        if (!active) return
        setDanhGia(Array.isArray(duLieu) ? duLieu.filter((item) => item.trangThai === 'Approved') : [])
      } catch (error) {
        if (!active) return
        setDanhGia([])
        const thongDiepLoi = String(error?.message || '').toLowerCase()
        if (thongDiepLoi.includes('failed to fetch')) {
          setLoi('Không thể kết nối máy chủ đánh giá lúc này. Vui lòng thử lại sau ít phút.')
        } else {
          setLoi(error?.message || 'Không thể tải đánh giá lúc này.')
        }
      } finally {
        if (active) setDangTai(false)
      }
    }

    taiDuLieu()
    return () => {
      active = false
    }
  }, [])

  const trungBinhSoSao = useMemo(() => {
    if (!danhGia.length) return 0
    const tong = danhGia.reduce((sum, item) => sum + Number(item.soSao || 0), 0)
    return tong / danhGia.length
  }, [danhGia])

  const nhanXepHangTong = useMemo(() => {
    const diem = trungBinhSoSao || 0
    const soSaoTron = Math.round(diem)
    return `${'★'.repeat(Math.max(0, soSaoTron))}${'☆'.repeat(Math.max(0, 5 - soSaoTron))}`
  }, [trungBinhSoSao])

  const nhanSaoDangChon = NHAN_SAO[formDanhGia.soSao] || 'Chọn số sao phù hợp'

  const xuLyDoiTruong = (field, value) => {
    setFormDanhGia((prev) => ({ ...prev, [field]: value }))
    if (loiGui) setLoiGui('')
    if (thongBaoGui) setThongBaoGui('')
  }

  const formHopLe = Boolean(formDanhGia.hoTen.trim() && formDanhGia.maDonHang && formDanhGia.soSao > 0 && formDanhGia.noiDung.trim())

  const xuLyGuiDanhGia = async (event) => {
    event.preventDefault()
    if (!formHopLe) {
      setLoiGui('Vui lòng nhập đủ họ tên, mã đơn hàng, số sao và nội dung đánh giá.')
      return
    }

    if (!nguoiDungHienTai?.maKH) {
      setLoiGui('Vui lòng đăng nhập bằng tài khoản khách hàng trước khi gửi đánh giá.')
      return
    }

    try {
      setDangGui(true)
      setLoiGui('')
      setThongBaoGui('')
      await taoDanhGiaApi({
        maDanhGia: formDanhGia.maDanhGia,
        maKH: nguoiDungHienTai.maKH,
        maDonHang: formDanhGia.maDonHang,
        soSao: formDanhGia.soSao,
        noiDung: formDanhGia.noiDung.trim(),
      })
      setThongBaoGui('✓ Cảm ơn bạn đã đánh giá! Phản hồi của bạn đang chờ duyệt.')
      setFormDanhGia({
        maDanhGia: `DG_${Date.now()}`,
        hoTen: nguoiDungHienTai?.fullName || formDanhGia.hoTen,
        maDonHang: '',
        soSao: 0,
        noiDung: '',
      })
    } catch (error) {
      setLoiGui(error?.message || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.')
    } finally {
      setDangGui(false)
    }
  }

  return (
    <div className="danh-gia-page">
      <section className="danh-gia-page-hero">
        <div className="container danh-gia-page-hero__inner">
          <p className="eyebrow">Phản hồi từ khách hàng</p>
          <h1>Đánh Giá Từ Người Dùng</h1>
          <p>
            Những nhận xét đã được duyệt từ khách hàng sau khi trải nghiệm món ăn, dịch vụ và không gian tại nhà hàng.
          </p>
          <div className="danh-gia-page-stats">
            <div>
              <strong>{danhGia.length}</strong>
              <span>đánh giá đã duyệt</span>
            </div>
            <div>
              <strong>{trungBinhSoSao ? trungBinhSoSao.toFixed(1) : '0.0'}</strong>
              <span>điểm trung bình</span>
            </div>
            <div>
              <strong>{nhanXepHangTong}</strong>
              <span>xếp hạng tổng</span>
            </div>
          </div>
        </div>
      </section>

      <section className="danh-gia-page-list">
        <div className="container">
          {dangTai ? (
            <div className="danh-gia-page-empty">Đang tải đánh giá...</div>
          ) : loi ? (
            <div className="danh-gia-page-empty">{loi}</div>
          ) : danhGia.length === 0 ? (
            <div className="danh-gia-page-empty">Hiện chưa có đánh giá đã duyệt để hiển thị.</div>
          ) : (
            <div className="danh-gia-page-grid">
              {danhGia.map((review) => (
                <article key={review.maDanhGia} className="danh-gia-page-card">
                  <div className="danh-gia-page-card__head">
                    <strong>{review.maKH || 'Khách hàng'}</strong>
                    <span>{'★'.repeat(Math.max(1, Math.min(5, review.soSao || 0)))}</span>
                  </div>
                  <p>{review.noiDung || 'Khách hàng đã để lại phản hồi tích cực về nhà hàng.'}</p>
                  <small>{review.maDonHang ? `Đơn hàng: ${review.maDonHang}` : 'Phản hồi sau trải nghiệm dùng bữa'}</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="danh-gia-page-form-section">
        <div className="container">
          <div className="danh-gia-page-form-shell">
            <form className="danh-gia-page-form" onSubmit={xuLyGuiDanhGia}>
              <div className="danh-gia-page-form-copy">
                <p className="eyebrow">Gửi phản hồi</p>
                <h2>Chia sẻ trải nghiệm của bạn</h2>
                <p>
                  Đánh giá được gắn với mã đơn hàng để phản ánh tổng thể món ăn, phục vụ và trải nghiệm của bạn tại nhà hàng.
                </p>
              </div>

              <div className="danh-gia-page-form-grid">
                <label>
                  <span>Họ tên</span>
                  <input
                    type="text"
                    value={formDanhGia.hoTen}
                    onChange={(event) => xuLyDoiTruong('hoTen', event.target.value)}
                    placeholder="Ví dụ: Trần Văn Khách"
                  />
                </label>

                <label>
                  <span>Mã đơn hàng</span>
                  <input
                    type="text"
                    value={formDanhGia.maDonHang}
                    onChange={(event) => xuLyDoiTruong('maDonHang', event.target.value.trim().toUpperCase())}
                    placeholder="VD: DH001"
                  />
                </label>
              </div>

              <div className="danh-gia-page-star-block">
                <span>Chọn số sao</span>
                <div className="danh-gia-page-stars" role="group" aria-label="Chọn số sao đánh giá">
                  {[1, 2, 3, 4, 5].map((mucSao) => {
                    const duocChon = (saoHover || formDanhGia.soSao) >= mucSao
                    return (
                      <button
                        key={mucSao}
                        type="button"
                        className={`danh-gia-page-star ${duocChon ? 'active' : ''}`}
                        onMouseEnter={() => setSaoHover(mucSao)}
                        onMouseLeave={() => setSaoHover(0)}
                        onClick={() => xuLyDoiTruong('soSao', mucSao)}
                      >
                        ★
                      </button>
                    )
                  })}
                </div>
                <small>{nhanSaoDangChon}</small>
              </div>

              <label className="danh-gia-page-textarea-wrap">
                <span>Nội dung đánh giá</span>
                <textarea
                  rows="5"
                  value={formDanhGia.noiDung}
                  onChange={(event) => xuLyDoiTruong('noiDung', event.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về món ăn, phục vụ và trải nghiệm tại nhà hàng..."
                />
              </label>

              {loiGui ? <div className="danh-gia-page-form-error">{loiGui}</div> : null}
              {thongBaoGui ? <div className="danh-gia-page-form-success">{thongBaoGui}</div> : null}

              <button type="submit" className="btn nut-chinh danh-gia-page-submit" disabled={!formHopLe || dangGui}>
                {dangGui ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DanhGiaPage
