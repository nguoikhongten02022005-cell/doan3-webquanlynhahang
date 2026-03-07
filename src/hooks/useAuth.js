import { useCallback, useMemo } from 'react'
import {
  clearCurrentUser,
  findAccountByIdentifier,
  getAccounts,
  getCurrentUser,
  saveAccounts,
  saveCurrentUser,
} from '../services/authService'

export const useAuth = () => {
  const currentUser = useMemo(() => getCurrentUser(), [])

  const login = useCallback((identifier, password) => {
    const accounts = getAccounts()
    const matchedAccount = findAccountByIdentifier(accounts, identifier)

    if (!matchedAccount || matchedAccount.password !== password) {
      return {
        success: false,
        error: 'Tên tài khoản/email hoặc mật khẩu không đúng.',
      }
    }

    saveCurrentUser(matchedAccount)

    return {
      success: true,
      user: matchedAccount,
    }
  }, [])

  const register = useCallback((payload) => {
    const normalizedUsername = payload.username.trim().toLowerCase()
    const normalizedEmail = payload.email.trim().toLowerCase()
    const accounts = getAccounts()

    const hasDuplicate = accounts.some((account) => {
      const existedUsername = String(account.username ?? '').toLowerCase()
      const existedEmail = String(account.email ?? '').toLowerCase()
      return existedUsername === normalizedUsername || existedEmail === normalizedEmail
    })

    if (hasDuplicate) {
      return {
        success: false,
        error: 'Tên tài khoản hoặc email đã tồn tại.',
      }
    }

    const newAccount = {
      fullName: payload.fullName.trim(),
      username: payload.username.trim(),
      email: payload.email.trim(),
      password: payload.password,
    }

    saveAccounts([...accounts, newAccount])

    return {
      success: true,
      user: newAccount,
    }
  }, [])

  const logout = useCallback(() => {
    clearCurrentUser()
  }, [])

  return {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
  }
}
