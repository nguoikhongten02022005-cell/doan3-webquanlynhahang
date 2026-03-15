import { useMemo, useState } from 'react'
import TheMonAn from '../components/TheMonAn'
import ChiTietMonAnModal from '../components/thucDon/ChiTietMonAnModal'
import { DANH_MUC_TAT_CA_THUC_DON, CAC_DANH_MUC_THUC_DON, MO_TA_DANH_MUC_THUC_DON } from '../constants/danhMucThucDon'
import { CAC_LUA_CHON_SAP_XEP_THUC_DON } from '../constants/tuyChonThucDon'
import { useGioHang } from '../context/GioHangContext'
import { useChiTietMonAnModal } from '../hooks/useChiTietMonAnModal'
import { useDanhSachMonAn } from '../hooks/useDanhSachMonAn'

function ThucDonPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(DANH_MUC_TAT_CA_THUC_DON)
  const [sortOption, setSortOption] = useState('featured')
  const {
    dishes,
    loading,
    error,
    reloadDishes,
  } = useDanhSachMonAn()
  const { themVaoGio } = useGioHang()
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

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const categoryCounts = useMemo(
    () => CAC_DANH_MUC_THUC_DON.reduce((counts, category) => {
      counts[category] = category === DANH_MUC_TAT_CA_THUC_DON
        ? dishes.length
        : dishes.filter((dish) => dish.category === category).length
      return counts
    }, {}),
    [dishes],
  )

  const filteredDishes = useMemo(
    () => dishes
      .filter((dish) => {
        const matchesCategory = activeCategory === DANH_MUC_TAT_CA_THUC_DON || dish.category === activeCategory
        const searchableName = String(dish?.name || '').toLowerCase()
        const searchableDescription = String(dish?.description || '').toLowerCase()
        const matchesSearch = !normalizedQuery
          || searchableName.includes(normalizedQuery)
          || searchableDescription.includes(normalizedQuery)
        return matchesCategory && matchesSearch
      })
      .sort((firstDish, secondDish) => {
        if (sortOption === 'price-asc') {
          return (firstDish.priceValue || 0) - (secondDish.priceValue || 0)
        }

        if (sortOption === 'price-desc') {
          return (secondDish.priceValue || 0) - (firstDish.priceValue || 0)
        }

        if (sortOption === 'newest') {
          return (Number(secondDish.id) || 0) - (Number(firstDish.id) || 0)
        }

        return 0
      }),
    [activeCategory, dishes, normalizedQuery, sortOption],
  )

  const hasSourceDishes = dishes.length > 0
  const hasLoadError = Boolean(error)
  const isEmptyState = !loading && !hasLoadError && !hasSourceDishes
  const isNoResultState = !loading && !hasLoadError && hasSourceDishes && filteredDishes.length === 0
  const activeCategoryLabel = activeCategory === DANH_MUC_TAT_CA_THUC_DON ? 'Tất cả danh mục' : activeCategory
  const activeCategoryDescription = MO_TA_DANH_MUC_THUC_DON[activeCategory] || MO_TA_DANH_MUC_THUC_DON[DANH_MUC_TAT_CA_THUC_DON]
  const searchLabel = normalizedQuery ? `· Từ khóa “${searchQuery.trim()}”` : ''

  return (
    <div className="thuc-don-page">
      <div className="container">
        <div className="thuc-don-layout">
          <aside className="thuc-don-sidebar">
            <div className="thuc-don-search">
              <input
                type="text"
                className="thuc-don-search-input"
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="thuc-don-categories">
              <div className="thuc-don-sidebar-head">
                <h3 className="thuc-don-categories-title">Danh mục</h3>
                <span className="thuc-don-sidebar-count">{CAC_DANH_MUC_THUC_DON.length - 1} nhóm món</span>
              </div>
              <div className="thuc-don-danh-muc-list">
                {CAC_DANH_MUC_THUC_DON.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`thuc-don-danh-muc-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span>{category}</span>
                    <small>{categoryCounts[category] ?? 0}</small>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="thuc-don-main">
            <div className="thuc-don-toolbar">
              <div className="thuc-don-toolbar-copy">
                <p className="thuc-don-toolbar-eyebrow">Thực đơn trong ngày</p>
                <h1 className="thuc-don-toolbar-title">{activeCategoryLabel}</h1>
                <p className="thuc-don-toolbar-summary">
                  {loading ? 'Đang tải thực đơn...' : `${filteredDishes.length} món ${searchLabel}`}
                </p>
                <p className="thuc-don-toolbar-description">{activeCategoryDescription}</p>
              </div>

              <label className="thuc-don-sort" htmlFor="thuc-don-sort-select">
                <span>Sắp xếp</span>
                <select
                  id="thuc-don-sort-select"
                  className="thuc-don-sort-select"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                >
                  {CAC_LUA_CHON_SAP_XEP_THUC_DON.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="thuc-don-empty">
                <p>Đang tải thực đơn...</p>
              </div>
            ) : null}

            {!loading && hasLoadError ? (
              <div className="thuc-don-empty">
                <p>{error}</p>
                <button type="button" className="btn nut-chinh" onClick={reloadDishes}>
                  Tải lại
                </button>
              </div>
            ) : null}

            {isEmptyState ? (
              <div className="thuc-don-empty">
                <p>Hiện chưa có món nào trong thực đơn.</p>
              </div>
            ) : null}

            {isNoResultState ? (
              <div className="thuc-don-empty">
                <p>Không tìm thấy món ăn phù hợp với bộ lọc hiện tại.</p>
              </div>
            ) : null}

            {!loading && !hasLoadError && !isEmptyState && !isNoResultState ? (
              <div className="thuc-don-grid">
                {filteredDishes.map((dish) => (
                  <TheMonAn
                    key={dish.id}
                    dish={dish}
                    variant="menu"
                    xuLyThemVaoGio={xuLyThemVaoGio}
                    onOpenDetail={moChiTietMon}
                  />
                ))}
              </div>
            ) : null}
          </main>
        </div>
      </div>

      <ChiTietMonAnModal
        giaChiTiet={giaChiTiet}
        dangMo={dangMoChiTiet}
        xuLyThemVaoGio={xuLyThemMonDaTuyChon}
        xuLyDong={dongChiTietMon}
        xuLyChonKichCo={datKichCoDaChon}
        xuLyDoiGhiChuRieng={datGhiChuRieng}
        xuLyBatTatTopping={xuLyBatTatTopping}
        phamVi="menu"
        monDaChon={monDaChon}
        kichCoDaChon={kichCoDaChon}
        phuThuDaChon={phuThuDaChon}
        toppingDaChon={toppingDaChon}
        ghiChuRieng={ghiChuRieng}
      />
    </div>
  )
}

export default ThucDonPage
