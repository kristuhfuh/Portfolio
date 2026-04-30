import { motion } from 'framer-motion'
import LocalTime from './LocalTime.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line dark:border-dark-line overflow-hidden">
      {/* Standard footer row */}
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="label text-muted dark:text-dark-muted">
          © {new Date().getFullYear()} Christopher Akpoguma · /kris+tuh+fuh/
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <LocalTime />
          <span className="label text-muted dark:text-dark-muted">Set in Fraunces + Inter Tight</span>
        </div>
      </div>

      {/* Big decorative name — like Elian Ross footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative select-none overflow-hidden"
        aria-hidden="true"
      >
        <p
          className="display-hero whitespace-nowrap text-[clamp(5rem,18vw,20rem)] leading-[0.82] text-ink/[0.06] dark:text-dark-ink/[0.06]"
          style={{ letterSpacing: '-0.045em' }}
        >
          Christopher
        </p>
      </motion.div>
    </footer>
  )
}
