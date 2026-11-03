import { getProjects } from './cms.js'
import { lemaProject } from '../data/lema.js'

export function getProjectLibrary() {
  const saved = getProjects()
  return saved.some(project => project.slug === lemaProject.slug) ? saved : [...saved, { ...lemaProject, localSource: true }]
}
