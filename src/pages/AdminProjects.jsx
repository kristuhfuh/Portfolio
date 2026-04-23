import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjects, saveProject, deleteProject, getProjectBySlug, toggleProjectVisibility, normalizeDriveUrl } from '../lib/cms.js'
import RichTextField from '../components/RichTextField.jsx'
import GalleryImageManager from '../components/GalleryImageManager.jsx'
import ImageFocalPoint from '../components/ImageFocalPoint.jsx'

// ─── Projects List ───
export function AdminProjects() {
  const [projects, setProjects] = useState(getProjects())

  const handleDelete = (slug) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setProjects(deleteProject(slug))
  }

  const handleToggleVisibility = (slug) => {
    setProjects(toggleProjectVisibility(slug))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-ink dark:text-dark-ink">Case Studies</h1>
          <p className="mt-2 text-muted dark:text-dark-muted">
            {projects.length} projects · {projects.filter(p => !p.hidden).length} visible
          </p>
        </div>
        <Link to="/admin/projects/new"
          className="label inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-cream transition-transform hover:scale-[1.02]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          New Project
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {projects.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={`flex items-center gap-4 rounded-2xl border border-line bg-white/60 p-4 backdrop-blur dark:border-dark-line dark:bg-white/[0.03] ${p.hidden ? 'opacity-50' : ''}`}
          >
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-line dark:bg-dark-line">
              {p.cover && <img src={normalizeDriveUrl(p.cover)} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted dark:text-dark-muted">{p.number}</span>
                <h3 className="truncate font-display text-xl text-ink dark:text-dark-ink">{p.title}</h3>
                {p.hidden && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-400">Hidden</span>
                )}
              </div>
              <div className="mt-1 flex gap-2">
                {p.tags?.slice(0, 3).map(t => (
                  <span key={t} className="rounded-full bg-line/60 px-2 py-0.5 text-[10px] text-muted dark:bg-dark-line dark:text-dark-muted">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button 
                onClick={() => handleToggleVisibility(p.slug)}
                className="rounded-lg border border-line px-3 py-2 text-xs text-ink transition-colors hover:bg-accent hover:text-cream dark:border-dark-line dark:text-dark-ink"
                title={p.hidden ? 'Show on website' : 'Hide from website'}
              >
                {p.hidden ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
              <Link to={`/admin/projects/${p.slug}`}
                className="rounded-lg border border-line px-3 py-2 text-xs text-ink transition-colors hover:bg-accent hover:text-cream dark:border-dark-line dark:text-dark-ink">
                Edit
              </Link>
              <button onClick={() => handleDelete(p.slug)}
                className="rounded-lg border border-line px-3 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:border-dark-line dark:hover:bg-red-900/20">
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Project Editor ───
const emptyProject = {
  slug: '', number: '', title: '', tagline: '', tags: [], client: '', year: new Date().getFullYear().toString(),
  location: '', role: '', timeline: '', team: '', cover: '', accent: '#6D28D9', accentSoft: '#A78BFA',
  hook: '',
  images: [], metrics: [{ value: '', label: '' }, { value: '', label: '' }],
  outcomeStats: [],
  deliverables: [],
  overview: '', challenge: '', pullQuote: '', approach: [], outcome: '',
  reception: '', reflection: '', link: null,
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label mb-1.5 block text-muted dark:text-dark-muted">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink'
const textareaCls = inputCls + ' min-h-[120px] resize-y'

export function AdminProjectEdit() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNew = slug === 'new'
  const [project, setProject] = useState(emptyProject)
  const [tagsStr, setTagsStr] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [approachStr, setApproachStr] = useState('')
  const [deliverablesStr, setDeliverablesStr] = useState('')
  const [saved, setSaved] = useState(false)
  const [brief, setBrief] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  useEffect(() => {
    if (!isNew) {
      const p = getProjectBySlug(slug)
      if (p) {
        setProject({ ...emptyProject, ...p })
        setTagsStr(p.tags?.join(', ') || '')
        setGalleryImages((p.images || []).map(img =>
          typeof img === 'string' ? { url: img, caption: '' } : img
        ))
        setApproachStr(p.approach?.join('\n---\n') || '')
        setDeliverablesStr(p.deliverables?.join('\n') || '')
      }
    }
  }, [slug, isNew])

  const update = (key, value) => setProject(prev => ({ ...prev, [key]: value }))
  const updateMetric = (idx, key, value) => {
    const m = [...project.metrics]
    m[idx] = { ...m[idx], [key]: value }
    update('metrics', m)
  }
  const updateOutcomeStat = (idx, key, value) => {
    const stats = [...(project.outcomeStats || [])]
    stats[idx] = { ...stats[idx], [key]: value }
    update('outcomeStats', stats)
  }
  const addOutcomeStat = () => {
    update('outcomeStats', [...(project.outcomeStats || []), { value: '', suffix: '', label: '' }])
  }
  const removeOutcomeStat = (idx) => {
    update('outcomeStats', (project.outcomeStats || []).filter((_, i) => i !== idx))
  }

  const handleGenerate = async () => {
    if (!brief.trim()) return
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      if (data.hook) update('hook', data.hook)
      if (data.overview) update('overview', data.overview)
      if (data.challenge) update('challenge', data.challenge)
      if (data.approach) setApproachStr(data.approach)
      if (data.outcome) update('outcome', data.outcome)
      if (data.reflection) update('reflection', data.reflection)
      if (data.pullQuote) update('pullQuote', data.pullQuote)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = () => {
    const final = {
      ...project,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      number: project.number || String(getProjects().length + 1).padStart(2, '0'),
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      images: galleryImages,
      approach: approachStr.split('\n---\n').map(s => s.trim()).filter(Boolean),
      deliverables: deliverablesStr.split('\n').map(s => s.trim()).filter(Boolean),
    }
    saveProject(final)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (isNew) navigate(`/admin/projects/${final.slug}`, { replace: true })
  }

  const previewTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean)
  const previewDeliverables = deliverablesStr.split('\n').map(s => s.trim()).filter(Boolean)
  const previewApproach = approachStr.split('\n---\n').map(s => s.trim()).filter(Boolean)

  return (
    <div className="flex gap-0 min-h-screen -m-8">
      {/* ── Form panel ── */}
      <div className="flex-1 min-w-0 overflow-y-auto p-8" style={{ maxHeight: '100vh' }}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link to="/admin/projects" className="label mb-2 inline-flex items-center gap-1 text-muted hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink">
                ← Back to Projects
              </Link>
              <h1 className="font-display text-3xl text-ink dark:text-dark-ink">
                {isNew ? 'New Case Study' : `Edit: ${project.title}`}
              </h1>
            </div>
            <button onClick={handleSave}
              className={`label rounded-lg px-5 py-2.5 text-cream transition-all ${saved ? 'bg-emerald-500' : 'bg-accent hover:scale-[1.02]'}`}>
              {saved ? '✓ Saved' : 'Save'}
            </button>
          </div>

          <div className="space-y-6 rounded-2xl border border-line bg-white/60 p-6 backdrop-blur dark:border-dark-line dark:bg-white/[0.03] md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Title"><input className={inputCls} value={project.title} onChange={e => update('title', e.target.value)} /></Field>
              <Field label="Slug"><input className={inputCls} value={project.slug} onChange={e => update('slug', e.target.value)} placeholder="auto-generated" /></Field>
            </div>

            <Field label="Tagline">
              <RichTextField value={project.tagline} onChange={v => update('tagline', v)} placeholder="Short project description…" singleLine />
            </Field>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Number"><input className={inputCls} value={project.number} onChange={e => update('number', e.target.value)} placeholder="01" /></Field>
              <Field label="Year"><input className={inputCls} value={project.year} onChange={e => update('year', e.target.value)} /></Field>
              <Field label="Accent Color"><input type="color" value={project.accent} onChange={e => update('accent', e.target.value)} className="h-12 w-full cursor-pointer rounded-lg border border-line dark:border-dark-line" /></Field>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Client"><input className={inputCls} value={project.client} onChange={e => update('client', e.target.value)} /></Field>
              <Field label="Role"><input className={inputCls} value={project.role} onChange={e => update('role', e.target.value)} /></Field>
              <Field label="Timeline"><input className={inputCls} value={project.timeline} onChange={e => update('timeline', e.target.value)} /></Field>
              <Field label="Team"><input className={inputCls} value={project.team} onChange={e => update('team', e.target.value)} /></Field>
              <Field label="Location"><input className={inputCls} value={project.location} onChange={e => update('location', e.target.value)} /></Field>
              <Field label="Tags (comma-separated)"><input className={inputCls} value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Mobile App, Design System" /></Field>
            </div>

            <Field label="Cover Image">
              <ImageFocalPoint
                label=""
                imageValue={project.cover}
                focusValue={project.coverFocus}
                onImageChange={v => update('cover', v)}
                onFocusChange={v => update('coverFocus', v)}
              />
            </Field>

            <Field label="Gallery Images">
              <GalleryImageManager images={galleryImages} onChange={setGalleryImages} />
            </Field>

            <h2 className="pt-4 font-display text-xl text-ink dark:text-dark-ink">Metrics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {project.metrics.map((m, i) => (
                <div key={i} className="space-y-3 rounded-xl border border-line p-4 dark:border-dark-line">
                  <Field label={`Metric ${i + 1} — Value`}><input className={inputCls} value={m.value} onChange={e => updateMetric(i, 'value', e.target.value)} placeholder="94+" /></Field>
                  <Field label={`Metric ${i + 1} — Label`}><input className={inputCls} value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} placeholder="Screens designed" /></Field>
                </div>
              ))}
            </div>

            <h2 className="pt-4 font-display text-xl text-ink dark:text-dark-ink">Story Elements</h2>
            <Field label="Hook (big opening statement — one line, dramatic)">
              <RichTextField value={project.hook || ''} onChange={v => update('hook', v)} placeholder="e.g. Design 94 screens. Make them feel like one product." singleLine />
            </Field>
            <Field label="Pull Quote (mid-story editorial callout)">
              <RichTextField value={project.pullQuote || ''} onChange={v => update('pullQuote', v)} placeholder="The lesson you want readers to walk away with." minHeight={100} />
            </Field>
            <Field label="Reception (short quote about how the work was received)">
              <RichTextField value={project.reception || ''} onChange={v => update('reception', v)} placeholder="e.g. Adopted unchanged — in a project this size, that's the clearest signal the architecture worked." minHeight={100} />
            </Field>

            <h2 className="pt-4 font-display text-xl text-ink dark:text-dark-ink">Outcome Stats (By the Numbers grid)</h2>
            <p className="text-sm text-muted dark:text-dark-muted">Animated counter stats shown in the dark hero strip. 3–6 recommended.</p>
            <div className="space-y-3">
              {(project.outcomeStats || []).map((s, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 rounded-xl border border-line p-3 dark:border-dark-line">
                  <div className="col-span-3">
                    <label className="label mb-1 block text-[10px] text-muted dark:text-dark-muted">Value</label>
                    <input className={inputCls} value={s.value || ''} onChange={e => updateOutcomeStat(i, 'value', e.target.value)} placeholder="94" />
                  </div>
                  <div className="col-span-2">
                    <label className="label mb-1 block text-[10px] text-muted dark:text-dark-muted">Suffix</label>
                    <input className={inputCls} value={s.suffix || ''} onChange={e => updateOutcomeStat(i, 'suffix', e.target.value)} placeholder="+ / % / ×" />
                  </div>
                  <div className="col-span-6">
                    <label className="label mb-1 block text-[10px] text-muted dark:text-dark-muted">Label</label>
                    <input className={inputCls} value={s.label || ''} onChange={e => updateOutcomeStat(i, 'label', e.target.value)} placeholder="Screens designed" />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button type="button" onClick={() => removeOutcomeStat(i)}
                      className="h-[46px] w-full rounded-lg border border-line text-red-500 hover:bg-red-50 dark:border-dark-line dark:hover:bg-red-900/20">×</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addOutcomeStat}
                className="label w-full rounded-lg border border-dashed border-line py-3 text-muted hover:border-accent hover:text-accent dark:border-dark-line dark:text-dark-muted">
                + Add outcome stat
              </button>
            </div>

            <Field label="Deliverables (one per line — shown as a checklist)">
              <textarea className={textareaCls + ' !min-h-[200px]'} value={deliverablesStr} onChange={e => setDeliverablesStr(e.target.value)} placeholder="iOS + Android mobile applications&#10;Wallet top-up & transaction history flows&#10;Loyalty system" />
            </Field>

            {/* ── AI Generation ── */}
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="label text-accent">Generate with Claude</span>
              </div>
              <p className="mb-3 text-xs text-muted dark:text-dark-muted">
                Describe the project in plain language — what was built, for whom, the problem, and the results. Claude will draft all narrative fields.
              </p>
              <textarea
                className={textareaCls + ' !min-h-[100px]'}
                placeholder="e.g. Redesigned the onboarding flow for a Lagos fintech app. Users were dropping off at 60% before completing sign-up. We simplified from 12 steps to 4, added progress indicators, and personalised the copy. Drop-off fell to 18% within 2 weeks of launch."
                value={brief}
                onChange={e => setBrief(e.target.value)}
              />
              {genError && <p className="mt-2 text-xs text-red-500">{genError}</p>}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !brief.trim()}
                className="label mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-cream transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/></svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Generate Narrative
                  </>
                )}
              </button>
              {!generating && !genError && (
                <p className="mt-2 text-[10px] text-muted dark:text-dark-muted">Fields below will be overwritten. Review and edit after generating.</p>
              )}
            </div>

            <h2 className="pt-4 font-display text-xl text-ink dark:text-dark-ink">Narrative Sections</h2>
            <Field label="Overview">
              <RichTextField value={project.overview} onChange={v => update('overview', v)} placeholder="Project overview…" minHeight={200} />
            </Field>
            <Field label="Challenge">
              <RichTextField value={project.challenge} onChange={v => update('challenge', v)} placeholder="The design challenge…" minHeight={200} />
            </Field>
            <Field label="Approach (separate steps with --- on its own line)">
              <textarea className={textareaCls + ' !min-h-[200px]'} value={approachStr} onChange={e => setApproachStr(e.target.value)} />
            </Field>
            <Field label="Outcome">
              <RichTextField value={project.outcome} onChange={v => update('outcome', v)} placeholder="What was achieved…" minHeight={200} />
            </Field>
            <Field label="Reflection">
              <RichTextField value={project.reflection || ''} onChange={v => update('reflection', v)} placeholder="What you learned…" minHeight={160} />
            </Field>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave}
              className={`label rounded-lg px-6 py-3 text-cream transition-all ${saved ? 'bg-emerald-500' : 'bg-accent hover:scale-[1.02]'}`}>
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Preview panel ── */}
      <div className="w-[420px] shrink-0 border-l border-line bg-cream/50 dark:border-dark-line dark:bg-dark-bg/50 overflow-y-auto sticky top-0" style={{ height: '100vh' }}>
        <div className="border-b border-line px-5 py-4 dark:border-dark-line flex items-center justify-between">
          <span className="label text-muted dark:text-dark-muted">Live Preview</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-muted dark:text-dark-muted">Updates as you type</span>
          </span>
        </div>

        <div className="p-5 space-y-5">
          {/* Project card preview */}
          <div className="rounded-2xl overflow-hidden border border-line dark:border-dark-line bg-white dark:bg-white/[0.03]">
            <div className="relative h-52 bg-line dark:bg-dark-line">
              {project.cover
                ? <img src={project.cover} alt="" className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center text-xs text-muted dark:text-dark-muted">No cover image</div>
              }
              {project.accent && (
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${project.accent}33, transparent)` }} />
              )}
              <div className="absolute top-3 left-3">
                <span className="font-mono text-xs text-white/80 bg-black/30 rounded px-2 py-1">{project.number || '—'}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-xl text-ink dark:text-dark-ink">{project.title || <span className="text-muted">Untitled project</span>}</h3>
              {project.tagline && <p className="mt-1 text-sm text-muted dark:text-dark-muted">{project.tagline}</p>}
              {previewTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {previewTags.map(t => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[10px] text-muted dark:border-dark-line dark:text-dark-muted">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meta details */}
          <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4 space-y-2.5">
            <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-3">Details</div>
            {[['Client', project.client], ['Role', project.role], ['Timeline', project.timeline], ['Team', project.team], ['Location', project.location], ['Year', project.year]].map(([k, v]) => v ? (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted dark:text-dark-muted">{k}</span>
                <span className="text-ink dark:text-dark-ink font-medium">{v}</span>
              </div>
            ) : null)}
          </div>

          {/* Hook */}
          {project.hook && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-2">Hook</div>
              <p className="font-display text-lg text-ink dark:text-dark-ink italic">{project.hook}</p>
            </div>
          )}

          {/* Metrics */}
          {project.metrics.some(m => m.value) && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-3">Metrics</div>
              <div className="grid grid-cols-2 gap-3">
                {project.metrics.filter(m => m.value).map((m, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ background: project.accent + '15' }}>
                    <div className="font-display text-2xl font-bold" style={{ color: project.accent }}>{m.value}</div>
                    <div className="mt-0.5 text-[11px] text-muted dark:text-dark-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcome stats */}
          {(project.outcomeStats || []).length > 0 && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-3">By the Numbers</div>
              <div className="grid grid-cols-2 gap-3">
                {project.outcomeStats.map((s, i) => (
                  <div key={i} className="rounded-lg bg-ink/5 p-3 dark:bg-white/5">
                    <div className="font-display text-xl font-bold text-ink dark:text-dark-ink">{s.value}{s.suffix}</div>
                    <div className="mt-0.5 text-[11px] text-muted dark:text-dark-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pull quote */}
          {project.pullQuote && (
            <div className="rounded-xl border-l-4 pl-4 py-3 pr-4" style={{ borderColor: project.accent }}>
              <p className="text-sm italic text-ink/80 dark:text-dark-ink/80">{project.pullQuote}</p>
            </div>
          )}

          {/* Deliverables */}
          {previewDeliverables.length > 0 && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-3">Deliverables</div>
              <ul className="space-y-1.5">
                {previewDeliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink dark:text-dark-ink">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" style={{ color: project.accent }}><path d="M20 6L9 17l-5-5" /></svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Narrative preview */}
          {project.overview && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-2">Overview</div>
              <p className="text-sm leading-relaxed text-ink/80 dark:text-dark-ink/80 line-clamp-5">{project.overview}</p>
            </div>
          )}

          {previewApproach.length > 0 && (
            <div className="rounded-xl border border-line bg-white dark:border-dark-line dark:bg-white/[0.03] p-4">
              <div className="label text-[10px] text-muted dark:text-dark-muted uppercase tracking-widest mb-3">Approach ({previewApproach.length} steps)</div>
              {previewApproach.map((step, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <span className="font-mono text-[10px] text-muted dark:text-dark-muted mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-ink/80 dark:text-dark-ink/80 line-clamp-2">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
