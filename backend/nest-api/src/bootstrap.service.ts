import { Injectable, Logger } from '@nestjs/common';
import { MySqlService } from './mysql.service';

@Injectable()
export class BootstrapService {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly mysql: MySqlService) {}

  private docBienMoiTruongBatBuoc(tenBien: string) {
    const giaTri = process.env[tenBien]?.trim();

    if (!giaTri) {
      throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
    }

    return giaTri;
  }

  async khoiTaoNeuCan() {
    if (this.docBienMoiTruongBatBuoc('DB_AUTO_INIT').toLowerCase() !== 'true') {
      return;
    }

    await this.taoSchema();
    await this.seedCoBan();
    this.logger.log('Da khoi tao schema/seed MySQL cho NestJS.');
  }

  private async taoSchema() {
    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS NguoiDung (
        MaND VARCHAR(50) PRIMARY KEY,
        TenND VARCHAR(100) NOT NULL,
        Email VARCHAR(100) NOT NULL UNIQUE,
        MatKhau VARCHAR(255) NOT NULL,
        VaiTro ENUM('Admin','NhanVien','KhachHang') NOT NULL DEFAULT 'KhachHang',
        TrangThai ENUM('Active','Inactive','Banned') NOT NULL DEFAULT 'Active',
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS KhachHang (
        MaKH VARCHAR(50) PRIMARY KEY,
        MaND VARCHAR(50) UNIQUE,
        TenKH VARCHAR(100) NOT NULL,
        SDT VARCHAR(20) UNIQUE,
        DiaChi VARCHAR(255),
        DiemTichLuy INT NOT NULL DEFAULT 0,
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_KhachHang_NguoiDung FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS Ban (
        MaBan VARCHAR(50) PRIMARY KEY,
        TenBan VARCHAR(50),
        KhuVuc VARCHAR(50),
        SoBan INT NOT NULL,
        SoChoNgoi INT NOT NULL,
        ViTri VARCHAR(100),
        GhiChu VARCHAR(255),
        TrangThai ENUM('Available','Occupied','Reserved','Maintenance') NOT NULL DEFAULT 'Available',
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS ThucDon (
        MaMon VARCHAR(50) PRIMARY KEY,
        MaDanhMuc VARCHAR(50),
        TenMon VARCHAR(150) NOT NULL,
        MoTa VARCHAR(500),
        Gia DECIMAL(15,2) NOT NULL,
        HinhAnh VARCHAR(500),
        ThoiGianChuanBi INT DEFAULT 0,
        TrangThai ENUM('Available','Unavailable','Deleted') NOT NULL DEFAULT 'Available',
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS MaGiamGia (
        MaCode VARCHAR(50) PRIMARY KEY,
        TenCode VARCHAR(100) NOT NULL,
        GiaTri DECIMAL(10,2) NOT NULL,
        LoaiGiam ENUM('PhanTram','SoTien') NOT NULL,
        GiaTriToiDa DECIMAL(15,2),
        DonHangToiThieu DECIMAL(15,2) DEFAULT 0,
        NgayBatDau DATE NOT NULL,
        NgayKetThuc DATE NOT NULL,
        SoLanToiDa INT DEFAULT NULL,
        SoLanDaDung INT NOT NULL DEFAULT 0,
        TrangThai ENUM('Active','Inactive','HetHan') NOT NULL DEFAULT 'Active'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS DatBan (
        MaDatBan VARCHAR(50) PRIMARY KEY,
        MaKH VARCHAR(50),
        MaBan VARCHAR(50),
        MaNV VARCHAR(50),
        TenKhachDatBan VARCHAR(100),
        SDTDatBan VARCHAR(20),
        EmailDatBan VARCHAR(100),
        NgayDat DATE NOT NULL,
        GioDat TIME NOT NULL,
        GioKetThuc TIME,
        SoNguoi INT NOT NULL,
        GhiChu VARCHAR(500),
        KhuVucUuTien VARCHAR(50),
        GhiChuNoiBo VARCHAR(500),
        TrangThai ENUM('Pending','Confirmed','Cancelled','NoShow','Completed') NOT NULL DEFAULT 'Pending',
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT FK_DatBan_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL,
        CONSTRAINT FK_DatBan_Ban FOREIGN KEY (MaBan) REFERENCES Ban(MaBan) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.mysql.thucThi('ALTER TABLE DatBan ADD COLUMN IF NOT EXISTS TenKhachDatBan VARCHAR(100) NULL');
    await this.mysql.thucThi('ALTER TABLE DatBan ADD COLUMN IF NOT EXISTS SDTDatBan VARCHAR(20) NULL');
    await this.mysql.thucThi('ALTER TABLE DatBan ADD COLUMN IF NOT EXISTS EmailDatBan VARCHAR(100) NULL');
    await this.mysql.thucThi('ALTER TABLE DatBan ADD COLUMN IF NOT EXISTS KhuVucUuTien VARCHAR(50) NULL');
    await this.mysql.thucThi('ALTER TABLE DatBan ADD COLUMN IF NOT EXISTS GhiChuNoiBo VARCHAR(500) NULL');

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS DonHang (
        MaDonHang VARCHAR(50) PRIMARY KEY,
        MaKH VARCHAR(50),
        MaBan VARCHAR(50),
        MaBanAn VARCHAR(20),
        MaNV VARCHAR(50),
        MaDatBan VARCHAR(50),
        LoaiDon ENUM('TAI_QUAN','MANG_VE_PICKUP','MANG_VE_GIAO_HANG','TAI_BAN') NOT NULL DEFAULT 'TAI_QUAN',
        DiaChiGiao VARCHAR(255),
        PhiShip DECIMAL(10,2) NOT NULL DEFAULT 0,
        TongTien DECIMAL(15,2) NOT NULL DEFAULT 0,
        TrangThai ENUM('Pending','Confirmed','Preparing','Ready','Served','Paid','Cancelled') NOT NULL DEFAULT 'Pending',
        NguonTao ENUM('TaiQuay','QRCode','DatBan','Online') NOT NULL DEFAULT 'TaiQuay',
        GhiChu VARCHAR(500),
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT FK_DonHang_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL,
        CONSTRAINT FK_DonHang_Ban FOREIGN KEY (MaBan) REFERENCES Ban(MaBan) ON DELETE SET NULL,
        CONSTRAINT FK_DonHang_DatBan FOREIGN KEY (MaDatBan) REFERENCES DatBan(MaDatBan) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS ChiTietDonHang (
        MaChiTiet VARCHAR(50) PRIMARY KEY,
        MaDonHang VARCHAR(50) NOT NULL,
        MaMon VARCHAR(50) NOT NULL,
        SoLuong INT NOT NULL,
        DonGia DECIMAL(15,2) NOT NULL,
        ThanhTien DECIMAL(15,2) NOT NULL,
        GhiChu VARCHAR(255),
        TrangThai ENUM('Pending','Preparing','Done','Cancelled') NOT NULL DEFAULT 'Pending',
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_ChiTietDonHang_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE,
        CONSTRAINT FK_ChiTietDonHang_ThucDon FOREIGN KEY (MaMon) REFERENCES ThucDon(MaMon) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

      await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS DanhGia (
        MaDanhGia VARCHAR(50) PRIMARY KEY,
        MaKH VARCHAR(50) NOT NULL,
        MaDonHang VARCHAR(50) NOT NULL,
        SoSao TINYINT NOT NULL,
        NoiDung VARCHAR(500),
        PhanHoi VARCHAR(500),
        HinhAnh LONGTEXT,
        NgayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        TrangThai ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
        CONSTRAINT FK_DanhGia_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE CASCADE,
        CONSTRAINT FK_DanhGia_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.mysql.thucThi('ALTER TABLE DanhGia ADD COLUMN IF NOT EXISTS HinhAnh LONGTEXT NULL');

    await this.mysql.thucThi(`
      CREATE TABLE IF NOT EXISTS LichSuDiemTichLuy (
        MaGiaoDichDiem VARCHAR(50) PRIMARY KEY,
        MaKH VARCHAR(50) NOT NULL,
        MaDonHang VARCHAR(50),
        LoaiBienDong ENUM('CONG','TRU','DIEU_CHINH') NOT NULL DEFAULT 'CONG',
        SoDiem INT NOT NULL,
        SoDiemTruoc INT NOT NULL DEFAULT 0,
        SoDiemSau INT NOT NULL DEFAULT 0,
        MoTa VARCHAR(255),
        NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_LichSuDiemTichLuy_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE CASCADE,
        CONSTRAINT FK_LichSuDiemTichLuy_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  private async seedCoBan() {
    await this.mysql.thucThi(
      `INSERT IGNORE INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro, TrangThai) VALUES
      ('ND_ADMIN','Quan tri vien','admin@nhahang.com','$2b$10$sj0J9gfrWnGI/waaxmgUg.P3TaNi9AbmTFxVCTnD6iXcyfgYt8M..','Admin','Active'),
      ('ND_NV01','Nhan vien 1','an.nv@nhahang.com','$2b$10$ad53VsMp95hfdCxaBkqyXuLPQlB2qvcPR1L9cKIKVdFpN3aqdQgtq','NhanVien','Active'),
      ('ND_KH01','Khach hang 1','khach@nhahang.com','$2b$10$tMmFOT9DU8aIU3RQEhU30ONQXz6HFN86HljvcKRkmAFBu4.aepIzC','KhachHang','Active')`,
    );

    await this.mysql.thucThi(
      `INSERT IGNORE INTO KhachHang (MaKH, MaND, TenKH, SDT, DiaChi, DiemTichLuy) VALUES
      ('KH001','ND_KH01','Khach hang 1','0900000001','Ha Noi',0)`
    );

    await this.mysql.thucThi(
      `INSERT IGNORE INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai) VALUES
      ('B01','Ban 1','Trong nhà',1,4,'Trong nhà','Gan cua so','Available'),
      ('B02','Ban 2','Trong nhà',2,4,'Trong nhà','Trung tam','Occupied'),
      ('B03','Ban 3','Ngoài sân',3,6,'Ngoài sân','Thoang','Reserved')`
    );

    await this.mysql.thucThi(
      `INSERT IGNORE INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai) VALUES
      ('MON01',NULL,'Pho bo','Pho bo tai lan',65000,'',12,'Available'),
      ('MON02',NULL,'Com suon','Com suon nuong mat ong',72000,'',15,'Available'),
      ('MON03',NULL,'Tra dao','Tra dao cam sa',35000,'',5,'Available')`
    );

    await this.mysql.thucThi(
      `INSERT IGNORE INTO MaGiamGia (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu, NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai) VALUES
      ('GIAM10','Giam 10 phan tram',10,'PhanTram',50000,100000,'2025-01-01','2030-12-31',NULL,0,'Active'),
      ('SHIPFREE','Giam 30000',30000,'SoTien',30000,150000,'2025-01-01','2030-12-31',NULL,0,'Active')`
    );
  }
}
