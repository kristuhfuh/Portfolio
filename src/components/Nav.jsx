import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../lib/theme.jsx'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import LocalTime from './LocalTime.jsx'
import { getPageContent } from '../lib/cms.js'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group flex h-9 w-9 items-center justify-center rounded-full border border-line transition-[colors,transform] duration-150 hover:bg-ink hover:text-cream active:scale-[0.92] dark:border-dark-line dark:hover:bg-cream dark:hover:text-ink"
    >
      {theme === 'light' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  )
}

const navLinks = [
  { href: '#work',       label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about',      label: 'About' },
  { href: '#contact',    label: 'Contact' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Read contact email from CMS so it always matches
  const contactEmail = getPageContent('contact').email || 'akpogumachristopher@gmail.com'

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/60 backdrop-blur-md dark:border-white/5 dark:bg-[#0a0a0a]/60">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" className="fill-ink dark:fill-cream" />
              <text x="16" y="22" fontFamily="'Bricolage Grotesque', sans-serif" fontSize="18" fontWeight="800"
                textAnchor="middle" className="fill-cream dark:fill-ink">C</text>
              <circle cx="24" cy="8" r="3" fill="#6D28D9" />
            </svg>
            <div className="hidden flex-col leading-tight md:flex">
              <span className="label text-ink dark:text-dark-ink">Christopher Akpoguma</span>
              <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {isHome ? (
              navLinks.map(l => (
                <a key={l.href} href={l.href} className="label link-underline text-ink dark:text-dark-ink">{l.label}</a>
              ))
            ) : (
              <Link to="/" className="label link-underline text-ink dark:text-dark-ink">← Back home</Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <LocalTime className="hidden sm:inline-flex" />
            <ThemeToggle />
            <a
              href={`mailto:${contactEmail}`}
              className="label hidden rounded-full bg-ink px-4 py-2.5 text-cream transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.95] dark:bg-cream dark:text-ink dark:hover:bg-accent dark:hover:text-cream md:inline-flex"
            >
              Let's Talk
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className="block h-px w-5 bg-ink dark:bg-cream" />
              <span className="block h-px w-5 bg-ink dark:bg-cream" />
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-accent"
          style={{ scaleX }}
        />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-72 flex-col bg-cream dark:bg-dark-bg md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-6 py-5 dark:border-dark-line">
                <span className="label text-muted dark:text-dark-muted">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line dark:border-dark-line"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
                {isHome ? (
                  navLinks.map((l, i) => (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-center gap-3 rounded-xl px-4 py-4 text-ink transition-colors hover:bg-ink/5 dark:text-dark-ink dark:hover:bg-white/5"
                    >
                      <span className="label text-muted dark:text-dark-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-2xl tracking-tight">{l.label}</span>
                    </motion.a>
                  ))
                ) : (
                  <Link to="/" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-4 text-ink dark:text-dark-ink">
                    <span className="font-display text-2xl tracking-tight">← Home</span>
                  </Link>
                )}
              </nav>

              {/* Bottom CTA */}
              <div className="border-t border-line px-6 py-6 dark:border-dark-line">
                <a
                  href={`mailto:${contactEmail}`}
                  onClick={() => setMenuOpen(false)}
                  className="label flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-cream transition-colors hover:bg-accent dark:bg-cream dark:text-ink"
                >
                  Let's Talk
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
