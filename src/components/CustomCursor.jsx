import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pos = useRef({ x: -100, y: -100 })
  const raf = useRef(null)

  // Track dark mode
  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Direct DOM manipulation for cursor position (no React re-render lag)
  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    const interactives = () =>
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label')

    const addListeners = () => {
      interactives().forEach(el => {
        el.addEventListener('mouseenter', () => setHovering(true))
        el.addEventListener('mouseleave', () => setHovering(false))
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    addListeners()

    // Re-attach when DOM changes (SPAs)
    const mo = new MutationObserver(addListeners)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      mo.disconnect()
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null

  const fill = isDark ? '#ffffff' : '#0a0a0a'
  const strokeColor = isDark ? '#0a0a0a' : '#ffffff'

  return (
    <motion.div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: 'transform' }}
      // Offset: arrow tip sits exactly at (0,0) of this container
      animate={{
        scale: clicking ? 0.8 : hovering ? 0.7 : 1,
      }}
      transition={{ type: 'spring', stiffness: 600, damping: 32, mass: 0.4 }}
    >
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/*
          Standard arrow cursor shape.
          Tip is at (1, 1) — top-left corner.
          Body widens going down, tail cuts up from bottom-left.
        */}
        <path
          d="M1 1 L1 20 L5.5 15.5 L9 23 L12 21.5 L8.5 14 L15 14 Z"
          fill={fill}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Hover state: small + indicator near tip */}
        {hovering && (
          <>
            <line x1="18" y1="4" x2="18" y2="10" stroke={fill} strokeWidth="2" strokeLinecap="round" />
            <line x1="15" y1="7" x2="21" y2="7" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </motion.div>
  )
}
