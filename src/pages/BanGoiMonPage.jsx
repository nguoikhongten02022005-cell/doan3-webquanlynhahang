import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { layOrderDangMoTaiBanApi, layThucDonTheoBanApi, guiOrderTaiBanApi, guiYeuCauThanhToanTaiBanApi } from '../services/api/apiBanTaiBan'
import { dinhDangTienTeVietNam } from '../utils/tienTe'

const STORAGE_KEY_PREFIX = 'ban_order_draft_'

function BanGoiMonPage() {
  const { maBan } = useParams()
  const [banInfo, setBanInfo] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [tab, setTab] = useState('menu')
  const [gioTam, setGioTam] = useState([])
  const [orderDangMo, setOrderDangMo] = useState(null)
  const [yeuCauThanhToan, setYeuCauThanhToan] = useState(false)
  const [loi, setLoi] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [thucDonRes, orderRes] = await Promise.all([
          layThucDonTheoBanApi(maBan),
          layOrderDangMoTaiBanApi(maBan),
        ])
        const duLieuThucDon = thucDonRes?.duLieu || {}
        const danhSachMon = Array.isArray(duLieuThucDon?.data)
          ? duLieuThucDon.data
          : Array.isArray(duLieuThucDon?.monAn)
            ? duLieuThucDon.monAn
            : Array.isArray(duLieuThucDon)
              ? duLieuThucDon
              : []

        setBanInfo(duLieuThucDon?.ban || null)
        setMenuItems(danhSachMon)
        setOrderDangMo(orderRes?.duLieu || null)
      } catch (error) {
        if ((error?.message || '').toLowerCase().includes('không tồn tại') || (error?.message || '').toLowerCase().includes('not found')) {
          setLoi('Bàn không tồn tại hoặc QR code không hợp lệ')
          return
        }
        setLoi('Không thể tải dữ liệu bàn lúc này')
      }
    }

    const khoaBanNhapTam = `${STORAGE_KEY_PREFIX}${maBan}`
    const draft = sessionStorage.getItem(khoaBanNhapTam)
    if (draft) {
      try {
        const gioTamDaLuu = JSON.parse(draft)
        setGioTam(Array.isArray(gioTamDaLuu) ? gioTamDaLuu : [])
      } catch {
        sessionStorage.removeItem(khoaBanNhapTam)
      }
    }

    load()
  }, [maBan])

  useEffect(() => {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${maBan}`, JSON.stringify(gioTam))
  }, [gioTam, maBan])

  const tongTien = useMemo(() => gioTam.reduce((tong, item) => tong + item.gia * item.soLuong, 0), [gioTam])
  const soBanHienThi = Number(banInfo?.soBan ?? String(maBan).replace(/^B/i, ''))
  const tenBanHienThi = banInfo?.tenBan?.trim() || `Bàn ${soBanHienThi}`

  const themMon = (mon) => {
    setGioTam((current) => {
      const daCo = current.find((item) => item.maMon === mon.maMon)
      if (!daCo) return [...current, { maMon: mon.maMon, tenMon: mon.tenMon, gia: mon.gia, soLuong: 1 }]
      return current.map((item) => item.maMon === mon.maMon ? { ...item, soLuong: item.soLuong + 1 } : item)
    })
  }

  const doiSoLuong = (maMon, delta) => {
    setGioTam((current) => current.reduce((acc, item) => {
      if (item.maMon !== maMon) { acc.push(item); return acc }
      const next = item.soLuong + delta
      if (next > 0) acc.push({ ...item, soLuong: next })
      return acc
    }, []))
  }

  const guiOrder = async () => {
    const ketQua = await guiOrderTaiBanApi(maBan, gioTam.map((item, index) => ({ maChiTiet: `CTBAN_${Date.now()}_${index}`, maMon: item.maMon, soLuong: item.soLuong })))
    setOrderDangMo(ketQua.data || ketQua.duLieu)
    setGioTam([])
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${maBan}`)
    alert('Đã gửi order!')
  }

  const yeuCauBill = async () => {
    await guiYeuCauThanhToanTaiBanApi(maBan)
    setYeuCauThanhToan(true)
    alert('Nhân viên sẽ mang bill ra ngay!')
  }

  if (loi) return <div className="gio-hang-page"><div className="container"><div className="gio-hang-empty">{loi}</div></div></div>

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-list-head"><h2>Nguyên Vị • {tenBanHienThi}</h2><span>{gioTam.reduce((tong, item) => tong + item.soLuong, 0)} món trong giỏ</span></div>
        <div className="ho-so-filter-row">
          <button type="button" className={`btn ${tab === 'menu' ? 'nut-chinh' : 'nut-phu'}`} onClick={() => setTab('menu')}>Thực đơn</button>
          <button type="button" className={`btn ${tab === 'cart' ? 'nut-chinh' : 'nut-phu'}`} onClick={() => setTab('cart')}>Giỏ hàng</button>
        </div>
        {tab === 'menu' ? (
          <div className="food-grid food-grid--menu-showcase">
            {menuItems.map((mon) => (
              <article key={mon.maMon} className="the-mon the-mon--menu">
                <div className="than-mon than-mon--menu">
                  <div className="than-mon-main than-mon-main--menu">
                    <h3>{mon.tenMon}</h3>
                    <p>{mon.moTa}</p>
                  </div>
                  <div className="chan-mon"><strong className="gia-mon price">{dinhDangTienTeVietNam(mon.gia)}</strong><button type="button" className="btn nut-chinh" onClick={() => themMon(mon)}>+</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="gio-hang-layout">
            <div className="gio-hang-items-section">
              <div className="gio-hang-item-list">
                {gioTam.map((item) => (
                  <article key={item.maMon} className="gio-hang-item">
                    <div className="gio-hang-item-content">
                      <div className="gio-hang-item-top"><div className="gio-hang-item-copy"><h3>{item.tenMon}</h3></div></div>
                      <div className="gio-hang-item-bottom"><div className="quantity-control"><button type="button" className="qty-btn" onClick={() => doiSoLuong(item.maMon, -1)}>-</button><span className="qty-value">{item.soLuong}</span><button type="button" className="qty-btn" onClick={() => doiSoLuong(item.maMon, 1)}>+</button></div><strong className="gio-hang-item-total">{dinhDangTienTeVietNam(item.gia * item.soLuong)}</strong></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="gio-hang-summary"><div className="tom-tat-card gio-hang-tom-tat-card"><div className="tom-tat-row tom-tat-total"><span>Tổng tiền</span><strong>{dinhDangTienTeVietNam(tongTien)}</strong></div><button type="button" className="btn gio-hang-checkout-btn w-full" disabled={gioTam.length === 0} onClick={guiOrder}>Gửi order</button><button type="button" className="btn nut-phu w-full" onClick={() => setTab('menu')}>Gọi thêm</button></div></div>
          </div>
        )}

        {orderDangMo ? (
          <section className="thanh-toan-form-panel" style={{ marginTop: '1rem' }}>
            <h2>Món đã gọi</h2>
            <div className="thanh-toan-item-list">
              {(orderDangMo.chiTiet || orderDangMo.ChiTiet || []).map((item, index) => <div key={`${item.maMon || item.MaMon}-${index}`} className="thanh-toan-item"><div><p className="thanh-toan-item-name">{item.maMon || item.MaMon}</p><p className="thanh-toan-item-qty">x{item.soLuong || item.SoLuong}</p></div><strong>{dinhDangTienTeVietNam(item.thanhTien || item.ThanhTien)}</strong></div>)}
            </div>
            {!yeuCauThanhToan ? <button type="button" className="btn gio-hang-checkout-btn" onClick={yeuCauBill}>Yêu cầu thanh toán</button> : <p className="thanh-toan-tom-tat-note">Nhân viên sẽ mang bill ra ngay!</p>}
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default BanGoiMonPage
