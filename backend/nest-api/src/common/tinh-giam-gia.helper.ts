/**
 * Tinh so tien giam gia tu thong tin ma giam gia trong database.
 * Dung chung giua DonHangPricingService va MaGiamGiaService.
 */
export function tinhGiamGia(tongTien: number, maGiamGia: { LoaiGiam?: unknown; GiaTri?: unknown; GiaTriToiDa?: unknown }) {
  const laPhanTram = String(maGiamGia.LoaiGiam || '').toLowerCase() === 'phantram';
  const giaTriGiam = Number(maGiamGia.GiaTri || 0);
  const giamToiDa = maGiamGia.GiaTriToiDa == null ? null : Number(maGiamGia.GiaTriToiDa);
  const soTienGiamTamTinh = laPhanTram ? Math.round((tongTien * giaTriGiam) / 100) : giaTriGiam;
  const soTienGiamThucTe = giamToiDa == null ? soTienGiamTamTinh : Math.min(soTienGiamTamTinh, giamToiDa);

  return { laPhanTram, giaTriGiam, giamToiDa, soTienGiamTamTinh, soTienGiamThucTe };
}