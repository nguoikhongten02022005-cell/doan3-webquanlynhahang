export const parsePriceToNumber = (price) => {
  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : 0
  }

  if (typeof price === 'string') {
    const numeric = Number(price.replace(/[^\d]/g, ''))
    return Number.isNaN(numeric) ? 0 : numeric
  }

  return 0
}
