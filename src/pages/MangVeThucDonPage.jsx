import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDanhSachMonAn } from '../features/thucDon/hooks/useDanhSachMonAn'
import { useGioHangMangVe } from '../context/GioHangMangVeContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'

function MangVeThucDonPage() {
  const { dishes } = useDanhSachMonAn()
  const { themVaoGio, cartItems } = useGioHangMangVe()

  const tongMon = useMemo(() => cartItems.reduce((tong, item) => tong + item.quantity, 0), [cartItems])

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-list-head">
          <h2>Menu mang về</h2>
          <Link to="/mang-ve/gio-hang" className="btn nut-chinh">Giỏ mang về ({tongMon})</Link>
        </div>

        <div className="food-grid food-grid--menu-showcase">
          {dishes.map((dish) => (
            <article key={dish.id} className="the-mon the-mon--menu">
              <button type="button" className="the-mon-media-button the-mon-media-button--menu">
                {dish.image ? (
                  <img className="the-mon-hinh the-mon-hinh--menu" src={dish.image} alt={dish.name} loading="lazy" />
                ) : (
                  <div className="the-mon-hinh the-mon-hinh--menu" aria-hidden="true"></div>
                )}
              </button>
              <div className="than-mon than-mon--menu">
                <div className="than-mon-main than-mon-main--menu">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                </div>
                <div className="chan-mon">
                  <strong className="gia-mon price">{dinhDangTienTeVietNam(dish.priceValue)}</strong>
                  <button type="button" className="btn nut-chinh" onClick={() => themVaoGio({ ...dish, price: dish.priceValue, quantity: 1, toppingDaChon: [], ghiChuRieng: '' })}>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MangVeThucDonPage
