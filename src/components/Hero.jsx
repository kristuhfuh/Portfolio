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

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: 0.07 * i, ease: [0.23, 1, 0.32, 1] },
  }),
}

// Rotating adjectives — each describes a different facet of the work
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
          initial={{ opacity: 0, y: 12, rotateX: -70 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -12, rotateX: 70 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
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
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroContent = getPageContent('hero')
  const cvUrl = cvDownloadUrl(heroContent.cvUrl)

  return (
    <section ref={ref} className="relative overflow-hidden pb-24 pt-40 md:pb-40 md:pt-48">
      {/* Atmospheric parallax background */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 dotted opacity-40" />
      <motion.div style={{ y: bgY }}
        className="pointer-events-none absolute -left-20 top-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-3xl animate-float dark:bg-accent/20" />
      <motion.div style={{ y: bgY }}
        className="pointer-events-none absolute -right-24 bottom-10 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl animate-float dark:bg-accent/15"
        data-delay="2" />

      {/* Subtle decorative grid line */}
      <div className="pointer-events-none absolute left-10 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line to-transparent dark:via-dark-line md:block" />
      <div className="pointer-events-none absolute right-10 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-line to-transparent dark:via-dark-line md:block" />

      <motion.div style={{ y: textY, opacity }} className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div initial="hidden" animate="show" variants={fade} custom={0}
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <AvailabilityBadge />
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">Lagos, Nigeria</span>
          <span className="label text-muted dark:text-dark-muted">·</span>
          <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={fade} custom={1}
          className="mt-10 grid gap-x-10 gap-y-6 md:mt-16 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7 lg:col-span-6">
            <h1 className="display-hero text-[clamp(3.5rem,12vw,11rem)] text-ink dark:text-dark-ink">
              Christopher
              <br />
              <span className="inline-flex items-baseline gap-4">
                Akpoguma
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block h-3 w-3 translate-y-[-0.2em] rounded-full bg-accent md:h-5 md:w-5"
                />
              </span>
            </h1>
            <p className="mt-10 text-balance text-xl leading-[1.35] text-ink/85 dark:text-dark-ink/85 md:text-2xl">
              Product Designer turning complex ideas into <RotatingWord /> people actually finish using. Four years across real estate, fintech, events, and consumer apps — with a specialty in{' '}
              <span className="italic text-accent">Framer</span> for production-ready prototypes and web.
            </p>
          </div>

          <div className="md:col-span-5 lg:col-span-5 lg:col-start-8 flex flex-col gap-8 items-start">
            <HeroImageBox />

            <motion.div
              initial={{ opacity: 0, transform: 'translateX(20px)' }}
              animate={{ opacity: 1, transform: 'translateX(0px)' }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-4 border-l border-line pl-6 dark:border-dark-line w-full">
              <div>
                <div className="label text-muted dark:text-dark-muted">Focus</div>
                <div className="mt-1 text-ink dark:text-dark-ink">Product design · Framer development</div>
              </div>
              <div>
                <div className="label text-muted dark:text-dark-muted">Open to</div>
                <div className="mt-1 text-ink dark:text-dark-ink">Full-time · Contract · Select freelance</div>
              </div>
              {cvUrl && (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" download
                  className="label mt-2 inline-flex w-fit items-center gap-2 text-ink transition-transform duration-150 active:scale-[0.95] dark:text-dark-ink">
                  <span className="link-underline">Download CV</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v14M5 10l7 7 7-7" /></svg>
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20 flex items-center gap-3 text-muted dark:text-dark-muted"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </motion.span>
          <span className="label">Scroll to see the work</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
