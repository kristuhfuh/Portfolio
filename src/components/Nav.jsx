import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../lib/theme.jsx'
import { motion, useScroll, useSpring } from 'framer-motion'
import LocalTime from './LocalTime.jsx'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group flex h-9 w-9 items-center justify-center rounded-full border border-line transition-[colors,transform] duration-150 hover:bg-ink hover:text-cream active:scale-[0.92] dark:border-dark-line dark:hover:bg-cream dark:hover:text-ink"
    >
      {theme === 'light' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
      )}
    </button>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  
  // Scroll progress tracking
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  })

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" className="fill-ink dark:fill-cream" />
            <text x="16" y="22" fontFamily="Fraunces, serif" fontSize="18" fontWeight="500" textAnchor="middle" className="fill-cream dark:fill-ink">C</text>
            <circle cx="24" cy="8" r="3" fill="#6D28D9" />
          </svg>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="label text-ink dark:text-dark-ink">Christopher Akpoguma</span>
            <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {isHome ? (
            <>
              <a href="#work" className="label link-underline text-ink dark:text-dark-ink">Work</a>
              <a href="#experience" className="label link-underline text-ink dark:text-dark-ink">Experience</a>
              <a href="#about" className="label link-underline text-ink dark:text-dark-ink">About</a>
              <a href="#contact" className="label link-underline text-ink dark:text-dark-ink">Contact</a>
            </>
          ) : (
            <Link to="/" className="label link-underline text-ink dark:text-dark-ink">← Back home</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LocalTime className="hidden sm:inline-flex" />
          <ThemeToggle />
          <a
            href="mailto:hello@kristuhfuh.com"
            className="label hidden rounded-full bg-ink px-4 py-2.5 text-cream transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.95] dark:bg-cream dark:text-ink dark:hover:bg-accent dark:hover:text-cream md:inline-flex"
          >
            Let's Talk
          </a>
        </div>
      </div>
      
      {/* Scroll progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent via-accent to-accent origin-left"
        style={{ scaleX }}
      />
    </header>
  )
}
