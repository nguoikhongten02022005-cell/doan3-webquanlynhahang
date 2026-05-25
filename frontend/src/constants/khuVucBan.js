export const MA_KHU_VUC_BAN = Object.freeze({
  TRONG_NHA: 'SANH_CHINH',
  KHU_RIENG: 'PHONG_VIP',
  NGOAI_TROI: 'BAN_CONG',
})

export const CAC_KHU_VUC_BAN_CHUAN = Object.freeze([
  { id: MA_KHU_VUC_BAN.TRONG_NHA, name: 'Trong nhà', total: 12 },
  { id: MA_KHU_VUC_BAN.KHU_RIENG, name: 'Khu riêng', total: 4 },
  { id: MA_KHU_VUC_BAN.NGOAI_TROI, name: 'Ngoài trời', total: 6 },
])

export const DANH_SACH_TEN_KHU_VUC_BAN = Object.freeze(CAC_KHU_VUC_BAN_CHUAN.map((khuVuc) => khuVuc.name))

export const NHAN_KHU_VUC_BAN = Object.freeze({
  KHONG_UU_TIEN: 'Không ưu tiên',
  [MA_KHU_VUC_BAN.TRONG_NHA]: 'Trong nhà',
  [MA_KHU_VUC_BAN.KHU_RIENG]: 'Khu riêng',
  [MA_KHU_VUC_BAN.NGOAI_TROI]: 'Ngoài trời',
})

export const TUY_CHON_KHU_VUC_UU_TIEN = Object.freeze([
  { value: 'KHONG_UU_TIEN', label: 'Không ưu tiên' },
  ...CAC_KHU_VUC_BAN_CHUAN.map((khuVuc) => ({ value: khuVuc.id, label: khuVuc.name })),
])

const BO_MAP_KHU_VUC_THEO_CHUOI = Object.freeze({
  sanh_chinh: MA_KHU_VUC_BAN.TRONG_NHA,
  trong_nha: MA_KHU_VUC_BAN.TRONG_NHA,
  trongnh: MA_KHU_VUC_BAN.TRONG_NHA,
  tang_2: MA_KHU_VUC_BAN.TRONG_NHA,
  tang2: MA_KHU_VUC_BAN.TRONG_NHA,
  quay_bar: MA_KHU_VUC_BAN.TRONG_NHA,
  phong_vip: MA_KHU_VUC_BAN.KHU_RIENG,
  khu_rieng: MA_KHU_VUC_BAN.KHU_RIENG,
  khurieng: MA_KHU_VUC_BAN.KHU_RIENG,
  vip: MA_KHU_VUC_BAN.KHU_RIENG,
  ban_cong: MA_KHU_VUC_BAN.NGOAI_TROI,
  bancong: MA_KHU_VUC_BAN.NGOAI_TROI,
  ngoai_troi: MA_KHU_VUC_BAN.NGOAI_TROI,
  ngoaitroi: MA_KHU_VUC_BAN.NGOAI_TROI,
  ngoai_san: MA_KHU_VUC_BAN.NGOAI_TROI,
  ngoaisan: MA_KHU_VUC_BAN.NGOAI_TROI,
})

const boDauTiengViet = (giaTri = '') => String(giaTri || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')

export const chuanHoaMaKhuVucBan = (giaTri = '') => {
  const chuoi = String(giaTri || '').trim()
  if (!chuoi) return MA_KHU_VUC_BAN.TRONG_NHA

  const khoa = boDauTiengViet(chuoi).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  if (BO_MAP_KHU_VUC_THEO_CHUOI[khoa]) return BO_MAP_KHU_VUC_THEO_CHUOI[khoa]
  if (khoa.includes('vip') || khoa.includes('rieng')) return MA_KHU_VUC_BAN.KHU_RIENG
  if (khoa.includes('ngoai') || khoa.includes('ban_cong') || khoa.includes('bancong')) return MA_KHU_VUC_BAN.NGOAI_TROI
  return MA_KHU_VUC_BAN.TRONG_NHA
}

export const chuanHoaTenKhuVucBan = (giaTri = '') => NHAN_KHU_VUC_BAN[chuanHoaMaKhuVucBan(giaTri)]
