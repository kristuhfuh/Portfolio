import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { Burst } from './DesignMarks.jsx'
import { getPageContent } from '../lib/cms.js'

function Word({ children, index, total, progress, reduced }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.24, 1])
  return <motion.span style={reduced ? undefined : { opacity }}>{children}{' '}</motion.span>
}

export default function Statement() {
  const content = getPageContent('statement')
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 65%'] })
  const words = String(content.heading || '').trim().split(/\s+/).filter(Boolean)
  return (
    <section ref={ref} className="poet-statement">
      <div className="statement-aside"><span className="eyebrow">{content.eyebrow}</span><Burst className="statement-burst" /></div>
      <div>
        <h2 className="statement-heading">{words.map((word, i) => <Word key={i} index={i} total={words.length} progress={scrollYProgress} reduced={reduced}>{word}</Word>)}</h2>
        <div className="statement-bottom"><span style={{ whiteSpace: 'pre-line' }}>{content.signoff}</span><p>{content.description}</p></div>
      </div>
    </section>
  )
}
