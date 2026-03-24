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

export const laMaXacThucKhachDemo = (token) => token === TAI_KHOAN_KHACH_HANG_DEMO.accessToken

export const laThongTinDangNhapKhachDemo = (identifier, password) => {
  const normalizedIdentifier = String(identifier ?? '').trim().toLowerCase()
  const normalizedPassword = String(password ?? '')

  return normalizedPassword === TAI_KHOAN_KHACH_HANG_DEMO.password && (
    normalizedIdentifier === TAI_KHOAN_KHACH_HANG_DEMO.identifier.toLowerCase()
    || normalizedIdentifier === TAI_KHOAN_KHACH_HANG_DEMO.username.toLowerCase()
  )
}
