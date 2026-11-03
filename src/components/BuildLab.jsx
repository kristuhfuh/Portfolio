import { motion } from 'framer-motion'
import { Arrow, Burst } from './DesignMarks.jsx'
import ProjectLink from './ProjectLink.jsx'
import { getProjectBySlug } from '../lib/cms.js'

export default function BuildLab() {
  if (getProjectBySlug('lema')?.hidden) return null
  return (
    <section className="poet-build-lab" aria-labelledby="build-heading">
      <div className="build-lab-copy"><p className="eyebrow">Design it. Make it real.</p><h2 id="build-heading">From a what-if<br />to a <em>working thing.</em></h2><p>I use AI to prototype ideas and build websites and web apps. It brings another dimension to my practice: I can explore an experience, put it into someone's hands, and keep making it better.</p><a href="#contact" className="poet-button poet-button-lime" data-track="ai-building-contact">Have something in mind? <Arrow /></a></div>
      <motion.div className="build-lab-art" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <ProjectLink to="/work/lema" className="build-lab-window" data-track="project-lema"><div className="build-window-bar"><span>In development & testing</span><span>↗</span></div><div className="build-window-body"><Burst /><span className="eyebrow">Landmark Africa Group</span><h3>LEMA<span>Landmark Enterprise<br />Management System</span></h3><p>I redesigned the /admin experience, then built my redesign with AI. Twelve weeks across the tools people use to keep Landmark running.</p></div><div className="build-window-footer"><span>Design + AI-assisted build</span><span>Read the case study ↗</span></div></ProjectLink>
        <span className="build-lab-note">Think it through. Then try it out.</span>
      </motion.div>
    </section>
  )
}
