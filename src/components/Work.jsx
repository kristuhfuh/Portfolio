import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'
import { getProjects } from '../lib/cms.js'

function ProjectRow({ project, index, onHover }) {
  const { slug, number, title, tagline, tags, year, metrics, accent = '#6D28D9' } = project

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
    >
      <Link to={`/work/${slug}`}
        className="group relative block border-b border-line py-10 transition-colors dark:border-dark-line md:py-14"
      >
        {/* Hover background sweep */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 origin-left opacity-[0.04]"
          style={{ background: accent }}
        />

        <div className="relative grid grid-cols-12 gap-6 md:gap-10">
          {/* Number + accent dot */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full transition-all duration-500 group-hover:scale-150"
                style={{ background: accent }} />
              <span className="label text-muted dark:text-dark-muted tabular-nums">{number}</span>
            </div>
          </div>

          {/* Title block */}
          <div className="col-span-10 md:col-span-5">
            <h3 className="display-lg text-[2rem] text-ink transition-transform duration-500 group-hover:translate-x-2 dark:text-dark-ink md:text-[3rem]">
              {title}
            </h3>
            <p className="mt-2 max-w-md text-muted dark:text-dark-muted">{tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((t) => (
                <span key={t}
                  className="label rounded-full border border-line px-3 py-1 text-muted transition-colors dark:border-dark-line dark:text-dark-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics — use accent color */}
          <div className="col-span-7 mt-6 flex gap-10 md:col-span-5 md:mt-0">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display text-3xl leading-none tracking-tightest text-ink transition-colors duration-500 group-hover:text-[var(--accent)] dark:text-dark-ink md:text-5xl"
                  style={{ '--accent': accent }}
                >
                  {m.value}
                </span>
                <span className="label mt-2 text-muted dark:text-dark-muted">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Year + arrow */}
          <div className="col-span-5 mt-6 flex items-start justify-end gap-4 md:col-span-1 md:mt-0">
            <span className="label text-muted dark:text-dark-muted">{year}</span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition-all group-hover:border-transparent group-hover:text-cream dark:border-dark-line"
              onMouseEnter={(e) => { e.currentTarget.style.background = accent }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="transition-transform group-hover:-rotate-45">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Work() {
  const [hovered, setHovered] = useState(null)
  const projects = getProjects().filter(p => !p.hidden)

  return (
    <section id="work" className="relative border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 grid gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Selected Work — 2024 / 2025
            </div>
            <h2 className="display-lg text-[clamp(2.5rem,7vw,5rem)] text-ink dark:text-dark-ink">
              Every project has a <em className="italic text-accent">heartbeat.</em>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-muted dark:text-dark-muted">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} I helped bring to life — from real estate platforms to consumer apps. Tap any row for the full case study.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="border-t border-line dark:border-dark-line">
            {projects.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i} onHover={setHovered} />
            ))}
          </div>

          {/* Floating hover preview on desktop */}
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none fixed right-10 top-1/2 z-40 hidden h-[340px] w-[260px] -translate-y-1/2 overflow-hidden rounded-2xl border-2 shadow-2xl lg:block"
              style={{ borderColor: hovered.accent }}
            >
              <img src={hovered.cover} alt={hovered.title} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                <div className="font-display text-xl italic text-cream">{hovered.title}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
