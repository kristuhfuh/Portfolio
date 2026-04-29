import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Single-row name — rises from below the overflow-hidden parent
const chars = 'Christopher Akpoguma'.split('')

export default function PageLoader() {
  const [curtain, setCurtain] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setCurtain(true), 1050)
    const t2 = setTimeout(() => setDone(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink overflow-hidden select-none"
      animate={curtain ? { y: '-100%' } : {}}
      transition={curtain ? { duration: 0.65, ease: [0.76, 0, 0.24, 1] } : {}}
    >
      {/* Progress sweep */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
        style={{ transformOrigin: 'left center' }}
      />

      {/* Name chars rise from below single clip boundary */}
      <div
        className="flex whitespace-nowrap overflow-hidden"
        style={{ lineHeight: 1.1 }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block font-display text-[clamp(1.6rem,4.5vw,4rem)] text-cream"
            style={{ letterSpacing: '-0.04em' }}
            initial={{ y: '106%' }}
            animate={{ y: '0%' }}
            transition={{
              delay: 0.025 * i,
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="mt-4 label text-cream/32 tracking-[0.28em]"
      >
        PRODUCT DESIGNER
      </motion.p>
    </motion.div>
  )
}
