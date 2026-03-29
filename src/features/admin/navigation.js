export const ADMIN_NAVIGATION = Object.freeze([
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    group: 'QUẢN LÝ',
    glyph: '◧',
  },
  {
    key: 'dat-ban',
    label: 'Đặt bàn',
    path: '/admin/dat-ban',
    group: 'QUẢN LÝ',
    glyph: '⌘',
    badgeKey: 'bookings',
  },
  {
    key: 'so-do-ban',
    label: 'Sơ đồ bàn',
    path: '/admin/so-do-ban',
    group: 'QUẢN LÝ',
    glyph: '▦',
  },
  {
    key: 'thuc-don',
    label: 'Thực đơn',
    path: '/admin/thuc-don',
    group: 'QUẢN LÝ',
    glyph: '◫',
  },
  {
    key: 'don-hang',
    label: 'Đơn hàng',
    path: '/admin/don-hang',
    group: 'QUẢN LÝ',
    glyph: '◎',
    badgeKey: 'orders',
  },
  {
    key: 'danh-gia',
    label: 'Đánh giá',
    path: '/admin/danh-gia',
    group: 'QUẢN LÝ',
    glyph: '✦',
    badgeKey: 'reviews',
  },
  {
    key: 'thong-ke',
    label: 'Thống kê doanh thu',
    path: '/admin/thong-ke',
    group: 'BÁO CÁO',
    glyph: '▲',
  },
  {
    key: 'nhan-vien',
    label: 'Nhân viên',
    path: '/admin/nhan-vien',
    group: 'HỆ THỐNG',
    glyph: '◌',
    adminOnly: true,
  },
])

export const locMenuAdminTheoQuyen = (laAdmin) => (
  ADMIN_NAVIGATION.filter((item) => !item.adminOnly || laAdmin)
)

export const layMenuAdminTheoNhom = (laAdmin) => {
  const menuHopLe = locMenuAdminTheoQuyen(laAdmin)

  return menuHopLe.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = []
    }

    acc[item.group].push(item)
    return acc
  }, {})
}

export const timMetaTrangAdmin = (pathname) => {
  const ketQuaKhopTuyetDoi = ADMIN_NAVIGATION.find((item) => item.path === pathname)

  if (ketQuaKhopTuyetDoi) {
    return ketQuaKhopTuyetDoi
  }

  return ADMIN_NAVIGATION.find((item) => pathname.startsWith(item.path)) || ADMIN_NAVIGATION[0]
}
