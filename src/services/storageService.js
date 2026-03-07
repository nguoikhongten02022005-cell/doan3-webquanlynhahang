const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const getStorageItem = (key) => {
  if (!canUseStorage()) {
    return null
  }

  return localStorage.getItem(key)
}

export const setStorageItem = (key, value) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(key, value)
}

export const removeStorageItem = (key) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(key)
}

export const getStorageJSON = (key, fallbackValue = null) => {
  const raw = getStorageItem(key)

  if (!raw) {
    return fallbackValue
  }

  try {
    return JSON.parse(raw)
  } catch {
    return fallbackValue
  }
}

export const setStorageJSON = (key, value) => {
  setStorageItem(key, JSON.stringify(value))
}
