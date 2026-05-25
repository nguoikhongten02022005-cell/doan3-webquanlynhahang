SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND COLUMN_NAME = 'LoaiMa'
    ),
    'SELECT 1',
    'ALTER TABLE MaGiamGia
      ADD COLUMN LoaiMa ENUM(''PUBLIC'',''CUSTOMER'',''LOYALTY'',''VIP'',''BIRTHDAY'') NOT NULL DEFAULT ''PUBLIC'' AFTER LoaiGiam'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND COLUMN_NAME = 'MaKH'
    ),
    'SELECT 1',
    'ALTER TABLE MaGiamGia
      ADD COLUMN MaKH VARCHAR(50) NULL AFTER LoaiMa'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND COLUMN_NAME = 'DiemDaDoi'
    ),
    'SELECT 1',
    'ALTER TABLE MaGiamGia
      ADD COLUMN DiemDaDoi INT DEFAULT NULL AFTER MaKH'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND COLUMN_NAME = 'NguonTao'
    ),
    'SELECT 1',
    'ALTER TABLE MaGiamGia
      ADD COLUMN NguonTao VARCHAR(50) DEFAULT NULL AFTER TrangThai'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND CONSTRAINT_NAME = 'FK_MaGiamGia_KhachHang'
    ),
    'SELECT 1',
    'ALTER TABLE MaGiamGia
      ADD CONSTRAINT FK_MaGiamGia_KhachHang
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH) ON DELETE SET NULL'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND INDEX_NAME = 'IDX_MaGiamGia_LoaiMa'
    ),
    'SELECT 1',
    'CREATE INDEX IDX_MaGiamGia_LoaiMa ON MaGiamGia(LoaiMa)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'MaGiamGia'
        AND INDEX_NAME = 'IDX_MaGiamGia_MaKH'
    ),
    'SELECT 1',
    'CREATE INDEX IDX_MaGiamGia_MaKH ON MaGiamGia(MaKH)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE MaGiamGia
SET LoaiMa = 'LOYALTY',
    MaKH = 'KH006',
    DiemDaDoi = 250,
    NguonTao = 'SEED'
WHERE MaCode = 'LOYAL25K';

UPDATE MaGiamGia
SET LoaiMa = 'VIP',
    MaKH = 'KH006',
    DiemDaDoi = NULL,
    NguonTao = 'SEED'
WHERE MaCode = 'VIP25';
