import { useEffect, useMemo, useRef, useState } from 'react'
import TheMonAn from '../components/TheMonAn'
import ChiTietMonAnModal from '../components/thucDon/ChiTietMonAnModal'
import {
  GHI_CHU_DANH_MUC_THUC_DON,
  HOME_CAC_DANH_MUC_THUC_DON,
} from '../constants/danhMucThucDon'
import { layAnhMonTheoTen } from '../constants/anhMonAn'
import { useGioHang } from '../context/GioHangContext'
import { useChiTietMonAnModal } from '../hooks/useChiTietMonAnModal'
import { useDanhSachMonAn } from '../hooks/useDanhSachMonAn'

const MENU_CATEGORY_META = Object.freeze(
  HOME_CAC_DANH_MUC_THUC_DON.reduce(
    (mapping, category, index) => {
      mapping[category.name] = {
        ...category,
        index: String(index + 1).padStart(2, '0'),
      }
      return mapping
    },
    {},
  ),
)

const layMetaDanhMuc = (category) => MENU_CATEGORY_META[category] || HOME_CAC_DANH_MUC_THUC_DON[0]
const CAC_TAB_THUC_DON = HOME_CAC_DANH_MUC_THUC_DON.map((category) => category.name)
const KHOANG_CAN_DINH_TAB = 120

function ThucDonPage() {
  const [activeCategory, setActiveCategory] = useState(CAC_TAB_THUC_DON[0])
  const { dishes, daTaiLanDau, error, reloadDishes } = useDanhSachMonAn()
  const { themVaoGio } = useGioHang()
  const danhMucRefs = useRef({})
  const tabsRowRef = useRef(null)
  const tabItemRefs = useRef({})
  const {
    dongChiTietMon,
    giaChiTiet,
    xuLyThemMonDaTuyChon,
    xuLyThemMonNhanh,
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

  const categoryTabs = useMemo(
    () => CAC_TAB_THUC_DON.map((category) => ({
      category,
      label: category,
      ...layMetaDanhMuc(category),
      shortNote: GHI_CHU_DANH_MUC_THUC_DON[category] || 'Chọn nhanh theo khẩu vị bạn muốn.',
    })),
    [],
  )

  const danhSachMonDaCoAnh = useMemo(
    () => dishes.map((mon) => ({
      ...mon,
      image: layAnhMonTheoTen(mon.name, mon.category) || mon.image,
    })),
    [dishes],
  )

  const filteredDishes = useMemo(
    () => danhSachMonDaCoAnh
      .toSorted((firstDish, secondDish) => (Number(firstDish.id) || 0) - (Number(secondDish.id) || 0)),
    [danhSachMonDaCoAnh],
  )

  const cacSectionDanhMuc = useMemo(
    () => categoryTabs
      .map((categoryTab) => ({
        ...categoryTab,
        dishes: filteredDishes.filter((dish) => dish.category === categoryTab.category),
      }))
      .filter((categoryTab) => categoryTab.dishes.length > 0),
    [categoryTabs, filteredDishes],
  )

  const hasSourceDishes = dishes.length > 0
  const hasLoadError = Boolean(error)
  const isEmptyState = daTaiLanDau && !hasLoadError && !hasSourceDishes
  const isNoResultState = daTaiLanDau && hasSourceDishes && cacSectionDanhMuc.length === 0
  const shouldShowErrorState = daTaiLanDau && hasLoadError && !hasSourceDishes
  const shouldShowMenu = hasSourceDishes && !isNoResultState

  useEffect(() => {
    if (!cacSectionDanhMuc.length) {
      return
    }

    const activeStillVisible = cacSectionDanhMuc.some((section) => section.category === activeCategory)

    if (!activeStillVisible) {
      setActiveCategory(cacSectionDanhMuc[0].category)
    }
  }, [activeCategory, cacSectionDanhMuc])

  useEffect(() => {
    if (!cacSectionDanhMuc.length) {
      return undefined
    }

    const xuLyCuon = () => {
      let danhMucGanNhat = cacSectionDanhMuc[0].category
      let khoangCachGanNhat = Number.POSITIVE_INFINITY

      cacSectionDanhMuc.forEach((section) => {
        const phanTu = danhMucRefs.current[section.category]

        if (!phanTu) {
          return
        }

        const khoangCach = Math.abs(phanTu.getBoundingClientRect().top - KHOANG_CAN_DINH_TAB)

        if (khoangCach < khoangCachGanNhat) {
          khoangCachGanNhat = khoangCach
          danhMucGanNhat = section.category
        }
      })

      setActiveCategory((giaTriCu) => (giaTriCu === danhMucGanNhat ? giaTriCu : danhMucGanNhat))
    }

    xuLyCuon()
    window.addEventListener('scroll', xuLyCuon, { passive: true })

    return () => window.removeEventListener('scroll', xuLyCuon)
  }, [cacSectionDanhMuc])

  useEffect(() => {
    const container = tabsRowRef.current
    const activeTab = tabItemRefs.current[activeCategory]
    if (!container || !activeTab) return

    const targetScroll =
      activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2

    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [activeCategory])

  const xuLyChonDanhMuc = (category) => {
    setActiveCategory(category)
    const phanTu = danhMucRefs.current[category]

    if (!phanTu) {
      return
    }

    const viTriCuon = window.scrollY + phanTu.getBoundingClientRect().top - KHOANG_CAN_DINH_TAB
    window.scrollTo({ top: viTriCuon, behavior: 'smooth' })
  }

  return (
    <div className="thuc-don-page">
      <section className="thuc-don-list-section thuc-don-list-section--reworked">
        <div className="container">
          <div className="thuc-don-toolbar-shell thuc-don-toolbar-shell--sticky">
            <div className="thuc-don-tabs-row" ref={tabsRowRef} role="tablist" aria-label="Danh mục thực đơn">
              {categoryTabs.map((categoryTab) => {
                const isActive = activeCategory === categoryTab.category
                return (
                  <button
                    key={categoryTab.category}
                    ref={(el) => { tabItemRefs.current[categoryTab.category] = el }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`thuc-don-tab ${isActive ? 'active' : ''}`}
                    onClick={() => xuLyChonDanhMuc(categoryTab.category)}
                  >
                      <span className="thuc-don-tab-icon" aria-hidden="true">{categoryTab.icon}</span>
                      <span className="thuc-don-tab-copy">
                        <strong>{categoryTab.label}</strong>
                      </span>
                    </button>
                  )
              })}
            </div>

          </div>

          {shouldShowErrorState ? (
            <div className="thuc-don-empty thuc-don-state-card" aria-label="Trạng thái thực đơn">
              <p className="thuc-don-state-kicker">Không thể tải thực đơn</p>
              <h3>{error}</h3>
              <p>Vui lòng thử lại để cập nhật danh sách món đang phục vụ.</p>
              <button type="button" className="btn nut-chinh" onClick={reloadDishes}>
                Tải lại
              </button>
            </div>
          ) : null}

          {isEmptyState ? (
            <div className="thuc-don-empty thuc-don-state-card" aria-label="Trạng thái thực đơn">
              <p className="thuc-don-state-kicker">Thực đơn đang trống</p>
              <h3>Hiện chưa có món nào để hiển thị.</h3>
              <p>Hãy quay lại sau khi danh sách món được cập nhật đầy đủ hơn.</p>
            </div>
          ) : null}

          {isNoResultState ? (
            <div className="thuc-don-empty thuc-don-state-card" aria-label="Trạng thái thực đơn">
              <p className="thuc-don-state-kicker">Không có kết quả phù hợp</p>
              <h3>Chưa tìm thấy món ăn đúng với lựa chọn hiện tại.</h3>
              <p>Hãy thử đổi danh mục hoặc nhập từ khóa ngắn hơn.</p>
            </div>
          ) : null}

          {shouldShowMenu ? (
            <div className="thuc-don-sections" aria-label="Danh sách món ăn theo danh mục">
              {cacSectionDanhMuc.map((section) => (
                <section
                  key={section.category}
                  ref={(phanTu) => {
                    danhMucRefs.current[section.category] = phanTu
                  }}
                  className="thuc-don-category-section"
                  data-category={section.category}
                >
                  <div className="thuc-don-results-head thuc-don-results-head--minimal thuc-don-results-head--section">
                    <div>
                      <p className="thuc-don-results-kicker">Danh mục</p>
                      <h3>{section.label}</h3>
                    </div>
                  </div>

                  <div className="thuc-don-grid thuc-don-grid--menu-showcase">
                    {section.dishes.map((dish) => (
                      <TheMonAn
                        key={dish.id}
                        dish={dish}
                        variant="menu"
                        xuLyThemVaoGio={xuLyThemMonNhanh}
                        onOpenDetail={moChiTietMon}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
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
