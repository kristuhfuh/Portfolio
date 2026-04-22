import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { getProjectBySlug as getProject, getProjects } from '../lib/cms.js'
import AnimatedCounter from '../components/AnimatedCounter.jsx'

function getNextProject(slug) {
  const projects = getProjects()
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Story section (sticky heading + rich body) ───
function StoryBlock({ label, heading, accent, children }) {
  return (
    <section className="border-t border-line py-20 dark:border-dark-line md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-4">
          <div className="sticky top-32">
            <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              {label}
            </div>
            <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
              {heading}
            </h2>
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">{children}</div>
      </div>
    </section>
  )
}

// ─── Pull quote — dramatic editorial callout ───
function PullQuote({ quote, accent }) {
  return (
    <section className="border-t border-line dark:border-dark-line">
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          <span className="absolute -top-8 left-0 font-display text-[10rem] leading-none md:-left-16 md:-top-16 md:text-[16rem]"
            style={{ color: accent, opacity: 0.12 }}>
            &ldquo;
          </span>
          <blockquote className="relative font-display text-3xl italic leading-[1.2] tracking-tighter2 text-ink dark:text-dark-ink md:text-5xl lg:text-6xl">
            {quote}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-16" style={{ background: accent }} />
            <span className="label text-muted dark:text-dark-muted">The lesson</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Outcome stats grid — animated counters ───
function OutcomeStats({ stats, accent }) {
  if (!stats?.length) return null
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-24 text-cream dark:border-dark-line dark:bg-cream dark:text-ink md:py-32">
      {/* Accent-colored ambient glow */}
      <div className="pointer-events-none absolute -left-24 top-0 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: `${accent}40` }} />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: `${accent}30` }} />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <div className="label mb-4 text-cream/60 dark:text-ink/60">✦ By the numbers</div>
          <h2 className="display-lg text-[clamp(2.5rem,6vw,5rem)]">
            What the <em className="italic" style={{ color: accent }}>work</em> produced.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-cream/10 dark:bg-ink/10 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative flex flex-col gap-3 bg-ink p-8 transition-colors hover:bg-ink/80 dark:bg-cream dark:hover:bg-cream/80 md:p-10"
            >
              <div className="font-display text-[clamp(3rem,6vw,5rem)] leading-none tracking-tightest"
                style={{ color: accent }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
              </div>
              <div className="text-sm text-cream/80 dark:text-ink/80">{stat.label}</div>
              {/* Subtle grid corner mark */}
              <span className="absolute right-4 top-4 h-1 w-1 rounded-full bg-cream/20 dark:bg-ink/20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Deliverables — list of what shipped ───
function Deliverables({ items, accent }) {
  if (!items?.length) return null
  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                Deliverables
              </div>
              <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
                What <em className="italic" style={{ color: accent }}>shipped</em>.
              </h2>
              <p className="mt-6 text-muted dark:text-dark-muted">
                Every output from the project — design artefacts, systems, and production-ready assets.
              </p>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="grid gap-3">
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-white/40 px-5 py-4 transition-all hover:border-transparent hover:bg-white/80 dark:border-dark-line dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xs transition-all group-hover:border-transparent group-hover:text-cream dark:border-dark-line"
                    style={{ '--hover-bg': accent }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
                  >
                    ✓
                  </span>
                  <span className="text-ink dark:text-dark-ink">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Reception callout — small but punchy ───
function Reception({ quote, accent }) {
  if (!quote) return null
  return (
    <section className="border-t border-line py-20 dark:border-dark-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl rounded-3xl border p-8 md:p-12"
          style={{ borderColor: `${accent}40`, background: `${accent}08` }}
        >
          <div className="label mb-4 flex items-center gap-2" style={{ color: accent }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            Reception
          </div>
          <p className="font-display text-xl italic leading-relaxed tracking-tighter2 text-ink dark:text-dark-ink md:text-2xl">
            {quote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const THUMB_THRESHOLD = 5

// Normalize images — handles both old string[] and new {url,caption}[] formats
function normalizeImages(images) {
  if (!images) return []
  return images.map(img => typeof img === 'string' ? { url: img, caption: '' } : img)
}

// ─── Image gallery — auto-slideshow + Apple-style thumbnail strip ───
function ImageGallery({ images: rawImages, title, accent }) {
  const images = normalizeImages(rawImages)
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [direction, setDirection] = useState(1)
  const thumbsRef = useRef(null)
  const activeThumbRef = useRef(null)

  const active = images[activeIdx]
  const isVideo = active?.type === 'video'
  const imageInterval = hovered ? 12000 : 5000

  const go = (next) => {
    setDirection(next > activeIdx ? 1 : -1)
    setActiveIdx(next)
  }
  const prev = () => { setPaused(true); go(Math.max(0, activeIdx - 1)) }
  const next = () => { setPaused(true); go((activeIdx + 1) % images.length) }
  const advance = () => { setDirection(1); setActiveIdx(i => (i + 1) % images.length) }

  // Image timer — skipped for video slides
  useEffect(() => {
    if (paused || isVideo || images.length <= 1) return
    const t = setInterval(advance, imageInterval)
    return () => clearInterval(t)
  }, [paused, isVideo, images.length, imageInterval, activeIdx])

  // Resume 8 s after last manual interaction
  useEffect(() => {
    if (!paused) return
    const t = setTimeout(() => setPaused(false), 8000)
    return () => clearTimeout(t)
  }, [paused, activeIdx])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx])

  // Scroll thumbnail strip horizontally to keep active thumb centred
  useEffect(() => {
    const container = thumbsRef.current
    const thumb = activeThumbRef.current
    if (!container || !thumb) return
    const offset = thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }, [activeIdx])

  if (!images || images.length === 0) return null

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.96 }),
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      {/* Header */}
      <div className="label mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted dark:text-dark-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          Visual work
          {images.length > 1 && (
            <span className="text-muted/50 dark:text-dark-muted/50">{activeIdx + 1} / {images.length}</span>
          )}
        </div>
        {images.length > 1 && (
          <button onClick={() => setPaused(p => !p)}
            className="label flex items-center gap-1.5 text-xs text-muted transition hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink">
            {paused
              ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume</>
              : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause</>
            }
          </button>
        )}
      </div>

      {/* Main viewer */}
      <div
        className="relative mb-4 overflow-hidden rounded-3xl border border-line bg-black/5 dark:border-dark-line dark:bg-white/[0.02]"
        style={{ minHeight: 340 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="w-full"
          >
            {isVideo ? (
              <video
                key={active.url}
                src={active.url}
                controls
                playsInline
                preload="metadata"
                className="h-auto max-h-[75vh] w-full bg-black"
                onEnded={() => { if (!paused) advance() }}
              />
            ) : (
              <img
                src={active.url}
                alt={`${title} — visual ${activeIdx + 1}`}
                className="h-auto max-h-[75vh] w-full object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Caption pill */}
        <AnimatePresence>
          {active.caption && (
            <motion.div
              key={active.caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="absolute bottom-4 left-4 z-10 rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              {active.caption}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar — images only */}
        {images.length > 1 && !paused && !isVideo && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <motion.div
              key={`bar-${activeIdx}`}
              className="h-full origin-left"
              style={{ background: accent }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: imageInterval / 1000, ease: 'linear' }}
            />
          </div>
        )}

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} disabled={activeIdx === 0}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 disabled:opacity-20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Apple-style thumbnail strip */}
      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              ref={i === activeIdx ? activeThumbRef : null}
              onClick={() => { setPaused(true); go(i) }}
              className="relative shrink-0 overflow-hidden rounded-xl transition-all duration-300 focus:outline-none"
              style={{
                width: 80, height: 60,
                border: `2px solid ${i === activeIdx ? accent : 'transparent'}`,
                opacity: i === activeIdx ? 1 : 0.45,
                transform: i === activeIdx ? 'scale(1.06)' : 'scale(1)',
              }}
            >
              {img.type === 'video' ? (
                <>
                  <video src={img.url} className="h-full w-full object-cover" muted playsInline />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </>
              ) : (
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Main case study page ───
export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!project) return <Navigate to="/" replace />
  const next = getNextProject(slug)
  const accent = project.accent || '#6D28D9'

  return (
    <article>
      {/* ─── Hero with hook ─── */}
      <section ref={heroRef} className="relative overflow-hidden pb-12 pt-36 md:pb-20 md:pt-48">
        {/* Accent-tinted ambient glows */}
        <div className="pointer-events-none absolute -right-40 top-24 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: `${accent}18` }} />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ background: `${accent}10` }} />
        <div className="pointer-events-none absolute inset-0 dotted opacity-30" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="label mb-6 flex items-center gap-3 text-muted dark:text-dark-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              Case study {project.number} · {project.year}
            </div>

            <h1 className="display-hero text-[clamp(2.8rem,9vw,8rem)] text-ink dark:text-dark-ink">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-snug text-muted dark:text-dark-muted md:text-2xl">
              {project.tagline}
            </p>
          </motion.div>

          {/* Meta grid */}
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 dark:border-dark-line md:grid-cols-5">
            {[
              ['Client', project.client],
              ['Role', project.role],
              ['Timeline', project.timeline],
              ['Team', project.team],
              ['Location', project.location],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="label text-muted dark:text-dark-muted">{label}</dt>
                <dd className="mt-2 text-ink dark:text-dark-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* ─── Hook statement (huge editorial type) ─── */}
      {project.hook && (
        <section className="border-y border-line py-24 dark:border-dark-line md:py-36">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="label mb-6 flex items-center gap-2 text-muted dark:text-dark-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                The brief, in one line
              </div>
              <p className="display-hero max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] text-ink dark:text-dark-ink">
                {project.hook.split(' ').map((word, i) => {
                  const mid = Math.floor(project.hook.split(' ').length / 2)
                  const shouldAccent = i === mid
                  return (
                    <span key={i}>
                      {shouldAccent ? <em className="italic" style={{ color: accent }}>{word}</em> : word}
                      {' '}
                    </span>
                  )
                })}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Cover image ─── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 md:pt-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-line dark:border-dark-line"
        >
          <motion.img
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            src={project.cover}
            alt={project.title}
            className="h-auto w-full object-cover"
            loading="eager"
          />
          {/* Accent corner mark */}
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-cream/90 px-3 py-1.5 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <span className="label text-ink">{project.client}</span>
          </div>
        </motion.div>
      </section>

      {/* ─── The story: overview ─── */}
      <StoryBlock label="Overview" heading="The setup." accent={accent}>
        <div className="space-y-6 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85">
          {project.overview.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </StoryBlock>

      {/* ─── Challenge ─── */}
      <StoryBlock label="The tension" heading="What had to change." accent={accent}>
        <div className="space-y-6 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85">
          {project.challenge.split('\n\n').map((p, i) => (
            <p key={i} className="whitespace-pre-line">{p}</p>
          ))}
        </div>
      </StoryBlock>

      {/* ─── Pull quote (mid-story breakpoint) ─── */}
      {project.pullQuote && <PullQuote quote={project.pullQuote} accent={accent} />}

      {/* ─── Visual gallery ─── */}
      <ImageGallery images={project.images} title={project.title} accent={accent} />

      {/* ─── Approach ─── */}
      <StoryBlock label="The work" heading="How it came together." accent={accent}>
        <ol className="space-y-0">
          {project.approach.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="flex gap-5 border-b border-line py-6 dark:border-dark-line"
            >
              <span className="label shrink-0 pt-1 tabular-nums" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-lg leading-relaxed text-ink dark:text-dark-ink">{step}</span>
            </motion.li>
          ))}
        </ol>
      </StoryBlock>

      {/* ─── Outcome (prose) ─── */}
      <StoryBlock label="What shipped" heading="The result." accent={accent}>
        <div className="space-y-6 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85">
          {project.outcome.split('\n\n').map((p, i) => (
            <p key={i} className="whitespace-pre-line">{p}</p>
          ))}
        </div>
      </StoryBlock>

      {/* ─── Deliverables list ─── */}
      <Deliverables items={project.deliverables} accent={accent} />

      {/* ─── Outcome stats grid (dramatic dark section) ─── */}
      <OutcomeStats stats={project.outcomeStats} accent={accent} />

      {/* ─── Reception callout ─── */}
      <Reception quote={project.reception} accent={accent} />

      {/* ─── Reflection ─── */}
      {project.reflection && (
        <section className="border-t border-line dark:border-dark-line">
          <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-3xl">
              <div className="label mb-6 flex items-center gap-2 text-muted dark:text-dark-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                Reflection
              </div>
              <div className="space-y-6 font-display text-2xl italic leading-relaxed tracking-tighter2 text-ink/90 dark:text-dark-ink/90 md:text-3xl">
                {project.reflection.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tags ─── */}
      <section className="border-t border-line py-12 dark:border-dark-line">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-3 px-6 md:px-10">
          {project.tags.map((t) => (
            <span key={t} className="label rounded-full border border-line px-4 py-2 text-muted dark:border-dark-line dark:text-dark-muted">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Next project ─── */}
      <section className="border-t border-line dark:border-dark-line">
        <Link to={`/work/${next.slug}`}
          className="group relative flex flex-col items-start justify-between gap-8 overflow-hidden px-6 py-16 transition-colors md:flex-row md:items-center md:px-10 md:py-28"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: next.accent || accent }} />
          <div className="relative">
            <div className="label mb-4 text-muted group-hover:text-cream/70 dark:text-dark-muted">Next case study →</div>
            <h3 className="display-hero text-[clamp(2.5rem,8vw,7rem)] text-ink group-hover:text-cream dark:text-dark-ink">
              {next.title}
            </h3>
            <p className="mt-3 max-w-md text-muted group-hover:text-cream/70 dark:text-dark-muted">
              {next.tagline}
            </p>
          </div>
          <div className="relative h-36 w-full max-w-[280px] overflow-hidden rounded-2xl border border-line dark:border-dark-line md:h-48 md:w-[320px]">
            <img src={next.cover} alt={next.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </Link>
      </section>
    </article>
  )
}
