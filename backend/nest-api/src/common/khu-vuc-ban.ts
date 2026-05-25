export const MA_KHU_VUC_BAN = {
  TRONG_NHA: 'SANH_CHINH',
  KHU_RIENG: 'PHONG_VIP',
  NGOAI_TROI: 'BAN_CONG',
} as const;

export const NHAN_KHU_VUC_BAN = {
  [MA_KHU_VUC_BAN.TRONG_NHA]: 'Trong nhà',
  [MA_KHU_VUC_BAN.KHU_RIENG]: 'Khu riêng',
  [MA_KHU_VUC_BAN.NGOAI_TROI]: 'Ngoài trời',
} as const;

const boDauTiengViet = (giaTri = '') =>
  String(giaTri || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

export const chuanHoaMaKhuVucBan = (giaTri = '') => {
  const chuoi = String(giaTri || '').trim();
  if (!chuoi) return MA_KHU_VUC_BAN.TRONG_NHA;

  const khoa = boDauTiengViet(chuoi)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (['sanh_chinh', 'trong_nha', 'tang_2', 'tang2', 'quay_bar'].includes(khoa))
    return MA_KHU_VUC_BAN.TRONG_NHA;
  if (['phong_vip', 'khu_rieng', 'khurieng', 'vip'].includes(khoa))
    return MA_KHU_VUC_BAN.KHU_RIENG;
  if (
    [
      'ban_cong',
      'bancong',
      'ngoai_troi',
      'ngoaitroi',
      'ngoai_san',
      'ngoaisan',
    ].includes(khoa)
  )
    return MA_KHU_VUC_BAN.NGOAI_TROI;
  if (khoa.includes('vip') || khoa.includes('rieng'))
    return MA_KHU_VUC_BAN.KHU_RIENG;
  if (
    khoa.includes('ngoai') ||
    khoa.includes('ban_cong') ||
    khoa.includes('bancong')
  )
    return MA_KHU_VUC_BAN.NGOAI_TROI;
  return MA_KHU_VUC_BAN.TRONG_NHA;
};

export const chuanHoaTenKhuVucBan = (giaTri = '') =>
  NHAN_KHU_VUC_BAN[chuanHoaMaKhuVucBan(giaTri)];
