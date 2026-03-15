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
  'Bếp mở theo nhịp tối',
  'Bàn ăn đủ ánh ấm',
  'Món được kể bằng bố cục',
]

const HOME_SERVICE_POINTS = [
  {
    soLieu: '12',
    nhan: 'bàn được set mỗi tối',
  },
  {
    soLieu: '08',
    nhan: 'món nổi bật xoay theo tuần',
  },
  {
    soLieu: '01',
    nhan: 'hành trình đặt bàn gọn lẹ',
  },
]

const HOME_EDITORIAL_FACTS = [
  'Lối đi được chia thành từng nhịp rõ ràng để khách không bị ngợp khi vừa vào trang.',
  'Khung món nổi bật giữ nguyên luồng xem chi tiết và thêm giỏ như trải nghiệm hiện tại.',
  'Màu sắc và độ tương phản được đẩy lên vừa đủ để trang chủ bớt giống landing page mẫu.',
]

const HOME_TRUST_POINTS = [
  'Phù hợp nhóm nhỏ, gặp đối tác và bữa tối gia đình.',
  'Đặt bàn trước, vào bàn nhanh, không phải gọi lại nhiều lần.',
  'Có thể thay ảnh món thật về sau mà không cần đổi luồng trang chủ.',
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
            <p className="eyebrow">Nhà hàng Nguyên Vị</p>
            <h1>
              Không gian ấm,
              <br />
              món ăn <em>lên tiếng</em>
              <br />
              theo một nhịp riêng.
            </h1>
            <p className="subtitle">
              Trang chủ được sắp lại theo hướng biên tập nhà hàng: mở đầu có chủ đề, danh mục dễ quét nhanh, món nổi bật giữ đủ thao tác và phần đặt bàn được đẩy thành một lời mời rõ ràng.
            </p>
            <div className="mo-dau-actions-group">
              <Link className="btn nut-chinh" to="/dat-ban">
                Giữ bàn tối nay
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

            <div className="mo-dau-diem-tin-cay" aria-label="Số liệu tổng quan">
              {HOME_SERVICE_POINTS.map((muc) => (
                <article key={muc.nhan} className="diem-tin-cay-item">
                  <strong>{muc.soLieu}</strong>
                  <span>{muc.nhan}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="mo-dau-showcase">
            <article className="mo-dau-card">
              <div className="mo-dau-card-head">
                <span className="mo-dau-tag">Chuyên đề tuần này</span>
                <span className="mo-dau-note-chip">Phong vị nhà hàng</span>
              </div>

              <div className="mo-dau-art">
                <div className="mo-dau-visual-frame">
                  <div className="mo-dau-visual-copy">
                    <span className="mo-dau-visual-kicker">Bàn biên tập món nổi bật</span>
                    <strong>Miếng đầu tiên cần được thấy bằng một lý do rõ ràng.</strong>
                    <span>Phần hero không còn chỉ là một banner đẹp, mà trở thành khung giới thiệu tính cách của quán.</span>
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
                <p className="mo-dau-card-overline">Nhịp điệu mới</p>
                <h3>Hero được đổi sang bố cục tạp chí, lệch nhịp và có trọng tâm rõ.</h3>
                <p>Khung bên phải đóng vai trò như một tấm menu trình diễn, giúp tổng thể bớt giống mẫu website nhà hàng phổ biến.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="trai-nghiem-section" aria-labelledby="trai-nghiem-title">
        <div className="container trai-nghiem-grid">
          <div className="trai-nghiem-mo-dau">
            <p className="eyebrow">Hướng biên tập trang chủ</p>
            <h2 id="trai-nghiem-title">Trang đầu không còn trình bày kiểu khuôn mẫu.</h2>
          </div>

          <div className="trai-nghiem-danh-sach">
            {HOME_EDITORIAL_FACTS.map((ghiChu, index) => (
              <article key={ghiChu} className="trai-nghiem-item">
                <span className="trai-nghiem-index">0{index + 1}</span>
                <p>{ghiChu}</p>
              </article>
            ))}
          </div>
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
            <h2>Chọn trước một bàn đẹp cho buổi hẹn tối nay.</h2>
            <p>Phần kết được đổi thành một lời mời rõ ràng, có thêm các điểm tin cậy ngắn gọn để thao tác đặt bàn không bị chìm trong hình nền.</p>
            <div className="dat-ban-points" aria-label="Điểm nổi bật đặt bàn">
              {HOME_TRUST_POINTS.map((muc) => (
                <span key={muc}>{muc}</span>
              ))}
            </div>
          </div>

          <div className="dat-ban-cta">
            <Link className="btn nut-sang" to="/dat-ban">
              Bắt đầu đặt bàn
            </Link>
            <span>Mở form đặt bàn chỉ trong vài bước.</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrangChuPage
