DROP DATABASE IF EXISTS QuanNhaHang;

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
    LoaiDon     ENUM('TAI_QUAN','MANG_VE_PICKUP','MANG_VE_GIAO_HANG','TAI_BAN') NOT NULL DEFAULT 'TAI_QUAN',
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
('DB001', 'KH001', 'B004', 'NV002', 'Tran Van Khach', '0912345678', 'khach1@gmail.com', '2026-08-10', '18:00:00', '20:00:00', 4, 'Sinh nhat, can banh kem', 'PHONG_VIP', 'Can sap xep ban dep va uu tien check-in dung gio', 'Confirmed', NOW(), NOW());

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, GioLayHang, GioGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu, NgayTao, NgayCapNhat) VALUES
('DH001', 'KH001', 'B004', NULL, 'NV002', 'DB001', 'TAI_QUAN', NULL, NULL, NULL, 0, 215000, 'Paid', 'DatBan', NULL, NOW(), NOW());

INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai, NgayTao) VALUES
('CT001', 'DH001', 'M001', 2, 35000, 70000, NULL, 'Done', NOW()),
('CT002', 'DH001', 'M004', 1, 75000, 75000, NULL, 'Done', NOW()),
('CT003', 'DH001', 'M008', 2, 25000, 50000, NULL, 'Done', NOW()),
('CT004', 'DH001', 'M006', 1, 30000, 30000, NULL, 'Done', NOW());

INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, GioLayHang, GioGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu, NgayTao, NgayCapNhat) VALUES
('DH002', 'KH002', NULL, NULL, 'NV003', NULL, 'MANG_VE_PICKUP', NULL, '18:30:00', NULL, 0, 140000, 'Ready', 'Online', 'Khach se den lay sau gio tan lam', NOW(), NOW()),
('DH003', 'KH_TEST_01', NULL, NULL, 'NV002', NULL, 'MANG_VE_GIAO_HANG', '123 Nguyen Hue, Q1, TP.HCM', NULL, '19:15:00', 15000, 180000, 'Confirmed', 'Online', 'Giao tan noi, goi truoc khi giao', NOW(), NOW());

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
('LS007', 'DH002', NULL, 'Pending', 'Tao don mang ve pickup', 'System', NOW()),
('LS008', 'DH002', 'Pending', 'Confirmed', 'Da goi xac nhan khach den lay', 'NV003', NOW()),
('LS009', 'DH002', 'Confirmed', 'Preparing', 'Bep tiep nhan don', 'NV003', NOW()),
('LS010', 'DH002', 'Preparing', 'Ready', 'San sang tra khach tai quay', 'NV003', NOW()),
('LS011', 'DH003', NULL, 'Pending', 'Tao don giao hang', 'System', NOW()),
('LS012', 'DH003', 'Pending', 'Confirmed', 'Xac nhan dia chi giao hang', 'NV002', NOW());

INSERT INTO LichSuDiemTichLuy (MaGiaoDichDiem, MaKH, MaDonHang, LoaiBienDong, SoDiem, SoDiemTruoc, SoDiemSau, MoTa, NgayTao) VALUES
('LSD002', 'KH002', 'DH002', 'CONG', 15, 65, 80, 'Cong diem tu don hang pickup DH002', NOW()),
('LSD003', 'KH_TEST_01', 'DH003', 'CONG', 14, 0, 14, 'Tam cong diem cho don giao hang DH003', NOW());

-- Tai khoan khach test moi
UPDATE NguoiDung
SET MatKhau = '$2b$10$xSUYzc6LpQ0g/8eC1AZH3OpBGSWp4qZQNfJZfA.0e9WsHKQeBdcbi'
WHERE LOWER(Email) = LOWER('khach1@gmail.com');