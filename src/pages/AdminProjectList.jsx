import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { saveProject, deleteProject, toggleProjectVisibility, normalizeDriveUrl } from '../lib/cms.js'
import { getProjectReadiness } from '../lib/projectReadiness.js'
import { Arrow } from '../components/DesignMarks.jsx'
import { getProjectLibrary as library } from '../lib/projectLibrary.js'

export default function AdminProjectList() {
  const [projects, setProjects] = useState(library)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState(null)
  const shown = useMemo(() => projects.filter(project => {
    const matches = `${project.title} ${project.client} ${(project.tags || []).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())
    return matches && (filter === 'all' || (filter === 'visible' ? !project.hidden : project.hidden))
  }), [projects, query, filter])

  async function change(project, action) {
    if (action === 'delete' && !window.confirm(`Delete “${project.title}”? This removes the case study from your portfolio.`)) return
    setBusy(project.slug); setNotice(null)
    try {
      let result
      if (action === 'delete') result = await deleteProject(project.slug)
      else if (project.localSource) { const { localSource, ...data } = project; result = await saveProject({ ...data, hidden: !project.hidden }) }
      else result = await toggleProjectVisibility(project.slug)
      setProjects(library())
      setNotice({ type: result.cloudSynced ? 'success' : 'warning', text: result.cloudSynced ? 'Your portfolio has been updated.' : 'Saved on this device. Retry cloud sync above to update other visitors.' })
    } catch (error) { setNotice({ type: 'error', text: error.message }); setProjects(library()) }
    finally { setBusy(null) }
  }

  return <div className="admin-project-library">
    <div className="admin-page-heading"><div><p className="eyebrow">The work, in one place</p><h1>Case studies<span>.</span></h1><p>{projects.length} stories. {projects.filter(project => !project.hidden).length} shown on your portfolio.</p></div><Link className="admin-button primary" to="/admin/projects/new">New case study <span aria-hidden="true">＋</span></Link></div>
    <div className="admin-project-tools"><div className="admin-tabs" role="group" aria-label="Filter case studies">{[['all', 'All projects'], ['visible', 'Shown'], ['hidden', 'Hidden']].map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{projects.filter(project => value === 'all' || (value === 'visible' ? !project.hidden : project.hidden)).length}</span></button>)}</div><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects, clients, or skills" aria-label="Search case studies" /></div>
    {notice && <p className={`admin-notice ${notice.type}`} role="status">{notice.text}</p>}
    <div className="admin-project-list">{shown.map((project, index) => {
      const readiness = getProjectReadiness(project)
      return <article className="admin-project-row" key={project.slug}>
        <Link className="admin-project-thumb" to={`/admin/projects/${project.slug}`}>{project.cover ? <img src={normalizeDriveUrl(project.cover)} alt="" loading="lazy" /> : <span>{String(index + 1).padStart(2, '0')}</span>}</Link>
        <div className="admin-project-info"><div className="admin-project-kicker"><span className={`admin-badge ${project.hidden ? 'neutral' : 'positive'}`}>{project.hidden ? 'Hidden' : 'Shown'}</span>{project.status && <span>{project.status}</span>}</div><Link to={`/admin/projects/${project.slug}`}><h2>{project.title || 'Untitled case study'}</h2></Link><p>{project.client || 'Independent project'} <span aria-hidden="true">/</span> {project.year || 'Year not set'}</p><span className="admin-project-completeness">{readiness.complete} of {readiness.total} essentials in place{project.localSource ? ' · Built-in story' : ''}</span></div>
        <div className="admin-project-actions"><Link className="admin-button" to={`/admin/projects/${project.slug}`}>Edit story <Arrow /></Link><button className="admin-text-button" type="button" disabled={busy === project.slug} onClick={() => change(project, 'visibility')}>{busy === project.slug ? 'Updating…' : project.hidden ? 'Show on portfolio' : 'Hide from portfolio'}</button>{project.slug !== 'lema' && <button className="admin-text-button danger" type="button" disabled={busy === project.slug} onClick={() => change(project, 'delete')}>Delete</button>}</div>
      </article>
    })}</div>
    {shown.length === 0 && <div className="admin-empty"><h2>{query || filter !== 'all' ? 'No matching stories.' : 'Your next story starts here.'}</h2><p>{query || filter !== 'all' ? 'Try a different search or show all projects.' : 'Add a project and tell the story behind your decisions.'}</p><button className="admin-button" onClick={() => { setQuery(''); setFilter('all') }}>Show all projects</button></div>}
  </div>
}
