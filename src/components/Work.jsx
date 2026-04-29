import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { getProjects, normalizeDriveUrl } from '../lib/cms.js'

// ─── Shared helpers ──────────────────────────────────────────────────────────

function getSlides(project) {
  const gallery = (project.images || []).map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
  return [project.cover, ...gallery].filter(Boolean).map(normalizeDriveUrl)
}

// Word-by-word reveal for the section heading
function WordReveal({ text, className = '', delay = 0 }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.28em', verticalAlign: 'bottom' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '106%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{
              delay: delay + i * 0.06,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ─── Mobile: simple stacked cards ────────────────────────────────────────────

function MobileCard({ project, index }) {
  const { slug, number, title, tagline, tags, year, metrics, accent = '#6D28D9' } = project
  const slides = getSlides(project)
  const cover = slides[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/work/${slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-line dark:border-dark-line"
      >
        {/* Image */}
        {cover && (
          <div className="relative h-52 overflow-hidden bg-ink/10">
            <motion.img
              src={cover}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>
        )}

        <div className="p-5">
          <div className="label mb-2 text-muted dark:text-dark-muted">
            {number} · {year}
          </div>
          <h3 className="display-lg text-[1.6rem] text-ink dark:text-dark-ink">{title}</h3>
          <p className="mt-1 text-sm text-muted dark:text-dark-muted">{tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map(t => (
              <span
                key={t}
                className="label rounded-full border border-line px-3 py-1 text-muted dark:border-dark-line dark:text-dark-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Desktop: full-height project card ───────────────────────────────────────

function DesktopCard({ project }) {
  const { slug, title, tagline, tags, year, number, metrics, accent = '#6D28D9' } = project
  const [hovered, setHovered] = useState(false)
  const slides = getSlides(project)
  const [slideIdx, setSlideIdx] = useState(0)
  const cover = slides[0]

  // Cycle slides on hover
  useEffect(() => {
    if (!hovered || slides.length <= 1) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 1800)
    return () => clearInterval(t)
  }, [hovered, slides.length])

  return (
    <Link
      to={`/work/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSlideIdx(0) }}
      className="group relative flex h-[68vh] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-line/60 dark:border-dark-line/60"
      style={{ width: 'clamp(460px, 42vw, 680px)' }}
    >
      {/* Image fills card */}
      <div className="relative flex-1 overflow-hidden bg-ink/5 dark:bg-white/3">
        <AnimatePresence mode="sync">
          {cover ? (
            <motion.img
              key={slides[slideIdx]}
              src={slides[slideIdx]}
              alt={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            /* Placeholder if no image */
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `${accent}18` }}
            >
              <span className="display-lg text-[5rem] opacity-10">{number}</span>
            </div>
          )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        {/* Hover "View" circle */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-cream shadow-xl"
            style={{ color: accent }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        {/* Slide dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1 z-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === slideIdx ? 16 : 4,
                  background: i === slideIdx ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom content on image */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <div className="label mb-2 text-cream/50">{number} · {year}</div>
          <motion.h3
            animate={{ x: hovered ? 6 : 0 }}
            transition={{ duration: 0.25 }}
            className="display-lg text-[clamp(1.7rem,2.8vw,2.6rem)] text-cream"
          >
            {title}
          </motion.h3>
          <p className="mt-2 max-w-[340px] text-sm text-cream/65 leading-relaxed">{tagline}</p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map(t => (
              <span
                key={t}
                className="label rounded-full border border-cream/20 px-3 py-1 text-cream/55"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Metrics */}
          {metrics && metrics.length > 0 && (
            <div className="mt-5 flex gap-8">
              {metrics.slice(0, 2).map((m, i) => (
                <div key={i}>
                  <div className="font-display text-2xl leading-none tracking-tightest text-cream"
                    style={{ letterSpacing: '-0.04em' }}>
                    {m.value}
                  </div>
                  <div className="label mt-1 text-cream/45">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Desktop horizontal-scroll container ─────────────────────────────────────

function WorkDesktop({ projects }) {
  const containerRef = useRef(null)
  const [translation, setTranslation] = useState(0)

  // Mirror the CSS clamp(460px, 42vw, 680px) exactly so scroll math matches
  useEffect(() => {
    const calc = () => {
      const preferred = window.innerWidth * 0.42
      const cardW = Math.max(460, Math.min(preferred, 680))
      const gap = 24
      setTranslation((projects.length - 1) * (cardW + gap))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [projects.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -translation])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    /* Outer: tall section that controls scroll distance */
    <div
      ref={containerRef}
      className="relative hidden md:block"
      style={{ height: `${projects.length * 100}vh` }}
    >
      {/* Sticky inner viewport */}
      <div className="sticky top-0 h-screen overflow-hidden border-t border-line dark:border-dark-line">
        {/* Header row */}
        <div className="flex items-end justify-between px-10 pb-8 pt-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="label mb-3 flex items-center gap-2 text-muted dark:text-dark-muted"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Selected Work — 2024 / 2025
            </motion.div>

            <h2 className="display-lg text-[clamp(2rem,4.5vw,4rem)] text-ink dark:text-dark-ink">
              <WordReveal
                text="Every project has a"
                className="text-ink dark:text-dark-ink"
                delay={0}
              />
              {' '}
              <span className="italic text-accent">
                <WordReveal text="heartbeat." delay={0.35} />
              </span>
            </h2>
          </div>

          {/* Card count */}
          <div className="hidden items-baseline gap-1 lg:flex">
            <span
              className="font-display text-4xl tabular-nums text-ink dark:text-dark-ink"
              style={{ letterSpacing: '-0.04em' }}
            >
              {projects.length}
            </span>
            <span className="label text-muted dark:text-dark-muted"> projects · scroll →</span>
          </div>
        </div>

        {/* Horizontal strip */}
        <motion.div
          style={{ x }}
          className="flex gap-6 px-10"
          transition={{ type: 'tween' }}
        >
          {projects.map((project, i) => (
            <DesktopCard key={project.slug} project={project} index={i} />
          ))}
        </motion.div>

        {/* Bottom progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-accent"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  )
}

// ─── Mobile vertical section ──────────────────────────────────────────────────

function WorkMobile({ projects }) {
  return (
    <section className="border-t border-line py-16 dark:border-dark-line md:hidden">
      <div className="px-6">
        <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Selected Work — 2024 / 2025
        </div>
        <h2 className="display-lg text-[clamp(2rem,8vw,3.5rem)] text-ink dark:text-dark-ink">
          Every project has a{' '}
          <em className="italic text-accent">heartbeat.</em>
        </h2>
        <p className="mt-4 text-muted dark:text-dark-muted">
          {projects.length} projects · tap any card for the full case study.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          {projects.map((project, i) => (
            <MobileCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Root Work component ──────────────────────────────────────────────────────

export default function Work() {
  const projects = getProjects().filter(p => !p.hidden)

  return (
    <div id="work">
      <WorkMobile projects={projects} />
      <WorkDesktop projects={projects} />
    </div>
  )
}
