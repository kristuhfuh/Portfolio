import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 1024) return

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label'
    let isHovering = false

    const onMove = (e) => {
      outer.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onOver = (e) => {
      const nowHovering = !!e.target.closest(INTERACTIVE)
      if (nowHovering !== isHovering) {
        isHovering = nowHovering
        outer.classList.toggle('cursor-hovering', isHovering)
        inner.style.transform = isHovering ? 'scale(0.7)' : 'scale(1)'
      }
    }

    const onDown = () => { inner.style.transform = 'scale(0.8)' }
    const onUp   = () => { inner.style.transform = isHovering ? 'scale(0.7)' : 'scale(1)' }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{ willChange: 'transform' }}
    >
      <div ref={innerRef} className="cursor-inner">
        <svg
          width="22"
          height="26"
          viewBox="0 0 22 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="cursor-path"
            d="M1 1 L1 20 L5.5 15.5 L9 23 L12 21.5 L8.5 14 L15 14 Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line className="cursor-plus" x1="18" y1="4" x2="18" y2="10" strokeWidth="2" strokeLinecap="round" />
          <line className="cursor-plus" x1="15" y1="7" x2="21" y2="7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
