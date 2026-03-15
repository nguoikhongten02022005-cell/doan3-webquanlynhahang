import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import TheMonAn from '../components/TheMonAn'
import ChiTietMonAnModal from '../components/thucDon/ChiTietMonAnModal'
import { HOME_CAC_DANH_MUC_THUC_DON } from '../constants/danhMucThucDon'
import { useGioHang } from '../context/GioHangContext'
import { useChiTietMonAnModal } from '../hooks/useChiTietMonAnModal'
import { useDanhSachMonAn } from '../hooks/useDanhSachMonAn'
import { layDanhSachMonNoiBatTrangChu } from '../services/mappers/anhXaThucDon'

const HOME_CATEGORY_NOTES = {
  'Món Chính': 'Đậm vị, chỉn chu cho bữa chính.',
  'Khai Vị': 'Nhẹ nhàng để mở vị và khởi nhịp bàn ăn.',
  'Đồ Uống': 'Cocktail, trà và thức uống đi cùng món.',
  'Tráng Miệng': 'Một kết thúc mềm và gọn cho bữa tối.',
  Combo: 'Lựa chọn tiện cho cặp đôi và nhóm nhỏ.',
}

const HOME_ATMOSPHERE_NOTES = [
  'Editorial tối giản',
  'Tông kem ấm và nhẹ',
  'Dễ thay ảnh món về sau',
]

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

  const danhSachMonDacTrung = useMemo(() => layDanhSachMonNoiBatTrangChu(dishes), [dishes])

  return (
    <div className="trang-chu-page">
      <section className="hero" id="home">
        <div className="container mo-dau-grid">
          <div className="mo-dau-copy">
            <p className="eyebrow">Nhà hàng nguyên vị</p>
            <h1>
              Một trang chủ
              <br />
              gọn, sang và
              <br />
              đủ chỗ để món ăn
              <br />
              tự kể chuyện.
            </h1>
            <p>
              Từ phần mở đầu đến khu món nổi bật, mọi nhịp trình bày được tiết chế để thực khách nhìn thấy sự chỉn chu ngay từ lần ghé đầu tiên.
            </p>
            <div className="mo-dau-actions-group">
              <Link className="btn nut-chinh" to="/dat-ban">
                Đặt bàn ngay
              </Link>
              <Link className="btn nut-phu" to="/thuc-don">
                Xem thực đơn
              </Link>
            </div>
            <div className="mo-dau-atmosphere" aria-label="Tinh thần trình bày">
              {HOME_ATMOSPHERE_NOTES.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="mo-dau-showcase">
            <article className="mo-dau-card">
              <div className="mo-dau-card-head">
                <span className="mo-dau-tag">Khung ảnh nổi bật</span>
                <span className="mo-dau-note-chip">Sẵn sàng thay ảnh món</span>
              </div>

              <div className="mo-dau-art">
                <div className="mo-dau-visual-frame">
                  <div className="mo-dau-visual-copy">
                    <span className="mo-dau-visual-kicker">Khung ảnh đặc trưng</span>
                    <strong>Chỉ cần thay ảnh món chủ đạo tại đây.</strong>
                    <span>Giữ bố cục sáng, gọn và đủ sang kể cả khi chưa có ảnh thật.</span>
                  </div>

                  <div className="mo-dau-plate" aria-hidden="true">
                    <span className="mo-dau-food mo-dau-food--protein" />
                    <span className="mo-dau-food mo-dau-food--glaze" />
                    <span className="mo-dau-food mo-dau-food--puree" />
                    <span className="mo-dau-food mo-dau-food--greens" />
                    <span className="mo-dau-food mo-dau-food--accent" />
                  </div>
                </div>
              </div>

              <div className="mo-dau-card-meta">
                <p className="mo-dau-card-overline">Tinh thần trình bày</p>
                 <h3>Biên tập nhẹ, sang và dễ thay đổi về sau.</h3>
                 <p>Giữ phần hình ảnh như một khung món chủ đạo để sau này cập nhật ảnh thật mà không cần động vào luồng hiện tại.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="categories" id="menu">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="section-head-copy">
              <p className="eyebrow">Đi nhanh vào thực đơn</p>
              <h2>Danh mục nổi bật</h2>
            </div>
            <p className="section-head-description">Những nhóm món được sắp gọn để người xem chọn nhanh phần mình quan tâm và tiếp tục đi sâu vào menu.</p>
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
                  <small>{HOME_CATEGORY_NOTES[category.name]}</small>
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
              <p>Những món được gọi nhiều nhất trong tuần, giữ nguyên đầy đủ thao tác xem chi tiết và thêm món như luồng hiện tại.</p>
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

      <section className="dat-ban-banner" id="booking">
        <div className="container dat-ban-inner">
          <div className="dat-ban-copy">
            <p className="eyebrow">Đặt bàn tinh gọn</p>
            <h2>Giữ một góc bàn đẹp cho buổi hẹn tối nay.</h2>
            <p>Chọn khung giờ phù hợp và để đội ngũ chuẩn bị sẵn không gian vừa vặn cho cuộc gặp của bạn.</p>
            <div className="dat-ban-points" aria-label="Điểm nổi bật đặt bàn">
              <span>Khung giờ rõ ràng</span>
              <span>Xác nhận nhanh</span>
              <span>Phù hợp cặp đôi và nhóm nhỏ</span>
            </div>
          </div>

          <div className="dat-ban-cta">
            <Link className="btn nut-sang" to="/dat-ban">
              Giữ bàn cho tối nay
            </Link>
            <span>Mở form đặt bàn chỉ trong vài bước.</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrangChuPage
