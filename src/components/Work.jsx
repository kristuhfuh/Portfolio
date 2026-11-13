import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { getPageContent, normalizeDriveUrl } from '../lib/cms.js'
import { getSelectedProjects } from '../lib/projectLibrary.js'
import { projects as staticProjects } from '../data/projects.js'
import { lemaProject } from '../data/lema.js'
import { Arrow } from './DesignMarks.jsx'
import ProjectLink from './ProjectLink.jsx'

const majorProjects = new Set(['landmark-citizen-app', 'lema'])

function Project({ project, layoutIndex, featured, projectCta }) {
  const [active, setActive] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const fallback = (project.slug === lemaProject.slug ? lemaProject : staticProjects.find(p => p.slug === project.slug))?.cover
  const cover = project.cover || fallback

  function play() {
    setActive(true)
    if (!reduced) videoRef.current?.play().catch(() => {})
  }
  function pause() {
    setActive(false)
    setPlaying(false)
    videoRef.current?.pause()
  }

  return (
    <motion.article
      tabIndex={-1}
      className={`poet-project poet-project-${layoutIndex}${featured ? ' poet-project-featured' : ''}`}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      whileHover={reduced ? undefined : 'hover'}
      whileTap={reduced ? undefined : 'press'}
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } } }}
      viewport={{ once: true, margin: '-5%' }}
    >
      <ProjectLink to={`/work/${project.slug}`} className={`project-link ${active ? 'is-active' : ''}`} data-track={`project-${project.slug}`} onMouseEnter={play} onMouseLeave={pause} onFocus={play} onBlur={pause}>
        <motion.div className="project-image" style={{ '--project-accent': project.accent || '#6D28D9' }}
          variants={{
            hidden: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
            visible: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
            hover: { y: -4, rotate: -0.35, scaleX: 1, scaleY: 1 },
            press: { y: 1, rotate: 0.2, scaleX: 1.012, scaleY: 0.975 },
          }} transition={{ type: 'spring', stiffness: 520, damping: 32, mass: 0.65 }}>
          {cover ? <img src={normalizeDriveUrl(cover)} alt={`${project.title} - project preview`} loading="lazy" style={{ viewTransitionName: `project-${project.slug}` }} onError={e => { if (fallback && e.currentTarget.src !== new URL(fallback, window.location.href).href) e.currentTarget.src = fallback }} /> : <span className="project-placeholder">{project.title}</span>}
          {project.hoverVideo && <video ref={videoRef} src={normalizeDriveUrl(project.hoverVideo)} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)} className={active && playing ? 'is-playing' : ''} />}
          <span className="project-index">{project.number} / {project.year}</span>
          <span className="project-open"><span className="project-open-default">{projectCta}</span><span className="project-open-pending" role="status">Opening project...</span><Arrow /></span>
        </motion.div>
        <div className="project-caption">
          <div>
            <div className="project-meta"><p className="project-tags">{(project.tags || []).slice(0, 2).join(' / ')}</p>{featured && project.status && <span className="project-status">{project.status}</span>}</div>
            <h3>{project.title}</h3>
            <p className="project-tagline">{project.tagline}</p>
          </div>
          <span className="project-arrow"><motion.span className="project-arrow-motion"
            variants={{
              hidden: { x: 0, y: 0, rotate: 0, scale: 1 }, visible: { x: 0, y: 0, rotate: 0, scale: 1 },
              hover: { x: [0, -3, 3], y: [0, 2, -3], rotate: [0, -8, 0], scale: 1, transition: { duration: 0.24, times: [0, 0.3, 1], ease: [0.22, 1, 0.36, 1] } },
              press: { x: 5, y: -5, scale: 0.9 },
            }} transition={{ type: 'spring', stiffness: 520, damping: 32 }}><Arrow /></motion.span></span>
        </div>
      </ProjectLink>
    </motion.article>
  )
}

export default function Work() {
  const projects = getSelectedProjects()
  const content = getPageContent('work')
  let supportingIndex = 0

  return (
    <section id="work" className="poet-work" aria-labelledby="work-heading">
      <div className="work-header"><div><h2 id="work-heading">{content.heading}<br /><span>{content.headingAccent}</span></h2></div><p><span style={{ whiteSpace: 'pre-line' }}>{content.description}</span><br /><span>({String(projects.length).padStart(2, '0')} {content.countLabel})</span></p></div>
      <div className="poet-projects">{projects.map(project => {
        const featured = majorProjects.has(project.slug)
        const layoutIndex = featured ? 0 : (supportingIndex++ + 1) % 3
        return <Project project={project} key={project.slug} layoutIndex={layoutIndex} featured={featured} projectCta={content.projectCta} />
      })}</div>
    </section>
  )
}
