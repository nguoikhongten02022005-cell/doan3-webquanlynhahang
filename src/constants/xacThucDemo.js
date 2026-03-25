export const TAI_KHOAN_KHACH_HANG_DEMO = Object.freeze({
  identifier: 'demo@example.com',
  username: 'demo',
  password: '123456',
  accessToken: 'demo-customer-auth-token',
  user: Object.freeze({
    id: 'demo-customer',
    fullName: 'Khách hàng Demo',
    username: 'demo',
    email: 'demo@example.com',
    phone: '0901234567',
    role: 'customer',
  }),
})

export const TAI_KHOAN_NOI_BO_DEMO = Object.freeze([
  {
    identifier: 'admin@nguyenvi.vn',
    username: 'admin',
    password: '123456',
    accessToken: 'demo-admin-auth-token',
    user: Object.freeze({
      id: 'demo-admin',
      fullName: 'Quản trị viên Demo',
      username: 'admin',
      email: 'admin@nguyenvi.vn',
      phone: '0909000001',
      role: 'admin',
    }),
  },
  {
    identifier: 'staff@nguyenvi.vn',
    username: 'nhanvien',
    password: '123456',
    accessToken: 'demo-staff-auth-token',
    user: Object.freeze({
      id: 'demo-staff',
      fullName: 'Nhân viên Demo',
      username: 'nhanvien',
      email: 'staff@nguyenvi.vn',
      phone: '0909000002',
      role: 'staff',
    }),
  },
])

export const laMaXacThucKhachDemo = (token) => token === TAI_KHOAN_KHACH_HANG_DEMO.accessToken
export const laMaXacThucNoiBoDemo = (token) => TAI_KHOAN_NOI_BO_DEMO.some((account) => account.accessToken === token)
export const laMaXacThucDemo = (token) => laMaXacThucKhachDemo(token) || laMaXacThucNoiBoDemo(token)

export const laThongTinDangNhapKhachDemo = (identifier, password) => {
  const normalizedIdentifier = String(identifier ?? '').trim().toLowerCase()
  const normalizedPassword = String(password ?? '')

  return normalizedPassword === TAI_KHOAN_KHACH_HANG_DEMO.password && (
    normalizedIdentifier === TAI_KHOAN_KHACH_HANG_DEMO.identifier.toLowerCase()
    || normalizedIdentifier === TAI_KHOAN_KHACH_HANG_DEMO.username.toLowerCase()
  )
}

export const timTaiKhoanNoiBoDemo = (identifier, password) => {
  const normalizedIdentifier = String(identifier ?? '').trim().toLowerCase()
  const normalizedPassword = String(password ?? '')

  return TAI_KHOAN_NOI_BO_DEMO.find((account) => (
    normalizedPassword === account.password
    && (
      normalizedIdentifier === account.identifier.toLowerCase()
      || normalizedIdentifier === account.username.toLowerCase()
    )
  )) || null
}
