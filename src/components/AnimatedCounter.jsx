import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

// Animates a number from 0 to target when scrolled into view.
// Accepts numeric strings like "94", "40", or strings with non-digits like "4.7★"
// For non-pure-numeric values, renders them instantly without counting.
export default function AnimatedCounter({ value, duration = 1.4, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  const isPureNumeric = !isNaN(numericValue) && /^\d+(\.\d+)?$/.test(String(value))
  const [displayVal, setDisplayVal] = useState(isPureNumeric ? 0 : value)

  useEffect(() => {
    if (!inView || !isPureNumeric) return
    let startTime = null
    let frameId
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // easeOutQuart for a snappy feel
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = eased * numericValue
      const formatted = numericValue % 1 === 0
        ? Math.round(current).toString()
        : current.toFixed(1)
      setDisplayVal(formatted)
      if (progress < 1) frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => frameId && cancelAnimationFrame(frameId)
  }, [inView, numericValue, duration, isPureNumeric])

  return (
    <span ref={ref} className="tabular-nums">
      {displayVal}{suffix}
    </span>
  )
}
