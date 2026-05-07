import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="label text-muted dark:text-dark-muted">404</p>
        <h1 className="display-hero mt-3 text-[clamp(4rem,14vw,12rem)] leading-none text-ink dark:text-dark-ink">
          Lost.
        </h1>
        <p className="mt-6 text-muted dark:text-dark-muted">
          This page doesn't exist — but the work does.
        </p>
        <Link
          to="/"
          className="label mt-10 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-cream transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.96] dark:bg-cream dark:text-ink dark:hover:bg-accent dark:hover:text-cream"
        >
          ← Back to portfolio
        </Link>
      </motion.div>
    </div>
  )
}
