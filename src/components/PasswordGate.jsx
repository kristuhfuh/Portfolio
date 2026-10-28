import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Soft client-side preview gate. The password lives in the bundle — this is a
// deterrent, not real security. To swap in a hashed check later, replace the
// equality compare in handleSubmit with a SHA-256 hex-digest comparison.
const PREVIEW_PASSWORD = 'landmark2026'

export default function PasswordGate({ storageKey, title, subtitle, accent = '#FF8A00', children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === '1') setUnlocked(true)
    } catch {}
  }, [storageKey])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() === PREVIEW_PASSWORD) {
      try { sessionStorage.setItem(storageKey, '1') } catch {}
      setUnlocked(true)
      setError('')
    } else {
      setError('Incorrect password. Request access from Christopher.')
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <section className="border-t border-line py-20 dark:border-dark-line md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl rounded-3xl border p-8 text-center md:p-12"
          style={{ borderColor: `${accent}40`, background: `${accent}08` }}
        >
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: `${accent}25`, color: accent }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="font-display text-2xl text-ink dark:text-dark-ink md:text-3xl">{title}</h3>
          {subtitle && <p className="mt-3 text-muted dark:text-dark-muted">{subtitle}</p>}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter preview password"
              className="rounded-xl border border-line bg-white px-4 py-3 text-center text-ink outline-none transition dark:border-dark-line dark:bg-black/30 dark:text-dark-ink"
              onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${accent}` }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = '' }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="rounded-xl px-5 py-3 font-medium text-cream transition hover:opacity-90"
              style={{ background: accent }}
            >
              Unlock preview
            </button>
          </form>
          <p className="label mt-6 text-xs text-muted dark:text-dark-muted">
            Unreleased screens. Access limited to invited reviewers.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
