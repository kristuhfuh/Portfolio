import CaseStudyMedia from './CaseStudyMedia.jsx'
import { safeLink } from '../lib/richText.js'

const plain = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')
export default function CaseStudyHero({ project, readingTime }) {
  const details = [['My role', project.role], ['Timeline', project.timeline], ['Client', project.client], ['Team', project.team], ['Status', project.status]].filter(([, value]) => value)
  const links = (project.links || []).filter(link => safeLink(link.url))
  return <section className="case-hero" style={{ '--case-accent': project.accent || '#6535c5' }}>
    <div className="case-hero-grid"><div className="case-hero-copy"><p className="eyebrow">Case study {project.number} <span>/</span> {project.year} <span>/</span> {readingTime} min read</p><h1>{plain(project.title)}</h1><p className="case-hero-tagline">{plain(project.tagline)}</p><div className="case-hero-disciplines">{(project.tags || []).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="case-hero-visual"><CaseStudyMedia src={project.cover} title={`${plain(project.title)} — cover visual`} caption={project.coverCaption} eager transitionName={`project-${project.slug}`} /></div></div>
    <dl className="case-hero-details">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{plain(value)}</dd></div>)}</dl>
    {links.length > 0 && <div className="case-hero-links">{links.map((link, index) => <a key={`${link.url}-${index}`} href={safeLink(link.url)} target="_blank" rel="noopener noreferrer">{plain(link.name) || 'View project'} <span aria-hidden="true">↗</span></a>)}</div>}
  </section>
}
