import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { getProjects, normalizeDriveUrl } from '../lib/cms.js'
import { projects as staticProjects } from '../data/projects.js'
import { Arrow } from './DesignMarks.jsx'
import ProjectLink from './ProjectLink.jsx'

function Project({ project, index }) {
  const [active, setActive] = useState(false)
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const fallback = staticProjects.find(p => p.slug === project.slug)?.cover
  function play() {
    setActive(true)
    if (!reduced) videoRef.current?.play().catch(() => {})
  }
  function pause() { setActive(false); videoRef.current?.pause() }
  return (
    <motion.article className={`poet-project poet-project-${index % 3}`} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-5%' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      <ProjectLink to={`/work/${project.slug}`} className={`project-link ${active ? 'is-active' : ''}`} data-track={`project-${project.slug}`} onMouseEnter={play} onMouseLeave={pause} onFocus={play} onBlur={pause}>
        <div className="project-image" style={{ '--project-accent': project.accent || '#6D28D9' }}>
          {project.cover ? <img src={normalizeDriveUrl(project.cover)} alt={`${project.title} — project preview`} loading="lazy" style={{ viewTransitionName: `project-${project.slug}` }} onError={e => { if (fallback && e.currentTarget.src !== new URL(fallback, window.location.href).href) e.currentTarget.src = fallback }} /> : <span className="project-placeholder">{project.title}</span>}
          {project.hoverVideo && <video ref={videoRef} src={normalizeDriveUrl(project.hoverVideo)} muted loop playsInline preload="none" aria-hidden="true" className={active ? 'is-playing' : ''} />}
          <span className="project-index">{String(index + 1).padStart(2, '0')} / {project.year}</span>
          <span className="project-open"><span>Enter the project</span><Arrow /></span>
        </div>
        <div className="project-caption">
          <div><p className="project-tags">{(project.tags || []).slice(0, 2).join(' / ')}</p><h3>{project.title}</h3><p className="project-tagline">{project.tagline}</p></div>
          <span className="project-arrow"><Arrow /></span>
        </div>
      </ProjectLink>
    </motion.article>
  )
}

export default function Work() {
  const projects = getProjects().filter(p => !p.hidden)
  return (
    <section id="work" className="poet-work">
      <div className="work-header"><div><p className="eyebrow">02 / Selected work</p><h2>Thoughtfully made.<br /><span>Impossible to ignore.</span></h2></div><p>A few things I put my head,<br />heart, and a lot of pixels into.<br /><span>({String(projects.length).padStart(2, '0')} selected projects)</span></p></div>
      <div className="poet-projects">{projects.map((project, index) => <Project project={project} key={project.slug} index={index} />)}</div>
    </section>
  )
}
