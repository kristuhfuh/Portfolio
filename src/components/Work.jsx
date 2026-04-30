import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { getProjects, normalizeDriveUrl } from '../lib/cms.js'

function ProjectCard({ project, index }) {
  const { slug, number, title, tagline, tags, year, accent = '#6D28D9' } = project
  const [hovered, setHovered] = useState(false)
  const cover = project.cover ? normalizeDriveUrl(project.cover) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/work/${slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div className="relative overflow-hidden rounded-2xl bg-ink/5 dark:bg-white/5" style={{ aspectRatio: '4/3' }}>
          {cover ? (
            <>
              <motion.img
                src={cover}
                alt={title}
                className="h-full w-full object-cover"
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Hover overlay */}
              <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: `${accent}28` }}
              >
                <motion.div
                  animate={{ scale: hovered ? 1 : 0.75, opacity: hovered ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-cream shadow-xl"
                  style={{ color: accent }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            </>
          ) : (
            /* No cover fallback */
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: `${accent}12` }}
            >
              <span className="display-lg text-[5rem] opacity-15">{number}</span>
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="display-lg text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.05] text-ink dark:text-dark-ink">
                {title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3">
                {tags.slice(0, 2).map(t => (
                  <span key={t} className="label text-muted dark:text-dark-muted">{t}</span>
                ))}
                <span className="label text-muted/50 dark:text-dark-muted/50">· {year}</span>
              </div>
            </div>
            {/* Arrow */}
            <span
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-200 group-hover:border-transparent group-hover:bg-ink group-hover:text-cream dark:border-dark-line dark:group-hover:bg-cream dark:group-hover:text-ink"
            >
              <svg
                width="11"
                height="11"
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
        </div>
      </Link>
    </motion.div>
  )
}

export default function Work() {
  const projects = getProjects().filter(p => !p.hidden)

  return (
    <section id="work" className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-3 italic text-lg text-muted dark:text-dark-muted"
            >
              / Best Projects /
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
            >
              Selected Works
            </motion.h2>
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden label text-muted dark:text-dark-muted md:block"
          >
            {projects.length} projects
          </motion.span>
        </div>

        {/* 2-column grid */}
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
