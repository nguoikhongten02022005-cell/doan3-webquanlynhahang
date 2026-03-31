import { useCallback, useEffect, useMemo, useState } from 'react'
import { CAC_LUA_CHON_KICH_CO_THUC_DON } from '../constants/tuyChonThucDon'
import { BI_DANH_DANH_MUC_THUC_DON } from '../constants/danhMucThucDon'
import { phanTichGiaThanhSo } from '../utils/giaTien'

export const useChiTietMonAnModal = ({ sizeOptions = CAC_LUA_CHON_KICH_CO_THUC_DON, themVaoGio = null }) => {
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

  const laMonDoUong = (mon) => {
    const danhMucGoc = String(mon?.category || '').trim()
    const khoaDanhMuc = danhMucGoc
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')

    const danhMucChuan = BI_DANH_DANH_MUC_THUC_DON[khoaDanhMuc] || danhMucGoc
    return danhMucChuan === 'Đồ Uống'
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

  const coTheChonKichCo = laMonDoUong(monDaChon)
  const phuThuDaChon = coTheChonKichCo ? layPhuThuTheoKichCo(kichCoDaChon) : 0

  const giaChiTiet = useMemo(() => {
    if (!monDaChon) {
      return 0
    }

    return phanTichGiaThanhSo(monDaChon.price) + phuThuDaChon
  }, [monDaChon, phuThuDaChon])

  const taoMonDaTuyChon = useCallback(() => {
    if (!monDaChon) {
      return null
    }

    return {
      ...monDaChon,
      price: giaChiTiet,
      quantity: 1,
      kichCoDaChon,
      toppingDaChon,
      ghiChuRieng,
    }
  }, [monDaChon, giaChiTiet, kichCoDaChon, toppingDaChon, ghiChuRieng])

  const xuLyThemMonDaTuyChon = useCallback(() => {
    if (typeof themVaoGio !== 'function') {
      return
    }

    const monDaTuyChon = taoMonDaTuyChon()
    if (!monDaTuyChon) {
      return
    }

    themVaoGio(monDaTuyChon)
    dongChiTietMon()
  }, [themVaoGio, taoMonDaTuyChon])

  const xuLyThemVaoGio = useCallback((mon) => {
    if (typeof themVaoGio !== 'function' || !mon) {
      return
    }

    themVaoGio({
      ...mon,
      quantity: 1,
      kichCoDaChon: kichCoMacDinh,
      toppingDaChon: [],
      ghiChuRieng: '',
    })
  }, [themVaoGio, kichCoMacDinh])

  return {
    giaChiTiet,
    xuLyBatTatTopping,
    coTheChonKichCo,
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
    xuLyThemMonDaTuyChon,
    xuLyThemVaoGio,
  }
}
