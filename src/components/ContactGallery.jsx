import { useRef } from 'react'
import { motion } from 'framer-motion'
import { getContactGallery } from '../lib/cms.js'

// Portrait card — 9:16 ratio, height much taller than width
function PortraitCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 7) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="relative flex-shrink-0 overflow-hidden rounded-2xl"
      style={{ width: '200px', aspectRatio: '9/16' }}
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
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          draggable={false}
        />
      )}

      {/* Bottom gradient + caption */}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="label text-white/80" style={{ fontSize: 10 }}>{item.caption}</p>
        </div>
      )}
    </motion.div>
  )
}

export default function WorkGallery() {
  const items = getContactGallery()
  if (!items.length) return null

  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <section className="border-t border-line py-20 dark:border-dark-line overflow-hidden">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-[1400px] px-6 md:px-10">
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
            {items.length} pieces
          </motion.p>
        </div>
      </div>

      {/* Horizontal scrolling portrait strip */}
      <div className="gallery-pause group">
        <div
          className="flex gap-3 animate-gallery-scroll"
          style={{ width: 'max-content' }}
        >
          {doubled.map((item, i) => (
            <PortraitCard key={`${item.id}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
