import { getCaseStudyNotes, hasDraftText } from '../data/caseStudyNotes.js'

export function getProjectReadiness(project) {
  const notes = getCaseStudyNotes(project)
  const checks = [
    ['Title', project.title], ['Cover image', project.cover], ['Your role', project.role],
    ['Problem', notes.problem], ['Your contribution', notes.contribution], ['Result', notes.result],
    ['Design decisions', project.decisions?.length || notes.decisions?.length || project.chapters?.length || project.approach?.length],
    ['Reflection', project.reflection],
  ].map(([label, value]) => ({ label, complete: !!value && !hasDraftText(value) }))
  return { checks, complete: checks.filter(check => check.complete).length, total: checks.length }
}
