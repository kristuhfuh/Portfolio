import { useState } from 'react'
import { motion } from 'framer-motion'
import { getContactGallery } from '../lib/cms.js'

// ─── Layout constants ─────────────────────────────────────────────────────────
const CARD_W   = 170   // px — portrait card width
const CARD_H   = 360   // px — portrait card height (tall)
const STEP     = 108   // px — horizontal distance between card centres
const MAX_Z    = 16    // degrees — max rotateZ at the outer edges
const MAX_Y    = 12    // degrees — max rotateY (3-D depth)

// Per-card: position & rotation based on index
function cfg(index, total) {
  const mid = (total - 1) / 2
  const t   = total > 1 ? (index - mid) / mid : 0   // -1 … +1
  return {
    x:       (index - mid) * STEP,
    rotateZ:  t * MAX_Z,
    rotateY: -t * MAX_Y,
    zIndex:  total - Math.round(Math.abs(t) * mid),  // centre on top
  }
}

// ─── Single portrait card ─────────────────────────────────────────────────────
function Card({ item, index, total, isHovered, isAnyHovered, onHover, onLeave }) {
  const c = cfg(index, total)

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 cursor-pointer select-none"
      style={{
        width:           CARD_W,
        height:          CARD_H,
        marginLeft:     -CARD_W / 2,
        transformOrigin: 'bottom center',
        zIndex:          isHovered ? 100 : c.zIndex,
      }}
      animate={{
        x:       c.x,
        rotateZ: isHovered ? 0 : c.rotateZ,
        rotateY: isHovered ? 0 : c.rotateY,
        scale:   isHovered ? 1.22 : isAnyHovered ? 0.96 : 1,
        y:       isHovered ? -56 : 0,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.8 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card face */}
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ borderRadius: 22, boxShadow: '0 18px 48px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.18)' }}
      >
        {item.type === 'video' ? (
          <video
            src={item.src}
            poster={item.poster || undefined}
            muted
            loop
            playsInline
            autoPlay
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

        {/* Subtle bottom gradient for caption */}
        {item.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-4 pt-10">
            <p className="label text-white/80" style={{ fontSize: 10 }}>{item.caption}</p>
          </div>
        )}

        {/* Video badge */}
        {item.type === 'video' && (
          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Gallery section ──────────────────────────────────────────────────────────
export default function WorkGallery() {
  const items = getContactGallery().slice(0, 7)
  const [hovered, setHovered] = useState(null)

  if (!items.length) return null

  // Container width to fit the full fan
  const fanWidth = (items.length - 1) * STEP + CARD_W + 120

  return (
    <section className="border-t border-line dark:border-dark-line py-20 overflow-hidden">
      {/* Section label row */}
      <div className="mx-auto mb-14 max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-xl text-muted dark:text-dark-muted"
          >
            / Gallery /
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="label text-muted dark:text-dark-muted"
          >
            Hover the cards · click to expand
          </motion.p>
        </div>
      </div>

      {/* Fan stage — perspective applied here */}
      <div
        className="mx-auto"
        style={{
          width:             `min(${fanWidth}px, 96vw)`,
          height:            CARD_H + 60,
          position:          'relative',
          perspective:       '900px',
          perspectiveOrigin: '50% 100%',  // vanishing point at bottom centre
        }}
      >
        {items.map((item, i) => (
          <Card
            key={item.id}
            item={item}
            index={i}
            total={items.length}
            isHovered={hovered === i}
            isAnyHovered={hovered !== null && hovered !== i}
            onHover={() => setHovered(i)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* Mobile fallback hint */}
      <p className="mt-6 text-center label text-muted dark:text-dark-muted md:hidden">
        ← Scroll to see all →
      </p>
    </section>
  )
}
