import { chuanHoaDanhSachMucGioHang } from '../gioHang/cartModel'
import { LOAI_DON_HANG, TAO_PRICING_SUMMARY_MAC_DINH } from './contracts'

const sinhMaTam = (tienTo) => `${tienTo}_${Date.now()}`

const chuanHoaDanhSachMonTaoDon = (payload = {}) => {
  if (Array.isArray(payload.items)) {
    return payload.items.map((item, index) => ({
      maChiTiet: item.maChiTiet || item.id || sinhMaTam(`CT${index + 1}`),
      maMon: item.maMon || item.menuItemId,
      soLuong: Number(item.soLuong || item.quantity || 0),
      donGia: item.donGia ?? item.price ?? null,
      ghiChu: item.ghiChu || item.note || '',
    }))
  }

  if (Array.isArray(payload.danhSachMon)) {
    return payload.danhSachMon.map((item, index) => ({
      maChiTiet: item.maChiTiet || item.id || sinhMaTam(`CT${index + 1}`),
      maMon: item.maMon || item.menuItemId || item.id,
      soLuong: Number(item.soLuong || item.quantity || 0),
      donGia: item.donGia ?? item.price ?? null,
      ghiChu: item.ghiChu || item.note || '',
    }))
  }

  if (Array.isArray(payload.cartItems)) {
    return chuanHoaDanhSachMucGioHang(payload.cartItems).map((item, index) => ({
      maChiTiet: sinhMaTam(`CT${index + 1}`),
      maMon: item.maMon,
      soLuong: item.soLuong,
      donGia: item.donGia,
      ghiChu: item.ghiChu,
    }))
  }

  return []
}

export const buildPayloadTaoDon = (payload = {}) => {
  const loaiDon = payload.loaiDon || payload.orderType || payload.loaiNhanHang || LOAI_DON_HANG.TAI_QUAN
  const pricingSummary = payload.pricingSummary || TAO_PRICING_SUMMARY_MAC_DINH()
  const voucher = payload.voucher || {}

  return {
    maDonHang: payload.maDonHang || payload.orderCode || sinhMaTam('DH'),
    maKH: payload.maKH || payload.customerCode || payload.customer?.customerCode || null,
    maBan: payload.maBan || payload.tableCode || payload.tableNumber || null,
    maNV: payload.maNV || payload.staffCode || null,
    maDatBan: payload.maDatBan || payload.bookingCode || null,
    loaiDon,
    nguonTao: payload.nguonTao || payload.source || 'Online',
    ghiChu: payload.ghiChu || payload.note || '',
    maGiamGia: payload.maGiamGia || payload.voucherCode || voucher.maGiamGia || voucher.code || null,
    phiShip: Number(payload.phiShip || pricingSummary.phiShip || 0),
    diaChiGiao: payload.diaChiGiao || payload.customer?.address || '',
    gioLayHang: payload.gioLayHang || payload.thongTinNhanHang?.gioLayHang || '',
    gioGiao: payload.gioGiao || payload.thongTinNhanHang?.gioGiao || '',
    thongTinNhanHang: {
      loaiDon,
      diaChiGiao: payload.diaChiGiao || payload.customer?.address || '',
      gioLayHang: payload.gioLayHang || payload.thongTinNhanHang?.gioLayHang || '',
      gioGiao: payload.gioGiao || payload.thongTinNhanHang?.gioGiao || '',
    },
    pricingSummary,
    chiTiet: chuanHoaDanhSachMonTaoDon(payload),
  }
}
