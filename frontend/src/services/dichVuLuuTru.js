const canUseStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

export const layMucLuuTru = (key) => {
  if (!canUseStorage()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export const datMucLuuTru = (key, value) => {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // noop
  }
}

export const xoaMucLuuTru = (key) => {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // noop
  }
}

export const layJsonLuuTru = (key, fallbackValue = null) => {
  const raw = layMucLuuTru(key)

  if (!raw) {
    return fallbackValue
  }

  try {
    return JSON.parse(raw)
  } catch {
    return fallbackValue
  }
}

export const datJsonLuuTru = (key, value) => {
  try {
    datMucLuuTru(key, JSON.stringify(value))
  } catch {
    // noop
  }
}
