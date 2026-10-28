import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

// Animates a number from 0 to target when scrolled into view.
// Accepts numeric strings like "94", "40", or strings with non-digits like "4.7★"
// For non-pure-numeric values, renders them instantly without counting.
export default function AnimatedCounter({ value, duration = 1.4, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const animatedRef = useRef(false)

  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  const isPureNumeric = !isNaN(numericValue) && /^\d+(\.\d+)?$/.test(String(value))
  const [displayVal, setDisplayVal] = useState(isPureNumeric ? 0 : value)

  const runAnimation = () => {
    if (animatedRef.current) return
    animatedRef.current = true
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = eased * numericValue
      const formatted = numericValue % 1 === 0
        ? Math.round(current).toString()
        : current.toFixed(1)
      setDisplayVal(formatted)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  useEffect(() => {
    if (inView && isPureNumeric) runAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isPureNumeric])

  // Safety net: useInView sometimes misses elements that are already in the viewport
  // at mount (hydration race / IntersectionObserver timing). After a short grace period,
  // check the real bounding rect — only animate if the element truly is visible, so we
  // don't kill the scroll-in animation for counters below the fold.
  useEffect(() => {
    if (!isPureNumeric) return
    const t = setTimeout(() => {
      if (animatedRef.current) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const isVisible = rect.top < viewportHeight && rect.bottom > 0
      if (isVisible) runAnimation()
    }, 1200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPureNumeric])

  return (
    <span ref={ref} className="tabular-nums">
      {displayVal}{suffix}
    </span>
  )
}
