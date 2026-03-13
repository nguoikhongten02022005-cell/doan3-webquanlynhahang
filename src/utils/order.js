export const ORDER_STATUS_LABELS = Object.freeze({
  MOI_TAO: 'Mới tạo',
  DA_XAC_NHAN: 'Đã xác nhận',
  DANG_CHUAN_BI: 'Đang chuẩn bị',
  DANG_PHUC_VU: 'Đang phục vụ',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
})

export const ORDER_STATUS_TONES = Object.freeze({
  MOI_TAO: 'warning',
  DA_XAC_NHAN: 'success',
  DANG_CHUAN_BI: 'warning',
  DANG_PHUC_VU: 'warning',
  DA_HOAN_THANH: 'success',
  DA_HUY: 'danger',
})

export const ORDER_TIMELINE_STEPS = Object.freeze([
  'Mới tạo',
  'Đã xác nhận',
  'Đang chuẩn bị',
  'Đang phục vụ',
  'Hoàn thành',
])

const ORDER_TIMELINE_STEP_BY_STATUS = Object.freeze({
  MOI_TAO: 1,
  DA_XAC_NHAN: 2,
  DANG_CHUAN_BI: 3,
  DANG_PHUC_VU: 4,
  DA_HOAN_THANH: 5,
  DA_HUY: 0,
})

export const PAYMENT_METHOD_LABELS = Object.freeze({
  TIEN_MAT: 'Tiền mặt',
  CHUYEN_KHOAN: 'Chuyển khoản',
  THE: 'Thẻ',
})

export const PAYMENT_METHOD_OPTIONS = Object.freeze([
  {
    value: 'TIEN_MAT',
    label: 'Tiền mặt khi nhận hàng',
    description: 'Thanh toán trực tiếp khi nhận món.',
  },
  {
    value: 'CHUYEN_KHOAN',
    label: 'Chuyển khoản',
    description: 'Chuyển khoản trước khi giao hàng.',
  },
  {
    value: 'THE',
    label: 'Thanh toán bằng thẻ',
    description: 'Dùng thẻ khi quầy hoặc thiết bị hỗ trợ.',
  },
])

const normalizeText = (value) => String(value ?? '').trim()

const normalizeSelectedSize = (value) => normalizeText(value).toUpperCase() || 'M'

const normalizeSelectedToppings = (value) => (
  Array.isArray(value)
    ? value.map((item) => normalizeText(item)).filter(Boolean)
    : []
)

const PAYMENT_METHOD_ALIASES = Object.freeze({
  cash: 'TIEN_MAT',
  banking: 'CHUYEN_KHOAN',
  card: 'THE',
})

const normalizePaymentMethod = (value) => {
  const normalized = normalizeText(value)

  if (PAYMENT_METHOD_LABELS[normalized]) {
    return normalized
  }

  return PAYMENT_METHOD_ALIASES[normalized.toLowerCase()] || 'TIEN_MAT'
}

const normalizeMenuItemId = (value) => {
  const normalized = Number(value)
  return Number.isInteger(normalized) && normalized > 0 ? normalized : undefined
}

export const getOrderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || normalizeText(status) || 'Không xác định'

export const getOrderStatusTone = (status) => ORDER_STATUS_TONES[status] || 'neutral'

export const getOrderTimelineStep = (status) => ORDER_TIMELINE_STEP_BY_STATUS[status] ?? 0

export const isCancelledOrderStatus = (status) => status === 'DA_HUY'

export const isTerminalOrderStatus = (status) => status === 'DA_HOAN_THANH' || status === 'DA_HUY'

export const isActiveOrderStatus = (status) => Boolean(status) && !isTerminalOrderStatus(status)

export const getPaymentMethodLabel = (paymentMethod) => (
  PAYMENT_METHOD_LABELS[paymentMethod] || normalizeText(paymentMethod) || 'Chưa chọn'
)

export const mapCartItemToOrderItem = (item) => ({
  menuItemId: normalizeMenuItemId(item?.id),
  quantity: Math.max(1, Number(item?.quantity) || 1),
  selectedSize: normalizeSelectedSize(item?.selectedSize),
  selectedToppings: normalizeSelectedToppings(item?.selectedToppings),
  specialNote: normalizeText(item?.specialNote),
  variantKey: normalizeText(item?.variantKey),
})

export const buildCreateOrderPayload = ({ cartItems, voucherCode, customer, note, tableNumber, paymentMethod }) => ({
  items: Array.isArray(cartItems) ? cartItems.map(mapCartItemToOrderItem) : [],
  voucherCode: normalizeText(voucherCode).toUpperCase(),
  customer: {
    fullName: normalizeText(customer?.fullName),
    phone: normalizeText(customer?.phone),
    email: normalizeText(customer?.email),
    address: normalizeText(customer?.address),
  },
  note: normalizeText(note),
  tableNumber: normalizeText(tableNumber),
  paymentMethod: normalizePaymentMethod(paymentMethod),
})
