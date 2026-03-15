import { useEffect, useMemo, useState } from 'react'
import { CAC_LUA_CHON_KICH_CO_THUC_DON } from '../constants/tuyChonThucDon'
import { useThongBao } from '../context/ThongBaoContext'
import { phanTichGiaThanhSo } from '../utils/giaTien'

export const useChiTietMonAnModal = ({ themVaoGio, sizeOptions = CAC_LUA_CHON_KICH_CO_THUC_DON }) => {
  const { hienThanhCong } = useThongBao()
  const kichCoMacDinh = sizeOptions[0]?.value || 'M'
  const [monDaChon, setMonDaChon] = useState(null)
  const [dangMoChiTiet, setDangMoChiTiet] = useState(false)
  const [kichCoDaChon, setKichCoDaChon] = useState(kichCoMacDinh)
  const [toppingDaChon, setToppingDaChon] = useState([])
  const [ghiChuRieng, datGhiChuRieng] = useState('')

  useEffect(() => {
    if (!dangMoChiTiet) {
      return undefined
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setDangMoChiTiet(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [dangMoChiTiet])

  useEffect(() => {
    const trangThaiTranCu = document.body.style.overflow

    if (dangMoChiTiet) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = trangThaiTranCu
    }
  }, [dangMoChiTiet])

  const layPhuThuTheoKichCo = (kichCo) => {
    const luaChonDaChon = sizeOptions.find((option) => option.value === kichCo)
    return luaChonDaChon ? luaChonDaChon.surcharge : 0
  }

  const moChiTietMon = (mon) => {
    setMonDaChon(mon)
    setKichCoDaChon(kichCoMacDinh)
    setToppingDaChon([])
    datGhiChuRieng('')
    setDangMoChiTiet(true)
  }

  const dongChiTietMon = () => {
    setDangMoChiTiet(false)
    setMonDaChon(null)
  }

  const xuLyBatTatTopping = (topping) => {
    setToppingDaChon((truocDo) => (
      truocDo.includes(topping) ? truocDo.filter((muc) => muc !== topping) : [...truocDo, topping]
    ))
  }

  const xuLyThemMonNhanh = (mon) => {
    themVaoGio({
      ...mon,
      kichCoDaChon: kichCoMacDinh,
      toppingDaChon: [],
      specialNote: '',
    })
    hienThanhCong(`Đã thêm ${mon.name} vào giỏ hàng.`)
  }

  const phuThuDaChon = layPhuThuTheoKichCo(kichCoDaChon)

  const giaChiTiet = useMemo(() => {
    if (!monDaChon) {
      return 0
    }

    return phanTichGiaThanhSo(monDaChon.price) + phuThuDaChon
  }, [monDaChon, phuThuDaChon])

  const xuLyThemMonDaTuyChon = () => {
    if (!monDaChon) {
      return
    }

    themVaoGio({
      ...monDaChon,
      price: phanTichGiaThanhSo(monDaChon.price) + phuThuDaChon,
      kichCoDaChon: kichCoDaChon,
      toppingDaChon: toppingDaChon,
      specialNote: ghiChuRieng,
    })

    hienThanhCong(`Đã thêm ${monDaChon.name} vào giỏ hàng.`)
    dongChiTietMon()
  }

  return {
    giaChiTiet,
    xuLyThemMonDaTuyChon,
    xuLyThemMonNhanh,
    xuLyBatTatTopping,
    dangMoChiTiet,
    moChiTietMon,
    dongChiTietMon,
    monDaChon,
    kichCoDaChon,
    phuThuDaChon,
    toppingDaChon,
    datKichCoDaChon: setKichCoDaChon,
    datGhiChuRieng,
    ghiChuRieng,
  }
}
