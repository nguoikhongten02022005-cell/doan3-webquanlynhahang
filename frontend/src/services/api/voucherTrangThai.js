const MOC_GIO_VIET_NAM = '+07:00'

export const MA_TRANG_THAI_VOUCHER = Object.freeze({
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  EXPIRED: 'EXPIRED',
  USED_UP: 'USED_UP',
  USED: 'USED',
  INACTIVE: 'INACTIVE',
  DISABLED: 'DISABLED',
  UNKNOWN: 'UNKNOWN',
})

export const NHAN_TRANG_THAI_VOUCHER = Object.freeze({
  ACTIVE: 'Hoạt động',
  UPCOMING: 'Chưa hiệu lực',
  EXPIRED: 'Hết hạn',
  USED_UP: 'Hết lượt',
  USED: 'Đã dùng',
  INACTIVE: 'Tạm tắt',
  DISABLED: 'Tạm tắt',
  UNKNOWN: 'Không xác định',
})

export const MA_LOAI_VOUCHER = Object.freeze({
  PUBLIC: 'PUBLIC',
  CUSTOMER: 'CUSTOMER',
  LOYALTY: 'LOYALTY',
  VIP: 'VIP',
  BIRTHDAY: 'BIRTHDAY',
  UNKNOWN: 'UNKNOWN',
})

export const NHAN_LOAI_VOUCHER = Object.freeze({
  PUBLIC: 'Công khai',
  CUSTOMER: 'Riêng khách',
  LOYALTY: 'Đổi điểm',
  VIP: 'Thành viên VIP',
  BIRTHDAY: 'Sinh nhật',
  UNKNOWN: 'Không xác định',
})

const MA_NGUON_VOUCHER = Object.freeze({
  DOI_DIEM_TICH_LUY: 'DOI_DIEM_TICH_LUY',
  SEED: 'SEED',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
  IMPORT: 'IMPORT',
  UNKNOWN: 'UNKNOWN',
})

const NHAN_NGUON_VOUCHER = Object.freeze({
  DOI_DIEM_TICH_LUY: 'Đổi điểm tích lũy',
  SEED: 'Dữ liệu mẫu',
  ADMIN: 'Tạo thủ công',
  SYSTEM: 'Hệ thống',
  IMPORT: 'Nhập dữ liệu',
  UNKNOWN: 'Không xác định',
})

const BADGE_CLASS_TRANG_THAI_VOUCHER = Object.freeze({
  ACTIVE: 'tone-success',
  UPCOMING: 'tone-warning',
  EXPIRED: 'tone-danger',
  USED_UP: 'tone-warning',
  USED: 'tone-neutral',
  INACTIVE: 'tone-neutral',
  DISABLED: 'tone-neutral',
  UNKNOWN: 'tone-neutral',
})

const LOI_TRANG_THAI_VOUCHER = Object.freeze({
  ACTIVE: 'Mã giảm giá đang hoạt động.',
  UPCOMING: 'Mã giảm giá chưa có hiệu lực.',
  EXPIRED: 'Mã giảm giá đã hết hạn.',
  USED_UP: 'Mã giảm giá đã hết lượt.',
  USED: 'Mã giảm giá đã được dùng.',
  INACTIVE: 'Mã giảm giá đang tạm tắt.',
  DISABLED: 'Mã giảm giá đang tạm tắt.',
  UNKNOWN: 'Mã giảm giá không xác định.',
})

const chuanHoaKhoaLoaiVoucher = (giaTri) => {
  const chuoi = layChuoi(giaTri)
  if (!chuoi) return MA_LOAI_VOUCHER.UNKNOWN

  const khoa = boDauTiengViet(chuoi)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const banDoKhoa = {
    PUBLIC: MA_LOAI_VOUCHER.PUBLIC,
    CONG_KHAI: MA_LOAI_VOUCHER.PUBLIC,
    CUSTOMER: MA_LOAI_VOUCHER.CUSTOMER,
    RIENG_KHACH: MA_LOAI_VOUCHER.CUSTOMER,
    LOYALTY: MA_LOAI_VOUCHER.LOYALTY,
    DOI_DIEM: MA_LOAI_VOUCHER.LOYALTY,
    VIP: MA_LOAI_VOUCHER.VIP,
    THANH_VIEN: MA_LOAI_VOUCHER.VIP,
    THANH_VIEN_VIP: MA_LOAI_VOUCHER.VIP,
    BIRTHDAY: MA_LOAI_VOUCHER.BIRTHDAY,
    SINH_NHAT: MA_LOAI_VOUCHER.BIRTHDAY,
    UNKNOWN: MA_LOAI_VOUCHER.UNKNOWN,
    KHONG_XAC_DINH: MA_LOAI_VOUCHER.UNKNOWN,
  }

  return banDoKhoa[khoa] || MA_LOAI_VOUCHER.UNKNOWN
}

const layChuoi = (...giaTri) => {
  for (const item of giaTri) {
    if (item == null) continue
    const chuoi = String(item).trim()
    if (chuoi) return chuoi
  }
  return ''
}

const boDauTiengViet = (chuoi) =>
  chuoi
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Đđ]/g, (kyTu) => (kyTu === 'Đ' ? 'D' : 'd'))

const chuanHoaKhoaTrangThai = (giaTri) => {
  const chuoi = layChuoi(giaTri)
  if (!chuoi) return MA_TRANG_THAI_VOUCHER.UNKNOWN

  const khoa = boDauTiengViet(chuoi)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const banDoKhoa = {
    ACTIVE: MA_TRANG_THAI_VOUCHER.ACTIVE,
    HOAT_DONG: MA_TRANG_THAI_VOUCHER.ACTIVE,
    UPCOMING: MA_TRANG_THAI_VOUCHER.UPCOMING,
    CHUA_HIEU_LUC: MA_TRANG_THAI_VOUCHER.UPCOMING,
    EXPIRED: MA_TRANG_THAI_VOUCHER.EXPIRED,
    HET_HAN: MA_TRANG_THAI_VOUCHER.EXPIRED,
    HETHAN: MA_TRANG_THAI_VOUCHER.EXPIRED,
    USED_UP: MA_TRANG_THAI_VOUCHER.USED_UP,
    HET_LUOT: MA_TRANG_THAI_VOUCHER.USED_UP,
    USED: MA_TRANG_THAI_VOUCHER.USED,
    DA_DUNG: MA_TRANG_THAI_VOUCHER.USED,
    DA_SU_DUNG: MA_TRANG_THAI_VOUCHER.USED,
    INACTIVE: MA_TRANG_THAI_VOUCHER.INACTIVE,
    TAM_TAT: MA_TRANG_THAI_VOUCHER.INACTIVE,
    DISABLED: MA_TRANG_THAI_VOUCHER.DISABLED,
    VO_HIEU: MA_TRANG_THAI_VOUCHER.DISABLED,
    UNKNOWN: MA_TRANG_THAI_VOUCHER.UNKNOWN,
    KHONG_XAC_DINH: MA_TRANG_THAI_VOUCHER.UNKNOWN,
  }

  return banDoKhoa[khoa] || MA_TRANG_THAI_VOUCHER.UNKNOWN
}

const layTrangThaiTuDoiTuong = (nguon) => {
  if (!nguon || typeof nguon !== 'object') return nguon

  return layChuoi(
    nguon.trangThaiRuntime,
    nguon.TrangThaiRuntime,
    nguon.runtimeStatus,
    nguon.RuntimeStatus,
    nguon.trangThai,
    nguon.TrangThai,
    nguon.status,
    nguon.Status,
    nguon.maTrangThai,
    nguon.MaTrangThai,
  )
}

const layLoaiMaTuDoiTuong = (nguon) => {
  if (!nguon || typeof nguon !== 'object') return nguon

  return layChuoi(
    nguon.loaiMaHienThi,
    nguon.LoaiMaHienThi,
    nguon.nhanLoaiMa,
    nguon.NhanLoaiMa,
    nguon.loaiMa,
    nguon.LoaiMa,
    nguon.maLoai,
    nguon.MaLoai,
  )
}

const layNguonTuDoiTuong = (nguon) => {
  if (!nguon || typeof nguon !== 'object') return nguon

  return layChuoi(
    nguon.nguon,
    nguon.Nguon,
    nguon.nguonTao,
    nguon.NguonTao,
    nguon.source,
    nguon.Source,
  )
}

export const normalizeVoucherTrangThai = (status) =>
  chuanHoaKhoaTrangThai(layTrangThaiTuDoiTuong(status))

export const getVoucherTrangThaiLabel = (status) => {
  if (status && typeof status === 'object') {
    const labelTrucTiep = layChuoi(
      status.trangThaiHienThi,
      status.TrangThaiHienThi,
      status.nhanTrangThai,
      status.NhanTrangThai,
      status.label,
      status.Label,
    )

    if (labelTrucTiep) {
      const khoaNhan = normalizeVoucherTrangThai(labelTrucTiep)
      if (khoaNhan !== MA_TRANG_THAI_VOUCHER.UNKNOWN) {
        return NHAN_TRANG_THAI_VOUCHER[khoaNhan] || labelTrucTiep
      }
      return labelTrucTiep
    }
  }

  const khoaTrangThai = normalizeVoucherTrangThai(status)
  return NHAN_TRANG_THAI_VOUCHER[khoaTrangThai] || NHAN_TRANG_THAI_VOUCHER.UNKNOWN
}

export const normalizeVoucherLoaiMa = (loaiMa) =>
  chuanHoaKhoaLoaiVoucher(layLoaiMaTuDoiTuong(loaiMa))

export const getVoucherLoaiMaLabel = (loaiMa) => {
  if (loaiMa && typeof loaiMa === 'object') {
    const labelTrucTiep = layChuoi(
      loaiMa.loaiMaHienThi,
      loaiMa.LoaiMaHienThi,
      loaiMa.nhanLoaiMa,
      loaiMa.NhanLoaiMa,
    )

    if (labelTrucTiep) {
      const khoaNhan = normalizeVoucherLoaiMa(labelTrucTiep)
      if (khoaNhan !== MA_LOAI_VOUCHER.UNKNOWN) {
        return NHAN_LOAI_VOUCHER[khoaNhan] || labelTrucTiep
      }
      return labelTrucTiep
    }
  }

  const khoaLoaiMa = normalizeVoucherLoaiMa(loaiMa)
  return NHAN_LOAI_VOUCHER[khoaLoaiMa] || NHAN_LOAI_VOUCHER.UNKNOWN
}

const chuanHoaKhoaNguon = (giaTri) => {
  const chuoi = layChuoi(giaTri)
  if (!chuoi || chuoi === '--') return MA_NGUON_VOUCHER.UNKNOWN

  const khoa = boDauTiengViet(chuoi)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const banDoKhoa = {
    DOI_DIEM_TICH_LUY: MA_NGUON_VOUCHER.DOI_DIEM_TICH_LUY,
    DOI_DIEM: MA_NGUON_VOUCHER.DOI_DIEM_TICH_LUY,
    SEED: MA_NGUON_VOUCHER.SEED,
    DU_LIEU_MAU: MA_NGUON_VOUCHER.SEED,
    ADMIN: MA_NGUON_VOUCHER.ADMIN,
    NOI_BO: MA_NGUON_VOUCHER.ADMIN,
    TAO_THU_CONG: MA_NGUON_VOUCHER.ADMIN,
    SYSTEM: MA_NGUON_VOUCHER.SYSTEM,
    HE_THONG: MA_NGUON_VOUCHER.SYSTEM,
    IMPORT: MA_NGUON_VOUCHER.IMPORT,
    NHAP_DU_LIEU: MA_NGUON_VOUCHER.IMPORT,
    UNKNOWN: MA_NGUON_VOUCHER.UNKNOWN,
    KHONG_XAC_DINH: MA_NGUON_VOUCHER.UNKNOWN,
  }

  return banDoKhoa[khoa] || MA_NGUON_VOUCHER.UNKNOWN
}

export const normalizeVoucherNguon = (nguon) =>
  chuanHoaKhoaNguon(layNguonTuDoiTuong(nguon))

export const getVoucherNguonLabel = (nguon) => {
  if (nguon && typeof nguon === 'object') {
    const labelTrucTiep = layChuoi(
      nguon.nguonHienThi,
      nguon.NguonHienThi,
      nguon.nhanNguon,
      nguon.NhanNguon,
      nguon.label,
      nguon.Label,
    )

    if (labelTrucTiep) {
      const khoaNhan = normalizeVoucherNguon(labelTrucTiep)
      if (khoaNhan !== MA_NGUON_VOUCHER.UNKNOWN) {
        return NHAN_NGUON_VOUCHER[khoaNhan] || labelTrucTiep
      }
      return labelTrucTiep
    }
  }

  const chuoiNguon = layChuoi(layNguonTuDoiTuong(nguon) || nguon)
  if (!chuoiNguon || chuoiNguon === '--') return '--'

  const khoaNguon = normalizeVoucherNguon(chuoiNguon)
  return NHAN_NGUON_VOUCHER[khoaNguon] || 'Không xác định'
}

export const getVoucherTrangThaiBadgeClass = (status) => {
  const khoaTrangThai = normalizeVoucherTrangThai(status)
  return BADGE_CLASS_TRANG_THAI_VOUCHER[khoaTrangThai] || BADGE_CLASS_TRANG_THAI_VOUCHER.UNKNOWN
}

export const dichThongDiepLoiVoucher = (loi, macDinh = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.') => {
  const chuoiLoi = layChuoi(typeof loi === 'string' ? loi : loi?.message)
  if (!chuoiLoi) return macDinh

  const khopTrangThai = chuoiLoi.match(/voucher status is\s+([A-Za-z_]+)/i)
  const khoaTrangThai = normalizeVoucherTrangThai(khopTrangThai?.[1] || chuoiLoi)

  if (LOI_TRANG_THAI_VOUCHER[khoaTrangThai]) {
    return LOI_TRANG_THAI_VOUCHER[khoaTrangThai]
  }

  return chuoiLoi
}

export const parseNgayVoucher = (giaTri, cuoiNgay = false) => {
  if (!giaTri) return null
  if (giaTri instanceof Date) return new Date(giaTri.getTime())

  const chuoi = String(giaTri).trim()
  if (!chuoi) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(chuoi)) {
    const mocThoiGian = cuoiNgay ? '23:59:59.999' : '00:00:00.000'
    const ngay = new Date(`${chuoi}T${mocThoiGian}${MOC_GIO_VIET_NAM}`)
    return Number.isNaN(ngay.getTime()) ? null : ngay
  }

  const ngay = new Date(chuoi)
  return Number.isNaN(ngay.getTime()) ? null : ngay
}

const chuanHoaTrangThaiLuuTru = (giaTri) =>
  normalizeVoucherTrangThai(giaTri)

export const xacDinhTrangThaiVoucher = (voucher, thoiDiem = new Date()) => {
  const now = thoiDiem instanceof Date ? thoiDiem : new Date(thoiDiem)
  const ngayBatDau = parseNgayVoucher(voucher?.ngayBatDau || voucher?.NgayBatDau)
  const ngayKetThuc = parseNgayVoucher(
    voucher?.ngayKetThuc || voucher?.NgayKetThuc,
    true,
  )
  const soLanToiDa =
    voucher?.soLanToiDa != null ? Number(voucher?.soLanToiDa ?? voucher?.SoLanToiDa) : null
  const soLanDaDung = Number(voucher?.soLanDaDung ?? voucher?.SoLanDaDung ?? 0)
  const trangThaiLuuTru = chuanHoaTrangThaiLuuTru(
    voucher?.trangThaiRuntime ||
      voucher?.TrangThaiRuntime ||
      voucher?.runtimeStatus ||
      voucher?.RuntimeStatus ||
      voucher?.trangThai ||
      voucher?.TrangThai ||
      voucher?.status ||
      voucher?.Status ||
      'ACTIVE',
  )

  if (ngayBatDau && now < ngayBatDau) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.UPCOMING,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.UPCOMING,
      trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.UPCOMING,
      coTheApDung: false,
      lyDoTrangThai: 'Mã giảm giá chưa đến thời gian áp dụng.',
    }
  }

  if (ngayKetThuc && now > ngayKetThuc) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.EXPIRED,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
      trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
      coTheApDung: false,
      lyDoTrangThai: 'Mã giảm giá đã hết hạn.',
    }
  }

  if (soLanToiDa != null && soLanDaDung >= soLanToiDa) {
    return {
      maTrangThai: MA_TRANG_THAI_VOUCHER.USED_UP,
      nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.USED_UP,
      trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.USED_UP,
      coTheApDung: false,
      lyDoTrangThai: 'Mã giảm giá đã đạt giới hạn sử dụng.',
    }
  }

  switch (trangThaiLuuTru) {
    case MA_TRANG_THAI_VOUCHER.UPCOMING:
      return {
        maTrangThai: MA_TRANG_THAI_VOUCHER.UPCOMING,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.UPCOMING,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.UPCOMING,
        coTheApDung: false,
        lyDoTrangThai: 'Mã giảm giá chưa đến thời gian áp dụng.',
      }
    case MA_TRANG_THAI_VOUCHER.EXPIRED:
      return {
        maTrangThai: MA_TRANG_THAI_VOUCHER.EXPIRED,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.EXPIRED,
        coTheApDung: false,
        lyDoTrangThai: 'Mã giảm giá đã hết hạn.',
      }
    case MA_TRANG_THAI_VOUCHER.USED_UP:
      return {
        maTrangThai: MA_TRANG_THAI_VOUCHER.USED_UP,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.USED_UP,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.USED_UP,
        coTheApDung: false,
        lyDoTrangThai: 'Mã giảm giá đã đạt giới hạn sử dụng.',
      }
    case MA_TRANG_THAI_VOUCHER.USED:
      return {
        maTrangThai: MA_TRANG_THAI_VOUCHER.USED,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.USED,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.USED,
        coTheApDung: false,
        lyDoTrangThai: 'Mã giảm giá đã được dùng.',
      }
    case MA_TRANG_THAI_VOUCHER.INACTIVE:
    case MA_TRANG_THAI_VOUCHER.DISABLED:
      return {
        maTrangThai: trangThaiLuuTru,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.INACTIVE,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.INACTIVE,
        coTheApDung: false,
        lyDoTrangThai: 'Mã giảm giá đang tạm tắt.',
      }
    case MA_TRANG_THAI_VOUCHER.UNKNOWN:
      return {
        maTrangThai: MA_TRANG_THAI_VOUCHER.UNKNOWN,
        nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.UNKNOWN,
        trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.UNKNOWN,
        coTheApDung: false,
        lyDoTrangThai: 'Không xác định trạng thái mã giảm giá.',
      }
    default:
      break
  }

  return {
    maTrangThai: MA_TRANG_THAI_VOUCHER.ACTIVE,
    nhanTrangThai: NHAN_TRANG_THAI_VOUCHER.ACTIVE,
    trangThaiHienThi: NHAN_TRANG_THAI_VOUCHER.ACTIVE,
    coTheApDung: true,
    lyDoTrangThai: '',
  }
}
