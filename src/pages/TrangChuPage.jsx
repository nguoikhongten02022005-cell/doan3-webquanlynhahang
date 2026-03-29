import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import TheMonAn from '../components/TheMonAn'
import ChiTietMonAnModal from '../components/thucDon/ChiTietMonAnModal'
import anhTimChungToi from '../assets/img/findus.585c393ccd3671513743.png'
import knifeImage from '../assets/img/knife.1121c0a5afb62acb31cb.png'
import { ANH_HERO_TRANG_CHU, layAnhMonTheoTen } from '../constants/anhMonAn'
import { HOME_CAC_DANH_MUC_THUC_DON } from '../constants/danhMucThucDon'
import { useGioHang } from '../context/GioHangContext'
import { useChiTietMonAnModal } from '../hooks/useChiTietMonAnModal'
import { useDanhSachMonAn } from '../hooks/useDanhSachMonAn'
import { layDanhSachMonNoiBatTrangChu } from '../services/mappers/anhXaThucDon'

function TrangChuPage() {
  const { themVaoGio } = useGioHang()
  const { dishes } = useDanhSachMonAn()
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

      <section className="tim-chung-toi-section" aria-labelledby="tim-chung-toi-title">
        <div className="container tim-chung-toi-grid">
          <div className="tim-chung-toi-noi-dung">
            <p className="tim-chung-toi-kicker">Liên hệ</p>
            <h2 id="tim-chung-toi-title">Tìm Chúng Tôi</h2>
            <p className="tim-chung-toi-dia-chi">
              Lane Ends Bungalow, Whatcroft Hall Lane, Rudheath, CW9 75G
            </p>

            <div className="tim-chung-toi-thong-tin">
              <h3>Giờ Mở Cửa</h3>
              <p>Thứ Hai - Thứ Sáu: 10:00 Sáng - 02:00 Sáng</p>
              <p>Thứ Bảy - Chủ Nhật: 10:00 Sáng - 03:00 Sáng</p>
            </div>

            <Link className="btn tim-chung-toi-cta" to="/dat-ban">
              Ghé thăm chúng tôi
            </Link>
          </div>

          <div className="tim-chung-toi-visual">
            <span className="tim-chung-toi-khung tim-chung-toi-khung--tren" aria-hidden="true" />
            <span className="tim-chung-toi-khung tim-chung-toi-khung--duoi" aria-hidden="true" />
            <figure className="tim-chung-toi-anh-wrap">
              <img
                src={anhTimChungToi}
                alt="Thức uống đặc trưng của nhà hàng"
                className="tim-chung-toi-anh"
                loading="lazy"
              />
            </figure>
          </div>
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
