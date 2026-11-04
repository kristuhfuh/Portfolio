import { getProjects } from './cms.js'
import { lemaProject } from '../data/lema.js'
import { getReviewedProject } from '../data/caseStudyEditorial.js'

export function getProjectLibrary() {
  const saved = getProjects().map(getReviewedProject)
  return saved.some(project => project.slug === lemaProject.slug) ? saved : [...saved, { ...lemaProject, localSource: true }]
}

// Public ordering and numbering stay consistent without overwriting CMS content.
export function getSelectedProjects() {
  const projects = getProjectLibrary().filter(project => !project.hidden)
  const featuredSlugs = ['landmark-citizen-app', 'lema']
  const featured = featuredSlugs.map(slug => projects.find(project => project.slug === slug)).filter(Boolean)
  const supporting = projects.filter(project => !featuredSlugs.includes(project.slug))

  return [...featured, ...supporting].map((project, index) => ({
    ...project,
    number: String(index + 1).padStart(2, '0'),
  }))
}
