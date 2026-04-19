import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth.jsx'
import CustomCursor from '../components/CustomCursor.jsx'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function AdminLogin() {
  const { login, requestReset, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // login | forgot | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.success) navigate('/admin')
    else setError(result.error)
  }

  const handleForgot = (e) => {
    e.preventDefault()
    setError('')
    const result = requestReset(email)
    if (result.success) {
      setGeneratedCode(result.token)
      setMode('reset')
      setSuccess(`Reset code: ${result.token}`)
    } else setError(result.error)
  }

  const handleReset = (e) => {
    e.preventDefault()
    setError('')
    const result = resetPassword(resetCode, newPassword)
    if (result.success) {
      setSuccess('Password changed! Redirecting to login...')
      setTimeout(() => { setMode('login'); setSuccess(''); setPassword('') }, 1500)
    } else setError(result.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 dark:bg-dark-bg">
      <CustomCursor />
      <div className="grain pointer-events-none fixed inset-0" />
      <motion.div
        initial="hidden" animate="show" variants={fade}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="mx-auto mb-4">
            <rect width="32" height="32" rx="6" className="fill-ink dark:fill-cream" />
            <text x="16" y="22" fontFamily="Fraunces, serif" fontSize="18" fontWeight="500" textAnchor="middle" className="fill-cream dark:fill-ink">C</text>
            <circle cx="24" cy="8" r="3" fill="#6D28D9" />
          </svg>
          <h1 className="font-display text-3xl text-ink dark:text-dark-ink">
            {mode === 'login' ? 'CMS Login' : mode === 'forgot' ? 'Reset Password' : 'Enter Reset Code'}
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-dark-muted">
            {mode === 'login' ? 'Sign in to manage your portfolio' : mode === 'forgot' ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white/60 p-8 backdrop-blur dark:border-dark-line dark:bg-white/[0.03]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label mb-1.5 block text-muted dark:text-dark-muted">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full rounded-lg border border-line bg-cream px-4 py-3 text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
              </div>
              <div>
                <label className="label mb-1.5 block text-muted dark:text-dark-muted">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full rounded-lg border border-line bg-cream px-4 py-3 text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
              </div>
              <button type="submit" className="label w-full rounded-lg bg-accent px-4 py-3.5 text-cream transition-transform hover:scale-[1.01] active:scale-[0.99]">
                Sign In
              </button>
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                className="w-full text-center text-sm text-accent hover:underline">
                Forgot password?
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="label mb-1.5 block text-muted dark:text-dark-muted">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full rounded-lg border border-line bg-cream px-4 py-3 text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
              </div>
              <button type="submit" className="label w-full rounded-lg bg-accent px-4 py-3.5 text-cream transition-transform hover:scale-[1.01]">
                Send Reset Code
              </button>
              <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className="w-full text-center text-sm text-muted hover:underline dark:text-dark-muted">
                Back to login
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="label mb-1.5 block text-muted dark:text-dark-muted">Reset Code</label>
                <input type="text" value={resetCode} onChange={e => setResetCode(e.target.value)} required placeholder={generatedCode}
                  className="w-full rounded-lg border border-line bg-cream px-4 py-3 font-mono text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
              </div>
              <div>
                <label className="label mb-1.5 block text-muted dark:text-dark-muted">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={4}
                  className="w-full rounded-lg border border-line bg-cream px-4 py-3 text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
              </div>
              <button type="submit" className="label w-full rounded-lg bg-accent px-4 py-3.5 text-cream transition-transform hover:scale-[1.01]">
                Reset Password
              </button>
              <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className="w-full text-center text-sm text-muted hover:underline dark:text-dark-muted">
                Back to login
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted dark:text-dark-muted">
          Portfolio CMS · Christopher Akpoguma
        </p>
      </motion.div>
    </div>
  )
}
