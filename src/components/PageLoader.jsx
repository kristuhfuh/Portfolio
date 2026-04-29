import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const first = 'Christopher'.split('')
const last = 'Akpoguma'.split('')

export default function PageLoader() {
  const [curtain, setCurtain] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setCurtain(true), 2100)
    const t2 = setTimeout(() => setDone(true), 3100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink overflow-hidden select-none"
      animate={curtain ? { y: '-100%' } : { y: '0%' }}
      transition={curtain ? { duration: 0.95, ease: [0.76, 0, 0.24, 1] } : {}}
    >
      {/* Progress line sweeps left to right */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
        style={{ transformOrigin: 'left center' }}
      />

      {/* Top right corner mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-8 right-8 label text-cream/30 tracking-[0.2em]"
      >
        ©{new Date().getFullYear()}
      </motion.div>

      <div className="flex flex-col items-center gap-1">
        {/* First name — chars rise from below */}
        <div className="flex" style={{ overflow: 'hidden' }}>
          {first.map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ overflow: 'hidden', lineHeight: 1.08 }}
            >
              <motion.span
                className="inline-block font-display text-[clamp(2.8rem,9vw,7.5rem)] text-cream"
                style={{ letterSpacing: '-0.045em' }}
                initial={{ y: '106%' }}
                animate={{ y: '0%' }}
                transition={{
                  delay: 0.04 * i + 0.1,
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Last name — italic accent, slight extra delay */}
        <div className="flex" style={{ overflow: 'hidden' }}>
          {last.map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ overflow: 'hidden', lineHeight: 1.08 }}
            >
              <motion.span
                className="inline-block font-display italic text-accent text-[clamp(2.8rem,9vw,7.5rem)]"
                style={{ letterSpacing: '-0.045em' }}
                initial={{ y: '106%' }}
                animate={{ y: '0%' }}
                transition={{
                  delay: 0.04 * i + 0.65,
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Role label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-6 label text-cream/35 tracking-[0.28em]"
        >
          PRODUCT DESIGNER · LAGOS
        </motion.p>
      </div>
    </motion.div>
  )
}
