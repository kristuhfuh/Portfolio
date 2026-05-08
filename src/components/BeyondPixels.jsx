import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getBeyondPixels } from '../lib/cms.js'

function PixelBox({ item, index }) {
  const videoRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [muted, setMuted] = useState(true)
  const hasVideo = !!item.video

  const handleEnter = () => {
    setHovering(true)
    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleLeave = () => {
    setHovering(false)
    setMuted(true)
    if (hasVideo && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.muted = true
    }
  }

  const handleTap = () => {
    if (!window.matchMedia('(hover: none)').matches) return
    hovering ? handleLeave() : handleEnter()
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const next = !muted
    setMuted(next)
    if (videoRef.current) videoRef.current.muted = next
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-line dark:border-dark-line"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleTap}
    >
      <img
        src={item.image}
        alt={item.label}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
          hovering && hasVideo ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      {hasVideo && (
        <video
          ref={videoRef}
          src={item.video}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hovering ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10">
        <span className="label text-cream/90">{item.label}</span>
      </div>

      {hasVideo && hovering && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => { e.stopPropagation(); toggleMute(e) }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-cream backdrop-blur-sm transition-transform hover:scale-110"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </motion.button>
      )}

      {hasVideo && !hovering && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-cream/70">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div>
      )}
    </motion.div>
  )
}

export default function BeyondPixels() {
  const items = getBeyondPixels()

  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">

        {/* Header */}
        <div className="mb-14 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}
              className="label mb-3 text-muted dark:text-dark-muted">
              ✦ Beyond the Pixels
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink">
              Outside the work.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="label text-muted dark:text-dark-muted">
            <span className="hidden md:inline">Hover</span>
            <span className="md:hidden">Tap</span>
            {' '}to play
          </motion.p>
        </div>

        {/* 4-col grid on desktop, 2-col on mobile */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item, i) => (
            <PixelBox key={item.id} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
