import { CAC_LUA_CHON_KICH_CO_THUC_DON, CAC_LUA_CHON_TOPPING_THUC_DON } from '../../constants/tuyChonThucDon'
import { dinhDangTienTe } from '../../utils/tienTe'
import { phanTichGiaThanhSo } from '../../utils/giaTien'

function ChiTietMonAnModal({
  giaChiTiet,
  dangMo,
  xuLyDong,
  xuLyChonKichCo,
  xuLyDoiGhiChuRieng,
  xuLyBatTatTopping,
  coTheChonKichCo,
  phamVi = 'food',
  monDaChon,
  kichCoDaChon,
  phuThuDaChon,
  toppingDaChon,
  danhSachKichCo = CAC_LUA_CHON_KICH_CO_THUC_DON,
  ghiChuRieng,
  danhSachTopping = CAC_LUA_CHON_TOPPING_THUC_DON,
}) {
  if (!dangMo || !monDaChon) {
    return null
  }

  const monAnAnToan = monDaChon || {}
  const idTieuDe = `${phamVi}-chi-tiet-mon-title-${monAnAnToan.id}`
  const idGhiChu = `${phamVi}-special-note`

  return (
    <div className="chi-tiet-mon-hop-thoai-overlay" role="dialog" aria-modal="true" aria-labelledby={idTieuDe} onClick={xuLyDong}>
      <div className="chi-tiet-mon-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="chi-tiet-mon-close" onClick={xuLyDong} aria-label="Đóng chi tiết món">
          ×
        </button>

        <div className={`chi-tiet-mon-hero ${monAnAnToan.tone || ''}`}>
          {monAnAnToan.image ? (
            <img className="chi-tiet-mon-mo-dau-image" src={monAnAnToan.image} alt={monAnAnToan.name || 'Món ăn'} loading="lazy" />
          ) : (
            <div className="chi-tiet-mon-mo-dau-fallback" aria-hidden="true">{monAnAnToan.name?.slice(0, 1) || 'M'}</div>
          )}
          <div className="chi-tiet-mon-mo-dau-overlay">
            <span className="nhan-mon">{monAnAnToan.badge}</span>
          </div>
        </div>

        <div className="chi-tiet-mon-content">
          <div className="chi-tiet-mon-header">
            <div className="chi-tiet-mon-tieu-de-wrap">
              <h3 id={idTieuDe}>{monAnAnToan.name}</h3>
              <p>{monAnAnToan.description}</p>
            </div>
            <strong className="chi-tiet-mon-base-price">Giá gốc: {dinhDangTienTe(phanTichGiaThanhSo(monAnAnToan.price))}</strong>
          </div>

          {coTheChonKichCo ? (
            <div className="chi-tiet-mon-group">
              <p className="chi-tiet-mon-group-title">Chọn cỡ món</p>
              <div className="chi-tiet-mon-options two-columns">
                {danhSachKichCo.map((luaChon) => (
                  <label key={luaChon.value} className={`chi-tiet-mon-option ${kichCoDaChon === luaChon.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`detail-size-${phamVi}`}
                      value={luaChon.value}
                      checked={kichCoDaChon === luaChon.value}
                      onChange={(event) => xuLyChonKichCo(event.target.value)}
                    />
                    <span className="chi-tiet-mon-option-label">{luaChon.label}</span>
                    <small>{luaChon.surcharge > 0 ? `+${dinhDangTienTe(luaChon.surcharge)}` : 'Giá gốc'}</small>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="chi-tiet-mon-group">
            <p className="chi-tiet-mon-group-title">Topping thêm</p>
            <div className="chi-tiet-mon-options">
              {danhSachTopping.map((topping) => (
                <label key={topping} className={`chi-tiet-mon-option ${toppingDaChon.includes(topping) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={toppingDaChon.includes(topping)}
                    onChange={() => xuLyBatTatTopping(topping)}
                  />
                  <span className="chi-tiet-mon-option-label">{topping}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="chi-tiet-mon-group">
            <label className="chi-tiet-mon-group-title" htmlFor={idGhiChu}>
              Ghi chú món
            </label>
            <textarea
              id={idGhiChu}
              className="truong-van-ban chi-tiet-mon-note"
              rows="3"
              maxLength="120"
              placeholder="Ví dụ: ít cay, không hành..."
              value={ghiChuRieng}
              onChange={(event) => xuLyDoiGhiChuRieng(event.target.value)}
            />
          </div>

          <div className="chi-tiet-mon-actions">
            <div className="chi-tiet-mon-total-wrap">
              <span>Tạm tính món</span>
              <strong>{dinhDangTienTe(giaChiTiet)}</strong>
              {phuThuDaChon > 0 && <small>Đã gồm phụ thu cỡ món {dinhDangTienTe(phuThuDaChon)}</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChiTietMonAnModal
