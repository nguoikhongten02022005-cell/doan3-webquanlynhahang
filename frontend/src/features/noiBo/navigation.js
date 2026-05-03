export const NOI_BO_NAVIGATION = Object.freeze([
  {
    key: 'dashboard',
    label: 'Bảng điều khiển',
    path: '/noi-bo/dashboard',
    group: 'QUẢN LÝ',
    glyph: '◧',
  },
  {
    key: 'dat-ban',
    label: 'Đặt bàn',
    path: '/noi-bo/dat-ban',
    group: 'QUẢN LÝ',
    glyph: '⌘',
    badgeKey: 'bookings',
  },
  {
    key: 'so-do-ban',
    label: 'Sơ đồ bàn',
    path: '/noi-bo/so-do-ban',
    group: 'QUẢN LÝ',
    glyph: '▦',
  },
  {
    key: 'quan-ly-ban',
    label: 'Quản lý bàn',
    path: '/noi-bo/quan-ly-ban',
    group: 'QUẢN LÝ',
    glyph: '◩',
    chiChoQuanLy: true,
  },
{
    key: 'thuc-don',
    label: 'Thuc don',
    path: '/noi-bo/thuc-don',
    group: 'QUAN LY',
    glyph: '◫',
    chiChoQuanLy: true,
  },
  {
    key: 'ma-giam-gia',
    label: 'Ma giam gia',
    path: '/noi-bo/ma-giam-gia',
    group: 'QUAN LY',
    glyph: '◪',
    chiChoQuanLy: true,
  },
  {
    key: 'don-hang',
    label: 'Đơn hàng',
    path: '/noi-bo/don-hang',
    group: 'QUẢN LÝ',
    glyph: '◎',
    badgeKey: 'orders',
  },
  {
    key: 'danh-gia',
    label: 'Đánh giá',
    path: '/noi-bo/danh-gia',
    group: 'QUẢN LÝ',
    glyph: '✦',
    badgeKey: 'reviews',
  },
  {
    key: 'thong-ke',
    label: 'Thống kê doanh thu',
    path: '/noi-bo/thong-ke',
    group: 'BÁO CÁO',
    glyph: '▲',
    chiChoQuanLy: true,
  },
{
    key: 'nhan-vien',
    label: 'Nhan vien',
    path: '/noi-bo/nhan-vien',
    group: 'HỆ THỐNG',
    glyph: '◌',
    chiChoQuanLy: true,
  },
  {
    key: 'khach-hang',
    label: 'Khach hang',
    path: '/noi-bo/khach-hang',
    group: 'HỆ THỐNG',
    glyph: '◉',
    chiChoQuanLy: true,
  },
])

export const locMenuNoiBoTheoQuyen = (coQuyenQuanLy) => (
  NOI_BO_NAVIGATION.filter((item) => !item.chiChoQuanLy || coQuyenQuanLy)
)

export const layMenuNoiBoTheoNhom = (coQuyenQuanLy) => {
  const menuHopLe = locMenuNoiBoTheoQuyen(coQuyenQuanLy)

  return menuHopLe.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = []
    }

    acc[item.group].push(item)
    return acc
  }, {})
}

export const timMetaTrangNoiBo = (pathname) => {
  const ketQuaKhopTuyetDoi = NOI_BO_NAVIGATION.find((item) => item.path === pathname)

  if (ketQuaKhopTuyetDoi) {
    return ketQuaKhopTuyetDoi
  }

  return NOI_BO_NAVIGATION.find((item) => pathname.startsWith(item.path)) || NOI_BO_NAVIGATION[0]
}
