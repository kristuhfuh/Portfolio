import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

let caseStudyModule
function preload() {
  if (!caseStudyModule) caseStudyModule = import('../pages/CaseStudy.jsx').catch(error => { caseStudyModule = undefined; throw error })
  return caseStudyModule
}

// Keep normal links (including modifier keys) while enhancing supported browsers.
export default function ProjectLink({ to, children, onMouseEnter, onFocus, ...props }) {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const navigating = useRef(false)
  async function handleClick(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    event.preventDefault()
    if (navigating.current) return
    navigating.current = true
    setPending(true)
    try {
      await preload()
      const transition = document.startViewTransition(() => flushSync(() => navigate(to)))
      // Browsers can skip the visual transition if the visitor switches tabs.
      transition.ready.catch(() => {})
      await transition.finished
    } catch { navigate(to) }
    finally { navigating.current = false; setPending(false) }
  }
  return <a href={to} {...props} aria-busy={pending || undefined} data-pending={pending || undefined} onClick={handleClick} onMouseEnter={e => { preload().catch(() => {}); onMouseEnter?.(e) }} onFocus={e => { preload().catch(() => {}); onFocus?.(e) }}>{children}</a>
}
