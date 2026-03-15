-- Khoi tao CSDL MySQL cho du an quan ly nha hang.
-- Toan bo bang va cot duoc dat ten bang tieng Viet khong dau de phu hop voi API C#.
-- Uu tien MySQL 8.0+ de dung utf8mb4_0900_ai_ci.
-- Neu dang dung MySQL 5.7, doi utf8mb4_0900_ai_ci thanh utf8mb4_unicode_ci truoc khi chay.

CREATE DATABASE IF NOT EXISTS doan3quanlynhahang
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE doan3quanlynhahang;

CREATE TABLE IF NOT EXISTS nguoi_dung (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ho_ten VARCHAR(150) NOT NULL,
  ten_dang_nhap VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  mat_khau_ma_hoa VARCHAR(255) NOT NULL,
  vai_tro ENUM('customer', 'staff', 'admin') NOT NULL,
  trang_thai ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  so_dien_thoai VARCHAR(20) NULL,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nguoi_dung_ten_dang_nhap (ten_dang_nhap),
  UNIQUE KEY uq_nguoi_dung_email (email),
  KEY idx_nguoi_dung_vai_tro_trang_thai (vai_tro, trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS token_lam_moi (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nguoi_dung_id INT UNSIGNED NOT NULL,
  ma_bam_token VARCHAR(255) NOT NULL,
  het_han_luc DATETIME NOT NULL,
  thu_hoi_luc DATETIME NULL,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_lam_moi_ma_bam_token (ma_bam_token),
  KEY idx_token_lam_moi_nguoi_dung_het_han (nguoi_dung_id, het_han_luc),
  CONSTRAINT fk_token_lam_moi_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS khu_vuc_ban (
  id VARCHAR(40) NOT NULL,
  ten_khu_vuc VARCHAR(100) NOT NULL,
  mo_ta VARCHAR(255) NOT NULL DEFAULT '',
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS ban_an (
  id VARCHAR(50) NOT NULL,
  ma_ban VARCHAR(30) NOT NULL,
  ten_ban VARCHAR(100) NOT NULL,
  khu_vuc_id VARCHAR(40) NOT NULL,
  suc_chua INT UNSIGNED NOT NULL,
  trang_thai ENUM('AVAILABLE', 'HELD', 'OCCUPIED', 'DIRTY') NOT NULL DEFAULT 'AVAILABLE',
  dat_ban_hien_tai_id INT UNSIGNED NULL,
  ma_dat_ban_hien_tai VARCHAR(30) NOT NULL DEFAULT '',
  dang_su_dung_luc DATETIME NULL,
  giai_phong_luc DATETIME NULL,
  ghi_chu VARCHAR(255) NOT NULL DEFAULT '',
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ban_an_ma_ban (ma_ban),
  KEY idx_ban_an_khu_vuc_trang_thai (khu_vuc_id, trang_thai),
  CONSTRAINT fk_ban_an_khu_vuc FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc_ban(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS dat_ban (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma_dat_ban VARCHAR(30) NOT NULL,
  so_khach INT UNSIGNED NOT NULL,
  ngay_dat DATE NOT NULL,
  gio_dat TIME NOT NULL,
  khu_vuc_uu_tien VARCHAR(40) NOT NULL DEFAULT 'KHONG_UU_TIEN',
  ghi_chu VARCHAR(500) NOT NULL DEFAULT '',
  ten_khach VARCHAR(150) NOT NULL,
  so_dien_thoai_khach VARCHAR(20) NOT NULL,
  email_khach VARCHAR(150) NOT NULL DEFAULT '',
  trang_thai ENUM('YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN', 'DA_GHI_NHAN', 'DA_CHECK_IN', 'DA_XEP_BAN', 'TU_CHOI_HET_CHO', 'DA_HUY', 'KHONG_DEN', 'DA_HOAN_THANH') NOT NULL DEFAULT 'YEU_CAU_DAT_BAN',
  nguon_tao VARCHAR(50) NOT NULL DEFAULT 'web',
  email_nguoi_dung VARCHAR(150) NULL,
  dip_dac_biet VARCHAR(100) NOT NULL DEFAULT '',
  kenh_xac_nhan JSON NULL,
  ghi_chu_noi_bo VARCHAR(500) NOT NULL DEFAULT '',
  check_in_luc DATETIME NULL,
  xep_ban_luc DATETIME NULL,
  hoan_thanh_luc DATETIME NULL,
  huy_luc DATETIME NULL,
  vang_mat_luc DATETIME NULL,
  tao_boi VARCHAR(100) NOT NULL DEFAULT '',
  nguoi_dung_id INT UNSIGNED NULL,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dat_ban_ma_dat_ban (ma_dat_ban),
  KEY idx_dat_ban_trang_thai_ngay_gio (trang_thai, ngay_dat, gio_dat),
  KEY idx_dat_ban_nguoi_dung_id (nguoi_dung_id),
  CONSTRAINT fk_dat_ban_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS chi_tiet_dat_ban (
  dat_ban_id INT UNSIGNED NOT NULL,
  ban_an_id VARCHAR(50) NOT NULL,
  gan_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (dat_ban_id, ban_an_id),
  KEY idx_chi_tiet_dat_ban_ban_an_id (ban_an_id),
  CONSTRAINT fk_chi_tiet_dat_ban_dat_ban FOREIGN KEY (dat_ban_id) REFERENCES dat_ban(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_chi_tiet_dat_ban_ban_an FOREIGN KEY (ban_an_id) REFERENCES ban_an(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS mon_an (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ten_mon VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  mo_ta VARCHAR(500) NOT NULL,
  gia DECIMAL(10, 2) NOT NULL,
  danh_muc VARCHAR(100) NOT NULL,
  nhan_mon VARCHAR(60) NOT NULL DEFAULT 'Moi',
  tone_mau VARCHAR(40) NOT NULL DEFAULT 'tone-amber',
  hinh_anh VARCHAR(255) NOT NULL DEFAULT '',
  dang_kinh_doanh TINYINT(1) NOT NULL DEFAULT 1,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_mon_an_slug (slug),
  KEY idx_mon_an_danh_muc_kinh_doanh (danh_muc, dang_kinh_doanh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS ma_giam_gia (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma_giam VARCHAR(50) NOT NULL,
  ten_ma_giam VARCHAR(150) NOT NULL,
  mo_ta VARCHAR(255) NOT NULL DEFAULT '',
  loai_giam ENUM('FIXED', 'PERCENTAGE') NOT NULL DEFAULT 'FIXED',
  gia_tri_giam DECIMAL(10, 2) NOT NULL,
  don_toi_thieu DECIMAL(10, 2) NOT NULL DEFAULT 0,
  giam_toi_da DECIMAL(10, 2) NULL,
  bat_dau_luc DATETIME NULL,
  ket_thuc_luc DATETIME NULL,
  gioi_han_su_dung INT UNSIGNED NULL,
  da_su_dung INT UNSIGNED NOT NULL DEFAULT 0,
  dang_hoat_dong TINYINT(1) NOT NULL DEFAULT 1,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ma_giam_gia_ma_giam (ma_giam),
  KEY idx_ma_giam_gia_hoat_dong_thoi_gian (dang_hoat_dong, bat_dau_luc, ket_thuc_luc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS don_hang (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma_don_hang VARCHAR(30) NOT NULL,
  tam_tinh DECIMAL(10, 2) NOT NULL,
  phi_dich_vu DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tien_giam DECIMAL(10, 2) NOT NULL DEFAULT 0,
  ma_giam_gia_ap_dung VARCHAR(50) NOT NULL DEFAULT '',
  thanh_tien DECIMAL(10, 2) NOT NULL,
  dat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trang_thai ENUM('MOI_TAO', 'DA_XAC_NHAN', 'DANG_CHUAN_BI', 'DANG_PHUC_VU', 'DA_HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'MOI_TAO',
  trang_thai_thanh_toan ENUM('CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HOAN_TIEN') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
  ghi_chu VARCHAR(500) NOT NULL DEFAULT '',
  ma_ban VARCHAR(30) NOT NULL DEFAULT '',
  phuong_thuc_thanh_toan ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THE') NOT NULL DEFAULT 'TIEN_MAT',
  email_nguoi_dung VARCHAR(150) NOT NULL DEFAULT '',
  ten_khach_hang VARCHAR(150) NOT NULL DEFAULT '',
  so_dien_thoai_khach_hang VARCHAR(20) NOT NULL DEFAULT '',
  email_khach_hang VARCHAR(150) NOT NULL DEFAULT '',
  dia_chi_khach_hang VARCHAR(255) NOT NULL DEFAULT '',
  thong_tin_khach_hang JSON NULL,
  nguoi_dung_id INT UNSIGNED NULL,
  tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_don_hang_ma_don_hang (ma_don_hang),
  KEY idx_don_hang_nguoi_dung_trang_thai_ngay (nguoi_dung_id, trang_thai, dat_luc),
  KEY idx_don_hang_dat_luc (dat_luc),
  CONSTRAINT fk_don_hang_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS chi_tiet_don_hang (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  don_hang_id INT UNSIGNED NOT NULL,
  mon_an_id INT UNSIGNED NULL,
  ten_mon VARCHAR(150) NOT NULL,
  don_gia DECIMAL(10, 2) NOT NULL,
  so_luong INT UNSIGNED NOT NULL,
  kich_co VARCHAR(20) NOT NULL DEFAULT 'M',
  topping_da_chon JSON NULL,
  ghi_chu_mon VARCHAR(255) NOT NULL DEFAULT '',
  ma_bien_the VARCHAR(100) NOT NULL DEFAULT '',
  thong_tin_mon JSON NULL,
  PRIMARY KEY (id),
  KEY idx_chi_tiet_don_hang_don_hang_id (don_hang_id),
  KEY idx_chi_tiet_don_hang_mon_an_id (mon_an_id),
  CONSTRAINT fk_chi_tiet_don_hang_don_hang FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_chi_tiet_don_hang_mon_an FOREIGN KEY (mon_an_id) REFERENCES mon_an(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO nguoi_dung (ho_ten, ten_dang_nhap, email, mat_khau_ma_hoa, vai_tro, trang_thai, so_dien_thoai)
SELECT mau_nguoi_dung.ho_ten, mau_nguoi_dung.ten_dang_nhap, mau_nguoi_dung.email, mau_nguoi_dung.mat_khau_ma_hoa, mau_nguoi_dung.vai_tro, mau_nguoi_dung.trang_thai, mau_nguoi_dung.so_dien_thoai
FROM (
  SELECT 'Nguyen Van Hung' AS ho_ten, 'admin' AS ten_dang_nhap, 'admin@nhahangphohien.local' AS email, '$2a$10$g8F3YzU0vNf5mS1Z8yHfAOnqB5x1h0m0d4Jm7S0Z6N3J0q6D0gD6K' AS mat_khau_ma_hoa, 'admin' AS vai_tro, 'ACTIVE' AS trang_thai, '0912000001' AS so_dien_thoai
  UNION ALL
  SELECT 'Pham Thu Ha', 'staff', 'staff@nhahangphohien.local', '$2a$10$6rLwA8m3j7YpN0dX3S0uU.0r93Q9nZ7wR9zX7xwZQmS4LwR6U5m7i', 'staff', 'ACTIVE', '0912000002'
  UNION ALL
  SELECT 'Doan Quang Huy', 'doanquanghuy', 'doanquanghuy@gmail.com', '$2a$10$QmFja0VuZE1hdUN1c3RvbWVyUGFzc3RvbWVyMTIzNDU2Nzg5', 'customer', 'ACTIVE', '0912345678'
  UNION ALL
  SELECT 'Bui Thi Lan', 'buithilan', 'buithilan@gmail.com', '$2a$10$QmFja0VuZE1hdUN1c3RvbWVyUGFzc3RvbWVyMTIzNDU2Nzg5', 'customer', 'ACTIVE', '0987654321'
  UNION ALL
  SELECT 'Truong Minh Duc', 'truongminhduc', 'truongminhduc@gmail.com', '$2a$10$QmFja0VuZE1hdUN1c3RvbWVyUGFzc3RvbWVyMTIzNDU2Nzg5', 'customer', 'ACTIVE', '0968123456'
) AS mau_nguoi_dung
WHERE NOT EXISTS (
  SELECT 1
  FROM nguoi_dung nd
  WHERE nd.ten_dang_nhap = mau_nguoi_dung.ten_dang_nhap OR nd.email = mau_nguoi_dung.email
);


INSERT INTO khu_vuc_ban (id, ten_khu_vuc, mo_ta)
SELECT mau_khu_vuc.id, mau_khu_vuc.ten_khu_vuc, mau_khu_vuc.mo_ta
FROM (
  SELECT 'SANH_CHINH' AS id, 'Sanh chinh' AS ten_khu_vuc, 'Khu vuc trung tam nha hang' AS mo_ta
  UNION ALL SELECT 'PHONG_VIP', 'Phong VIP', 'Khong gian rieng tu cho khach VIP'
  UNION ALL SELECT 'BAN_CONG', 'Ban cong', 'Khu vuc ngoai troi thoang mat'
  UNION ALL SELECT 'QUAY_BAR', 'Quay bar', 'Khu vuc quay bar va ban cao'
) AS mau_khu_vuc
WHERE NOT EXISTS (
  SELECT 1 FROM khu_vuc_ban kv WHERE kv.id = mau_khu_vuc.id
);

INSERT INTO ban_an (id, ma_ban, ten_ban, khu_vuc_id, suc_chua, trang_thai, ma_dat_ban_hien_tai, ghi_chu)
SELECT mau_ban.id, mau_ban.ma_ban, mau_ban.ten_ban, mau_ban.khu_vuc_id, mau_ban.suc_chua, mau_ban.trang_thai, mau_ban.ma_dat_ban_hien_tai, mau_ban.ghi_chu
FROM (
  SELECT 'SANH_CHINH_01' AS id, 'SC-01' AS ma_ban, 'Sanh chinh 01' AS ten_ban, 'SANH_CHINH' AS khu_vuc_id, 2 AS suc_chua, 'AVAILABLE' AS trang_thai, '' AS ma_dat_ban_hien_tai, '' AS ghi_chu
  UNION ALL SELECT 'SANH_CHINH_02', 'SC-02', 'Sanh chinh 02', 'SANH_CHINH', 4, 'AVAILABLE', '', ''
  UNION ALL SELECT 'SANH_CHINH_03', 'SC-03', 'Sanh chinh 03', 'SANH_CHINH', 6, 'AVAILABLE', '', ''
  UNION ALL SELECT 'PHONG_VIP_01', 'VIP-01', 'Phong VIP 01', 'PHONG_VIP', 8, 'AVAILABLE', '', ''
  UNION ALL SELECT 'BAN_CONG_01', 'BC-01', 'Ban cong 01', 'BAN_CONG', 4, 'AVAILABLE', '', ''
  UNION ALL SELECT 'QUAY_BAR_01', 'BAR-01', 'Quay bar 01', 'QUAY_BAR', 2, 'AVAILABLE', '', ''
) AS mau_ban
WHERE NOT EXISTS (
  SELECT 1 FROM ban_an ba WHERE ba.id = mau_ban.id OR ba.ma_ban = mau_ban.ma_ban
);

INSERT INTO mon_an (ten_mon, slug, mo_ta, gia, danh_muc, nhan_mon, tone_mau, hinh_anh, dang_kinh_doanh)
SELECT mau_mon_an.ten_mon, mau_mon_an.slug, mau_mon_an.mo_ta, mau_mon_an.gia, mau_mon_an.danh_muc, mau_mon_an.nhan_mon, mau_mon_an.tone_mau, mau_mon_an.hinh_anh, mau_mon_an.dang_kinh_doanh
FROM (
  SELECT 'Bo bit tet Uc' AS ten_mon, 'bo-bit-tet-uc' AS slug, 'Thit bo Uc nuong chin vua, kem khoai tay nghien' AS mo_ta, 385000.00 AS gia, 'Mon Chinh' AS danh_muc, 'Best Seller' AS nhan_mon, 'tone-red' AS tone_mau, '/images/menu/bo-bit-tet-uc.jpg' AS hinh_anh, 1 AS dang_kinh_doanh
  UNION ALL SELECT 'Ca hoi nuong teriyaki', 'ca-hoi-nuong-teriyaki', 'Phi le ca hoi tuoi nuong sot teriyaki dac biet', 295000.00, 'Mon Chinh', 'Healthy', 'tone-amber', '/images/menu/ca-hoi-teriyaki.jpg', 1
  UNION ALL SELECT 'Salad Caesar', 'salad-caesar', 'Rau xa lach tuoi, ga nuong, pho mai Parmesan, sot Caesar', 95000.00, 'Khai Vi', 'Light', 'tone-green', '', 1
  UNION ALL SELECT 'Tra dao cam sa', 'tra-dao-cam-sa', 'Tra den pha dao tuoi, cam va sa thom mat', 55000.00, 'Do Uong', 'Signature', 'tone-amber', '/images/menu/tra-dao-cam-sa.jpg', 1
  UNION ALL SELECT 'Tiramisu', 'tiramisu', 'Banh Tiramisu Y truyen thong voi ca phe Espresso', 85000.00, 'Trang Mieng', 'Premium', 'tone-brown', '', 1
) AS mau_mon_an
WHERE NOT EXISTS (
  SELECT 1 FROM mon_an ma WHERE ma.slug = mau_mon_an.slug
);

INSERT INTO ma_giam_gia (ma_giam, ten_ma_giam, mo_ta, loai_giam, gia_tri_giam, don_toi_thieu, giam_toi_da, bat_dau_luc, ket_thuc_luc, gioi_han_su_dung, da_su_dung, dang_hoat_dong)
SELECT mau_ma_giam.ma_giam, mau_ma_giam.ten_ma_giam, mau_ma_giam.mo_ta, mau_ma_giam.loai_giam, mau_ma_giam.gia_tri_giam, mau_ma_giam.don_toi_thieu, mau_ma_giam.giam_toi_da, mau_ma_giam.bat_dau_luc, mau_ma_giam.ket_thuc_luc, mau_ma_giam.gioi_han_su_dung, mau_ma_giam.da_su_dung, mau_ma_giam.dang_hoat_dong
FROM (
  SELECT 'GIAM20K' AS ma_giam, 'Giam 20K' AS ten_ma_giam, 'Giam truc tiep 20.000d cho moi don du dieu kien.' AS mo_ta, 'FIXED' AS loai_giam, 20000.00 AS gia_tri_giam, 0.00 AS don_toi_thieu, NULL AS giam_toi_da, NULL AS bat_dau_luc, NULL AS ket_thuc_luc, NULL AS gioi_han_su_dung, 0 AS da_su_dung, 1 AS dang_hoat_dong
  UNION ALL
  SELECT 'VIP50K', 'VIP 50K', 'Giam 50.000d cho don tu 300.000d.', 'FIXED', 50000.00, 300000.00, NULL, NULL, NULL, 100, 0, 1
) AS mau_ma_giam
WHERE NOT EXISTS (
  SELECT 1 FROM ma_giam_gia mg WHERE mg.ma_giam = mau_ma_giam.ma_giam
);

INSERT INTO dat_ban (
  ma_dat_ban,
  so_khach,
  ngay_dat,
  gio_dat,
  khu_vuc_uu_tien,
  ghi_chu,
  ten_khach,
  so_dien_thoai_khach,
  email_khach,
  trang_thai,
  nguon_tao,
  email_nguoi_dung,
  dip_dac_biet,
  kenh_xac_nhan,
  ghi_chu_noi_bo,
  tao_boi,
  nguoi_dung_id
)
SELECT mau_dat_ban.ma_dat_ban, mau_dat_ban.so_khach, mau_dat_ban.ngay_dat, mau_dat_ban.gio_dat, mau_dat_ban.khu_vuc_uu_tien, mau_dat_ban.ghi_chu, mau_dat_ban.ten_khach, mau_dat_ban.so_dien_thoai_khach, mau_dat_ban.email_khach, mau_dat_ban.trang_thai, mau_dat_ban.nguon_tao, mau_dat_ban.email_nguoi_dung, mau_dat_ban.dip_dac_biet, mau_dat_ban.kenh_xac_nhan, mau_dat_ban.ghi_chu_noi_bo, mau_dat_ban.tao_boi, mau_dat_ban.nguoi_dung_id
FROM (
  SELECT 'BK-20260315-0001' AS ma_dat_ban, 4 AS so_khach, DATE('2026-03-20') AS ngay_dat, TIME('18:30:00') AS gio_dat, 'SANH_CHINH' AS khu_vuc_uu_tien, 'Ban gan cua so, yen tinh de tiep khach gia dinh' AS ghi_chu, 'Doan Quang Huy' AS ten_khach, '0912345678' AS so_dien_thoai_khach, 'doanquanghuy@gmail.com' AS email_khach, 'DA_XAC_NHAN' AS trang_thai, 'web' AS nguon_tao, 'doanquanghuy@gmail.com' AS email_nguoi_dung, 'Sinh nhat me' AS dip_dac_biet, JSON_ARRAY('sms', 'zalo') AS kenh_xac_nhan, 'Khach o Van Giang, Hung Yen, uu tien khu yen tinh' AS ghi_chu_noi_bo, 'Nguyen Van Hung' AS tao_boi, 3 AS nguoi_dung_id
) AS mau_dat_ban
WHERE NOT EXISTS (
  SELECT 1 FROM dat_ban db WHERE db.ma_dat_ban = mau_dat_ban.ma_dat_ban
);

INSERT INTO dat_ban (
  ma_dat_ban,
  so_khach,
  ngay_dat,
  gio_dat,
  khu_vuc_uu_tien,
  ghi_chu,
  ten_khach,
  so_dien_thoai_khach,
  email_khach,
  trang_thai,
  nguon_tao,
  email_nguoi_dung,
  dip_dac_biet,
  kenh_xac_nhan,
  ghi_chu_noi_bo,
  tao_boi,
  nguoi_dung_id
)
SELECT 'BK-20260315-0002', 6, DATE('2026-03-21'), TIME('19:00:00'), 'PHONG_VIP', 'Can phong rieng de tiep doi tac', 'Bui Thi Lan', '0987654321', 'buithilan@gmail.com', 'CHO_XAC_NHAN', 'web', 'buithilan@gmail.com', 'Gap mat gia dinh', JSON_ARRAY('sms'), 'Khach o Long Bien, Ha Noi', 'Pham Thu Ha', 4
WHERE NOT EXISTS (
  SELECT 1 FROM dat_ban db WHERE db.ma_dat_ban = 'BK-20260315-0002'
);

INSERT INTO dat_ban (
  ma_dat_ban,
  so_khach,
  ngay_dat,
  gio_dat,
  khu_vuc_uu_tien,
  ghi_chu,
  ten_khach,
  so_dien_thoai_khach,
  email_khach,
  trang_thai,
  nguon_tao,
  email_nguoi_dung,
  dip_dac_biet,
  kenh_xac_nhan,
  ghi_chu_noi_bo,
  tao_boi,
  nguoi_dung_id
)
SELECT 'BK-20260315-0003', 2, DATE('2026-03-22'), TIME('11:30:00'), 'BAN_CONG', 'Khach muon ngoi thoang mat', 'Truong Minh Duc', '0968123456', 'truongminhduc@gmail.com', 'YEU_CAU_DAT_BAN', 'web', 'truongminhduc@gmail.com', 'Ky niem ngay cuoi', JSON_ARRAY('zalo'), 'Khach o My Hao, Hung Yen', 'Pham Thu Ha', 5
WHERE NOT EXISTS (
  SELECT 1 FROM dat_ban db WHERE db.ma_dat_ban = 'BK-20260315-0003'
);

INSERT INTO chi_tiet_dat_ban (dat_ban_id, ban_an_id)
SELECT db.id, 'SANH_CHINH_02'
FROM dat_ban db
WHERE db.ma_dat_ban = 'BK-20260315-0001'
  AND NOT EXISTS (
    SELECT 1
    FROM chi_tiet_dat_ban ctdb
    WHERE ctdb.dat_ban_id = db.id AND ctdb.ban_an_id = 'SANH_CHINH_02'
  );

UPDATE ban_an ba
JOIN dat_ban db ON db.ma_dat_ban = 'BK-20260315-0001'
SET ba.dat_ban_hien_tai_id = db.id,
    ba.ma_dat_ban_hien_tai = db.ma_dat_ban,
    ba.trang_thai = 'HELD'
WHERE ba.id = 'SANH_CHINH_02'
  AND (ba.dat_ban_hien_tai_id IS NULL OR ba.ma_dat_ban_hien_tai = '');

INSERT INTO don_hang (
  ma_don_hang,
  tam_tinh,
  phi_dich_vu,
  tien_giam,
  ma_giam_gia_ap_dung,
  thanh_tien,
  dat_luc,
  trang_thai,
  trang_thai_thanh_toan,
  ghi_chu,
  ma_ban,
  phuong_thuc_thanh_toan,
  email_nguoi_dung,
  ten_khach_hang,
  so_dien_thoai_khach_hang,
  email_khach_hang,
  dia_chi_khach_hang,
  thong_tin_khach_hang,
  nguoi_dung_id
)
SELECT mau_don_hang.ma_don_hang, mau_don_hang.tam_tinh, mau_don_hang.phi_dich_vu, mau_don_hang.tien_giam, mau_don_hang.ma_giam_gia_ap_dung, mau_don_hang.thanh_tien, mau_don_hang.dat_luc, mau_don_hang.trang_thai, mau_don_hang.trang_thai_thanh_toan, mau_don_hang.ghi_chu, mau_don_hang.ma_ban, mau_don_hang.phuong_thuc_thanh_toan, mau_don_hang.email_nguoi_dung, mau_don_hang.ten_khach_hang, mau_don_hang.so_dien_thoai_khach_hang, mau_don_hang.email_khach_hang, mau_don_hang.dia_chi_khach_hang, mau_don_hang.thong_tin_khach_hang, mau_don_hang.nguoi_dung_id
FROM (
  SELECT 'DH-20260315-000001' AS ma_don_hang, 440000.00 AS tam_tinh, 0.00 AS phi_dich_vu, 20000.00 AS tien_giam, 'GIAM20K' AS ma_giam_gia_ap_dung, 420000.00 AS thanh_tien, TIMESTAMP('2026-03-15 12:00:00') AS dat_luc, 'DA_XAC_NHAN' AS trang_thai, 'CHUA_THANH_TOAN' AS trang_thai_thanh_toan, 'Khach hen gio nghi trua, uu tien giao dung gio' AS ghi_chu, 'SC-02' AS ma_ban, 'TIEN_MAT' AS phuong_thuc_thanh_toan, 'doanquanghuy@gmail.com' AS email_nguoi_dung, 'Doan Quang Huy' AS ten_khach_hang, '0912345678' AS so_dien_thoai_khach_hang, 'doanquanghuy@gmail.com' AS email_khach_hang, 'So 18, Duong Nguyen Van Linh, Thi tran Van Giang, Huyen Van Giang, Hung Yen, Viet Nam' AS dia_chi_khach_hang, JSON_OBJECT('fullName', 'Doan Quang Huy', 'phone', '0912345678', 'email', 'doanquanghuy@gmail.com', 'address', 'So 18, Duong Nguyen Van Linh, Thi tran Van Giang, Huyen Van Giang, Hung Yen, Viet Nam') AS thong_tin_khach_hang, 3 AS nguoi_dung_id
) AS mau_don_hang
WHERE NOT EXISTS (
  SELECT 1 FROM don_hang dh WHERE dh.ma_don_hang = mau_don_hang.ma_don_hang
);

INSERT INTO don_hang (
  ma_don_hang,
  tam_tinh,
  phi_dich_vu,
  tien_giam,
  ma_giam_gia_ap_dung,
  thanh_tien,
  dat_luc,
  trang_thai,
  trang_thai_thanh_toan,
  ghi_chu,
  ma_ban,
  phuong_thuc_thanh_toan,
  email_nguoi_dung,
  ten_khach_hang,
  so_dien_thoai_khach_hang,
  email_khach_hang,
  dia_chi_khach_hang,
  thong_tin_khach_hang,
  nguoi_dung_id
)
SELECT 'DH-20260315-000002', 350000.00, 0.00, 0.00, '', 350000.00, TIMESTAMP('2026-03-16 18:10:00'), 'MOI_TAO', 'CHUA_THANH_TOAN', 'Khach dat ban toi tai Ha Noi', 'VIP-01', 'CHUYEN_KHOAN', 'buithilan@gmail.com', 'Bui Thi Lan', '0987654321', 'buithilan@gmail.com', 'So 25, Ngach 12, Pho Ngoc Lam, Phuong Ngoc Lam, Quan Long Bien, Ha Noi, Viet Nam', JSON_OBJECT('fullName', 'Bui Thi Lan', 'phone', '0987654321', 'email', 'buithilan@gmail.com', 'address', 'So 25, Ngach 12, Pho Ngoc Lam, Phuong Ngoc Lam, Quan Long Bien, Ha Noi, Viet Nam'), 4
WHERE NOT EXISTS (
  SELECT 1 FROM don_hang dh WHERE dh.ma_don_hang = 'DH-20260315-000002'
);

INSERT INTO don_hang (
  ma_don_hang,
  tam_tinh,
  phi_dich_vu,
  tien_giam,
  ma_giam_gia_ap_dung,
  thanh_tien,
  dat_luc,
  trang_thai,
  trang_thai_thanh_toan,
  ghi_chu,
  ma_ban,
  phuong_thuc_thanh_toan,
  email_nguoi_dung,
  ten_khach_hang,
  so_dien_thoai_khach_hang,
  email_khach_hang,
  dia_chi_khach_hang,
  thong_tin_khach_hang,
  nguoi_dung_id
)
SELECT 'DH-20260315-000003', 240000.00, 0.00, 0.00, '', 240000.00, TIMESTAMP('2026-03-17 11:15:00'), 'DA_XAC_NHAN', 'DA_THANH_TOAN', 'Khach nhan hoa don cong ty neu can', 'BC-01', 'THE', 'truongminhduc@gmail.com', 'Truong Minh Duc', '0968123456', 'truongminhduc@gmail.com', 'So 9, Pho Noi, Phuong Bach Sam, Thi xa My Hao, Hung Yen, Viet Nam', JSON_OBJECT('fullName', 'Truong Minh Duc', 'phone', '0968123456', 'email', 'truongminhduc@gmail.com', 'address', 'So 9, Pho Noi, Phuong Bach Sam, Thi xa My Hao, Hung Yen, Viet Nam'), 5
WHERE NOT EXISTS (
  SELECT 1 FROM don_hang dh WHERE dh.ma_don_hang = 'DH-20260315-000003'
);

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Bo bit tet Uc', 385000.00, 1, 'M', JSON_ARRAY(), 'Tai vua', 'bo-bit-tet-uc_M', JSON_OBJECT('name', 'Bo bit tet Uc', 'price', 385000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'bo-bit-tet-uc'
WHERE dh.ma_don_hang = 'DH-20260315-000001'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'bo-bit-tet-uc_M'
  );

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Tra dao cam sa', 55000.00, 1, 'M', JSON_ARRAY('it da', 'it ngot'), '', 'tra-dao-cam-sa_M', JSON_OBJECT('name', 'Tra dao cam sa', 'price', 55000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'tra-dao-cam-sa'
WHERE dh.ma_don_hang = 'DH-20260315-000001'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'tra-dao-cam-sa_M'
  );

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Ca hoi nuong teriyaki', 295000.00, 1, 'M', JSON_ARRAY(), 'Lam nong truoc khi phuc vu', 'ca-hoi-nuong-teriyaki_M', JSON_OBJECT('name', 'Ca hoi nuong teriyaki', 'price', 295000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'ca-hoi-nuong-teriyaki'
WHERE dh.ma_don_hang = 'DH-20260315-000002'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'ca-hoi-nuong-teriyaki_M'
  );

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Tra dao cam sa', 55000.00, 1, 'M', JSON_ARRAY('it da'), '', 'tra-dao-cam-sa_M_2', JSON_OBJECT('name', 'Tra dao cam sa', 'price', 55000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'tra-dao-cam-sa'
WHERE dh.ma_don_hang = 'DH-20260315-000002'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'tra-dao-cam-sa_M_2'
  );

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Salad Caesar', 95000.00, 1, 'M', JSON_ARRAY(), '', 'salad-caesar_M', JSON_OBJECT('name', 'Salad Caesar', 'price', 95000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'salad-caesar'
WHERE dh.ma_don_hang = 'DH-20260315-000003'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'salad-caesar_M'
  );

INSERT INTO chi_tiet_don_hang (
  don_hang_id,
  mon_an_id,
  ten_mon,
  don_gia,
  so_luong,
  kich_co,
  topping_da_chon,
  ghi_chu_mon,
  ma_bien_the,
  thong_tin_mon
)
SELECT dh.id, ma.id, 'Tiramisu', 85000.00, 1, 'M', JSON_ARRAY(), 'Them muong nho', 'tiramisu_M', JSON_OBJECT('name', 'Tiramisu', 'price', 85000.00)
FROM don_hang dh
JOIN mon_an ma ON ma.slug = 'tiramisu'
WHERE dh.ma_don_hang = 'DH-20260315-000003'
  AND NOT EXISTS (
    SELECT 1 FROM chi_tiet_don_hang ctdh WHERE ctdh.don_hang_id = dh.id AND ctdh.ma_bien_the = 'tiramisu_M'
  );
