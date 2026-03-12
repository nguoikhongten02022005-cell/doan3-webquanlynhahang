-- Create enums for Order
ALTER TABLE `Order`
  MODIFY `status` ENUM('MOI_TAO', 'DA_XAC_NHAN', 'DANG_CHUAN_BI', 'DANG_PHUC_VU', 'DA_HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'MOI_TAO';

ALTER TABLE `Order`
  MODIFY `paymentMethod` ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THE') NOT NULL DEFAULT 'TIEN_MAT';

ALTER TABLE `Order`
  ADD COLUMN `paymentStatus` ENUM('CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HOAN_TIEN') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
  ADD COLUMN `maDonHang` VARCHAR(191) NULL;

UPDATE `Order`
SET `status` = CASE
  WHEN `status` IN ('Mới Đặt', 'MOI_TAO') THEN 'MOI_TAO'
  WHEN `status` IN ('Đã Xác Nhận', 'DA_XAC_NHAN') THEN 'DA_XAC_NHAN'
  WHEN `status` IN ('Đang Chuẩn Bị', 'DANG_CHUAN_BI') THEN 'DANG_CHUAN_BI'
  WHEN `status` IN ('Đang Phục Vụ', 'DANG_PHUC_VU') THEN 'DANG_PHUC_VU'
  WHEN `status` IN ('Đã Hoàn Thành', 'DA_HOAN_THANH') THEN 'DA_HOAN_THANH'
  WHEN `status` IN ('Đã Hủy', 'DA_HUY') THEN 'DA_HUY'
  ELSE 'MOI_TAO'
END;

UPDATE `Order`
SET `paymentMethod` = CASE
  WHEN `paymentMethod` IN ('cash', 'TIEN_MAT') THEN 'TIEN_MAT'
  WHEN `paymentMethod` IN ('banking', 'transfer', 'CHUYEN_KHOAN') THEN 'CHUYEN_KHOAN'
  WHEN `paymentMethod` IN ('card', 'THE') THEN 'THE'
  ELSE 'TIEN_MAT'
END;

UPDATE `Order`
SET `maDonHang` = CONCAT('DH-', DATE_FORMAT(`orderDate`, '%Y%m%d'), '-', LPAD(`id`, 6, '0'))
WHERE `maDonHang` IS NULL OR `maDonHang` = '';

ALTER TABLE `Order`
  MODIFY `maDonHang` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `Order_maDonHang_key` ON `Order`(`maDonHang`);

-- MenuItem slug
ALTER TABLE `MenuItem`
  ADD COLUMN `slug` VARCHAR(191) NULL;

UPDATE `MenuItem`
SET `slug` = CONCAT('menu-item-', `id`)
WHERE `slug` IS NULL OR `slug` = '';

ALTER TABLE `MenuItem`
  MODIFY `slug` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `MenuItem_slug_key` ON `MenuItem`(`slug`);

-- Voucher metadata
ALTER TABLE `Voucher`
  ADD COLUMN `name` VARCHAR(191) NULL,
  ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '';

UPDATE `Voucher`
SET `name` = `code`
WHERE `name` IS NULL OR `name` = '';

ALTER TABLE `Voucher`
  MODIFY `name` VARCHAR(191) NOT NULL;
