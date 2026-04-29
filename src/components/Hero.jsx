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
          initial={{ opacity: 0, y: 10, rotateX: -50 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -10, rotateX: 50 }}
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block italic text-accent"
          style={{ transformOrigin: 'center center' }}
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Two parallax speeds: background (slow) and content (medium)
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 55])
  const opacity = useTransform(scrollYProgress, [0, 0.52], [1, 0])

  const heroContent = getPageContent('hero')
  const cvUrl = cvDownloadUrl(heroContent.cvUrl)

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pb-24 pt-36 md:pt-48">
      {/* Dotted grid — slowest layer */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 dotted opacity-25" />

      {/* Accent blobs */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute -left-48 -top-16 h-[700px] w-[700px] rounded-full bg-accent/6 blur-[140px] dark:bg-accent/10"
      />
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute -right-60 top-40 h-[600px] w-[600px] rounded-full bg-violet-400/4 blur-[120px] dark:bg-violet-400/8"
      />

      {/* Vertical frame lines */}
      <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line/35 to-transparent dark:via-dark-line/35 md:block" />
      <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line/35 to-transparent dark:via-dark-line/35 md:block" />

      {/* Content block */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto max-w-[1400px] px-6 md:px-10"
      >
        {/* Status row — first in */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-wrap items-center gap-x-5 gap-y-3"
        >
          <AvailabilityBadge />
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">Lagos, Nigeria</span>
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
        </motion.div>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12 md:items-start">
          {/* Left: name + description — appear as unified blocks */}
          <div className="md:col-span-7 lg:col-span-6">
            {/* Name block */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="display-hero text-[clamp(3.8rem,11vw,10rem)] text-ink dark:text-dark-ink">
                Christopher
                <br />
                <span className="inline-flex items-baseline gap-3">
                  <em className="italic">Akpoguma</em>
                  {/* Pulsing dot — entry then infinite pulse */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.85, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block shrink-0"
                    style={{ transform: 'translateY(-0.12em)' }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.6,
                        delay: 1.2,
                      }}
                      className="block h-3 w-3 rounded-full bg-accent md:h-5 md:w-5"
                    />
                  </motion.span>
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-lg text-balance text-xl leading-[1.42] text-ink/78 dark:text-dark-ink/78 md:text-[1.32rem]"
            >
              Product Designer turning complex ideas into{' '}
              <RotatingWord />{' '}
              people actually finish using. Four years across fintech, real estate, events &amp; apps — with a specialty in{' '}
              <span className="italic text-accent">Framer</span>.
            </motion.p>
          </div>

          {/* Right: photo + info */}
          <div className="flex flex-col gap-8 md:col-span-5 lg:col-span-5 lg:col-start-8">
            <motion.div
              initial={{ opacity: 0, y: 32, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: imgY }}
            >
              <HeroImageBox />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.62, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4 border-l-2 border-accent/35 pl-5 dark:border-accent/25"
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
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 flex items-center gap-3 text-muted dark:text-dark-muted"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
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
