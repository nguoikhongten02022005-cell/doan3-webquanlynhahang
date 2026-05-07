/**
 * Đọc biến môi trường bắt buộc.
 * Throw nếu thiếu hoặc rỗng.
 */
export const docBienMoiTruongBatBuoc = (tenBien: string): string => {
  const giaTri = process.env[tenBien]?.trim();

  if (!giaTri) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
  }

  return giaTri;
};

/**
 * Đọc biến môi trường tuỳ chọn, trả về chuỗi rỗng nếu thiếu.
 */
export const docBienMoiTruongTuyChon = (tenBien: string): string => {
  return process.env[tenBien]?.trim() || '';
};