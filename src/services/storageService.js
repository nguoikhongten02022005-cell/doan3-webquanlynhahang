const canUseStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

export const getStorageItem = (key) => {
  if (!canUseStorage()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export const setStorageItem = (key, value) => {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // noop
  }
}

export const removeStorageItem = (key) => {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // noop
  }
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
  try {
    setStorageItem(key, JSON.stringify(value))
  } catch {
    // noop
  }
}
