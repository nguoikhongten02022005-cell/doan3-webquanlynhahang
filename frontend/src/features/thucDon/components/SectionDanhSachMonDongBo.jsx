import TheMonAn from './TheMonAn'

function SectionDanhSachMonDongBo({
  tenMuc,
  nhanMuc = 'Danh mục',
  danhSachMon,
  xuLyMoChiTiet,
  thamChieuMuc,
  maDanhMuc,
}) {
  return (
    <section
      ref={thamChieuMuc}
      className="thuc-don-category-section"
      data-category={maDanhMuc}
    >
      <div className="thuc-don-results-head thuc-don-results-head--minimal thuc-don-results-head--section">
        <div>
          <p className="thuc-don-results-kicker">{nhanMuc}</p>
          <h3>{tenMuc}</h3>
        </div>
      </div>

      <div className="thuc-don-grid thuc-don-grid--menu-showcase">
        {danhSachMon.map((mon) => (
          <TheMonAn
            key={mon.id}
            dish={mon}
            variant="menu"
            onOpenDetail={xuLyMoChiTiet}
          />
        ))}
      </div>
    </section>
  )
}

export default SectionDanhSachMonDongBo
