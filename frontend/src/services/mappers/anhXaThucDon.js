import {
  CAC_DANH_MUC_CHUAN_THUC_DON,
  BI_DANH_DANH_MUC_THUC_DON,
  DANH_MUC_MAC_DINH_THUC_DON,
} from '../../features/thucDon/constants/danhMucThucDon'
import {
  NHAN_MAC_DINH_THUC_DON,
  SAC_DO_MAC_DINH_THUC_DON,
  ANH_DU_PHONG_THUC_DON,
} from '../../features/thucDon/constants/tuyChonThucDon'
import { layAnhMonTheoTen } from '../../features/thucDon/constants/anhMonAn'
import { phanTichGiaThanhSo } from '../../utils/giaTien'
import { dinhDangTienTe } from '../../utils/tienTe'

const TEN_MON_DU_PHONG = 'Món đang cập nhật'
const MO_TA_MON_DU_PHONG = 'Nhà hàng sẽ cập nhật mô tả món ăn sớm nhất.'

const chuanHoaVanBan = (giaTri) => String(giaTri ?? '').trim()

const taoBiDanhDanhMuc = (giaTri) => chuanHoaVanBan(giaTri)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')

const damBaoDanhMucHopLe = (giaTri) => {
  if (CAC_DANH_MUC_CHUAN_THUC_DON.includes(giaTri)) {
    return giaTri
  }

  return DANH_MUC_MAC_DINH_THUC_DON
}

const chuanHoaGiaTriGia = (giaGoc) => phanTichGiaThanhSo(giaGoc)

const chuanHoaNhan = (giaTri) => chuanHoaVanBan(giaTri) || NHAN_MAC_DINH_THUC_DON
const chuanHoaSacDo = (giaTri) => chuanHoaVanBan(giaTri) || SAC_DO_MAC_DINH_THUC_DON
const chuanHoaAnh = (giaTri, tenMon = '', danhMuc = '') => chuanHoaVanBan(giaTri) || layAnhMonTheoTen(tenMon, danhMuc) || ANH_DU_PHONG_THUC_DON

export const chuanHoaDanhMucThucDon = (danhMucGoc) => {
  const danhMucDaChuanHoa = chuanHoaVanBan(danhMucGoc)

  if (CAC_DANH_MUC_CHUAN_THUC_DON.includes(danhMucDaChuanHoa)) {
    return danhMucDaChuanHoa
  }

  return BI_DANH_DANH_MUC_THUC_DON[taoBiDanhDanhMuc(danhMucDaChuanHoa)] || DANH_MUC_MAC_DINH_THUC_DON
}

export const chuanHoaMonThucDon = (monGoc, chiSoDuPhong = 0) => {
  if (!monGoc || typeof monGoc !== 'object') {
    return {
      id: `fallback-${chiSoDuPhong}`,
      name: TEN_MON_DU_PHONG,
      description: MO_TA_MON_DU_PHONG,
      price: dinhDangTienTe(0),
      priceValue: 0,
      category: DANH_MUC_MAC_DINH_THUC_DON,
      badge: NHAN_MAC_DINH_THUC_DON,
      tone: SAC_DO_MAC_DINH_THUC_DON,
      image: ANH_DU_PHONG_THUC_DON,
    }
  }

  const giaTriGia = chuanHoaGiaTriGia(monGoc.price ?? monGoc.gia ?? monGoc.Gia)
  const danhMucDaChuanHoa = chuanHoaDanhMucThucDon(monGoc.category ?? monGoc.danhMuc ?? monGoc.maDanhMuc ?? monGoc.MaDanhMuc)
  const tenMonDaChuanHoa = chuanHoaVanBan(monGoc.name ?? monGoc.tenMon ?? monGoc.TenMon) || TEN_MON_DU_PHONG
  const idDaChuanHoa = monGoc.id ?? monGoc.maMon ?? monGoc.MaMon ?? monGoc._id ?? monGoc.slug ?? `fallback-${chiSoDuPhong}`

  return {
    ...monGoc,
    id: idDaChuanHoa,
    maMon: chuanHoaVanBan(monGoc.maMon ?? monGoc.MaMon ?? idDaChuanHoa),
    name: tenMonDaChuanHoa,
    description: chuanHoaVanBan(monGoc.description ?? monGoc.moTa ?? monGoc.MoTa) || MO_TA_MON_DU_PHONG,
    price: dinhDangTienTe(giaTriGia),
    priceValue: giaTriGia,
    category: damBaoDanhMucHopLe(danhMucDaChuanHoa),
    badge: chuanHoaNhan(monGoc.badge ?? monGoc.nhanMon),
    tone: chuanHoaSacDo(monGoc.tone ?? monGoc.toneMau),
    image: chuanHoaAnh(monGoc.image ?? monGoc.hinhAnh, tenMonDaChuanHoa, danhMucDaChuanHoa),
  }
}

export const chuanHoaDanhSachMonThucDon = (danhSach) => {
  if (!Array.isArray(danhSach)) {
    return []
  }

  return danhSach.map((mon, chiSo) => chuanHoaMonThucDon(mon, chiSo))
}

export const layDanhSachMonNoiBatTrangChu = (danhSachMon, gioiHan = 8) => {
  if (!Array.isArray(danhSachMon) || danhSachMon.length === 0) {
    return []
  }

  return [...danhSachMon]
    .sort((monDau, monSau) => {
      if (monDau.badge !== monSau.badge) {
        if (monDau.badge === NHAN_MAC_DINH_THUC_DON) return -1
        if (monSau.badge === NHAN_MAC_DINH_THUC_DON) return 1
      }

      return (Number(monSau.id) || 0) - (Number(monDau.id) || 0)
    })
    .slice(0, gioiHan)
}

export const anhXaFormMonThanhDuLieuGuiDi = (giaTriForm) => {
  const giaTriGia = chuanHoaGiaTriGia(giaTriForm?.price)
  const tenMon = chuanHoaVanBan(giaTriForm?.name)
  const moTa = chuanHoaVanBan(giaTriForm?.description)
  const maDanhMuc = chuanHoaDanhMucThucDon(giaTriForm?.category)
  const hinhAnh = chuanHoaAnh(giaTriForm?.image)

  return {
    name: tenMon,
    tenMon,
    description: moTa,
    moTa,
    price: giaTriGia,
    gia: giaTriGia,
    category: maDanhMuc,
    maDanhMuc,
    badge: chuanHoaNhan(giaTriForm?.badge),
    tone: chuanHoaSacDo(giaTriForm?.tone),
    image: hinhAnh,
    hinhAnh,
    thoiGianChuanBi: Number(giaTriForm?.thoiGianChuanBi ?? 0),
  }
}

export const anhXaMonThanhGiaTriForm = (mon) => ({
  name: chuanHoaVanBan(mon?.name),
  description: chuanHoaVanBan(mon?.description),
  price: chuanHoaVanBan(mon?.price),
  category: chuanHoaDanhMucThucDon(mon?.category),
  badge: chuanHoaVanBan(mon?.badge) || NHAN_MAC_DINH_THUC_DON,
  tone: chuanHoaSacDo(mon?.tone),
  image: chuanHoaVanBan(mon?.image),
})
