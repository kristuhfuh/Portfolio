import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { Burst } from './DesignMarks.jsx'

export default function PageLoader() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(() => {
    try { return sessionStorage.getItem('poet-intro-seen') === 'true' } catch { return true }
  })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (done || reduced) return
    try { sessionStorage.setItem('poet-intro-seen', 'true') } catch { /* intro is optional */ }
    const first = setTimeout(() => setOpen(true), 550)
    const last = setTimeout(() => setDone(true), 1250)
    return () => { clearTimeout(first); clearTimeout(last) }
  }, [done, reduced])
  if (done || reduced) return null
  return <motion.div className="poet-intro-curtain" aria-hidden="true" animate={{ y: open ? '-100%' : 0 }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}><Burst /><span>A little more feeling.</span><span className="intro-signature">CHRISTOPHER AKPOGUMA</span></motion.div>
}
