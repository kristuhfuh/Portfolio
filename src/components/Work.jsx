import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { getProjects, normalizeDriveUrl } from '../lib/cms.js'

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileCard({ project, index }) {
  const { slug, number, title, tagline, tags, year } = project
  const cover = project.cover ? normalizeDriveUrl(project.cover) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/work/${slug}`}
        className="group block overflow-hidden rounded-2xl border border-line dark:border-dark-line"
      >
        {cover && (
          <div className="relative h-56 overflow-hidden bg-ink/5">
            <img
              src={cover}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
          </div>
        )}
        <div className="p-5">
          <div className="label mb-2 text-muted dark:text-dark-muted">{number} · {year}</div>
          <h3 className="display-lg text-[1.65rem] text-ink dark:text-dark-ink">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted dark:text-dark-muted">{tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map(t => (
              <span key={t} className="label rounded-full border border-line px-3 py-1 text-muted dark:border-dark-line dark:text-dark-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Desktop: numbered list row ───────────────────────────────────────────────

function ProjectRow({ project, index, isActive, onEnter, onLeave }) {
  const { slug, number, title, tagline, tags, year } = project

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/work/${slug}`}
        className="group relative flex items-center gap-8 border-b border-line py-9 transition-colors duration-200 dark:border-dark-line md:py-11"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/* Hover background sweep */}
        <motion.div
          animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 bg-accent/5 dark:bg-accent/8"
          style={{ transformOrigin: 'left center' }}
        />

        {/* Project number */}
        <span className="label shrink-0 tabular-nums text-muted dark:text-dark-muted">
          {number}
        </span>

        {/* Title + meta */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <motion.h3
            animate={{ x: isActive ? 10 : 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="display-lg text-[clamp(1.7rem,2.6vw,3rem)] leading-[1.05] text-ink dark:text-dark-ink"
          >
            {title}
          </motion.h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3">
            {tags.slice(0, 2).map(t => (
              <span key={t} className="label text-muted dark:text-dark-muted">{t}</span>
            ))}
          </div>
        </div>

        {/* Year + arrow */}
        <div className="flex shrink-0 items-center gap-5">
          <span className="label hidden text-muted dark:text-dark-muted lg:block">{year}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-200 group-hover:border-transparent group-hover:bg-ink group-hover:text-cream dark:border-dark-line dark:group-hover:bg-cream dark:group-hover:text-ink">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-200 group-hover:-rotate-45"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Desktop: sticky image preview pane ──────────────────────────────────────

function ImagePane({ project }) {
  const cover = project?.cover ? normalizeDriveUrl(project.cover) : null

  return (
    <AnimatePresence mode="wait">
      {project ? (
        <motion.div
          key={project.slug}
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          {cover ? (
            <img
              src={cover}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-accent/10" />
          )}

          {/* Gradient + info */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
          <div className="absolute bottom-10 left-8 right-8">
            <p className="line-clamp-2 text-sm leading-relaxed text-cream/60">
              {project.tagline}
            </p>
            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-5 flex gap-8">
                {project.metrics.slice(0, 2).map((m, i) => (
                  <div key={i}>
                    <div
                      className="font-display text-[2.2rem] leading-none text-cream"
                      style={{ letterSpacing: '-0.04em' }}
                    >
                      {m.value}
                    </div>
                    <div className="label mt-1 text-cream/45">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* No hover — subtle default */
        <motion.div
          key="default"
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="label text-muted/40 dark:text-dark-muted/40 tracking-[0.2em]">
            hover a project
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(null)
  const projects = getProjects().filter(p => !p.hidden)
  const activeProject = activeIndex !== null ? projects[activeIndex] : null

  return (
    <section id="work" className="border-t border-line dark:border-dark-line">
      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between py-14 md:py-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Selected Work — 2024 / 2025
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
            >
              Every project has a <em className="italic text-accent">heartbeat.</em>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden label text-muted dark:text-dark-muted md:block"
          >
            {projects.length} projects
          </motion.div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="mx-auto max-w-[1400px] px-6 pb-16 md:hidden">
        <div className="flex flex-col gap-5">
          {projects.map((p, i) => (
            <MobileCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>

      {/* Desktop: split-screen */}
      <div className="mx-auto hidden max-w-[1400px] md:flex">
        {/* Left: project list */}
        <div className="min-w-0 flex-1 border-t border-line px-6 dark:border-dark-line md:px-10">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={i}
              isActive={activeIndex === i}
              onEnter={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex(null)}
            />
          ))}
        </div>

        {/* Right: sticky image pane */}
        <div className="ml-10 w-[40%] shrink-0 border-t border-line dark:border-dark-line">
          <div className="sticky top-0 h-screen overflow-hidden bg-ink/3 dark:bg-white/3">
            <ImagePane project={activeProject} />
          </div>
        </div>
      </div>
    </section>
  )
}
