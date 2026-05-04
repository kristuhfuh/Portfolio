import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getContactGallery } from '../lib/cms.js'

// ─── Per-card layout config ───────────────────────────────────────────────────
const STACK = [
  { widthPct: 54, xPx: 0,  yPx: 0,  zPx: 0,   scale: 1.00, opacity: 1.00 },
  { widthPct: 47, xPx: 32, yPx: 18, zPx: -55,  scale: 0.93, opacity: 0.92 },
  { widthPct: 40, xPx: 64, yPx: 36, zPx: -110, scale: 0.86, opacity: 0.80 },
  { widthPct: 34, xPx: 96, yPx: 54, zPx: -165, scale: 0.79, opacity: 0.65 },
]

// ─── Single card ──────────────────────────────────────────────────────────────
function GalleryCard({ item, index, total, isExpanded, isOther, mouseX, mouseY, onClick }) {
  const videoRef = useRef(null)
  const cfg = STACK[Math.min(index, STACK.length - 1)]

  // Video playback: front card or expanded card plays; others pause
  useEffect(() => {
    const v = videoRef.current
    if (!v || item.type !== 'video') return
    if (isExpanded || index === 0) {
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [isExpanded, index, item.type])

  // Pause video when off-screen (IntersectionObserver)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const obs = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) v.pause() },
      { threshold: 0.1 }
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  const expandedLeft = '7%'
  const expandedWidth = '86%'
  const noTilt = isExpanded || isOther

  return (
    <motion.div
      className="absolute top-0 left-0 cursor-pointer overflow-hidden rounded-2xl"
      style={{ zIndex: total - index, aspectRatio: '16/10' }}
      animate={{
        left: isExpanded ? expandedLeft : `${cfg.xPx}px`,
        top: isExpanded ? '5%' : `${cfg.yPx}px`,
        width: isExpanded ? expandedWidth : `${cfg.widthPct}%`,
        scale: isExpanded ? 1.02 : isOther ? cfg.scale * 0.82 : cfg.scale,
        opacity: isOther ? 0.22 : cfg.opacity,
        rotateX: noTilt ? 0 : mouseY * (-3 + index * 0.4),
        rotateY: noTilt ? 0 : mouseX * (5 - index * 0.6),
        z: isExpanded ? 60 : isOther ? cfg.zPx - 35 : cfg.zPx,
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={!isExpanded && !isOther ? { y: `${cfg.yPx - 5}px` } : {}}
      onClick={onClick}
    >
      {/* Shadow depth */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)]" />

      {/* Media */}
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster || undefined}
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={item.src}
          alt={item.caption || ''}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {/* Bottom gradient + caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-sm font-medium text-white/85">{item.caption}</p>
        </div>
      )}

      {/* Video indicator badge */}
      {item.type === 'video' && !isExpanded && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Expanded: ESC hint */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm"
        >
          <span className="label text-white/75" style={{ fontSize: 9 }}>ESC · click to close</span>
        </motion.div>
      )}

      {/* Depth indicator lines (decorative) */}
      {!isExpanded && !isOther && index === 0 && (
        <div className="absolute left-3 top-3 flex flex-col gap-0.5 opacity-60">
          {Array.from({ length: Math.min(total, 4) }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] rounded-full bg-white"
              style={{ width: `${14 - i * 3}px`, opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Root gallery ─────────────────────────────────────────────────────────────
export default function ContactGallery() {
  const items = getContactGallery().slice(0, 4)
  const containerRef = useRef(null)
  const [active, setActive] = useState(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setMouse({
      x: (e.clientX - r.left - r.width / 2) / (r.width / 2),
      y: (e.clientY - r.top - r.height / 2) / (r.height / 2),
    })
  }, [])

  const onMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), [])

  // ESC to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  if (!items.length) return null

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full"
      style={{ perspective: '1100px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* 3D stage — mouse tilt applied here */}
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: active !== null ? 0 : mouse.y * -4,
          rotateY: active !== null ? 0 : mouse.x * 6,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Render back-to-front so front card is on top */}
        {[...items].reverse().map((item, revIdx) => {
          const index = items.length - 1 - revIdx
          return (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              isExpanded={active === index}
              isOther={active !== null && active !== index}
              mouseX={mouse.x}
              mouseY={mouse.y}
              onClick={() => setActive(active === index ? null : index)}
            />
          )
        })}
      </motion.div>

      {/* Backdrop — click outside expanded card to close */}
      {active !== null && (
        <div
          className="absolute inset-0 z-0"
          onClick={() => setActive(null)}
          aria-label="Close"
        />
      )}

      {/* Navigation dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            className="h-1.5 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70"
            style={{ width: active === i ? 20 : 6, background: active === i ? 'rgba(255,255,255,0.85)' : undefined }}
            aria-label={`View item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
