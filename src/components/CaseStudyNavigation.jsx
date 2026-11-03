import { useEffect, useRef, useState } from 'react'
import { useMotionPreference } from '../lib/motion.js'

export default function CaseStudyNavigation({ sections, slug }) {
  const [active, setActive] = useState('snapshot')
  const ref = useRef(null)
  const reduced = useMotionPreference()
  const ids = sections.map(section => section.id).join(',')
  useEffect(() => {
    setActive('snapshot')
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length) setActive(visible[visible.length - 1].target.id)
    }, { rootMargin: '-20% 0px -55% 0px' })
    ids.split(',').forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node) })
    return () => observer.disconnect()
  }, [ids, slug])
  useEffect(() => {
    const link = ref.current?.querySelector('[aria-current]')
    if (link && ref.current.scrollWidth > ref.current.clientWidth) ref.current.scrollTo({ left: link.offsetLeft - ref.current.clientWidth / 2 + link.clientWidth / 2, behavior: reduced ? 'instant' : 'smooth' })
  }, [active, reduced])
  return <nav ref={ref} className="case-story-nav" aria-label="Case study sections">{sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined} onClick={() => setActive(section.id)}>{section.label}</a>)}</nav>
}
