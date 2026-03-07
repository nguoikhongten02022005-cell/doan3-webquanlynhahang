export const formatCurrency = (value) => {
  const amount = Number(value)
  const safeAmount = Number.isFinite(amount) ? amount : 0
  return `${safeAmount.toLocaleString('vi-VN')}₫`
}
