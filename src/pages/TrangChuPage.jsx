import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TheMonAn from '../components/TheMonAn'
import ChiTietMonAnModal from '../components/thucDon/ChiTietMonAnModal'
import knifeImage from '../assets/img/knife.1121c0a5afb62acb31cb.png'
import { ANH_HERO_TRANG_CHU, layAnhMonTheoTen } from '../constants/anhMonAn'
import { HOME_CAC_DANH_MUC_THUC_DON } from '../constants/danhMucThucDon'
import { useGioHang } from '../context/GioHangContext'
import { useChiTietMonAnModal } from '../hooks/useChiTietMonAnModal'
import { useDanhSachMonAn } from '../hooks/useDanhSachMonAn'
import { layDanhSachDanhGiaApi } from '../services/api/apiDanhGia'
import { layDanhSachMonNoiBatTrangChu } from '../services/mappers/anhXaThucDon'

function TrangChuPage() {
  const { themVaoGio } = useGioHang()
  const { dishes } = useDanhSachMonAn()
  const [danhGiaDaDuyet, setDanhGiaDaDuyet] = useState([])
  const {
    dongChiTietMon,
    giaChiTiet,
    xuLyThemMonDaTuyChon,
    xuLyThemVaoGio,
    xuLyBatTatTopping,
    dangMoChiTiet,
    moChiTietMon,
    monDaChon,
    kichCoDaChon,
    phuThuDaChon,
    toppingDaChon,
    datKichCoDaChon,
    datGhiChuRieng,
    ghiChuRieng,
  } = useChiTietMonAnModal({ themVaoGio })

  const danhSachMonDacTrung = useMemo(
    () => layDanhSachMonNoiBatTrangChu(dishes).map((dish) => ({
      ...dish,
      image: dish.image || layAnhMonTheoTen(dish.name),
    })),
    [dishes],
  )

  useEffect(() => {
    let active = true

    const taiDanhGia = async () => {
      try {
        const { duLieu } = await layDanhSachDanhGiaApi()
        if (!active) return
        const danhGiaHopLe = Array.isArray(duLieu)
          ? duLieu.filter((item) => item.trangThai === 'Approved').slice(0, 3)
          : []
        setDanhGiaDaDuyet(danhGiaHopLe)
      } catch {
        if (active) setDanhGiaDaDuyet([])
      }
    }

    taiDanhGia()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="trang-chu-page">
      <section className="hero" id="home">
        <div className="container mo-dau-grid">
          <div className="mo-dau-copy">
            <p className="hero-kicker-tham-chieu">Khơi mở hương vị mới</p>
            <h1>
              Tinh hoa ẩm thực
            </h1>
            <p className="subtitle">
              Thưởng thức những món ăn được chuẩn bị chỉn chu, đậm đà bản sắc và phù hợp cho những buổi gặp gỡ ấm cúng lẫn các dịp đặc biệt.
            </p>
            <div className="mo-dau-actions-group">
              <Link className="btn nut-chinh" to="/thuc-don">
                Xem thực đơn
              </Link>
            </div>
          </div>

          <div className="mo-dau-showcase">
            <div className="hero-tham-chieu-mon">
              <span className="hero-tham-chieu-nen hero-tham-chieu-nen--tren" />
              <span className="hero-tham-chieu-nen hero-tham-chieu-nen--duoi" />
              <figure className="hero-tham-chieu-khung-anh">
                <img src={ANH_HERO_TRANG_CHU} alt="Món ăn chủ đạo của nhà hàng" className="hero-tham-chieu-anh" loading="eager" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-am-thuc" aria-labelledby="showcase-am-thuc-title">
        <div className="container showcase-am-thuc-grid">
          <article className="showcase-am-thuc-panel showcase-am-thuc-panel--left">
            <h2 id="showcase-am-thuc-title">Về chúng tôi</h2>
            <span className="showcase-am-thuc-divider" aria-hidden="true" />
            <p>
              Từ cách chọn nguyên liệu đến cách đón tiếp, chúng tôi giữ một tinh thần phục vụ ấm áp và chỉn chu cho từng bữa ăn.
            </p>
            <Link className="showcase-am-thuc-link" to="/gioi-thieu">
              Xem thêm
            </Link>
          </article>

          <div className="showcase-am-thuc-center" aria-hidden="true">
            <span className="showcase-am-thuc-monogram">N</span>
            <img src={knifeImage} alt="" className="showcase-am-thuc-knife" loading="lazy" />
          </div>

          <article className="showcase-am-thuc-panel showcase-am-thuc-panel--right">
            <h3>Hành trình vị ngon</h3>
            <span className="showcase-am-thuc-divider" aria-hidden="true" />
            <p>
              Mỗi công thức được hoàn thiện qua nhiều lần cân chỉnh để hương vị lên bàn luôn gọn gàng, rõ nét và đáng nhớ.
            </p>
            <Link className="showcase-am-thuc-link" to="/thuc-don">
              Xem thực đơn
            </Link>
          </article>
        </div>
      </section>

      <section className="categories" id="menu">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="section-head-copy">
              <p className="eyebrow">Đi nhanh vào thực đơn</p>
              <h2>Danh Mục Nổi Bật</h2>
            </div>
            <p className="section-head-description">Danh mục được chuyển sang dạng thẻ lớn, đọc theo hàng có nhịp để bớt cảm giác chip slider quen thuộc.</p>
          </div>

          <div className="danh-muc-row">
            {HOME_CAC_DANH_MUC_THUC_DON.map((category, index) => (
              <Link key={category.name} to="/thuc-don" className="danh-muc-item">
                <span className="danh-muc-index">0{index + 1}</span>
                <span className="danh-muc-icon" aria-hidden="true">
                  {category.icon}
                </span>
                <span className="danh-muc-copy">
                  <strong>{category.name}</strong>
                  <small>{category.note}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="noi-bat-section">
        <div className="container">
          <div className="section-head section-head--split noi-bat-head">
            <div className="section-head-copy">
              <p className="eyebrow">Món được chọn nhiều</p>
              <h2>Món Ngon Phải Thử</h2>
            </div>
            <div className="noi-bat-intro">
              <p>Phần này giữ nguyên luồng xem chi tiết và thêm giỏ, nhưng được đặt trong khung sạch hơn để món ăn thật sự là trung tâm.</p>
              <Link className="noi-bat-link" to="/thuc-don">
                Xem toàn bộ thực đơn
              </Link>
            </div>
          </div>

          <div className="food-grid">
            {danhSachMonDacTrung.map((dish) => (
              <TheMonAn key={dish.id} dish={dish} xuLyThemVaoGio={xuLyThemVaoGio} onOpenDetail={moChiTietMon} variant="menu" />
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="danh-gia-section" aria-labelledby="danh-gia-trang-chu-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="section-head-copy">
              <p className="eyebrow">Khách nói gì về chúng tôi</p>
              <h2 id="danh-gia-trang-chu-title">Đánh Giá Nổi Bật</h2>
            </div>
            <p className="section-head-description">Những phản hồi đã được duyệt từ khách hàng sau khi trải nghiệm dịch vụ tại nhà hàng.</p>
          </div>

          {danhGiaDaDuyet.length > 0 ? (
            <div className="danh-gia-grid">
              {danhGiaDaDuyet.map((review) => (
                <article key={review.maDanhGia} className="danh-gia-card">
                  <div className="danh-gia-card-head">
                    <strong>{review.maKH || 'Khách hàng'}</strong>
                    <span>{'★'.repeat(Math.max(1, Math.min(5, review.soSao || 0)))}</span>
                  </div>
                  <p>{review.noiDung || 'Khách hàng đã để lại phản hồi tích cực về nhà hàng.'}</p>
                  <small>{review.maDonHang ? `Đơn hàng: ${review.maDonHang}` : 'Phản hồi từ trải nghiệm dùng bữa'}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="danh-gia-empty-state">
              <h3>Đánh giá sẽ xuất hiện tại đây.</h3>
              <p>Khi có phản hồi được duyệt từ khách hàng, trang chủ sẽ tự động cập nhật để tạo thêm độ tin cậy cho nhà hàng.</p>
            </div>
          )}
        </div>
      </section>

      <ChiTietMonAnModal
        giaChiTiet={giaChiTiet}
        dangMo={dangMoChiTiet}
        xuLyThemVaoGio={xuLyThemMonDaTuyChon}
        xuLyDong={dongChiTietMon}
        xuLyChonKichCo={datKichCoDaChon}
        xuLyDoiGhiChuRieng={datGhiChuRieng}
        xuLyBatTatTopping={xuLyBatTatTopping}
        phamVi="home"
        monDaChon={monDaChon}
        kichCoDaChon={kichCoDaChon}
        phuThuDaChon={phuThuDaChon}
        toppingDaChon={toppingDaChon}
        ghiChuRieng={ghiChuRieng}
      />

    </div>
  )
}

export default TrangChuPage
