import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const DEFAULT_EMAIL = 'akpogumachristopher@gmail.com'
const DEFAULT_PASSWORD = 'password'
const STORAGE_KEY = 'cms_auth'
const CREDS_KEY = 'cms_credentials'
const RESET_KEY = 'cms_reset_token'

function getCredentials() {
  try {
    const saved = localStorage.getItem(CREDS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
}

function saveCredentials(creds) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const creds = getCredentials()
    if (email === creds.email && password === creds.password) {
      const session = { email, loggedInAt: Date.now() }
      setUser(session)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const requestReset = (email) => {
    const creds = getCredentials()
    if (email !== creds.email) return { success: false, error: 'Email not found' }
    const token = Math.random().toString(36).slice(2, 8).toUpperCase()
    localStorage.setItem(RESET_KEY, JSON.stringify({ token, email, expires: Date.now() + 600000 }))
    return { success: true, token }
  }

  const resetPassword = (token, newPassword) => {
    try {
      const saved = JSON.parse(localStorage.getItem(RESET_KEY))
      if (!saved || saved.token !== token || Date.now() > saved.expires) {
        return { success: false, error: 'Invalid or expired reset code' }
      }
      const creds = getCredentials()
      creds.password = newPassword
      saveCredentials(creds)
      localStorage.removeItem(RESET_KEY)
      return { success: true }
    } catch {
      return { success: false, error: 'Reset failed' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, requestReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
