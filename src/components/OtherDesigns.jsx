import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreference } from '../lib/motion.js'
import { getOtherDesigns, getPageContent, normalizeDriveUrl } from '../lib/cms.js'
import { safeLink } from '../lib/richText.js'

function DesignCard({ item, index }) {
  const reduced = useMotionPreference()
  const content = getPageContent('otherDesignsIntro')
  const [hovered, setHovered] = useState(false)
  const src = normalizeDriveUrl(item.image)
  const link = safeLink(item.link)
  const isExternal = /^(https?:)?\/\//i.test(link)

  const cardContent = (
    <div
      className="group relative overflow-hidden rounded-2xl bg-ink/5 dark:bg-white/5 cursor-pointer"
      style={{ aspectRatio: '4/3' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {src ? (
        <img
          src={src}
          alt={item.title || 'Design'}
          className="h-full w-full object-cover"
          style={{
            transform: hovered && !reduced ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-ink/5 dark:bg-white/5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.2" className="text-ink/20 dark:text-dark-ink/20">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5"
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      >
        {item.title && (
          <p
            className="text-sm font-medium text-cream leading-snug"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {item.title}
          </p>
        )}
        {link && (
          <span
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-cream/70"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.3s 0.04s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s 0.04s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {content.cardCta}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{
                transform: hovered ? 'rotate(-45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: reduced ? 0 : 0.24, delay: 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {link ? (
        isExternal ? (
          <a href={link} target="_blank" rel="noopener noreferrer" onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
            {cardContent}
          </a>
        ) : (
          <a href={link} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
            {cardContent}
          </a>
        )
      ) : (
        cardContent
      )}
    </motion.div>
  )
}

export default function OtherDesigns() {
  const items = getOtherDesigns()
  const content = getPageContent('otherDesignsIntro')
  if (!items || items.length === 0) return null

  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">

        {/* Header */}
        <div className="mb-14">
          <motion.h2
            initial={false} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
          >
            {content.heading}
          </motion.h2>
        </div>

        {/* Grid - 3 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => (
            <DesignCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
