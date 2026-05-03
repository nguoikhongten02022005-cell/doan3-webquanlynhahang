DROP DATABASE IF EXISTS QuanNhaHang;

CREATE DATABASE IF NOT EXISTS QuanNhaHang
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE QuanNhaHang;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS NguoiDung (
    MaND        VARCHAR(50) PRIMARY KEY,
    TenND       VARCHAR(100) NOT NULL,
    Email       VARCHAR(100) NOT NULL UNIQUE,
    MatKhau     VARCHAR(255) NOT NULL,
    VaiTro      ENUM('Admin','NhanVien','KhachHang') NOT NULL DEFAULT 'KhachHang',
    TrangThai   ENUM('Active','Inactive','Banned') NOT NULL DEFAULT 'Active',
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS NhanVien (
    MaNV        VARCHAR(50) PRIMARY KEY,
    MaND        VARCHAR(50) NOT NULL UNIQUE,
    HoTen       VARCHAR(100) NOT NULL,
    GioiTinh    ENUM('Nam','Nu','Khac'),
    SDT         VARCHAR(20),
    DiaChi      VARCHAR(255),
    ChucVu      VARCHAR(50) NOT NULL,
    LuongCoBan  DECIMAL(15,2) DEFAULT 0,
    NgayVaoLam  DATE,
    TinhTrang   ENUM('Active','Inactive','NghiViec') NOT NULL DEFAULT 'Active',
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_NhanVien_NguoiDung
        FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS KhachHang (
    MaKH        VARCHAR(50) PRIMARY KEY,
    MaND        VARCHAR(50) UNIQUE,
    TenKH       VARCHAR(100) NOT NULL,
    SDT         VARCHAR(20) UNIQUE,
    DiaChi      VARCHAR(255),
    DiemTichLuy INT NOT NULL DEFAULT 0,
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_KhachHang_NguoiDung
        FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS Ban (
    MaBan       VARCHAR(50) PRIMARY KEY,
    TenBan      VARCHAR(50),
    KhuVuc      VARCHAR(50),
    SoBan       INT NOT NULL,
    SoChoNgoi   INT NOT NULL,
    ViTri       VARCHAR(100),
    GhiChu      VARCHAR(255),
    TrangThai   ENUM('Available','Occupied','Reserved','Maintenance') NOT NULL DEFAULT 'Available',
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS QRCode (
    MaQR        VARCHAR(50) PRIMARY KEY,
    MaBan       VARCHAR(50) NOT NULL UNIQUE,
    DuongDanQR  VARCHAR(500) NOT NULL,
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayHetHan  DATETIME,
    TrangThai   ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    CONSTRAINT FK_QRCode_Ban
        FOREIGN KEY (MaBan) REFERENCES Ban(MaBan) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS DanhMuc (
    MaDanhMuc   VARCHAR(50) PRIMARY KEY,
    TenDanhMuc  VARCHAR(100) NOT NULL,
    MoTa        VARCHAR(255),
    ThuTu       INT NOT NULL DEFAULT 0,
    TrangThai   ENUM('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS ThucDon (
    MaMon           VARCHAR(50) PRIMARY KEY,
    MaDanhMuc       VARCHAR(50),
    TenMon          VARCHAR(150) NOT NULL,
    MoTa            VARCHAR(500),
    Gia             DECIMAL(15,2) NOT NULL,
    HinhAnh         VARCHAR(500),
    ThoiGianChuanBi INT DEFAULT 0,
    TrangThai       ENUM('Available','Unavailable','Deleted') NOT NULL DEFAULT 'Available',
    NgayTao         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_ThucDon_DanhMuc
        FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. MA GIAM GIA
-- ============================================================
CREATE TABLE IF NOT EXISTS MaGiamGia (
    MaCode          VARCHAR(50) PRIMARY KEY,
    TenCode         VARCHAR(100) NOT NULL,
    GiaTri          DECIMAL(10,2) NOT NULL,
    LoaiGiam        ENUM('PhanTram','SoTien') NOT NULL,
    GiaTriToiDa     DECIMAL(15,2),
    DonHangToiThieu DECIMAL(15,2) DEFAULT 0,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    SoLanToiDa      INT DEFAULT NULL,
    SoLanDaDung     INT NOT NULL DEFAULT 0,
    TrangThai       ENUM('Active','Inactive','HetHan') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. DAT BAN
-- ============================================================
CREATE TABLE IF NOT EXISTS DatBan (
    MaDatBan       VARCHAR(50) PRIMARY KEY,
    MaKH           VARCHAR(50),
    MaBan          VARCHAR(50),
    MaNV           VARCHAR(50),
    TenKhachDatBan VARCHAR(100),
    SDTDatBan      VARCHAR(20),
    EmailDatBan    VARCHAR(100),
    NgayDat        DATE NOT NULL,
    GioDat         TIME NOT NULL,
    GioKetThuc     TIME,
    SoNguoi        INT NOT NULL,
    GhiChu         VARCHAR(500),
    KhuVucUuTien   VARCHAR(50),
    GhiChuNoiBo    VARCHAR(500),
    TrangThai      ENUM('Pending','Confirmed','Cancelled','NoShow','Completed','YEU_CAU_DAT_BAN','GIU_CHO_TAM','DA_XAC_NHAN','CAN_GOI_LAI','TU_CHOI_HET_CHO','CHO_XAC_NHAN','DA_GHI_NHAN','DA_CHECK_IN','DA_XEP_BAN','DA_HOAN_THANH','DA_HUY','KHONG_DEN') NOT NULL DEFAULT 'Pending',
    NgayTao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_DatBan_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL,
    CONSTRAINT FK_DatBan_Ban
        FOREIGN KEY (MaBan) REFERENCES Ban(MaBan) ON DELETE SET NULL,
    CONSTRAINT FK_DatBan_NhanVien
        FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. DON HANG
-- ============================================================
CREATE TABLE IF NOT EXISTS DonHang (
    MaDonHang   VARCHAR(50) PRIMARY KEY,
    MaKH        VARCHAR(50),
    MaBan       VARCHAR(50),
    MaBanAn     VARCHAR(20),
    MaNV        VARCHAR(50),
    MaDatBan    VARCHAR(50),
    LoaiDon     ENUM('TAI_QUAN','TAI_BAN') NOT NULL DEFAULT 'TAI_QUAN',
    DiaChiGiao  VARCHAR(255),
    GioLayHang  TIME,
    GioGiao     TIME,
    PhiShip     DECIMAL(10,2) NOT NULL DEFAULT 0,
    TongTien    DECIMAL(15,2) NOT NULL DEFAULT 0,
    TrangThai   ENUM('Pending','Confirmed','Preparing','Ready','Served','Paid','Cancelled') NOT NULL DEFAULT 'Pending',
    NguonTao    ENUM('TaiQuay','QRCode','DatBan','Online') NOT NULL DEFAULT 'TaiQuay',
    GhiChu      VARCHAR(500),
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_DonHang_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL,
    CONSTRAINT FK_DonHang_Ban
        FOREIGN KEY (MaBan) REFERENCES Ban(MaBan) ON DELETE SET NULL,
    CONSTRAINT FK_DonHang_NhanVien
        FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV) ON DELETE SET NULL,
    CONSTRAINT FK_DonHang_DatBan
        FOREIGN KEY (MaDatBan) REFERENCES DatBan(MaDatBan) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. CHI TIET DON HANG
-- ============================================================
CREATE TABLE IF NOT EXISTS ChiTietDonHang (
    MaChiTiet   VARCHAR(50) PRIMARY KEY,
    MaDonHang   VARCHAR(50) NOT NULL,
    MaMon       VARCHAR(50) NOT NULL,
    SoLuong     INT NOT NULL,
    DonGia      DECIMAL(15,2) NOT NULL,
    ThanhTien   DECIMAL(15,2) NOT NULL,
    GhiChu      VARCHAR(255),
    TrangThai   ENUM('Pending','Preparing','Done','Cancelled') NOT NULL DEFAULT 'Pending',
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ChiTietDonHang_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietDonHang_ThucDon
        FOREIGN KEY (MaMon) REFERENCES ThucDon(MaMon) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. HOA DON
-- ============================================================
CREATE TABLE IF NOT EXISTS HoaDon (
    MaHoaDon    VARCHAR(50) PRIMARY KEY,
    MaDonHang   VARCHAR(50) NOT NULL UNIQUE,
    MaKH        VARCHAR(50),
    MaCode      VARCHAR(50),
    TongTien    DECIMAL(15,2) NOT NULL,
    GiamGia     DECIMAL(15,2) NOT NULL DEFAULT 0,
    ThueSuat    DECIMAL(5,2) NOT NULL DEFAULT 0,
    TienThue    DECIMAL(15,2) NOT NULL DEFAULT 0,
    ThanhTien   DECIMAL(15,2) NOT NULL,
    GhiChu      VARCHAR(255),
    NgayXuat    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_HoaDon_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT FK_HoaDon_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL,
    CONSTRAINT FK_HoaDon_MaGiamGia
        FOREIGN KEY (MaCode) REFERENCES MaGiamGia(MaCode) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. THANH TOAN
-- ============================================================
CREATE TABLE IF NOT EXISTS ThanhToan (
    MaThanhToan VARCHAR(50) PRIMARY KEY,
    MaHoaDon    VARCHAR(50) NOT NULL,
    PhuongThuc  ENUM('TienMat','ChuyenKhoan','TheNganHang','MoMo','ZaloPay','VNPay') NOT NULL,
    SoTien      DECIMAL(15,2) NOT NULL,
    MaGiaoDich  VARCHAR(100),
    TrangThai   ENUM('Pending','Success','Failed','Refunded') NOT NULL DEFAULT 'Pending',
    ThoiGian    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ThanhToan_HoaDon
        FOREIGN KEY (MaHoaDon) REFERENCES HoaDon(MaHoaDon) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. DANH GIA
-- ============================================================
CREATE TABLE IF NOT EXISTS DanhGia (
    MaDanhGia    VARCHAR(50) PRIMARY KEY,
    MaKH         VARCHAR(50) NOT NULL,
    MaDonHang    VARCHAR(50) NOT NULL,
    SoSao        TINYINT NOT NULL,
    NoiDung      VARCHAR(500),
    PhanHoi      VARCHAR(500),
    HinhAnh      LONGTEXT,
    SoLuotHuuIch INT NOT NULL DEFAULT 0,
    NgayDanhGia  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    TrangThai    ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
    CONSTRAINT FK_DanhGia_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE CASCADE,
    CONSTRAINT FK_DanhGia_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT UQ_DanhGia_MaKH_MaDonHang UNIQUE (MaKH, MaDonHang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. LICH SU DON HANG
-- ============================================================
CREATE TABLE IF NOT EXISTS LichSuDonHang (
    MaLichSu      VARCHAR(50) PRIMARY KEY,
    MaDonHang     VARCHAR(50) NOT NULL,
    TrangThaiCu   VARCHAR(50),
    TrangThaiMoi  VARCHAR(50) NOT NULL,
    GhiChu        VARCHAR(255),
    NguoiThucHien VARCHAR(50),
    ThoiGian      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_LichSuDonHang_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. LICH SU DIEM TICH LUY
-- ============================================================
CREATE TABLE IF NOT EXISTS LichSuDiemTichLuy (
    MaGiaoDichDiem VARCHAR(50) PRIMARY KEY,
    MaKH           VARCHAR(50) NOT NULL,
    MaDonHang      VARCHAR(50),
    LoaiBienDong   ENUM('CONG','TRU','DIEU_CHINH') NOT NULL DEFAULT 'CONG',
    SoDiem         INT NOT NULL,
    SoDiemTruoc    INT NOT NULL DEFAULT 0,
    SoDiemSau      INT NOT NULL DEFAULT 0,
    MoTa           VARCHAR(255),
    NgayTao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_LichSuDiemTichLuy_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE CASCADE,
    CONSTRAINT FK_LichSuDiemTichLuy_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. THONG BAO
-- ============================================================
CREATE TABLE IF NOT EXISTS ThongBao (
    MaThongBao   VARCHAR(50) PRIMARY KEY,
    MaND         VARCHAR(50) NOT NULL,
    TieuDe       VARCHAR(200) NOT NULL,
    NoiDung      VARCHAR(500),
    LoaiThongBao ENUM('DonHang','DatBan','DanhGia','HeThong') NOT NULL,
    MaThamChieu  VARCHAR(50),
    DaDoc        BOOLEAN NOT NULL DEFAULT FALSE,
    NgayTao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ThongBao_NguoiDung
        FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IDX_Ban_TrangThai ON Ban(TrangThai);
CREATE INDEX IDX_DatBan_NgayDat ON DatBan(NgayDat);
CREATE INDEX IDX_DatBan_TrangThai ON DatBan(TrangThai);
CREATE INDEX IDX_DatBan_MaKH ON DatBan(MaKH);
CREATE INDEX IDX_ThucDon_DanhMuc ON ThucDon(MaDanhMuc);
CREATE INDEX IDX_ThucDon_TrangThai ON ThucDon(TrangThai);
CREATE INDEX IDX_DonHang_NgayTao ON DonHang(NgayTao);
CREATE INDEX IDX_DonHang_TrangThai ON DonHang(TrangThai);
CREATE INDEX IDX_DonHang_MaBan ON DonHang(MaBan);
CREATE INDEX IDX_DonHang_MaBanAn ON DonHang(MaBanAn);
CREATE INDEX IDX_DonHang_MaKH ON DonHang(MaKH);
CREATE INDEX IDX_ChiTiet_DonHang ON ChiTietDonHang(MaDonHang);
CREATE INDEX IDX_ChiTiet_TrangThai ON ChiTietDonHang(TrangThai);
CREATE INDEX IDX_ThanhToan_HoaDon ON ThanhToan(MaHoaDon);
CREATE INDEX IDX_ThanhToan_TrangThai ON ThanhToan(TrangThai);
CREATE INDEX IDX_DanhGia_TrangThai ON DanhGia(TrangThai);
CREATE INDEX IDX_LichSu_DonHang ON LichSuDonHang(MaDonHang);
CREATE INDEX IDX_LichSuDiemTichLuy_MaKH ON LichSuDiemTichLuy(MaKH);
CREATE INDEX IDX_LichSuDiemTichLuy_NgayTao ON LichSuDiemTichLuy(NgayTao);
CREATE INDEX IDX_ThongBao_MaND ON ThongBao(MaND);
CREATE INDEX IDX_ThongBao_DaDoc ON ThongBao(DaDoc);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VIEWS
-- ============================================================
CREATE OR REPLACE VIEW V_DoanhThuNgay AS
SELECT
    DATE(hd.NgayXuat) AS Ngay,
    COUNT(hd.MaHoaDon) AS SoHoaDon,
    SUM(hd.TongTien) AS TongTruocGiam,
    SUM(hd.GiamGia) AS TongGiam,
    SUM(hd.ThanhTien) AS DoanhThu
FROM HoaDon hd
JOIN ThanhToan tt
    ON tt.MaHoaDon = hd.MaHoaDon
   AND tt.TrangThai = 'Success'
GROUP BY DATE(hd.NgayXuat);

CREATE OR REPLACE VIEW V_MonBanChay AS
SELECT
    td.MaMon,
    td.TenMon,
    dm.TenDanhMuc,
    SUM(ct.SoLuong) AS TongSoLuong,
    SUM(ct.ThanhTien) AS TongDoanhThu
FROM ChiTietDonHang ct
JOIN ThucDon td
    ON td.MaMon = ct.MaMon
JOIN DanhMuc dm
    ON dm.MaDanhMuc = td.MaDanhMuc
JOIN DonHang dh
    ON dh.MaDonHang = ct.MaDonHang
   AND dh.TrangThai <> 'Cancelled'
GROUP BY td.MaMon, td.TenMon, dm.TenDanhMuc
ORDER BY TongSoLuong DESC;

CREATE OR REPLACE VIEW V_TinhTrangBan AS
SELECT
    b.MaBan,
    b.TenBan,
    b.KhuVuc,
    b.SoBan,
    b.SoChoNgoi,
    b.ViTri,
    b.GhiChu,
    b.TrangThai,
    dh.MaDonHang,
    dh.TrangThai AS TrangThaiDon
FROM Ban b
LEFT JOIN DonHang dh
    ON dh.MaDonHang = (
        SELECT dh2.MaDonHang
        FROM DonHang dh2
        WHERE dh2.MaBan = b.MaBan
          AND dh2.TrangThai NOT IN ('Paid', 'Cancelled')
        ORDER BY dh2.NgayTao DESC
        LIMIT 1
    );

-- ============================================================
-- DU LIEU MAU
-- Password mac dinh da doi chieu voi DB dang chay:
-- admin@nhahang.com / Admin@123
-- an.nv@nhahang.com / Staff@123
-- bich.lt@nhahang.com / Staff@123
-- khach1@gmail.com / 123
-- mai.pt@gmail.com / 123
-- khachtest01@gmail.com / chua xac minh tu DB dang chay (giu nguyen hash hien tai)
-- ============================================================
INSERT INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro, TrangThai) VALUES
('ND001', 'Admin System', 'admin@nhahang.com', '$2b$10$QQjUYOP2RIOusra.a.Sig.dnEWuKOnYCqQoMEqhJPX/T/XJ.dMEiW', 'Admin', 'Active'),
('ND002', 'Nguyen Van An', 'an.nv@nhahang.com', '$2b$10$wd0YWq1YXw0jlVA0qlrA.udcmvJRVp7MSUO0RH57wU4iA9Tf/JeS6', 'NhanVien', 'Active'),
('ND003', 'Le Thi Bich', 'bich.lt@nhahang.com', '$2b$10$cU0ttRiu8gphooM1j9SuVuJ8l7M0GLj8G/ZzReu9xFxDyY/5YFi4W', 'NhanVien', 'Active'),
('ND004', 'Tran Van Khach', 'khach1@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND005', 'Pham Thi Mai', 'mai.pt@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND_KH_TEST_01', 'Nguyen Van Test', 'khachtest01@gmail.com', '$2a$11$dtmZV4AJS/fB16ymIqO4AuCZuj21tj08dUYpY3uons9iJor0n1omW', 'KhachHang', 'Active');

INSERT INTO NhanVien (MaNV, MaND, HoTen, GioiTinh, SDT, ChucVu, NgayVaoLam) VALUES
('NV001', 'ND001', 'Admin System', 'Nam', '0901111111', 'Admin', '2024-01-01'),
('NV002', 'ND002', 'Nguyen Van An', 'Nam', '0901234567', 'QuanLy', '2024-06-01'),
('NV003', 'ND003', 'Le Thi Bich', 'Nu', '0907654321', 'ThuNgan', '2025-01-15');

INSERT INTO KhachHang (MaKH, MaND, TenKH, SDT, DiaChi, DiemTichLuy) VALUES
('KH001', 'ND004', 'Tran Van Khach', '0912345678', NULL, 150),
('KH002', 'ND005', 'Pham Thi Mai', '0987654321', NULL, 80),
('KH003', NULL, 'Khach Vang Lai', NULL, NULL, 0),
('KH_TEST_01', 'ND_KH_TEST_01', 'Nguyen Van Test', '0901239999', '123 Nguyen Hue, Q1, TP.HCM', 0);

INSERT INTO DanhMuc (MaDanhMuc, TenDanhMuc, ThuTu) VALUES
('DM001', 'Khai Vi', 1),
('DM002', 'Mon Chinh', 2),
('DM003', 'Trang Mieng', 3),
('DM004', 'Do Uong', 4),
('DM005', 'Combo', 5);

INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai, NgayTao, NgayCapNhat) VALUES
('M001', 'DM001', 'Goi Cuon Tom Thit', 'Goi cuon tuoi, thanh nhe, an cung nuoc cham dac biet.', 35000, NULL, 10, 'Available', NOW(), NOW()),
('M002', 'DM001', 'Cha Gio Hai San', 'Cha gio hai san gion rum, nhan day va dam vi.', 45000, NULL, 15, 'Available', NOW(), NOW()),
('M003', 'DM002', 'Com Rang Duong Chau', 'Com rang duong chau day dan va de an.', 55000, NULL, 20, 'Available', NOW(), NOW()),
('M004', 'DM002', 'Pho Bo Dac Biet', 'Pho bo dam da, nuoc dung ngot thanh tu nhien.', 75000, NULL, 25, 'Available', NOW(), NOW()),
('M005', 'DM002', 'Bun Bo Hue', 'Bun bo hue cay nhe, huong vi dac trung.', 65000, NULL, 25, 'Available', NOW(), NOW()),
('M006', 'DM003', 'Kem Dau Tay', 'Kem mat lanh, vi dau tay thanh mat.', 30000, NULL, 5, 'Available', NOW(), NOW()),
('M007', 'DM003', 'Banh Flan Caramel', 'Banh flan caramel mem min, ngot nhe.', 25000, NULL, 5, 'Available', NOW(), NOW()),
('M008', 'DM004', 'Ca Phe Sua Da', 'Ca phe sua da dam vi, dung chat Viet Nam.', 25000, NULL, 5, 'Available', NOW(), NOW()),
('M009', 'DM004', 'Tra Dao Cam Sa', 'Tra dao cam sa thanh mat, de uong.', 35000, NULL, 5, 'Available', NOW(), NOW()),
('M010', 'DM004', 'Nuoc Ep Cam', 'Nuoc ep cam tuoi, bo sung nang luong.', 30000, NULL, 5, 'Available', NOW(), NOW()),
('M011', 'DM005', 'Combo Gia Dinh', 'Combo danh cho 4 nguoi gom mon chinh, khai vi va do uong.', 299000, NULL, 20, 'Available', NOW(), NOW()),
('M012', 'DM005', 'Combo Couple', 'Combo gon nhe cho 2 nguoi voi mon chinh va do uong.', 199000, NULL, 15, 'Available', NOW(), NOW()),
('M013', 'DM005', 'Combo Solo', 'Combo ca nhan tiet kiem, phuc vu nhanh.', 129000, NULL, 10, 'Available', NOW(), NOW());

INSERT INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai, NgayTao, NgayCapNhat) VALUES
('B001', 'Ban 1', 'Trong nha', 1, 2, 'Tang 1 - Cua so', NULL, 'Available', NOW(), NOW()),
('B002', 'Ban 2', 'Trong nha', 2, 4, 'Tang 1 - Khu A', NULL, 'Available', NOW(), NOW()),
('B003', 'Ban 3', 'Trong nha', 3, 4, 'Tang 1 - Khu B', NULL, 'Available', NOW(), NOW()),
('B004', 'Ban 4', 'Tang 2', 4, 6, 'Tang 2 - View dep', NULL, 'Available', NOW(), NOW()),
('B005', 'Ban VIP', 'Khu rieng', 5, 8, 'Tang 2 - Khu rieng', NULL, 'Available', NOW(), NOW()),
('B006', 'Ban 6', 'Ngoai troi', 6, 2, 'Ngoai troi', NULL, 'Available', NOW(), NOW()),
('B007', 'Ban 7', 'Trong nha', 7, 4, 'Tang 1 - Khu C', NULL, 'Available', NOW(), NOW()),
('B008', 'Ban 8', 'Trong nha', 8, 4, 'Tang 1 - Khu C', NULL, 'Available', NOW(), NOW()),
('B009', 'Ban 9', 'Tang 2', 9, 6, 'Tang 2 - Ban cong', NULL, 'Available', NOW(), NOW()),
('B010', 'Ban 10', 'Ngoai troi', 10, 2, 'Ngoai troi', NULL, 'Available', NOW(), NOW()),
('B011', 'Ban 11', 'Khu rieng', 11, 8, 'Tang 2 - Phong VIP', NULL, 'Available', NOW(), NOW());

INSERT INTO QRCode (MaQR, MaBan, DuongDanQR, NgayHetHan, TrangThai) VALUES
('QR001', 'B001', 'http://localhost:5173/ban/B001', '2027-12-31 23:59:59', 'Active'),
('QR002', 'B002', 'http://localhost:5173/ban/B002', '2027-12-31 23:59:59', 'Active'),
('QR003', 'B003', 'http://localhost:5173/ban/B003', '2027-12-31 23:59:59', 'Active'),
('QR004', 'B004', 'http://localhost:5173/ban/B004', '2027-12-31 23:59:59', 'Active'),
('QR005', 'B005', 'http://localhost:5173/ban/B005', '2027-12-31 23:59:59', 'Active'),
('QR006', 'B006', 'http://localhost:5173/ban/B006', '2027-12-31 23:59:59', 'Active'),
('QR007', 'B007', 'http://localhost:5173/ban/B007', '2027-12-31 23:59:59', 'Active'),
('QR008', 'B008', 'http://localhost:5173/ban/B008', '2027-12-31 23:59:59', 'Active'),
('QR009', 'B009', 'http://localhost:5173/ban/B009', '2027-12-31 23:59:59', 'Active'),
('QR010', 'B010', 'http://localhost:5173/ban/B010', '2027-12-31 23:59:59', 'Active'),
('QR011', 'B011', 'http://localhost:5173/ban/B011', '2027-12-31 23:59:59', 'Active');

INSERT INTO MaGiamGia (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu, NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai) VALUES
('WELCOME10', 'Chao mung KH moi', 10, 'PhanTram', 50000, 100000, '2026-01-01', '2026-12-31', 1, 0, 'Active'),
('SUMMER20', 'Khuyen mai He', 20, 'PhanTram', 100000, 200000, '2026-06-01', '2026-08-31', NULL, 0, 'Active'),
('GIAM50K', 'Giam thang 50k', 50000, 'SoTien', NULL, 300000, '2026-01-01', '2026-12-31', 500, 0, 'Active');

INSERT INTO DatBan (
    MaDatBan, MaKH, MaBan, MaNV, TenKhachDatBan, SDTDatBan, EmailDatBan,
    NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, KhuVucUuTien, GhiChuNoiBo,
    TrangThai, NgayTao, NgayCapNhat
) VALUES
('DB001', 'KH001', 'B004', 'NV002', 'Tran Van Khach', '0912345678', 'khach1@gmail.com', '2026-08-10', '18:00:00', '20:00:00', 4, 'Sinh nhat, can banh kem', 'PHONG_VIP', 'Can sap xep ban dep va uu tien check-in dung gio', 'Pending', NOW(), NOW());

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, GioLayHang, GioGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu, NgayTao, NgayCapNhat) VALUES
('DH001', 'KH001', 'B004', NULL, 'NV002', 'DB001', 'TAI_QUAN', NULL, NULL, NULL, 0, 215000, 'Paid', 'DatBan', NULL, NOW(), NOW());

INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai, NgayTao) VALUES
('CT001', 'DH001', 'M001', 2, 35000, 70000, NULL, 'Done', NOW()),
('CT002', 'DH001', 'M004', 1, 75000, 75000, NULL, 'Done', NOW()),
('CT003', 'DH001', 'M008', 2, 25000, 50000, NULL, 'Done', NOW()),
('CT004', 'DH001', 'M006', 1, 30000, 30000, NULL, 'Done', NOW());

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, GioLayHang, GioGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu, NgayTao, NgayCapNhat) VALUES
('DH002', 'KH002', NULL, NULL, 'NV003', NULL, 'TAI_QUAN', NULL, '18:30:00', NULL, 0, 140000, 'Ready', 'Online', 'Khach se den lay sau gio tan lam', NOW(), NOW()),
('DH003', 'KH_TEST_01', NULL, NULL, 'NV002', NULL, 'TAI_QUAN', '123 Nguyen Hue, Q1, TP.HCM', NULL, '19:15:00', 15000, 180000, 'Pending', 'Online', 'Giao tan noi, goi truoc khi giao', NOW(), NOW());

INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai, NgayTao) VALUES
('CT005', 'DH002', 'M003', 1, 55000, 55000, 'Khong hanh', 'Done', NOW()),
('CT006', 'DH002', 'M009', 1, 35000, 35000, 'It da', 'Done', NOW()),
('CT007', 'DH002', 'M007', 2, 25000, 50000, NULL, 'Done', NOW()),
('CT008', 'DH003', 'M004', 1, 75000, 75000, 'Them tieu', 'Preparing', NOW()),
('CT009', 'DH003', 'M008', 2, 25000, 50000, 'Bot duong', 'Preparing', NOW()),
('CT010', 'DH003', 'M010', 1, 30000, 30000, NULL, 'Pending', NOW());

INSERT INTO HoaDon (MaHoaDon, MaDonHang, MaKH, MaCode, TongTien, GiamGia, ThueSuat, TienThue, ThanhTien, GhiChu, NgayXuat) VALUES
('HD001', 'DH001', 'KH001', 'WELCOME10', 215000, 21500, 10, 19350, 212850, NULL, NOW()),
('HD002', 'DH002', 'KH002', NULL, 140000, 0, 10, 14000, 154000, 'Khach den lay tai quay', NOW()),
('HD003', 'DH003', 'KH_TEST_01', 'GIAM50K', 180000, 50000, 10, 13000, 143000, 'Don giao hang khu vuc trung tam', NOW());

INSERT INTO ThanhToan (MaThanhToan, MaHoaDon, PhuongThuc, SoTien, MaGiaoDich, TrangThai, ThoiGian) VALUES
('TT001', 'HD001', 'ChuyenKhoan', 212850, NULL, 'Success', NOW()),
('TT002', 'HD002', 'TienMat', 154000, NULL, 'Pending', NOW()),
('TT003', 'HD003', 'MoMo', 143000, 'MOMO_DH003_001', 'Pending', NOW());

INSERT INTO LichSuDonHang (MaLichSu, MaDonHang, TrangThaiCu, TrangThaiMoi, GhiChu, NguoiThucHien, ThoiGian) VALUES
('LS007', 'DH002', NULL, 'Pending', 'Tao don tai quan pickup', 'System', NOW()),
('LS008', 'DH002', 'Pending', 'Pending', 'Da goi xac nhan khach den lay', 'NV003', NOW()),
('LS009', 'DH002', 'Pending', 'Preparing', 'Bep tiep nhan don', 'NV003', NOW()),
('LS010', 'DH002', 'Preparing', 'Ready', 'San sang tra khach tai quay', 'NV003', NOW()),
('LS011', 'DH003', NULL, 'Pending', 'Tao don giao hang', 'System', NOW()),
('LS012', 'DH003', 'Pending', 'Pending', 'Xac nhan dia chi giao hang', 'NV002', NOW());

INSERT INTO LichSuDiemTichLuy (MaGiaoDichDiem, MaKH, MaDonHang, LoaiBienDong, SoDiem, SoDiemTruoc, SoDiemSau, MoTa, NgayTao) VALUES
('LSD002', 'KH002', 'DH002', 'CONG', 15, 65, 80, 'Cong diem tu don hang pickup DH002', NOW()),
('LSD003', 'KH_TEST_01', 'DH003', 'CONG', 14, 0, 14, 'Tam cong diem cho don giao hang DH003', NOW());

-- ============================================================
-- MO RONG DU LIEU MAU DE KIEM TRA END-TO-END VOI BACKEND THAT
-- Cac tai khoan noi bo bo sung dung mat khau: Staff@123
-- Cac tai khoan khach hang bo sung dung mat khau: 123
-- ============================================================
INSERT INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro, TrangThai) VALUES
('ND006', 'Pham Hoang Long', 'long.host@nhahang.com', '$2b$10$wd0YWq1YXw0jlVA0qlrA.udcmvJRVp7MSUO0RH57wU4iA9Tf/JeS6', 'NhanVien', 'Active'),
('ND007', 'Tran Thu Ha', 'ha.phucvu@nhahang.com', '$2b$10$wd0YWq1YXw0jlVA0qlrA.udcmvJRVp7MSUO0RH57wU4iA9Tf/JeS6', 'NhanVien', 'Active'),
('ND008', 'Vo Gia Bao', 'bao.thungan@nhahang.com', '$2b$10$wd0YWq1YXw0jlVA0qlrA.udcmvJRVp7MSUO0RH57wU4iA9Tf/JeS6', 'NhanVien', 'Inactive'),
('ND009', 'Nguyen Thi Quyen', 'quyen.admin@nhahang.com', '$2b$10$QQjUYOP2RIOusra.a.Sig.dnEWuKOnYCqQoMEqhJPX/T/XJ.dMEiW', 'Admin', 'Active'),
('ND010', 'Le Minh Chau', 'chau.lm@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND011', 'Hoang Anh Thu', 'thu.ha@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND012', 'Bui Quoc Dat', 'dat.bq@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND013', 'Nguyen Bao Ngoc', 'ngoc.nb@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Active'),
('ND014', 'Do Khanh Linh', 'linh.dk@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Inactive'),
('ND015', 'Phan Gia Huy', 'huy.pg@gmail.com', '$2b$12$nQJNiPj3O1iNDm624ZlBd.qrwnPSBrsxz7KV6JJp1ZBVAJloTQa8K', 'KhachHang', 'Banned');

INSERT INTO NhanVien (MaNV, MaND, HoTen, GioiTinh, SDT, DiaChi, ChucVu, LuongCoBan, NgayVaoLam, TinhTrang) VALUES
('NV004', 'ND006', 'Pham Hoang Long', 'Nam', '0901112222', 'Quan 1, TP.HCM', 'Host', 8500000, '2025-06-10', 'Active'),
('NV005', 'ND007', 'Tran Thu Ha', 'Nu', '0901113333', 'Quan 3, TP.HCM', 'PhucVu', 7800000, '2025-08-01', 'Active'),
('NV006', 'ND008', 'Vo Gia Bao', 'Nam', '0901114444', 'Quan 7, TP.HCM', 'ThuNgan', 9200000, '2025-03-01', 'Inactive'),
('NV007', 'ND009', 'Nguyen Thi Quyen', 'Nu', '0901115555', 'Thu Duc, TP.HCM', 'QuanLyCa', 13500000, '2024-09-15', 'Active');

INSERT INTO KhachHang (MaKH, MaND, TenKH, SDT, DiaChi, DiemTichLuy) VALUES
('KH004', NULL, 'Khach Le Cong Ty', NULL, 'Van phong cong ty tai Quan 1', 0),
('KH005', NULL, 'Khach Ban Tiec', NULL, 'Khach doan dat tiec cuoi tu su kien', 0),
('KH006', 'ND010', 'Le Minh Chau', '0908800001', '45 Le Loi, Quan 1, TP.HCM', 320),
('KH007', 'ND011', 'Hoang Anh Thu', '0908800002', '88 Cach Mang Thang 8, Quan 3, TP.HCM', 45),
('KH008', 'ND012', 'Bui Quoc Dat', '0908800003', '12 Nguyen Hue, Quan 1, TP.HCM', 95),
('KH009', 'ND013', 'Nguyen Bao Ngoc', '0908800004', '67 Dien Bien Phu, Binh Thanh, TP.HCM', 12),
('KH010', 'ND014', 'Do Khanh Linh', '0908800005', '90 Tran Hung Dao, Quan 5, TP.HCM', 0),
('KH011', 'ND015', 'Phan Gia Huy', '0908800006', '14 Ho Tung Mau, Quan 1, TP.HCM', 0);

INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai, NgayTao, NgayCapNhat) VALUES
('M014', 'DM001', 'Salad Ca Ngu', 'Salad ca ngu sot chanh day thanh mat.', 68000, NULL, 12, 'Available', NOW(), NOW()),
('M015', 'DM002', 'Suon Nuong Mat Ong', 'Suon nuong mem, sot mat ong dam vi.', 129000, NULL, 25, 'Available', NOW(), NOW()),
('M016', 'DM002', 'Lau Thai Hai San', 'Lau thai chua cay nhe cho nhom 2-4 nguoi.', 259000, NULL, 30, 'Available', NOW(), NOW()),
('M017', 'DM004', 'Tra Vai Hoa Hong', 'Do uong theo mua, tam thoi het hang.', 42000, NULL, 5, 'Unavailable', NOW(), NOW()),
('M018', 'DM003', 'Banh Tiramisu', 'Trang mieng vi ca phe nhe.', 45000, NULL, 8, 'Available', NOW(), NOW()),
('M019', 'DM005', 'Combo Van Phong', 'Combo trua gon nhe cho nhan vien van phong.', 159000, NULL, 15, 'Unavailable', NOW(), NOW()),
('M020', 'DM002', 'Mi Y Sot Bo Bam', 'Mon tam ngung kinh doanh de cap nhat cong thuc.', 89000, NULL, 18, 'Deleted', NOW(), NOW());

INSERT INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai, NgayTao, NgayCapNhat) VALUES
('B012', 'Ban 12', 'Trong nha', 12, 4, 'Tang 1 - Khu D', NULL, 'Available', NOW(), NOW()),
('B013', 'Ban 13', 'Quay bar', 13, 2, 'Quay bar', 'Phu hop khach di 2 nguoi', 'Available', NOW(), NOW()),
('B014', 'Ban 14', 'Tang 2', 14, 6, 'Tang 2 - Phong rieng 2', 'Ban du phong cho booking VIP', 'Available', NOW(), NOW()),

-- =====================
-- BAN MOI: TRONG NHA / TANG 2 / TANG 3 (B015-B039)
-- =====================
('B015', 'Ban 15', 'Trong nha', 15, 2, 'Tang 1 - Gan cua so', NULL, 'Reserved', NOW(), NOW()),
('B016', 'Ban 16', 'Trong nha', 16, 4, 'Tang 1 - Khu A', NULL, 'Available', NOW(), NOW()),
('B017', 'Ban 17', 'Trong nha', 17, 4, 'Tang 1 - Khu A', NULL, 'Occupied', NOW(), NOW()),
('B018', 'Ban 18', 'Trong nha', 18, 6, 'Tang 1 - Khu B', NULL, 'Available', NOW(), NOW()),
('B019', 'Ban 19', 'Trong nha', 19, 4, 'Tang 1 - Khu B', NULL, 'Reserved', NOW(), NOW()),
('B020', 'Ban 20', 'Trong nha', 20, 4, 'Tang 1 - Khu C', NULL, 'Available', NOW(), NOW()),
('B021', 'Ban 21', 'Trong nha', 21, 6, 'Tang 1 - Khu C', NULL, 'Occupied', NOW(), NOW()),
('B022', 'Ban 22', 'Trong nha', 22, 2, 'Tang 1 - Khu D', NULL, 'Available', NOW(), NOW()),
('B023', 'Ban 23', 'Trong nha', 23, 4, 'Tang 1 - Khu D', NULL, 'Maintenance', NOW(), NOW()),
('B024', 'Ban 24', 'Trong nha', 24, 8, 'Tang 1 - Khu E', NULL, 'Reserved', NOW(), NOW()),
('B025', 'Tang 2', 25, 4, 'Tang 2 - Phong chinh', NULL, 'Available', NOW(), NOW()),
('B026', 'Tang 2', 26, 4, 'Tang 2 - Phong chinh', NULL, 'Occupied', NOW(), NOW()),
('B027', 'Tang 2', 27, 6, 'Tang 2 - Phong chinh', NULL, 'Reserved', NOW(), NOW()),
('B028', 'Tang 2', 28, 6, 'Tang 2 - View dep', NULL, 'Available', NOW(), NOW()),
('B029', 'Tang 2', 29, 8, 'Tang 2 - Ban lon', NULL, 'Occupied', NOW(), NOW()),
('B030', 'Tang 2', 30, 4, 'Tang 2 - Khu truoc', NULL, 'Available', NOW(), NOW()),
('B031', 'Tang 2', 31, 4, 'Tang 2 - Khu truoc', NULL, 'Reserved', NOW(), NOW()),
('B032', 'Tang 3', 32, 4, 'Tang 3 - Phong rieng', NULL, 'Available', NOW(), NOW()),
('B033', 'Tang 3', 33, 6, 'Tang 3 - Phong rieng', NULL, 'Occupied', NOW(), NOW()),
('B034', 'Tang 3', 34, 8, 'Tang 3 - Phong lon', NULL, 'Available', NOW(), NOW()),
('B035', 'Tang 3', 35, 10, 'Tang 3 - Phong tiec', NULL, 'Reserved', NOW(), NOW()),
('B036', 'Tang 3', 36, 4, 'Tang 3 - Khu thanh pho', NULL, 'Available', NOW(), NOW()),
('B037', 'Tang 3', 37, 6, 'Tang 3 - Khu thanh pho', NULL, 'Maintenance', NOW(), NOW()),
('B038', 'Tang 3', 38, 2, 'Tang 3 - Ban nho', NULL, 'Available', NOW(), NOW()),

-- =====================
-- BAN MOI: KHU RIENG / VIP (B039-B048)
-- =====================
('B039', 'Ban VIP 1', 'Khu rieng', 39, 8, 'Tang 2 - Phong VIP 1', 'Phong VIP dau tien', 'Occupied', NOW(), NOW()),
('B040', 'Ban VIP 2', 'Khu rieng', 40, 8, 'Tang 2 - Phong VIP 2', 'Phong VIP thu hai', 'Reserved', NOW(), NOW()),
('B041', 'Ban VIP 3', 'Khu rieng', 41, 10, 'Tang 3 - Phong VIP 3', 'Phong VIP lon nhat', 'Available', NOW(), NOW()),
('B042', 'Ban VIP 4', 'Khu rieng', 42, 6, 'Tang 2 - Phong rieng A', NULL, 'Available', NOW(), NOW()),
('B043', 'Ban VIP 5', 'Khu riêng', 43, 6, 'Tang 2 - Phong rieng B', NULL, 'Occupied', NOW(), NOW()),
('B044', 'Ban VIP 6', 'Khu riêng', 44, 8, 'Tang 3 - Phong rieng C', NULL, 'Reserved', NOW(), NOW()),
('B045', 'Ban VIP 7', 'Khu riêng', 45, 4, 'Tang 2 - Phong nho', NULL, 'Available', NOW(), NOW()),
('B046', 'Ban VIP 8', 'Khu riêng', 46, 8, 'Tang 3 - Tang VIP', 'Danh cho khach VVIP', 'Occupied', NOW(), NOW()),
('B047', 'Ban VIP 9', 'Khu riêng', 47, 10, 'Tang 3 - Hall VIP', 'Phong hop vuong mac', 'Available', NOW(), NOW()),
('B048', 'Ban VIP 10', 'Khu riêng', 48, 6, 'Tang 2 - Ban cong VIP', 'Vi tri view dep', 'Reserved', NOW(), NOW()),

-- =====================
-- BAN MOI: NGOAI TROI (B049-B063)
-- =====================
('B049', 'Ban NT 1', 'Ngoai troi', 49, 2, 'Ngoai troi - Khu A', NULL, 'Available', NOW(), NOW()),
('B050', 'Ban NT 2', 'Ngoai troi', 50, 2, 'Ngoai troi - Khu A', NULL, 'Occupied', NOW(), NOW()),
('B051', 'Ban NT 3', 'Ngoai troi', 51, 4, 'Ngoai troi - Khu A', NULL, 'Available', NOW(), NOW()),
('B052', 'Ban NT 4', 'Ngoai troi', 52, 4, 'Ngoai troi - Khu A', NULL, 'Reserved', NOW(), NOW()),
('B053', 'Ban NT 5', 'Ngoai troi', 53, 4, 'Ngoai troi - Khu B', NULL, 'Available', NOW(), NOW()),
('B054', 'Ban NT 6', 'Ngoai troi', 54, 6, 'Ngoai troi - Khu B', NULL, 'Occupied', NOW(), NOW()),
('B055', 'Ban NT 7', 'Ngoai troi', 55, 6, 'Ngoai troi - Khu B', NULL, 'Available', NOW(), NOW()),
('B056', 'Ban NT 8', 'Ngoai troi', 56, 2, 'Ngoai troi - Khu C', NULL, 'Reserved', NOW(), NOW()),
('B057', 'Ban NT 9', 'Ngoai troi', 57, 4, 'Ngoai troi - Khu C', NULL, 'Available', NOW(), NOW()),
('B058', 'Ban NT 10', 'Ngoai troi', 58, 8, 'Ngoai troi - Khu C', NULL, 'Occupied', NOW(), NOW()),
('B059', 'Ban NT 11', 'Ngoai troi', 59, 4, 'Ngoai troi - Khu D', NULL, 'Available', NOW(), NOW()),
('B060', 'Ban NT 12', 'Ngoai troi', 60, 6, 'Ngoai troi - Khu D', NULL, 'Reserved', NOW(), NOW()),
('B061', 'Ban NT 13', 'Ngoai troi', 61, 4, 'Ngoai troi - Khu D', NULL, 'Maintenance', NOW(), NOW()),
('B062', 'Ban NT 14', 'Ngoai troi', 62, 2, 'Ngoai troi - Khu E', NULL, 'Available', NOW(), NOW()),
('B063', 'Ban NT 15', 'Ngoai troi', 63, 4, 'Ngoai troi - Khu E', NULL, 'Occupied', NOW(), NOW());

INSERT INTO QRCode (MaQR, MaBan, DuongDanQR, NgayHetHan, TrangThai) VALUES
('QR012', 'B012', 'http://localhost:5173/ban/B012', '2027-12-31 23:59:59', 'Active'),
('QR013', 'B013', 'http://localhost:5173/ban/B013', '2027-12-31 23:59:59', 'Active'),
('QR014', 'B014', 'http://localhost:5173/ban/B014', '2027-12-31 23:59:59', 'Inactive'),

-- QR Trong nha / Tang 2 / Tang 3 (B015-B038)
('QR015', 'B015', 'http://localhost:5173/ban/B015', '2027-12-31 23:59:59', 'Active'),
('QR016', 'B016', 'http://localhost:5173/ban/B016', '2027-12-31 23:59:59', 'Active'),
('QR017', 'B017', 'http://localhost:5173/ban/B017', '2027-12-31 23:59:59', 'Active'),
('QR018', 'B018', 'http://localhost:5173/ban/B018', '2027-12-31 23:59:59', 'Active'),
('QR019', 'B019', 'http://localhost:5173/ban/B019', '2027-12-31 23:59:59', 'Active'),
('QR020', 'B020', 'http://localhost:5173/ban/B020', '2027-12-31 23:59:59', 'Active'),
('QR021', 'B021', 'http://localhost:5173/ban/B021', '2027-12-31 23:59:59', 'Active'),
('QR022', 'B022', 'http://localhost:5173/ban/B022', '2027-12-31 23:59:59', 'Active'),
('QR023', 'B023', 'http://localhost:5173/ban/B023', '2027-12-31 23:59:59', 'Active'),
('QR024', 'B024', 'http://localhost:5173/ban/B024', '2027-12-31 23:59:59', 'Active'),
('QR025', 'B025', 'http://localhost:5173/ban/B025', '2027-12-31 23:59:59', 'Active'),
('QR026', 'B026', 'http://localhost:5173/ban/B026', '2027-12-31 23:59:59', 'Active'),
('QR027', 'B027', 'http://localhost:5173/ban/B027', '2027-12-31 23:59:59', 'Active'),
('QR028', 'B028', 'http://localhost:5173/ban/B028', '2027-12-31 23:59:59', 'Active'),
('QR029', 'B029', 'http://localhost:5173/ban/B029', '2027-12-31 23:59:59', 'Active'),
('QR030', 'B030', 'http://localhost:5173/ban/B030', '2027-12-31 23:59:59', 'Active'),
('QR031', 'B031', 'http://localhost:5173/ban/B031', '2027-12-31 23:59:59', 'Active'),
('QR032', 'B032', 'http://localhost:5173/ban/B032', '2027-12-31 23:59:59', 'Active'),
('QR033', 'B033', 'http://localhost:5173/ban/B033', '2027-12-31 23:59:59', 'Active'),
('QR034', 'B034', 'http://localhost:5173/ban/B034', '2027-12-31 23:59:59', 'Active'),
('QR035', 'B035', 'http://localhost:5173/ban/B035', '2027-12-31 23:59:59', 'Active'),
('QR036', 'B036', 'http://localhost:5173/ban/B036', '2027-12-31 23:59:59', 'Active'),
('QR037', 'B037', 'http://localhost:5173/ban/B037', '2027-12-31 23:59:59', 'Active'),
('QR038', 'B038', 'http://localhost:5173/ban/B038', '2027-12-31 23:59:59', 'Active'),

-- QR Khu rieng / VIP (B039-B048)
('QR039', 'B039', 'http://localhost:5173/ban/B039', '2027-12-31 23:59:59', 'Active'),
('QR040', 'B040', 'http://localhost:5173/ban/B040', '2027-12-31 23:59:59', 'Active'),
('QR041', 'B041', 'http://localhost:5173/ban/B041', '2027-12-31 23:59:59', 'Active'),
('QR042', 'B042', 'http://localhost:5173/ban/B042', '2027-12-31 23:59:59', 'Active'),
('QR043', 'B043', 'http://localhost:5173/ban/B043', '2027-12-31 23:59:59', 'Active'),
('QR044', 'B044', 'http://localhost:5173/ban/B044', '2027-12-31 23:59:59', 'Active'),
('QR045', 'B045', 'http://localhost:5173/ban/B045', '2027-12-31 23:59:59', 'Active'),
('QR046', 'B046', 'http://localhost:5173/ban/B046', '2027-12-31 23:59:59', 'Active'),
('QR047', 'B047', 'http://localhost:5173/ban/B047', '2027-12-31 23:59:59', 'Active'),
('QR048', 'B048', 'http://localhost:5173/ban/B048', '2027-12-31 23:59:59', 'Active'),

-- QR Ngoai troi (B049-B063)
('QR049', 'B049', 'http://localhost:5173/ban/B049', '2027-12-31 23:59:59', 'Active'),
('QR050', 'B050', 'http://localhost:5173/ban/B050', '2027-12-31 23:59:59', 'Active'),
('QR051', 'B051', 'http://localhost:5173/ban/B051', '2027-12-31 23:59:59', 'Active'),
('QR052', 'B052', 'http://localhost:5173/ban/B052', '2027-12-31 23:59:59', 'Active'),
('QR053', 'B053', 'http://localhost:5173/ban/B053', '2027-12-31 23:59:59', 'Active'),
('QR054', 'B054', 'http://localhost:5173/ban/B054', '2027-12-31 23:59:59', 'Active'),
('QR055', 'B055', 'http://localhost:5173/ban/B055', '2027-12-31 23:59:59', 'Active'),
('QR056', 'B056', 'http://localhost:5173/ban/B056', '2027-12-31 23:59:59', 'Active'),
('QR057', 'B057', 'http://localhost:5173/ban/B057', '2027-12-31 23:59:59', 'Active'),
('QR058', 'B058', 'http://localhost:5173/ban/B058', '2027-12-31 23:59:59', 'Active'),
('QR059', 'B059', 'http://localhost:5173/ban/B059', '2027-12-31 23:59:59', 'Active'),
('QR060', 'B060', 'http://localhost:5173/ban/B060', '2027-12-31 23:59:59', 'Active'),
('QR061', 'B061', 'http://localhost:5173/ban/B061', '2027-12-31 23:59:59', 'Active'),
('QR062', 'B062', 'http://localhost:5173/ban/B062', '2027-12-31 23:59:59', 'Active'),
('QR063', 'B063', 'http://localhost:5173/ban/B063', '2027-12-31 23:59:59', 'Active');

INSERT INTO MaGiamGia (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu, NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai) VALUES
('VIP25', 'Uu dai VIP 25%', 25, 'PhanTram', 90000, 250000, DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 200, 15, 'Active'),
('FREESHIP20', 'Ho tro phi ship 20k', 20000, 'SoTien', NULL, 120000, DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), NULL, 12, 'Active'),
('LOYAL25K', 'Tri an thanh vien 25k', 25000, 'SoTien', NULL, 180000, DATE_SUB(CURRENT_DATE(), INTERVAL 15 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 90 DAY), NULL, 8, 'Active'),
('MORNING15', 'Uu dai buoi sang', 15, 'PhanTram', 30000, 80000, DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 100, 100, 'Inactive'),
('FLASH30', 'Flash sale 30%', 30, 'PhanTram', 60000, 150000, DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 50, 50, 'HetHan');

INSERT INTO DatBan (
    MaDatBan, MaKH, MaBan, MaNV, TenKhachDatBan, SDTDatBan, EmailDatBan,
    NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, KhuVucUuTien, GhiChuNoiBo,
    TrangThai, NgayTao, NgayCapNhat
) VALUES
('DB002', 'KH002', NULL, 'NV004', 'Pham Thi Mai', '0987654321', 'mai.pt@gmail.com', DATE(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 210 MINUTE)), 2, 'Ban gan cua so neu con cho.', 'SANH_CHINH', 'Booking sap den, can xac nhan qua dien thoai.', 'CHO_XAC_NHAN', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 20 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 20 MINUTE)),
('DB003', 'KH006', NULL, 'NV004', 'Le Minh Chau', '0908800001', 'chau.lm@gmail.com', DATE(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 60 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 60 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 180 MINUTE)), 6, 'Can khong gian rieng cho nhom hop mat.', 'PHONG_VIP', 'Khach VIP, neu het cho can goi lai de doi khung gio.', 'CAN_GOI_LAI', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 50 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)),
('DB004', 'KH006', 'B005', 'NV002', 'Le Minh Chau', '0908800001', 'chau.lm@gmail.com', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '19:00:00', '21:00:00', 4, 'Sinh nhat gia dinh.', 'PHONG_VIP', 'Da xac nhan va giu ban VIP.', 'DA_XAC_NHAN', TIMESTAMP(CURRENT_DATE(), '09:15:00'), TIMESTAMP(CURRENT_DATE(), '09:25:00')),
('DB005', 'KH007', 'B011', 'NV005', 'Hoang Anh Thu', '0908800002', 'thu.ha@gmail.com', DATE(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 45 MINUTE)), TIME(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 45 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)), 4, 'Da den du gio.', 'PHONG_VIP', 'Khach da check-in va dang dung bua.', 'DA_CHECK_IN', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 HOUR), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)),
('DB006', 'KH001', 'B002', 'NV002', 'Tran Van Khach', '0912345678', 'khach1@gmail.com', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '12:00:00', '13:30:00', 2, 'Khach quen dat ban trua.', 'SANH_CHINH', 'Tam giu cho den khi xac nhan lai so khach.', 'GIU_CHO_TAM', TIMESTAMP(CURRENT_DATE(), '10:05:00'), TIMESTAMP(CURRENT_DATE(), '10:10:00')),
('DB007', 'KH004', NULL, 'NV004', 'Khach Le Cong Ty', '0907772001', 'booking.doanhnghiep@demo.local', DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY), '18:30:00', '20:30:00', 8, 'Can hoa don cong ty.', 'SANH_CHINH', 'Booking doan tu website, cho goi xac nhan.', 'YEU_CAU_DAT_BAN', TIMESTAMP(CURRENT_DATE(), '08:20:00'), TIMESTAMP(CURRENT_DATE(), '08:20:00')),
('DB008', 'KH002', 'B006', 'NV005', 'Pham Thi Mai', '0987654321', 'mai.pt@gmail.com', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:00:00', '19:30:00', 2, 'Dat ban ngoai troi.', 'BAN_CONG', 'Khach khong den sau 20 phut.', 'KHONG_DEN', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '11:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:30:00')),
('DB009', 'KH008', NULL, 'NV004', 'Bui Quoc Dat', '0908800003', 'dat.bq@gmail.com', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '19:00:00', '21:00:00', 3, 'Khach doi lich sang tuan sau.', 'SANH_CHINH', 'Da huy theo yeu cau khach.', 'Cancelled', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '16:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '12:00:00')),
('DB010', 'KH005', NULL, 'NV004', 'Khach Ban Tiec', '0907772002', 'ban.tiec@demo.local', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), '20:00:00', '22:00:00', 10, 'Doan khach muon phong rieng.', 'PHONG_VIP', 'Het suc chua vao cuoi tuan.', 'TU_CHOI_HET_CHO', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY), '15:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), '10:30:00')),
('DB011', 'KH009', 'B014', 'NV007', 'Nguyen Bao Ngoc', '0908800004', 'ngoc.nb@gmail.com', DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), '18:00:00', '20:00:00', 5, 'Dat phong rieng tiep doi tac.', 'PHONG_VIP', 'Admin da duyet booking VIP.', 'Pending', TIMESTAMP(CURRENT_DATE(), '13:10:00'), TIMESTAMP(CURRENT_DATE(), '13:20:00')),
('DB012', 'KH008', 'B012', 'NV002', 'Bui Quoc Dat', '0908800003', 'dat.bq@gmail.com', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '18:15:00', '20:15:00', 4, 'Khach se den sau gio tan lam.', 'SANH_CHINH', 'Da ghi nhan va tam giu ban tang 1.', 'DA_GHI_NHAN', TIMESTAMP(CURRENT_DATE(), '14:00:00'), TIMESTAMP(CURRENT_DATE(), '14:05:00')),
('DB013', 'KH_TEST_01', NULL, 'NV004', 'Nguyen Van Test', '0901239999', 'khachtest01@gmail.com', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '17:30:00', '19:00:00', 3, 'Muon ngoi gan may lanh.', 'SANH_CHINH', 'Khach moi tao booking, chua gan ban.', 'Pending', TIMESTAMP(CURRENT_DATE(), '15:15:00'), TIMESTAMP(CURRENT_DATE(), '15:15:00')),
('DB014', 'KH001', 'B013', 'NV005', 'Tran Van Khach', '0912345678', 'khach1@gmail.com', DATE(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)), TIME(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 75 MINUTE)), 2, 'Khach vao ban va da goi mon.', 'QUAY_BAR', 'Da xep ban tai quay bar.', 'DA_XEP_BAN', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)),
('DB015', 'KH006', 'B010', 'NV004', 'Le Minh Chau', '0908800001', 'chau.lm@gmail.com', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY), '18:30:00', '20:00:00', 2, 'Booking cu khach khong den.', 'BAN_CONG', 'Khach bao tre nhung khong den.', 'NoShow', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 11 DAY), '09:40:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY), '19:00:00'));

INSERT INTO DatBan (
    MaDatBan, MaKH, MaBan, MaNV, TenKhachDatBan, SDTDatBan, EmailDatBan,
    NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, KhuVucUuTien, GhiChuNoiBo,
    TrangThai, NgayTao, NgayCapNhat
) VALUES
('DB016', 'KH008', 'B012', 'NV002', 'Bui Quoc Dat', '0908800003', 'dat.bq@gmail.com', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:15:00', '13:45:00', 4, 'Hop mat ban be buoi trua.', 'SANH_CHINH', 'Da phuc vu xong va khach danh gia tot.', 'Completed', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:40:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:50:00')),
('DB017', 'KH009', 'B014', 'NV007', 'Nguyen Bao Ngoc', '0908800004', 'ngoc.nb@gmail.com', DATE(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 75 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 75 MINUTE)), TIME(DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 195 MINUTE)), 5, 'Khach tiep doi tac, uu tien phong rieng.', 'PHONG_VIP', 'Can kiem tra lai setup phong VIP truoc gio den.', 'Pending', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 35 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)),
('DB018', 'KH006', 'B005', 'NV002', 'Le Minh Chau', '0908800001', 'chau.lm@gmail.com', DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:15:00', '21:00:00', 6, 'Tiec nho ky niem cua nhom than thiet.', 'PHONG_VIP', 'Khach da dung bua tron ven va hoan thanh thanh toan.', 'Completed', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '17:30:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:05:00')),
('DB019', 'KH004', NULL, 'NV004', 'Khach Le Cong Ty', '0907772003', 'company.booking2@demo.local', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '18:45:00', '20:30:00', 10, 'Can xac nhan lai so luong khach va yeu cau hoa don.', 'SANH_CHINH', 'Booking doanh nghiep moi tu website.', 'CHO_XAC_NHAN', TIMESTAMP(CURRENT_DATE(), '16:10:00'), TIMESTAMP(CURRENT_DATE(), '16:10:00')),
('DB020', 'KH008', 'B009', 'NV005', 'Bui Quoc Dat', '0908800003', 'dat.bq@gmail.com', CURRENT_DATE(), '19:15:00', '20:45:00', 4, 'Dat ban toi cuoi ngay sau gio lam.', 'BAN_CONG', 'Khach da xac nhan, uu tien phuc vu nhanh trong cao diem toi.', 'DA_XAC_NHAN', TIMESTAMP(CURRENT_DATE(), '17:10:00'), TIMESTAMP(CURRENT_DATE(), '17:20:00'));

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, GioLayHang, GioGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu, NgayTao, NgayCapNhat) VALUES
('DH004', 'KH003', 'B003', 'B003', 'NV004', NULL, 'TAI_BAN', NULL, NULL, NULL, 0, 110000, 'Preparing', 'QRCode', 'Khach tai ban goi them mon va nuoc.', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 35 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 5 MINUTE)),
('DH005', 'KH006', 'B009', 'B009', 'NV002', NULL, 'TAI_BAN', NULL, NULL, NULL, 0, 351000, 'Ready', 'QRCode', 'Khach yeu cau xuat hoa don tai ban.', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 70 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 8 MINUTE)),
('DH006', 'KH007', 'B011', 'B011', 'NV005', 'DB005', 'TAI_QUAN', NULL, NULL, NULL, 0, 205000, 'Served', 'DatBan', 'Da phuc vu xong mon chinh, cho danh gia.', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 50 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 4 MINUTE)),
('DH007', 'KH006', NULL, NULL, 'NV003', NULL, 'TAI_QUAN', NULL, '11:30:00', NULL, 0, 210000, 'Paid', 'Online', 'Khach dat pickup cho buoi trua.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:20:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:45:00')),
('DH008', 'KH008', NULL, NULL, 'NV005', NULL, 'TAI_QUAN', '12 Nguyen Hue, Quan 1, TP.HCM', NULL, '19:10:00', 15000, 168000, 'Paid', 'Online', 'Giao tan noi trong khung toi.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:40:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '19:40:00')),
('DH009', 'KH009', NULL, NULL, 'NV007', NULL, 'TAI_QUAN', '67 Dien Bien Phu, Binh Thanh, TP.HCM', NULL, '18:20:00', 15000, 115000, 'Cancelled', 'Online', 'Khach huy don sau khi tai xe chua nhan.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:50:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:05:00')),
('DH010', 'KH002', 'B001', NULL, 'NV003', NULL, 'TAI_QUAN', NULL, NULL, NULL, 0, 147000, 'Paid', 'TaiQuay', 'Khach an tai quan vao gio trua.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:20:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '13:10:00')),
('DH011', 'KH001', NULL, NULL, 'NV003', NULL, 'TAI_QUAN', NULL, '18:40:00', NULL, 0, 188000, 'Paid', 'Online', 'Don pickup buoi toi cho gia dinh.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:45:00')),
('DH012', 'KH006', NULL, NULL, 'NV002', NULL, 'TAI_QUAN', '45 Le Loi, Quan 1, TP.HCM', NULL, '19:00:00', 20000, 307000, 'Paid', 'Online', 'Don giao hang VIP da ap dung uu dai.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:15:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:30:00')),
('DH013', 'KH001', 'B013', 'B013', 'NV005', 'DB014', 'TAI_BAN', NULL, NULL, NULL, 0, 105000, 'Pending', 'QRCode', 'Order tai quay bar vua tao, dang cho bep tiep nhan.', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 20 MINUTE), DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 6 MINUTE)),
('DH014', 'KH008', 'B012', 'B012', 'NV002', 'DB016', 'TAI_QUAN', NULL, NULL, NULL, 0, 268000, 'Paid', 'DatBan', 'Khach dung bua trua va thanh toan tron ven.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:18:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:42:00')),
('DH015', 'KH006', 'B005', 'B005', 'NV002', 'DB018', 'TAI_QUAN', NULL, NULL, NULL, 0, 394000, 'Paid', 'DatBan', 'Tiec VIP da phuc vu xong, doanh thu cao.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:20:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:10:00')),
('DH016', 'KH007', NULL, NULL, 'NV003', NULL, 'TAI_QUAN', NULL, '18:10:00', NULL, 0, 172000, 'Paid', 'Online', 'Khach pickup buoi toi, co mua them trang mieng.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:30:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:20:00')),
('DH017', 'KH009', NULL, NULL, 'NV005', NULL, 'TAI_QUAN', '67 Dien Bien Phu, Binh Thanh, TP.HCM', NULL, '19:45:00', 15000, 226000, 'Paid', 'Online', 'Don giao hang buoi toi trong noi thanh.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:35:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:50:00')),
('DH018', 'KH001', 'B002', 'B002', 'NV003', 'DB006', 'TAI_QUAN', NULL, NULL, NULL, 0, 184000, 'Pending', 'DatBan', 'Booking trua dang cho bep tiep nhan.', TIMESTAMP(CURRENT_DATE(), '11:35:00'), TIMESTAMP(CURRENT_DATE(), '11:40:00')),
('DH019', 'KH008', 'B009', 'B009', 'NV005', 'DB020', 'TAI_QUAN', NULL, NULL, NULL, 0, 312000, 'Paid', 'DatBan', 'Khach toi cuoi ngay da thanh toan ngay sau bua toi.', TIMESTAMP(CURRENT_DATE(), '19:18:00'), TIMESTAMP(CURRENT_DATE(), '20:48:00'));

INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai, NgayTao) VALUES
('CT011', 'DH004', 'M002', 1, 45000, 45000, 'Lam gion ky', 'Preparing', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 34 MINUTE)),
('CT012', 'DH004', 'M008', 1, 25000, 25000, 'It da', 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 33 MINUTE)),
('CT013', 'DH004', 'M009', 1, 35000, 35000, NULL, 'Pending', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 32 MINUTE)),
('CT014', 'DH005', 'M011', 1, 299000, 299000, NULL, 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 68 MINUTE)),
('CT015', 'DH005', 'M009', 1, 35000, 35000, 'Khong da', 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 66 MINUTE)),
('CT016', 'DH006', 'M004', 1, 75000, 75000, NULL, 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 MINUTE)),
('CT017', 'DH006', 'M005', 1, 65000, 65000, 'Bot cay', 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 47 MINUTE)),
('CT018', 'DH006', 'M008', 1, 25000, 25000, NULL, 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 46 MINUTE)),
('CT019', 'DH006', 'M010', 1, 30000, 30000, NULL, 'Done', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 45 MINUTE)),
('CT020', 'DH007', 'M012', 1, 199000, 199000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:22:00')),
('CT021', 'DH007', 'M007', 1, 25000, 25000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:23:00')),
('CT022', 'DH008', 'M003', 1, 55000, 55000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:42:00')),
('CT023', 'DH008', 'M004', 1, 75000, 75000, 'Them hanh', 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:43:00')),
('CT024', 'DH008', 'M009', 1, 35000, 35000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:44:00')),
('CT025', 'DH009', 'M005', 1, 65000, 65000, NULL, 'Cancelled', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:52:00')),
('CT026', 'DH009', 'M010', 1, 30000, 30000, NULL, 'Cancelled', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:53:00')),
('CT027', 'DH010', 'M001', 1, 35000, 35000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:21:00')),
('CT028', 'DH010', 'M003', 1, 55000, 55000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:22:00')),
('CT029', 'DH010', 'M008', 2, 25000, 50000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:23:00')),
('CT030', 'DH011', 'M013', 1, 129000, 129000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:02:00')),
('CT031', 'DH011', 'M008', 2, 25000, 50000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:03:00')),
('CT032', 'DH012', 'M011', 1, 299000, 299000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:16:00')),
('CT033', 'DH012', 'M010', 2, 30000, 60000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:17:00')),
('CT034', 'DH013', 'M002', 1, 45000, 45000, 'Khong hanh phi', 'Pending', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 19 MINUTE)),
('CT035', 'DH013', 'M003', 1, 55000, 55000, NULL, 'Pending', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 18 MINUTE)),
('CT036', 'DH014', 'M015', 1, 129000, 129000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:20:00')),
('CT037', 'DH014', 'M014', 1, 68000, 68000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:21:00')),
('CT038', 'DH014', 'M018', 1, 45000, 45000, 'Sinh nhat tang kem', 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:22:00')),
('CT039', 'DH015', 'M016', 1, 259000, 259000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:25:00')),
('CT040', 'DH015', 'M015', 1, 129000, 129000, 'Cat nho de chia mon', 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:26:00')),
('CT041', 'DH016', 'M013', 1, 129000, 129000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:35:00')),
('CT042', 'DH016', 'M018', 1, 45000, 45000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:36:00')),
('CT043', 'DH017', 'M015', 1, 129000, 129000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:40:00')),
('CT044', 'DH017', 'M009', 1, 35000, 35000, 'It da', 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:41:00')),
('CT045', 'DH017', 'M010', 1, 30000, 30000, NULL, 'Done', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:42:00')),
('CT046', 'DH018', 'M003', 1, 55000, 55000, NULL, 'Pending', TIMESTAMP(CURRENT_DATE(), '11:36:00')),
('CT047', 'DH018', 'M008', 2, 25000, 50000, NULL, 'Pending', TIMESTAMP(CURRENT_DATE(), '11:37:00')),
('CT048', 'DH018', 'M014', 1, 68000, 68000, NULL, 'Pending', TIMESTAMP(CURRENT_DATE(), '11:38:00')),
('CT049', 'DH019', 'M016', 1, 259000, 259000, NULL, 'Done', TIMESTAMP(CURRENT_DATE(), '19:20:00')),
('CT050', 'DH019', 'M009', 1, 35000, 35000, NULL, 'Done', TIMESTAMP(CURRENT_DATE(), '19:21:00')),
('CT051', 'DH019', 'M018', 1, 45000, 45000, 'Tang kem sau bua toi', 'Done', TIMESTAMP(CURRENT_DATE(), '19:22:00'));

INSERT INTO HoaDon (MaHoaDon, MaDonHang, MaKH, MaCode, TongTien, GiamGia, ThueSuat, TienThue, ThanhTien, GhiChu, NgayXuat) VALUES
('HD004', 'DH007', 'KH006', 'LOYAL25K', 210000, 25000, 10, 21000, 231000, 'Don pickup tri an thanh vien.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:46:00')),
('HD005', 'DH008', 'KH008', 'FREESHIP20', 168000, 20000, 10, 16800, 184800, 'Ho tro phi ship cho don giao hang.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '19:42:00')),
('HD006', 'DH009', 'KH009', NULL, 115000, 0, 10, 11500, 126500, 'Thanh toan that bai truoc khi khach huy don.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:08:00')),
('HD007', 'DH010', 'KH002', NULL, 147000, 0, 10, 14700, 161700, 'Hoa don tai quay gio trua.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '13:12:00')),
('HD008', 'DH011', 'KH001', NULL, 188000, 0, 8, 15040, 203040, 'Hoa don pickup buoi toi.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:46:00')),
('HD009', 'DH012', 'KH006', 'VIP25', 307000, 90000, 8, 24560, 331560, 'Don giao hang VIP co ap dung ma giam gia.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:32:00')),
('HD010', 'DH014', 'KH008', NULL, 268000, 0, 10, 26800, 294800, 'Don tai quan buoi trua co them trang mieng.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:40:00')),
('HD011', 'DH015', 'KH006', 'VIP25', 394000, 90000, 10, 39400, 343400, 'Don tiec VIP da ap dung uu dai thanh vien.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:08:00')),
('HD012', 'DH016', 'KH007', NULL, 172000, 0, 8, 13760, 185760, 'Don pickup sau gio tan lam.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:18:00')),
('HD013', 'DH017', 'KH009', 'FREESHIP20', 226000, 20000, 8, 18080, 224080, 'Don giao hang noi thanh buoi toi.', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:48:00')),
('HD014', 'DH019', 'KH008', NULL, 312000, 0, 10, 31200, 343200, 'Don bua toi cao diem trong nha hang.', TIMESTAMP(CURRENT_DATE(), '20:46:00'));

INSERT INTO ThanhToan (MaThanhToan, MaHoaDon, PhuongThuc, SoTien, MaGiaoDich, TrangThai, ThoiGian) VALUES
('TT004', 'HD004', 'ChuyenKhoan', 231000, 'CK_DH007_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:48:00')),
('TT005', 'HD005', 'MoMo', 184800, 'MOMO_DH008_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '19:44:00')),
('TT006', 'HD006', 'VNPay', 126500, 'VNPAY_DH009_001', 'Failed', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:09:00')),
('TT007', 'HD007', 'TienMat', 161700, NULL, 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '13:15:00')),
('TT008', 'HD008', 'TheNganHang', 203040, 'CARD_DH011_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:48:00')),
('TT009', 'HD009', 'ZaloPay', 331560, 'ZALOPAY_DH012_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:35:00')),
('TT010', 'HD010', 'TienMat', 294800, NULL, 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:42:00')),
('TT011', 'HD011', 'TheNganHang', 343400, 'CARD_DH015_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:10:00')),
('TT012', 'HD012', 'ChuyenKhoan', 185760, 'CK_DH016_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:20:00')),
('TT013', 'HD013', 'MoMo', 224080, 'MOMO_DH017_001', 'Success', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:50:00')),
('TT014', 'HD014', 'TienMat', 343200, NULL, 'Success', TIMESTAMP(CURRENT_DATE(), '20:48:00'));

INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, HinhAnh, SoLuotHuuIch, NgayDanhGia, NgayCapNhat, TrangThai) VALUES
('DG001', 'KH001', 'DH001', 5, 'Khong gian dep, mon len nhanh va phuc vu lich su.', 'Cam on quy khach da ung ho nha hang.', NULL, 12, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '09:15:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '10:00:00'), 'Approved'),
('DG002', 'KH006', 'DH007', 4, 'Dong goi can than, den lay hang dung gio.', NULL, NULL, 3, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:00:00'), 'Pending'),
('DG003', 'KH008', 'DH008', 2, 'Mon giao hoi nguoi va nuoc cham bi thieu.', 'Nha hang da lien he xin loi va gui uu dai cho don tiep theo.', NULL, 1, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '21:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '21:20:00'), 'Rejected'),
('DG004', 'KH002', 'DH010', 5, 'Com rang vua vi, phuc vu nhanh vao gio cao diem.', NULL, '["/uploads/reviews/dg004-1.jpg"]', 8, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '14:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '14:00:00'), 'Approved'),
('DG005', 'KH001', 'DH011', 4, 'Combo pickup tien, do an van nong.', NULL, NULL, 5, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 11 DAY), '19:10:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 11 DAY), '19:10:00'), 'Approved'),
('DG006', 'KH006', 'DH012', 5, 'Giao hang dung gio, tai xe goi truoc rat chuyen nghiep.', 'Cam on quy khach, hen gap lai o don tiep theo.', '["/uploads/reviews/dg006-1.jpg","/uploads/reviews/dg006-2.jpg"]', 15, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 19 DAY), '20:15:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 19 DAY), '20:40:00'), 'Approved'),
('DG007', 'KH008', 'DH014', 5, 'Bua trua rat on, mon nuong va salad can bang, ra mon nhanh.', NULL, NULL, 6, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '15:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '15:00:00'), 'Approved'),
('DG008', 'KH006', 'DH015', 5, 'Phong VIP rieng tu, lau len nong va phuc vu chu dao.', 'Cam on quy khach da tin tuong dat tiec nho tai nha hang.', NULL, 11, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '22:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '22:15:00'), 'Approved'),
('DG009', 'KH007', 'DH016', 4, 'Don pickup gon gang, banh tiramisu rat ngon.', NULL, NULL, 4, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '09:00:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '09:00:00'), 'Pending'),
('DG010', 'KH009', 'DH017', 4, 'Giao hang dung hen, do uong con lanh va dong goi ky.', NULL, NULL, 2, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:10:00'), TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:10:00'), 'Approved'),
('DG011', 'KH008', 'DH019', 5, 'Bua toi dong khach nhung nha hang phuc vu van nhanh va mon rat on dinh.', NULL, NULL, 7, TIMESTAMP(CURRENT_DATE(), '22:05:00'), TIMESTAMP(CURRENT_DATE(), '22:05:00'), 'Approved');

INSERT INTO LichSuDonHang (MaLichSu, MaDonHang, TrangThaiCu, TrangThaiMoi, GhiChu, NguoiThucHien, ThoiGian) VALUES
('LS013', 'DH001', NULL, 'Pending', 'Tao don tu booking da xac nhan', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:15:00')),
('LS014', 'DH001', 'Pending', 'Pending', 'Thu ngan xac nhan order tai quan', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:17:00')),
('LS015', 'DH001', 'Pending', 'Preparing', 'Bep tiep nhan mon', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:22:00')),
('LS016', 'DH001', 'Preparing', 'Paid', 'Hoan tat thanh toan don tai quan', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:12:00')),
('LS017', 'DH004', NULL, 'Pending', 'Tao order moi qua QR tai ban', 'System', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 35 MINUTE)),
('LS018', 'DH004', 'Pending', 'Pending', 'Nhan vien da xac nhan order tai ban', 'NV004', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 25 MINUTE)),
('LS019', 'DH004', 'Pending', 'Preparing', 'Bep dang chuan bi mon', 'NV004', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 5 MINUTE)),
('LS020', 'DH005', NULL, 'Pending', 'Khach tai ban goi combo gia dinh', 'System', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 70 MINUTE)),
('LS021', 'DH005', 'Pending', 'Pending', 'Nhan vien tiep nhan don tai ban', 'NV002', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 60 MINUTE)),
('LS022', 'DH005', 'Pending', 'Preparing', 'Bep hoan tat mon chinh', 'NV002', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)),
('LS023', 'DH005', 'Preparing', 'Ready', 'Ban da yeu cau thanh toan, cho xuat hoa don', 'NV002', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 8 MINUTE)),
('LS024', 'DH006', NULL, 'Pending', 'Tao don theo booking check-in', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 50 MINUTE)),
('LS025', 'DH006', 'Pending', 'Pending', 'Order duoc xac nhan tai ban', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 42 MINUTE)),
('LS026', 'DH006', 'Pending', 'Preparing', 'Bep bat dau che bien', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)),
('LS027', 'DH006', 'Preparing', 'Ready', 'Da san sang phuc vu', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)),
('LS028', 'DH006', 'Ready', 'Served', 'Nhan vien da mang mon ra ban', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 4 MINUTE)),
('LS029', 'DH007', NULL, 'Pending', 'Khach tao don pickup online', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:20:00')),
('LS030', 'DH007', 'Pending', 'Pending', 'Thu ngan goi xac nhan don', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:25:00')),
('LS031', 'DH007', 'Pending', 'Preparing', 'Bep xu ly don trua', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:30:00')),
('LS032', 'DH007', 'Preparing', 'Paid', 'Khach den lay va thanh toan', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:48:00')),
('LS033', 'DH008', NULL, 'Pending', 'Khach tao don giao hang online', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:40:00')),
('LS034', 'DH008', 'Pending', 'Pending', 'Nhan vien xac nhan dia chi giao', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:45:00')),
('LS035', 'DH008', 'Pending', 'Preparing', 'Bep chuan bi don giao hang', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '18:55:00')),
('LS036', 'DH008', 'Preparing', 'Paid', 'Don giao thanh cong va da thanh toan', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '19:44:00')),
('LS037', 'DH009', NULL, 'Pending', 'Tao don giao hang online', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:50:00')),
('LS038', 'DH009', 'Pending', 'Cancelled', 'Khach huy don truoc khi tai xe nhan', 'NV007', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:05:00')),
('LS039', 'DH010', NULL, 'Pending', 'Tao don tai quay gio trua', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:20:00')),
('LS040', 'DH010', 'Pending', 'Pending', 'Thu ngan xac nhan order', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:25:00')),
('LS041', 'DH010', 'Pending', 'Preparing', 'Bep ra mon nhanh cho khach an tai quan', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '12:35:00')),
('LS042', 'DH010', 'Preparing', 'Paid', 'Khach thanh toan xong tai quay', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '13:15:00')),
('LS043', 'DH011', NULL, 'Pending', 'Don pickup buoi toi duoc tao tu app', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:00:00')),
('LS044', 'DH011', 'Pending', 'Pending', 'Thu ngan xac nhan gio lay', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:10:00')),
('LS045', 'DH011', 'Pending', 'Paid', 'Khach den lay va quet the thanh cong', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:48:00')),
('LS046', 'DH012', NULL, 'Pending', 'Khach VIP tao don giao hang lon', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:15:00')),
('LS047', 'DH012', 'Pending', 'Pending', 'Nhan vien goi xac nhan va ap ma VIP', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:25:00')),
('LS048', 'DH012', 'Pending', 'Preparing', 'Bep xu ly don lon', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '18:45:00')),
('LS049', 'DH012', 'Preparing', 'Ready', 'Tai xe da nhan don giao hang', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:10:00')),
('LS050', 'DH012', 'Ready', 'Paid', 'Thanh toan thanh cong qua ZaloPay', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:35:00')),
('LS051', 'DH013', NULL, 'Pending', 'Khach vua tao order tai quay bar', 'System', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 20 MINUTE)),
('LS052', 'DH013', 'Pending', 'Pending', 'Nhan vien tiep nhan order tai bar', 'NV005', DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 6 MINUTE)),
('LS053', 'DH014', NULL, 'Pending', 'Tao don theo booking buoi trua', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:18:00')),
('LS054', 'DH014', 'Pending', 'Pending', 'Host chot mon va gui bep', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:22:00')),
('LS055', 'DH014', 'Pending', 'Preparing', 'Bep xu ly mon trua', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '12:30:00')),
('LS056', 'DH014', 'Preparing', 'Paid', 'Khach thanh toan xong truoc 14h', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:42:00')),
('LS057', 'DH015', NULL, 'Pending', 'Tao don tiec VIP theo booking', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:20:00')),
('LS058', 'DH015', 'Pending', 'Pending', 'Quan ly ca xac nhan don VIP', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:25:00')),
('LS059', 'DH015', 'Pending', 'Preparing', 'Bep xu ly lau va mon nuong', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '19:40:00')),
('LS060', 'DH015', 'Preparing', 'Paid', 'Khach thanh toan sau bua toi', 'NV002', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:10:00')),
('LS061', 'DH016', NULL, 'Pending', 'Tao don pickup buoi toi', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:30:00')),
('LS062', 'DH016', 'Pending', 'Pending', 'Thu ngan xac nhan gio khach den lay', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:40:00')),
('LS063', 'DH016', 'Pending', 'Preparing', 'Bep hoan tat combo va trang mieng', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '17:55:00')),
('LS064', 'DH016', 'Preparing', 'Paid', 'Khach den lay dung gio va thanh toan', 'NV003', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:20:00')),
('LS065', 'DH017', NULL, 'Pending', 'Tao don giao hang noi thanh', 'System', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:35:00')),
('LS066', 'DH017', 'Pending', 'Pending', 'Nhan vien xac nhan giao hang toi', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:45:00')),
('LS067', 'DH017', 'Pending', 'Preparing', 'Bep dong goi mon giao hang', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:00:00')),
('LS068', 'DH017', 'Preparing', 'Paid', 'Tai xe giao thanh cong va thanh toan', 'NV005', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:50:00')),
('LS069', 'DH018', NULL, 'Pending', 'Don trua hom nay vua duoc tao', 'NV003', TIMESTAMP(CURRENT_DATE(), '11:35:00')),
('LS070', 'DH018', 'Pending', 'Pending', 'Thu ngan da xac nhan order ban trua', 'NV003', TIMESTAMP(CURRENT_DATE(), '11:40:00')),
('LS071', 'DH019', NULL, 'Pending', 'Tao don bua toi cao diem theo booking', 'NV005', TIMESTAMP(CURRENT_DATE(), '19:18:00')),
('LS072', 'DH019', 'Pending', 'Pending', 'Nhan vien da chot mon cho khach bua toi', 'NV005', TIMESTAMP(CURRENT_DATE(), '19:22:00')),
('LS073', 'DH019', 'Pending', 'Preparing', 'Bep hoan tat mon chinh va trang mieng', 'NV005', TIMESTAMP(CURRENT_DATE(), '19:40:00')),
('LS074', 'DH019', 'Preparing', 'Paid', 'Khach thanh toan xong trong khung cao diem toi', 'NV005', TIMESTAMP(CURRENT_DATE(), '20:48:00'));

INSERT INTO LichSuDiemTichLuy (MaGiaoDichDiem, MaKH, MaDonHang, LoaiBienDong, SoDiem, SoDiemTruoc, SoDiemSau, MoTa, NgayTao) VALUES
('LSD004', 'KH001', 'DH011', 'CONG', 120, 0, 120, 'Cong diem tu don pickup DH011', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 12 DAY), '18:50:00')),
('LSD005', 'KH001', 'DH001', 'CONG', 115, 120, 235, 'Cong diem tu don tai quan DH001', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:15:00')),
('LSD006', 'KH002', 'DH010', 'CONG', 150, 0, 150, 'Cong diem tu don tai quay DH010', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '13:20:00')),
('LSD007', 'KH006', 'DH012', 'CONG', 180, 0, 180, 'Cong diem tu don giao hang VIP DH012', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY), '19:40:00')),
('LSD008', 'KH006', 'DH007', 'CONG', 140, 180, 320, 'Cong diem tu don pickup DH007', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:50:00')),
('LSD009', 'KH007', NULL, 'DIEU_CHINH', 45, 0, 45, 'Admin dieu chinh diem khuyen khich khach hang than thiet', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '09:00:00')),
('LSD010', 'KH008', 'DH008', 'CONG', 95, 0, 95, 'Cong diem tu don giao hang DH008', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '19:50:00')),
('LSD011', 'KH009', NULL, 'CONG', 12, 0, 12, 'Tang diem cho khach doi tac moi dang ky', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '10:00:00')),
('LSD012', 'KH008', 'DH014', 'CONG', 180, 95, 275, 'Cong diem tu don buoi trua DH014', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '13:45:00')),
('LSD013', 'KH006', 'DH015', 'CONG', 250, 320, 570, 'Cong diem tu don tiec VIP DH015', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '21:15:00')),
('LSD014', 'KH007', 'DH016', 'CONG', 120, 45, 165, 'Cong diem tu don pickup DH016', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:25:00')),
('LSD015', 'KH009', 'DH017', 'CONG', 160, 12, 172, 'Cong diem tu don giao hang DH017', TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '19:55:00')),
('LSD016', 'KH008', 'DH019', 'CONG', 210, 275, 485, 'Cong diem tu don bua toi cao diem DH019', TIMESTAMP(CURRENT_DATE(), '20:55:00'));

UPDATE KhachHang
SET DiemTichLuy = CASE MaKH
    WHEN 'KH001' THEN 235
    WHEN 'KH002' THEN 165
    WHEN 'KH006' THEN 570
    WHEN 'KH007' THEN 165
    WHEN 'KH008' THEN 485
    WHEN 'KH009' THEN 172
    WHEN 'KH_TEST_01' THEN 14
    ELSE DiemTichLuy
END
WHERE MaKH IN ('KH001', 'KH002', 'KH006', 'KH007', 'KH008', 'KH009', 'KH_TEST_01');

UPDATE MaGiamGia
SET SoLanDaDung = CASE MaCode
    WHEN 'WELCOME10' THEN 1
    WHEN 'GIAM50K' THEN 1
    WHEN 'LOYAL25K' THEN 1
    WHEN 'FREESHIP20' THEN 1
    WHEN 'VIP25' THEN 1
    ELSE SoLanDaDung
END
WHERE MaCode IN ('WELCOME10', 'GIAM50K', 'LOYAL25K', 'FREESHIP20', 'VIP25');

INSERT INTO ThongBao (MaThongBao, MaND, TieuDe, NoiDung, LoaiThongBao, MaThamChieu, DaDoc, NgayTao) VALUES
('TB001', 'ND001', 'Co danh gia moi cho duyet', 'Danh gia DG002 dang o trang thai Pending va can admin xu ly.', 'DanhGia', 'DG002', FALSE, DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 50 MINUTE)),
('TB002', 'ND002', 'Booking sap den can goi lai', 'Booking DB002 sap den trong vong 2 gio va chua chot hoan tat.', 'DatBan', 'DB002', FALSE, DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 35 MINUTE)),
('TB003', 'ND003', 'Don pickup san sang tra khach', 'Don DH002 da san sang, can lien he khach den lay.', 'DonHang', 'DH002', FALSE, DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 20 MINUTE)),
('TB004', 'ND006', 'Ban B003 vua co order moi', 'Khach tai ban B003 vua gui them mon qua QR.', 'DonHang', 'DH004', FALSE, DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE)),
('TB005', 'ND007', 'Booking VIP da duoc xac nhan', 'Booking DB004 da giu phong VIP cho khach Le Minh Chau.', 'DatBan', 'DB004', TRUE, TIMESTAMP(CURRENT_DATE(), '09:30:00')),
('TB006', 'ND004', 'Diem tich luy vua duoc cap nhat', 'Ban vua nhan them diem tu don hang DH001.', 'HeThong', 'DH001', TRUE, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:20:00')),
('TB007', 'ND010', 'Don pickup thanh cong', 'Don DH007 da thanh toan thanh cong, diem tich luy da duoc cong.', 'DonHang', 'DH007', TRUE, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '11:55:00')),
('TB008', 'ND001', 'Can xu ly thanh toan that bai', 'Thanh toan TT006 cua don DH009 dang o trang thai Failed.', 'HeThong', 'TT006', FALSE, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '18:10:00')),
('TB009', 'ND003', 'Khach vua danh gia 5 sao', 'Danh gia DG004 da duoc khach gui cho don DH010.', 'DanhGia', 'DG004', TRUE, TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '14:05:00')),
('TB010', 'ND009', 'Bao cao cuoi ngay da san sang', 'Du lieu doanh thu va booking hom nay da san sang de doi chieu.', 'HeThong', 'REPORT_001', FALSE, TIMESTAMP(CURRENT_DATE(), '22:00:00'));

-- ============================================================
-- DIEU CHINH DU LIEU MAU SAU KHI INSERT
-- Gom cac lenh UPDATE xuong cuoi de de theo doi khi chay seed.
-- ============================================================

-- Tai khoan khach test moi
UPDATE NguoiDung
SET MatKhau = '$2b$10$xSUYzc6LpQ0g/8eC1AZH3OpBGSWp4qZQNfJZfA.0e9WsHKQeBdcbi'
WHERE LOWER(Email) = LOWER('khach1@gmail.com');

-- Dong bo bo seed goc ve moc thoi gian co y nghia hon cho viec test.
UPDATE DatBan
SET NgayDat = DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY),
    GioDat = '18:00:00',
    GioKetThuc = '20:00:00',
    TrangThai = 'Completed',
    NgayTao = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '14:00:00'),
    NgayCapNhat = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:05:00')
WHERE MaDatBan = 'DB001';

UPDATE DonHang
SET NgayTao = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '18:15:00'),
    NgayCapNhat = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:10:00')
WHERE MaDonHang = 'DH001';

UPDATE HoaDon
SET NgayXuat = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:10:00')
WHERE MaHoaDon = 'HD001';

UPDATE ThanhToan
SET ThoiGian = TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), '20:12:00')
WHERE MaThanhToan = 'TT001';

UPDATE LichSuDiemTichLuy
SET SoDiemTruoc = 150,
    SoDiemSau = 165,
    MoTa = 'Cong diem tu don hang pickup DH002',
    NgayTao = TIMESTAMP(CURRENT_DATE(), '18:45:00')
WHERE MaGiaoDichDiem = 'LSD002';

UPDATE Ban SET TrangThai = 'Available' WHERE MaBan IN ('B001', 'B004', 'B008', 'B010', 'B016', 'B018', 'B020', 'B022', 'B025', 'B028', 'B030', 'B032', 'B034', 'B036', 'B038', 'B041', 'B042', 'B045', 'B047', 'B049', 'B051', 'B053', 'B055', 'B057', 'B059');
UPDATE Ban SET TrangThai = 'Reserved' WHERE MaBan IN ('B002', 'B005', 'B009', 'B012', 'B014', 'B015', 'B019', 'B024', 'B027', 'B031', 'B035', 'B040', 'B044', 'B048', 'B052', 'B056', 'B060');
UPDATE Ban SET TrangThai = 'Occupied' WHERE MaBan IN ('B003', 'B011', 'B013', 'B017', 'B021', 'B026', 'B029', 'B033', 'B039', 'B043', 'B046', 'B050', 'B054', 'B058', 'B063');
UPDATE Ban SET TrangThai = 'Maintenance' WHERE MaBan IN ('B007', 'B023', 'B037', 'B061');

-- ============================================================
-- ADD ChiTietMonAn column to DatBan for menu items in booking
-- ============================================================
ALTER TABLE DatBan ADD COLUMN ChiTietMonAn JSON AFTER KhuVucUuTien;