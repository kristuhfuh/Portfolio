import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { Burst } from './DesignMarks.jsx'

function Word({ children, index, total, progress, reduced }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.24, 1])
  return <motion.span style={reduced ? undefined : { opacity }}>{children}{' '}</motion.span>
}

export default function Statement() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 65%'] })
  const words = 'Good design makes things work. Great design makes people feel seen.'.split(' ')
  return (
    <section ref={ref} className="poet-statement">
      <div className="statement-aside"><span className="eyebrow">01 / A point of view</span><Burst className="statement-burst" /></div>
      <div>
        <h2 className="statement-heading">{words.map((word, i) => <Word key={i} index={i} total={words.length} progress={scrollYProgress} reduced={reduced}>{word}</Word>)}</h2>
        <div className="statement-bottom"><span>Empathy first.<br />Expression, always.</span><p>I bring thoughtful strategy and an expressive eye to digital products. Because useful can be beautiful. And beautiful should mean something.</p></div>
      </div>
    </section>
  )
}
