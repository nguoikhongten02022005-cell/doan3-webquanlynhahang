import { getStorageJSON, removeStorageItem, setStorageJSON } from '../services/storageService'

const BOOKING_DRAFT_TTL_MS = 1000 * 60 * 60 * 12
const BOOKING_DRAFT_FIELDS = [
  'guests',
  'date',
  'time',
  'seatingArea',
  'occasion',
  'notes',
  'name',
  'phone',
  'email',
]

const sanitizeDraftValue = (value) => String(value ?? '').trim()

const sanitizeDraft = (draft) => {
  if (!draft || typeof draft !== 'object') {
    return null
  }

  const updatedAt = typeof draft.updatedAt === 'string' ? draft.updatedAt : new Date().toISOString()
  const sanitizedDraft = BOOKING_DRAFT_FIELDS.reduce((result, field) => {
    result[field] = sanitizeDraftValue(draft[field])
    return result
  }, {})

  return {
    ...sanitizedDraft,
    seatingArea: sanitizedDraft.seatingArea || 'KHONG_UU_TIEN',
    updatedAt,
  }
}

const isDraftExpired = (draft) => {
  const timestamp = Date.parse(draft?.updatedAt || '')

  if (Number.isNaN(timestamp)) {
    return true
  }

  return (Date.now() - timestamp) > BOOKING_DRAFT_TTL_MS
}

export const getValidBookingDraft = (storageKey) => {
  const draft = sanitizeDraft(getStorageJSON(storageKey, null))

  if (!draft || isDraftExpired(draft)) {
    removeStorageItem(storageKey)
    return null
  }

  return draft
}

export const saveBookingDraft = (storageKey, draftPayload) => {
  const sanitizedDraft = sanitizeDraft({
    ...draftPayload,
    updatedAt: new Date().toISOString(),
  })

  if (!sanitizedDraft) {
    removeStorageItem(storageKey)
    return null
  }

  setStorageJSON(storageKey, sanitizedDraft)
  return sanitizedDraft
}

export const clearBookingDraft = (storageKey) => {
  removeStorageItem(storageKey)
}

export const createBookingDraftSnapshot = (formData) => ({
  guests: formData?.guests,
  date: formData?.date,
  time: formData?.time,
  seatingArea: formData?.seatingArea,
  occasion: formData?.occasion,
  notes: formData?.notes,
  name: formData?.name,
  phone: formData?.phone,
  email: formData?.email,
})

export const BOOKING_DRAFT_TTL = BOOKING_DRAFT_TTL_MS
