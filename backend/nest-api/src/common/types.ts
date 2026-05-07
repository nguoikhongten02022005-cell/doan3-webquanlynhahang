/**
 * Generic record used for gradual migration from BanGhi.
 * Prefer specific interfaces below when possible.
 */
export type BanGhi = Record<string, any>;

// ── Auth ──
export interface NguoiDungRecord {
  MaND: string;
  TenND: string;
  Email: string;
  MatKhau: string;
  VaiTro: string;
  TrangThai: string;
  NgayTao: string;
  NgayCapNhat: string;
}

export interface JwtPayload {
  maND: string;
  email: string;
  vaiTro: string;
}

// ── Ban ──
export interface BanRecord {
  MaBan: string;
  TenBan: string;
  KhuVuc: string;
  SoBan: number;
  SoChoNgoi: number;
  ViTri: string;
  GhiChu: string;
  TrangThai: string;
  NgayTao: string;
  NgayCapNhat: string;
}

// ── DonHang ──
export interface DonHangRecord {
  MaDonHang: string;
  MaKH: string | null;
  MaBan: string | null;
  MaNV: string | null;
  MaDatBan: string | null;
  LoaiDon: string;
  DiaChiGiao: string | null;
  GioLayHang: string | null;
  GioGiao: string | null;
  PhiShip: number;
  TongTien: number;
  TrangThai: string;
  NguonTao: string;
  GhiChu: string | null;
  NgayTao: string;
  NgayCapNhat: string;
}

export interface ChiTietDonHangRecord {
  MaChiTiet: string;
  MaDonHang: string;
  MaMon: string;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
  GhiChu: string | null;
  TrangThai: string;
  NgayTao: string;
}

// ── DatBan ──
export interface DatBanRecord {
  MaDatBan: string;
  MaKH: string | null;
  MaBan: string | null;
  MaNV: string | null;
  TenKhachDatBan: string;
  SDTDatBan: string;
  EmailDatBan: string;
  NgayDat: string;
  GioDat: string;
  GioKetThuc: string | null;
  SoNguoi: number;
  GhiChu: string | null;
  KhuVucUuTien: string | null;
  GhiChuNoiBo: string | null;
  ChiTietMonAn: string | null;
  TrangThai: string;
  NgayTao: string;
  NgayCapNhat: string;
}

// ── KhachHang ──
export interface KhachHangRecord {
  MaKH: string;
  MaND: string | null;
  TenKH: string;
  SDT: string | null;
  DiaChi: string | null;
  DiemTichLuy: number;
  NgayTao: string;
}

// ── ThucDon ──
export interface ThucDonRecord {
  MaMon: string;
  MaDanhMuc: string | null;
  TenMon: string;
  MoTa: string | null;
  Gia: number;
  HinhAnh: string | null;
  ThoiGianChuanBi: number;
  TrangThai: string;
}

// ── MaGiamGia ──
export interface MaGiamGiaRecord {
  MaCode: string;
  TenCode: string;
  GiaTri: number;
  LoaiGiam: string;
  GiaTriToiDa: number | null;
  DonHangToiThieu: number;
  NgayBatDau: string;
  NgayKetThuc: string;
  SoLanToiDa: number | null;
  SoLanDaDung: number;
  TrangThai: string;
}