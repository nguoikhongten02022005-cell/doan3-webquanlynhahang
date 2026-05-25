ALTER TABLE DonHang
MODIFY COLUMN TrangThai ENUM(
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Served',
  'Serving',
  'Paid',
  'Cancelled',
  'Completed',
  'CHO_XU_LY',
  'DANG_CHE_BIEN',
  'SAN_SANG',
  'DANG_PHUC_VU',
  'DA_THANH_TOAN',
  'DA_HUY'
) NOT NULL DEFAULT 'Pending';
