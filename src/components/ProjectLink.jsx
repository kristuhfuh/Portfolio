import { useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'

// Keep normal links (including modifier keys) while enhancing supported browsers.
export default function ProjectLink({ to, children, onMouseEnter, onFocus, ...props }) {
  const navigate = useNavigate()
  const preload = () => import('../pages/CaseStudy.jsx')
  async function handleClick(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    event.preventDefault()
    try { await preload() } catch { navigate(to); return }
    document.startViewTransition(() => flushSync(() => navigate(to)))
  }
  return <a href={to} {...props} onClick={handleClick} onMouseEnter={e => { preload().catch(() => {}); onMouseEnter?.(e) }} onFocus={e => { preload().catch(() => {}); onFocus?.(e) }}>{children}</a>
}
