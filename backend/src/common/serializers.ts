export const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) {
    return ''
  }

  return value instanceof Date ? value.toISOString() : String(value)
}

export const decimalToNumber = (value: { toNumber(): number } | number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return 0
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return Number(value) || 0
  }

  return value.toNumber()
}

export const formatPriceVnd = (value: { toNumber(): number } | number | string) => {
  const amount = decimalToNumber(value)
  return `${amount.toLocaleString('vi-VN')}đ`
}
