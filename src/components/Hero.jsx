import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import HeroImageBox from './HeroImageBox.jsx'
import { getPageContent } from '../lib/cms.js'

function cvDownloadUrl(raw) {
  if (!raw) return null
  const match = raw.match(/\/file\/d\/([^/?#]+)/)
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : raw
}

const rotatingWords = ['interfaces', 'systems', 'journeys', 'products', 'stories']

function RotatingWord() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % rotatingWords.length), 2600)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ opacity: 0, y: 14, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -14, rotateX: 60 }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block italic text-accent"
          style={{ transformOrigin: 'center center' }}
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Char-by-char curtain reveal — each character rises from below its own clip
function CharReveal({ text, italic = false, delay = 0, className = '' }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ overflow: 'hidden', lineHeight: 1.1 }}
        >
          <motion.span
            className={`inline-block ${italic ? 'italic' : ''} ${className}`}
            initial={{ y: '106%' }}
            animate={{ y: '0%' }}
            transition={{
              delay: delay + i * 0.032,
              duration: 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Multi-speed parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const heroContent = getPageContent('hero')
  const cvUrl = cvDownloadUrl(heroContent.cvUrl)

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pb-24 pt-36 md:pt-48">
      {/* Dotted grid — slowest */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 dotted opacity-30" />

      {/* Blob 1 — left */}
      <motion.div
        style={{ y: blob1Y }}
        className="pointer-events-none absolute -left-48 -top-10 h-[800px] w-[800px] rounded-full bg-accent/7 blur-[160px] dark:bg-accent/12"
      />
      {/* Blob 2 — right */}
      <motion.div
        style={{ y: blob2Y }}
        className="pointer-events-none absolute -right-56 top-40 h-[650px] w-[650px] rounded-full bg-violet-400/5 blur-[130px] dark:bg-violet-400/10"
      />
      {/* Blob 3 — bottom centre */}
      <motion.div
        style={{ y: blob2Y }}
        className="pointer-events-none absolute left-1/3 -bottom-20 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[90px]"
      />

      {/* Vertical frame lines */}
      <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line/40 to-transparent dark:via-dark-line/40 md:block" />
      <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line/40 to-transparent dark:via-dark-line/40 md:block" />

      {/* Horizontal accent line — draws in on load */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-6 right-6 top-36 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent md:top-48"
        style={{ transformOrigin: 'left center' }}
      />

      {/* Content block — fades + parallaxes on scroll */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto max-w-[1400px] px-6 md:px-10"
      >
        {/* Status row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <AvailabilityBadge />
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">Lagos, Nigeria</span>
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12 md:items-start">
          {/* Name + description */}
          <div className="md:col-span-7 lg:col-span-6">
            <h1 className="display-hero text-[clamp(3.8rem,11vw,10.5rem)] text-ink dark:text-dark-ink">
              <CharReveal text="Christopher" delay={0.28} />
              <br />
              {/* Keep dot inline with last name */}
              <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.3em' }}>
                <CharReveal text="Akpoguma" italic delay={0.58} />
                {/* Entry wrapper, then inner pulses */}
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block shrink-0"
                  style={{ transform: 'translateY(-0.18em)' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.38, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4, delay: 1.8 }}
                    className="block h-3 w-3 rounded-full bg-accent md:h-5 md:w-5"
                  />
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.18, duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
              className="mt-10 max-w-lg text-balance text-xl leading-[1.42] text-ink/78 dark:text-dark-ink/78 md:text-[1.35rem]"
            >
              Product Designer turning complex ideas into{' '}
              <RotatingWord />{' '}
              people actually finish using. Four years across fintech, real estate, events &amp; apps — with a specialty in{' '}
              <span className="italic text-accent">Framer</span> for production-ready web.
            </motion.p>
          </div>

          {/* Image + info card */}
          <div className="flex flex-col gap-8 md:col-span-5 lg:col-span-5 lg:col-start-8">
            {/* Image with parallax + slight tilt */}
            <motion.div
              initial={{ opacity: 0, y: 36, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ delay: 0.88, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: imgY }}
              className="w-full"
            >
              <HeroImageBox />
            </motion.div>

            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.12, duration: 0.68, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-4 border-l-[2px] border-accent/35 pl-5 dark:border-accent/25"
            >
              <div>
                <div className="label text-muted dark:text-dark-muted">Focus</div>
                <div className="mt-1 text-ink dark:text-dark-ink">Product design · Framer development</div>
              </div>
              <div>
                <div className="label text-muted dark:text-dark-muted">Open to</div>
                <div className="mt-1 text-ink dark:text-dark-ink">Full-time · Contract · Select freelance</div>
              </div>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="label mt-1 inline-flex w-fit items-center gap-2 text-ink transition-transform duration-150 active:scale-[0.95] dark:text-dark-ink"
                >
                  <span className="link-underline">Download CV</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v14M5 10l7 7 7-7" />
                  </svg>
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.95, duration: 0.9 }}
          className="mt-20 flex items-center gap-3 text-muted dark:text-dark-muted"
        >
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.span>
          <span className="label">Scroll to see the work</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
