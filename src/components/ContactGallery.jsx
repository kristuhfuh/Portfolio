import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getContactGallery } from '../lib/cms.js'

// ─── Layout constants ─────────────────────────────────────────────────────────
const CARD_W   = 155
const CARD_H   = 330
const GAP      = 18
const STRIDE   = CARD_W + GAP
const WAVE_AMP = 58
const WAVE_SIG = 210
const MAX_ROT  = 20
const SPD_NORM = 0.55
const SPD_SLOW = 0.07

function lerp(a, b, t) { return a + (b - a) * t }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

// ─── Expanded overlay ─────────────────────────────────────────────────────────
function ExpandedCard({ item, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.82, opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative cursor-default"
        style={{ width: 340, height: 520, borderRadius: 28, overflow: 'hidden',
                 boxShadow: '0 40px 100px rgba(0,0,0,0.55)' }}
        onClick={e => e.stopPropagation()}
      >
        {item.type === 'video'
          ? <video src={item.src} poster={item.poster} muted loop playsInline autoPlay className="h-full w-full object-cover" />
          : <img src={item.src} alt={item.caption || ''} className="h-full w-full object-cover" draggable={false} />
        }
        {item.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-6 pb-6 pt-16">
            <p className="text-white/90 text-sm font-medium tracking-wide">{item.caption}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Single card — image shows by default, video plays on hover ───────────────
function GalleryCard({ item, outerRef, innerRef, onHover, onLeave, onClick }) {
  const videoRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  // The video source: video-type items use item.src; image-type items use item.hoverVideo
  const videoSrc = item.type === 'video' ? item.src : (item.hoverVideo || null)
  // The base image: video-type items use item.poster; image-type items use item.src
  const imageSrc = item.type === 'video' ? item.poster : item.src
  const hasVideo = !!videoSrc

  const handleEnter = () => {
    setHovering(true)
    onHover()
    if (videoRef.current && hasVideo) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleLeave = () => {
    setHovering(false)
    onLeave()
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      ref={outerRef}
      className="absolute bottom-0 left-0 cursor-pointer select-none"
      style={{ width: CARD_W, height: CARD_H, willChange: 'transform' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      <div
        ref={innerRef}
        style={{ width: '100%', height: '100%', transformOrigin: 'bottom center', willChange: 'transform' }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ borderRadius: 20, boxShadow: '0 16px 40px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.14)' }}
        >
          {/* Base image — always visible */}
          {imageSrc
            ? <img src={imageSrc} alt={item.caption || ''} draggable={false}
                className="absolute inset-0 h-full w-full object-cover" />
            : <div className="absolute inset-0 bg-ink/10 dark:bg-white/10" />
          }

          {/* Video — fades in on hover */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: hovering ? 1 : 0 }}
            />
          )}

          {/* Caption */}
          {item.caption && (
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent px-3 pb-3 pt-8">
              <p className="label text-white/80" style={{ fontSize: 10 }}>{item.caption}</p>
            </div>
          )}

          {/* Play badge — shown when not hovering and video exists */}
          {hasVideo && !hovering && (
            <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Gallery section ──────────────────────────────────────────────────────────
export default function WorkGallery() {
  const rawItems = getContactGallery()
  if (!rawItems.length) return null

  const total  = rawItems.length
  const LOOP_W = total * STRIDE
  const loopItems = [...rawItems, ...rawItems, ...rawItems]

  const containerRef   = useRef(null)
  const outerRefs      = useRef([])
  const innerRefs      = useRef([])
  const offsetRef      = useRef(0)
  const speedRef       = useRef(SPD_NORM)
  const targetSpeedRef = useRef(SPD_NORM)
  const cursorXRef     = useRef(null)
  const rafRef         = useRef(null)
  const touchLastXRef  = useRef(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const tick = () => {
      speedRef.current = lerp(speedRef.current, targetSpeedRef.current, 0.05)
      offsetRef.current = (offsetRef.current + speedRef.current) % LOOP_W

      const W = container.clientWidth

      outerRefs.current.forEach((outer, i) => {
        if (!outer) return
        const inner = innerRefs.current[i]

        const slotIndex = i % total
        const copyIndex = Math.floor(i / total)
        const screenX   = slotIndex * STRIDE + copyIndex * LOOP_W - offsetRef.current
        const cardCenter = screenX + CARD_W / 2

        const normT = clamp((cardCenter - W / 2) / (W / 2), -1, 1)
        const rotZ  = normT * MAX_ROT

        let waveY = 0
        if (cursorXRef.current !== null) {
          const dist = cardCenter - cursorXRef.current
          waveY = WAVE_AMP * Math.exp(-(dist * dist) / (2 * WAVE_SIG * WAVE_SIG))
        }

        outer.style.transform = `translateX(${screenX}px) translateY(${-waveY}px)`
        if (inner) inner.style.transform = `rotateZ(${rotZ}deg)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [total, LOOP_W])

  const onMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) cursorXRef.current = e.clientX - rect.left
    targetSpeedRef.current = SPD_SLOW
  }
  const onMouseLeave = () => {
    cursorXRef.current = null
    targetSpeedRef.current = SPD_NORM
  }

  const onTouchStart = (e) => {
    touchLastXRef.current = e.touches[0].clientX
    targetSpeedRef.current = 0
  }
  const onTouchMove = (e) => {
    if (touchLastXRef.current === null) return
    const dx = touchLastXRef.current - e.touches[0].clientX
    offsetRef.current = ((offsetRef.current + dx) % LOOP_W + LOOP_W) % LOOP_W
    touchLastXRef.current = e.touches[0].clientX
  }
  const onTouchEnd = () => {
    touchLastXRef.current = null
    targetSpeedRef.current = SPD_NORM
  }

  const selectedItem = selected !== null ? rawItems[selected % total] : null

  return (
    <>
      <section className="border-t border-line dark:border-dark-line py-16">
        <div className="mx-auto mb-10 max-w-[1400px] px-6 md:px-10">
          <div className="flex items-end justify-between">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="label text-muted dark:text-dark-muted">
              ✦ Gallery
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} className="label text-muted dark:text-dark-muted">
              <span className="hidden md:inline">Hover to slow · click</span>
              <span className="md:hidden">Swipe · tap</span>
              {' '}to expand
            </motion.p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full [overflow-x:clip]"
          style={{ height: CARD_H + WAVE_AMP + 48 }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {loopItems.map((item, i) => (
            <GalleryCard
              key={`${item.id}-${i}`}
              item={item}
              outerRef={el => { outerRefs.current[i] = el }}
              innerRef={el => { innerRefs.current[i] = el }}
              onHover={() => { targetSpeedRef.current = SPD_SLOW }}
              onLeave={() => { targetSpeedRef.current = SPD_NORM }}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>

      </section>

      <AnimatePresence>
        {selectedItem && (
          <ExpandedCard item={selectedItem} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
