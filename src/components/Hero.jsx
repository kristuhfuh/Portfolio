import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import HeroImageBox from './HeroImageBox.jsx'
import { getPageContent } from '../lib/cms.js'

function richHtml(content = '') {
  if (!content) return ''
  if (/<[a-z][\s\S]*>/i.test(content)) return content
  return content.split('\n\n').filter(Boolean).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
}

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
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block italic text-accent"
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
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const heroContent = getPageContent('hero')
  const cvUrl = cvDownloadUrl(heroContent.cvUrl)

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pb-20 pt-32 md:pt-40"
    >
      {/* Very subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 dotted opacity-20 dark:opacity-10" />

      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto max-w-[1400px] px-6 md:px-10"
      >
        {/* Top line: availability + name intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <AvailabilityBadge />
          <span className="italic text-xl text-muted dark:text-dark-muted">
            Hi, I'm Christopher —
          </span>
        </motion.div>

        {/* Main hero grid: role text (left) + photo (right) */}
        <div className="grid items-start gap-10 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px]">
          {/* Left: MASSIVE role text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display-hero text-[clamp(4.5rem,13vw,12rem)] leading-[0.87] text-ink dark:text-dark-ink"
            >
              Product
              <br />
              <span className="text-accent">Designer.</span>
            </motion.h1>

            {/* Description — uses CMS subtitle if set, otherwise fallback with RotatingWord */}
            {heroContent.subtitle ? (
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 max-w-[480px] text-lg leading-relaxed text-ink/72 dark:text-dark-ink/72 md:text-xl [&>p]:mb-3 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: richHtml(heroContent.subtitle) }}
              />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 max-w-[480px] text-lg leading-relaxed text-ink/72 dark:text-dark-ink/72 md:text-xl"
              >
                Turning complex ideas into <RotatingWord /> people actually finish using.
                Four years across fintech, real estate, events &amp; apps — with a specialty in{' '}
                <em className="italic text-accent">Framer</em> for production-ready web.
              </motion.p>
            )}

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                className="label inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-cream transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.96] dark:bg-cream dark:text-ink dark:hover:bg-accent dark:hover:text-cream"
              >
                Get in Touch
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="label inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-70 dark:text-dark-ink"
                >
                  <span className="link-underline">Download CV</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v14M5 10l7 7 7-7" />
                  </svg>
                </a>
              )}
            </motion.div>

            {/* Info pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-8 dark:border-dark-line"
            >
              {[
                { label: 'Location', value: 'Lagos, Nigeria' },
                { label: 'Focus', value: heroContent.focus || 'Product Design · Framer' },
                { label: 'Open to', value: heroContent.openTo || 'Full-time · Contract' },
              ].map(item => (
                <div key={item.label}>
                  <div className="label text-muted dark:text-dark-muted">{item.label}</div>
                  <div className="mt-0.5 text-sm text-ink dark:text-dark-ink">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: hero image box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.88, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: imgY }}
          >
            <HeroImageBox />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-16 flex items-center gap-3 text-muted dark:text-dark-muted"
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
