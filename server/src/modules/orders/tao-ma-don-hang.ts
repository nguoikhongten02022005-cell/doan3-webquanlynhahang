export const taoMaDonHang = () => {
  const now = new Date()
  const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const ngauNhien = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `DH-${yyyymmdd}-${ngauNhien}`
}
