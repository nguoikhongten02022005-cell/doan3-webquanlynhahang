DROP DATABASE QuanNhaHang;

CREATE DATABASE IF NOT EXISTS QuanNhaHang
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE QuanNhaHang;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. NGUOI DUNG
-- ============================================================
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

-- ============================================================
-- 2. NHAN VIEN
-- ============================================================
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

-- ============================================================
-- 3. KHACH HANG
-- ============================================================
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

-- ============================================================
-- 4. BAN
-- ============================================================
CREATE TABLE IF NOT EXISTS Ban (
    MaBan       VARCHAR(50) PRIMARY KEY,
    SoBan       INT NOT NULL,
    SoChoNgoi   INT NOT NULL,
    ViTri       VARCHAR(100),
    TrangThai   ENUM('Available','Occupied','Reserved','Maintenance') NOT NULL DEFAULT 'Available',
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. QR CODE
-- ============================================================
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

-- ============================================================
-- 6. DANH MUC
-- ============================================================
CREATE TABLE IF NOT EXISTS DanhMuc (
    MaDanhMuc   VARCHAR(50) PRIMARY KEY,
    TenDanhMuc  VARCHAR(100) NOT NULL,
    MoTa        VARCHAR(255),
    ThuTu       INT NOT NULL DEFAULT 0,
    TrangThai   ENUM('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. THUC DON
-- ============================================================
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
    MaDatBan    VARCHAR(50) PRIMARY KEY,
    MaKH        VARCHAR(50),
    MaBan       VARCHAR(50),
    MaNV        VARCHAR(50),
    NgayDat     DATE NOT NULL,
    GioDat      TIME NOT NULL,
    GioKetThuc  TIME,
    SoNguoi     INT NOT NULL,
    GhiChu      VARCHAR(500),
    TrangThai   ENUM('Pending','Confirmed','Cancelled','NoShow','Completed') NOT NULL DEFAULT 'Pending',
    NgayTao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    MaNV        VARCHAR(50),
    MaDatBan    VARCHAR(50),
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
    MaDanhGia   VARCHAR(50) PRIMARY KEY,
    MaKH        VARCHAR(50) NOT NULL,
    MaDonHang   VARCHAR(50) NOT NULL,
    SoSao       TINYINT NOT NULL,
    NoiDung     VARCHAR(500),
    PhanHoi     VARCHAR(500),
    NgayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    TrangThai   ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
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
-- 16. THONG BAO
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
CREATE INDEX IDX_NguoiDung_Email ON NguoiDung(Email);
CREATE INDEX IDX_KhachHang_SDT ON KhachHang(SDT);
CREATE INDEX IDX_KhachHang_MaND ON KhachHang(MaND);
CREATE INDEX IDX_NhanVien_MaND ON NhanVien(MaND);
CREATE INDEX IDX_Ban_TrangThai ON Ban(TrangThai);
CREATE INDEX IDX_QRCode_MaBan ON QRCode(MaBan);
CREATE INDEX IDX_DatBan_NgayDat ON DatBan(NgayDat);
CREATE INDEX IDX_DatBan_TrangThai ON DatBan(TrangThai);
CREATE INDEX IDX_DatBan_MaKH ON DatBan(MaKH);
CREATE INDEX IDX_ThucDon_DanhMuc ON ThucDon(MaDanhMuc);
CREATE INDEX IDX_ThucDon_TrangThai ON ThucDon(TrangThai);
CREATE INDEX IDX_DonHang_NgayTao ON DonHang(NgayTao);
CREATE INDEX IDX_DonHang_TrangThai ON DonHang(TrangThai);
CREATE INDEX IDX_DonHang_MaBan ON DonHang(MaBan);
CREATE INDEX IDX_DonHang_MaKH ON DonHang(MaKH);
CREATE INDEX IDX_ChiTiet_DonHang ON ChiTietDonHang(MaDonHang);
CREATE INDEX IDX_ChiTiet_TrangThai ON ChiTietDonHang(TrangThai);
CREATE INDEX IDX_HoaDon_DonHang ON HoaDon(MaDonHang);
CREATE INDEX IDX_ThanhToan_HoaDon ON ThanhToan(MaHoaDon);
CREATE INDEX IDX_ThanhToan_TrangThai ON ThanhToan(TrangThai);
CREATE INDEX IDX_DanhGia_TrangThai ON DanhGia(TrangThai);
CREATE INDEX IDX_LichSu_DonHang ON LichSuDonHang(MaDonHang);
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
JOIN ThanhToan tt ON tt.MaHoaDon = hd.MaHoaDon AND tt.TrangThai = 'Success'
GROUP BY DATE(hd.NgayXuat);

CREATE OR REPLACE VIEW V_MonBanChay AS
SELECT
    td.MaMon,
    td.TenMon,
    dm.TenDanhMuc,
    SUM(ct.SoLuong) AS TongSoLuong,
    SUM(ct.ThanhTien) AS TongDoanhThu
FROM ChiTietDonHang ct
JOIN ThucDon td ON td.MaMon = ct.MaMon
JOIN DanhMuc dm ON dm.MaDanhMuc = td.MaDanhMuc
JOIN DonHang dh ON dh.MaDonHang = ct.MaDonHang AND dh.TrangThai <> 'Cancelled'
GROUP BY td.MaMon, td.TenMon, dm.TenDanhMuc
ORDER BY TongSoLuong DESC;

CREATE OR REPLACE VIEW V_TinhTrangBan AS
SELECT
    b.MaBan,
    b.SoBan,
    b.SoChoNgoi,
    b.ViTri,
    b.TrangThai,
    dh.MaDonHang,
    dh.TrangThai AS TrangThaiDon
FROM Ban b
LEFT JOIN DonHang dh
    ON dh.MaBan = b.MaBan
   AND dh.TrangThai NOT IN ('Paid','Cancelled');

-- ============================================================
-- DU LIEU MAU
-- ============================================================
INSERT INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro) VALUES
('ND001', 'Admin System', 'admin@nhahang.com', '$2y$10$hashed_admin', 'Admin'),
('ND002', 'Nguyen Van An', 'an.nv@nhahang.com', '$2y$10$hashed_nv001', 'NhanVien'),
('ND003', 'Le Thi Bich', 'bich.lt@nhahang.com', '$2y$10$hashed_nv002', 'NhanVien'),
('ND004', 'Tran Van Khach', 'khach1@gmail.com', '$2y$10$hashed_kh001', 'KhachHang'),
('ND005', 'Pham Thi Mai', 'mai.pt@gmail.com', '$2y$10$hashed_kh002', 'KhachHang');

INSERT INTO NhanVien (MaNV, MaND, HoTen, GioiTinh, SDT, ChucVu, NgayVaoLam) VALUES
('NV001', 'ND001', 'Admin System', 'Nam', '0901111111', 'Admin', '2024-01-01'),
('NV002', 'ND002', 'Nguyen Van An', 'Nam', '0901234567', 'QuanLy', '2024-06-01'),
('NV003', 'ND003', 'Le Thi Bich', 'Nu', '0907654321', 'ThuNgan', '2025-01-15');

INSERT INTO KhachHang (MaKH, MaND, TenKH, SDT, DiemTichLuy) VALUES
('KH001', 'ND004', 'Tran Van Khach', '0912345678', 150),
('KH002', 'ND005', 'Pham Thi Mai', '0987654321', 80),
('KH003', NULL, 'Khach Vang Lai', NULL, 0);

INSERT INTO DanhMuc (MaDanhMuc, TenDanhMuc, ThuTu) VALUES
('DM001', 'Khai Vi', 1),
('DM002', 'Mon Chinh', 2),
('DM003', 'Trang Mieng', 3),
('DM004', 'Do Uong', 4),
('DM005', 'Combo', 5);

INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, Gia, ThoiGianChuanBi) VALUES
('M001', 'DM001', 'Goi Cuon Tom Thit', 35000, 10),
('M002', 'DM001', 'Cha Gio Hai San', 45000, 15),
('M003', 'DM002', 'Com Rang Duong Chau', 55000, 20),
('M004', 'DM002', 'Pho Bo Dac Biet', 75000, 25),
('M005', 'DM002', 'Bun Bo Hue', 65000, 25),
('M006', 'DM003', 'Kem Dau Tay', 30000, 5),
('M007', 'DM003', 'Banh Flan Caramel', 25000, 5),
('M008', 'DM004', 'Ca Phe Sua Da', 25000, 5),
('M009', 'DM004', 'Tra Dao Cam Sa', 35000, 5),
('M010', 'DM004', 'Nuoc Ep Cam', 30000, 5);

INSERT INTO Ban (MaBan, SoBan, SoChoNgoi, ViTri) VALUES
('B001', 1, 2, 'Tang 1 - Cua so'),
('B002', 2, 4, 'Tang 1 - Khu A'),
('B003', 3, 4, 'Tang 1 - Khu B'),
('B004', 4, 6, 'Tang 2 - View dep'),
('B005', 5, 8, 'Tang 2 - Phong rieng'),
('B006', 6, 2, 'Ngoai troi');

INSERT INTO QRCode (MaQR, MaBan, DuongDanQR, NgayHetHan) VALUES
('QR001', 'B001', 'https://nhahang.com/order?ban=B001', '2027-12-31 23:59:59'),
('QR002', 'B002', 'https://nhahang.com/order?ban=B002', '2027-12-31 23:59:59'),
('QR003', 'B003', 'https://nhahang.com/order?ban=B003', '2027-12-31 23:59:59'),
('QR004', 'B004', 'https://nhahang.com/order?ban=B004', '2027-12-31 23:59:59'),
('QR005', 'B005', 'https://nhahang.com/order?ban=B005', '2027-12-31 23:59:59'),
('QR006', 'B006', 'https://nhahang.com/order?ban=B006', '2027-12-31 23:59:59');

INSERT INTO MaGiamGia (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu, NgayBatDau, NgayKetThuc, SoLanToiDa) VALUES
('WELCOME10', 'Chao mung KH moi', 10, 'PhanTram', 50000, 100000, '2026-01-01', '2026-12-31', 1),
('SUMMER20', 'Khuyen mai He', 20, 'PhanTram', 100000, 200000, '2026-06-01', '2026-08-31', NULL),
('GIAM50K', 'Giam thang 50k', 50000, 'SoTien', NULL, 300000, '2026-01-01', '2026-12-31', 500);

INSERT INTO DatBan (MaDatBan, MaKH, MaBan, MaNV, NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, TrangThai) VALUES
('DB001', 'KH001', 'B004', 'NV002', '2026-08-10', '18:00:00', '20:00:00', 4, 'Sinh nhat, can banh kem', 'Confirmed');

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaNV, MaDatBan, TongTien, TrangThai, NguonTao) VALUES
('DH001', 'KH001', 'B004', 'NV002', 'DB001', 215000, 'Paid', 'DatBan');

INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, TrangThai) VALUES
('CT001', 'DH001', 'M001', 2, 35000, 70000, 'Done'),
('CT002', 'DH001', 'M004', 1, 75000, 75000, 'Done'),
('CT003', 'DH001', 'M008', 2, 25000, 50000, 'Done'),
('CT004', 'DH001', 'M006', 1, 20000, 20000, 'Done');

INSERT INTO HoaDon (MaHoaDon, MaDonHang, MaKH, MaCode, TongTien, GiamGia, ThueSuat, TienThue, ThanhTien) VALUES
('HD001', 'DH001', 'KH001', 'WELCOME10', 215000, 21500, 10, 19350, 212850);

INSERT INTO ThanhToan (MaThanhToan, MaHoaDon, PhuongThuc, SoTien, TrangThai) VALUES
('TT001', 'HD001', 'ChuyenKhoan', 212850, 'Success');

INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung) VALUES
('DG001', 'KH001', 'DH001', 5, 'Mon ngon, phuc vu nhiet tinh, khong gian dep!');

INSERT INTO LichSuDonHang (MaLichSu, MaDonHang, TrangThaiCu, TrangThaiMoi, NguoiThucHien) VALUES
('LS001', 'DH001', NULL, 'Pending', 'System'),
('LS002', 'DH001', 'Pending', 'Confirmed', 'NV002'),
('LS003', 'DH001', 'Confirmed', 'Preparing', 'NV002'),
('LS004', 'DH001', 'Preparing', 'Ready', 'System'),
('LS005', 'DH001', 'Ready', 'Served', 'NV002'),
('LS006', 'DH001', 'Served', 'Paid', 'NV003');
