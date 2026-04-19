import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { saveProject, getProjects } from '../lib/cms.js'

const formats = [
  {
    id: 'classic',
    name: 'Classic Case Study',
    description: 'Hook → Overview → Challenge → Approach → Outcome → Reflection',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    id: 'narrative',
    name: 'Story Arc',
    description: 'Emotional before → turning point → transformation narrative',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    id: 'metrics',
    name: 'Metrics-First',
    description: 'Impact numbers lead, then the process that created them',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    id: 'sprint',
    name: 'Design Sprint',
    description: 'Fast-paced, decisions under pressure, tight timelines',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 'research',
    name: 'Research Deep-Dive',
    description: 'Discovery and insights heavy, user research leads to design decisions',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    id: 'system',
    name: 'Design System',
    description: 'Components, tokens, documentation and scaling a design language',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  },
]

const STEP_FORMAT = 0
const STEP_BRIEF  = 1
const STEP_RESULT = 2

export default function AIGenerateModal({ onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEP_FORMAT)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [brief, setBrief] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState(null)

  const handleGenerate = async () => {
    if (!brief.trim()) return
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, format: selectedFormat }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)
      setStep(STEP_RESULT)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateProject = () => {
    if (!generated) return
    const projects = getProjects()
    const slug = (generated.title || 'untitled')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const final = {
      slug,
      number: String(projects.length + 1).padStart(2, '0'),
      title: generated.title || '',
      tagline: generated.tagline || '',
      tags: generated.tags || [],
      client: generated.client || '',
      year: new Date().getFullYear().toString(),
      role: '', timeline: '', team: '', location: '',
      cover: '', accent: '#6D28D9', accentSoft: '#A78BFA',
      hook: generated.hook || '',
      images: [], metrics: [{ value: '', label: '' }, { value: '', label: '' }],
      outcomeStats: [],
      deliverables: generated.deliverables || [],
      overview: generated.overview || '',
      challenge: generated.challenge || '',
      pullQuote: generated.pullQuote || '',
      approach: generated.approach ? [generated.approach] : [],
      outcome: generated.outcome || '',
      reception: '', reflection: generated.reflection || '', link: null,
    }
    saveProject(final)
    onClose()
    navigate(`/admin/projects/${slug}`)
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-cream shadow-2xl dark:border-dark-line dark:bg-dark-bg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5 dark:border-dark-line">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-ink dark:text-dark-ink">Generate with Claude</div>
              <div className="text-xs text-muted dark:text-dark-muted">
                {step === STEP_FORMAT && 'Step 1 of 2 — Choose a format'}
                {step === STEP_BRIEF && 'Step 2 of 2 — Describe your project'}
                {step === STEP_RESULT && 'Review your generated case study'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted transition-colors hover:bg-line/50 dark:text-dark-muted dark:hover:bg-dark-line/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Format selection ── */}
            {step === STEP_FORMAT && (
              <motion.div key="format" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="mb-5 text-sm text-muted dark:text-dark-muted">
                  Pick the structure that best fits this project. Claude will shape the tone and narrative accordingly.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {formats.map(f => (
                    <button key={f.id} onClick={() => setSelectedFormat(f.id)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        selectedFormat === f.id
                          ? 'border-accent bg-accent/5'
                          : 'border-line bg-white/60 hover:border-accent/50 dark:border-dark-line dark:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selectedFormat === f.id ? 'bg-accent text-cream' : 'bg-line/60 text-muted dark:bg-dark-line dark:text-dark-muted'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d={f.icon} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${selectedFormat === f.id ? 'text-accent' : 'text-ink dark:text-dark-ink'}`}>{f.name}</div>
                        <div className="mt-0.5 text-xs text-muted dark:text-dark-muted">{f.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(STEP_BRIEF)}
                    disabled={!selectedFormat}
                    className="label inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-cream transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Next — Write Brief
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Brief ── */}
            {step === STEP_BRIEF && (
              <motion.div key="brief" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent">
                    <path d={formats.find(f => f.id === selectedFormat)?.icon} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs font-medium text-accent">{formats.find(f => f.id === selectedFormat)?.name}</span>
                  <button onClick={() => setStep(STEP_FORMAT)} className="ml-1 text-[10px] text-muted underline hover:text-accent">change</button>
                </div>

                <p className="mb-3 text-sm text-muted dark:text-dark-muted">
                  Describe the project in plain language. Include what was built, for whom, the core problem, and the results. More detail = better output.
                </p>
                <textarea
                  autoFocus
                  rows={8}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                  placeholder={`e.g. Redesigned the onboarding flow for a Lagos-based fintech app called PocketPay. The app helps underbanked users send and receive money. Users were dropping off at 60% before completing sign-up because the form was too long and asked for documents they didn't have ready.\n\nWe simplified from 12 steps to 4, added a "save and continue later" option, and personalised the copy based on the user's stated goal. We ran usability tests with 12 users and iterated 3 times.\n\nResult: Drop-off fell from 60% to 18% within 2 weeks of launch. Sign-ups increased by 40%.`}
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                />
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => setStep(STEP_FORMAT)} className="label text-sm text-muted hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink">
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !brief.trim()}
                    className="label inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-cream transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {generating ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0110 10"/>
                        </svg>
                        Claude is writing…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        Generate Case Study
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Result preview ── */}
            {step === STEP_RESULT && generated && (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="mb-5 text-sm text-muted dark:text-dark-muted">
                  Claude has drafted your case study. Review it below, then create the project — you can edit everything in the full editor.
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Hook', value: generated.hook },
                    { label: 'Overview', value: generated.overview },
                    { label: 'Challenge', value: generated.challenge },
                    { label: 'Approach', value: generated.approach },
                    { label: 'Outcome', value: generated.outcome },
                    { label: 'Reflection', value: generated.reflection },
                    { label: 'Pull Quote', value: generated.pullQuote },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="rounded-xl border border-line bg-white/60 p-4 dark:border-dark-line dark:bg-white/[0.03]">
                      <div className="label mb-1.5 text-[10px] uppercase tracking-widest text-muted dark:text-dark-muted">{f.label}</div>
                      <p className="text-sm leading-relaxed text-ink dark:text-dark-ink whitespace-pre-line">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => { setGenerated(null); setStep(STEP_BRIEF) }}
                    className="label text-sm text-muted hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink"
                  >
                    ← Regenerate
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="label inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-cream transition-all hover:scale-[1.02]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    Create Project & Open Editor
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
