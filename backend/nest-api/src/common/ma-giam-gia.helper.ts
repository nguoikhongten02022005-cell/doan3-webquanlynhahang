import type { BanGhi } from './types';

export const MA_TRANG_THAI_VOUCHER = Object.freeze({
  UPCOMING: 'UPCOMING',
  EXPIRED: 'EXPIRED',
  USED_UP: 'USED_UP',
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
} as const);

export const NHAN_TRANG_THAI_VOUCHER = Object.freeze({
  UPCOMING: 'Chưa hiệu lực',
  EXPIRED: 'Hết hạn',
  USED_UP: 'Hết lượt',
  INACTIVE: 'Tạm tắt',
  ACTIVE: 'Hoạt động',
} as const);

const MOC_GIO_VIET_NAM = '+07:00';

const chuyenNgaySangDate = (giaTri: unknown, cuoiNgay = false) => {
  if (giaTri instanceof Date) {
    return new Date(giaTri.getTime());
  }

  const chuoi = String(giaTri || '').trim();
  if (!chuoi) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(chuoi)) {
    const thoiDiem = cuoiNgay ? '23:59:59.999' : '00:00:00.000';
    const ngay = new Date(`${chuoi}T${thoiDiem}${MOC_GIO_VIET_NAM}`);
    return Number.isNaN(ngay.getTime()) ? null : ngay;
  }

  const ngay = new Date(chuoi);
  return Number.isNaN(ngay.getTime()) ? null : ngay;
};

const chuanHoaTrangThaiLuuTru = (giaTri: unknown) =>
  String(giaTri || '').trim().toUpperCase();

const chuanHoaMaThanhChuoi = (giaTri: unknown) =>
  String(giaTri || '')
    .trim()
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();

export const chuanHoaMaYeuCau = (maKH: unknown, maYeuCau: unknown) => {
  const phanKhach = chuanHoaMaThanhChuoi(maKH);
  const phanYeuCau = chuanHoaMaThanhChuoi(maYeuCau);
  return [phanKhach, phanYeuCau].filter(Boolean).join('_').slice(0, 32);
};

export const taoMaVoucherDoiDiemTheoYeuCau = (
  maKH: unknown,
  maYeuCau: unknown,
) => {
  const phanMa = chuanHoaMaYeuCau(maKH, maYeuCau);
  return `LOYALTY-${phanMa}`.slice(0, 50);
};

export const taoMaGiaoDichDiemTheoYeuCau = (
  maKH: unknown,
  maYeuCau: unknown,
) => {
  const phanMa = chuanHoaMaYeuCau(maKH, maYeuCau);
  return `GDDL-${phanMa}`.slice(0, 50);
};

export const xacDinhTrangThaiMaGiamGia = (
  ma: BanGhi,
  thoiDiem = new Date(),
) => {
  const now = thoiDiem instanceof Date ? thoiDiem : new Date(thoiDiem);
  const ngayBatDau = chuyenNgaySangDate(ma?.NgayBatDau ?? ma?.ngayBatDau);
  const ngayKetThuc = chuyenNgaySangDate(
    ma?.NgayKetThuc ?? ma?.ngayKetThuc,
    true,
  );
  const soLanToiDa =
    ma?.SoLanToiDa == null ? null : Number(ma?.SoLanToiDa || 0);
  const soLanDaDung = Number(ma?.SoLanDaDung || 0);
  const trangThaiLuuTru = chuanHoaTrangThaiLuuTru(
    ma?.TrangThai ?? ma?.trangThai ?? 'Active',
  );

  if (ngayBatDau && now < ngayBatDau) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.UPCOMING,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.UPCOMING,
      coTheApDung: false,
      lyDo: 'Mã giảm giá chưa đến thời gian áp dụng.',
    };
  }

  if (ngayKetThuc && now > ngayKetThuc) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.EXPIRED,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
      coTheApDung: false,
      lyDo: 'Mã giảm giá đã hết hạn.',
    };
  }

  if (soLanToiDa != null && soLanDaDung >= soLanToiDa) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.USED_UP,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.USED_UP,
      coTheApDung: false,
      lyDo: 'Mã giảm giá đã đạt giới hạn sử dụng.',
    };
  }

  if (trangThaiLuuTru === 'HETHAN') {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.EXPIRED,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
      coTheApDung: false,
      lyDo: 'Mã giảm giá đã hết hạn.',
    };
  }

  if (trangThaiLuuTru !== 'ACTIVE') {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.INACTIVE,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.INACTIVE,
      coTheApDung: false,
      lyDo: 'Mã giảm giá không còn hiệu lực.',
    };
  }

  return {
    maTrangThai: MA_TRANG_THAI_VOUCHER.ACTIVE,
    nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.ACTIVE,
    coTheApDung: true,
    lyDo: '',
  };
};
