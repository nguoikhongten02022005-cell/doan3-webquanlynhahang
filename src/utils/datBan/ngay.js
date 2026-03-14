import { NHAN_THU_TRONG_TUAN } from '../../data/duLieuDatBan'
import { SO_NGAY_MO_LICH, CAC_NGAY_DONG_CUA, CAC_THU_DONG_CUA } from './hangSo'

export const layChuoiNgayDiaPhuong = (ngay = new Date()) => {
  const nam = ngay.getFullYear()
  const thang = String(ngay.getMonth() + 1).padStart(2, '0')
  const ngayTrongThang = String(ngay.getDate()).padStart(2, '0')
  return `${nam}-${thang}-${ngayTrongThang}`
}

export const laNgayDongCua = (dateValue) => {
  if (!dateValue) return false
  if (CAC_NGAY_DONG_CUA.includes(dateValue)) return true

  const [nam, thang, ngayTrongThang] = dateValue.split('-').map(Number)
  if (!nam || !thang || !ngayTrongThang) return false

  const ngay = new Date(nam, thang - 1, ngayTrongThang)
  return CAC_THU_DONG_CUA.includes(ngay.getDay())
}

export const layNhanNgayDongCua = (dateValue) => {
  if (!dateValue) return ''

  const [nam, thang, ngayTrongThang] = dateValue.split('-').map(Number)
  if (!nam || !thang || !ngayTrongThang) return dateValue

  const ngay = new Date(nam, thang - 1, ngayTrongThang)
  return `${NHAN_THU_TRONG_TUAN[ngay.getDay()]}, ${String(ngayTrongThang).padStart(2, '0')}/${String(thang).padStart(2, '0')}/${nam}`
}

const congThemNgay = (ngay, soNgay) => {
  const ngayKeTiep = new Date(ngay)
  ngayKeTiep.setDate(ngayKeTiep.getDate() + soNgay)
  return ngayKeTiep
}

export const layNgayMoCuaTiepTheo = (ngayBatDau = new Date()) => {
  const ngayUngVien = new Date(ngayBatDau)

  for (let doLech = 0; doLech <= 30; doLech += 1) {
    const ngayKeTiep = congThemNgay(ngayUngVien, doLech)
    const chuoiNgayKeTiep = layChuoiNgayDiaPhuong(ngayKeTiep)
    if (!laNgayDongCua(chuoiNgayKeTiep)) return chuoiNgayKeTiep
  }

  return layChuoiNgayDiaPhuong(ngayUngVien)
}

export const taoDanhSachLuaChonNgayMoCua = (ngayBatDau = new Date(), soLuong = SO_NGAY_MO_LICH) => {
  const danhSachLuaChon = []
  let doLech = 0

  while (danhSachLuaChon.length < soLuong && doLech <= 45) {
    const ngayKeTiep = congThemNgay(ngayBatDau, doLech)
    const chuoiNgayKeTiep = layChuoiNgayDiaPhuong(ngayKeTiep)

    if (!laNgayDongCua(chuoiNgayKeTiep)) {
      danhSachLuaChon.push(chuoiNgayKeTiep)
    }

    doLech += 1
  }

  return danhSachLuaChon
}

export const dinhDangNgayHienThi = (chuoiNgay) => {
  if (!chuoiNgay) return ''
  const [nam, thang, ngayTrongThang] = chuoiNgay.split('-')
  const ngay = new Date(Number(nam), Number(thang) - 1, Number(ngayTrongThang))
  return `${NHAN_THU_TRONG_TUAN[ngay.getDay()]}, ${ngayTrongThang}/${thang}/${nam}`
}
