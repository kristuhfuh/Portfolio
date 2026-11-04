import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { getProjectBySlug as getProject } from '../lib/cms.js'
import { getSelectedProjects } from '../lib/projectLibrary.js'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import CaseStudyOverview from '../components/CaseStudyOverview.jsx'
import CaseStudyEvidence from '../components/CaseStudyEvidence.jsx'
import { getCaseStudyNotes, hasDraftText } from '../data/caseStudyNotes.js'
import { formatCaseStudyText } from '../lib/caseStudyText.js'
import { lemaProject } from '../data/lema.js'
import CaseStudyComparisons from '../components/CaseStudyComparisons.jsx'
import CaseStudyHero from '../components/CaseStudyHero.jsx'
import CaseStudyChapters from '../components/CaseStudyChapters.jsx'
import CaseStudyNavigation from '../components/CaseStudyNavigation.jsx'
import { getCaseStudyChapters } from '../data/caseStudyStories.js'
import CaseStudyGallery from '../components/CaseStudyGallery.jsx'
import { useAuth } from '../lib/auth.jsx'
import NotFound from './NotFound.jsx'
import '../styles/case-studies.css'

// Renders CMS text that may be plain (uses \n\n) or HTML (from RichTextField)
const richHtml = formatCaseStudyText

function getNextProject(slug) {
  const projects = getSelectedProjects()
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Story section (sticky heading + rich body) ───
function StoryBlock({ label, heading, accent, children, id }) {
  return (
    <section id={id} className="case-prose border-t border-line py-20 dark:border-dark-line md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-4">
          <div className="sticky top-32">
            <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
{label}
            </div>
            <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
              {heading}
            </h2>
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">{children}</div>
      </div>
    </section>
  )
}

// ─── Pull quote — dramatic editorial callout ───
function PullQuote({ quote, accent }) {
  return (
    <section className="border-t border-line dark:border-dark-line">
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          <span className="absolute -top-8 left-0 font-display text-[10rem] leading-none md:-left-16 md:-top-16 md:text-[16rem]"
            style={{ color: accent, opacity: 0.12 }}>
            &ldquo;
          </span>
          <blockquote className="relative font-display text-3xl italic leading-[1.2] tracking-tighter2 text-ink dark:text-dark-ink md:text-5xl lg:text-6xl">
            {quote}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-16" style={{ background: accent }} />
            <span className="label text-muted dark:text-dark-muted">The lesson</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Outcome stats grid — animated counters ───
function OutcomeStats({ stats, accent, intro, label, heading }) {
  const publishedStats = (stats || []).filter(stat => !hasDraftText(stat.value) && !hasDraftText(stat.label))
  if (!publishedStats.length) return null
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-24 text-cream dark:border-dark-line dark:bg-cream dark:text-ink md:py-32">

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <div className="label mb-4 text-cream/60 dark:text-ink/60">{label || '✦ By the numbers'}</div>
          <h2 className="display-lg text-[clamp(2.5rem,6vw,5rem)]">
            {heading || (
              <>What the work produced.</>
            )}
          </h2>
          {intro && (
            <p className="mt-6 text-base leading-relaxed text-cream/80 dark:text-ink/80 md:text-lg">
              {intro}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-cream/10 dark:bg-ink/10 md:grid-cols-3">
          {publishedStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative flex flex-col gap-3 bg-ink p-8 transition-colors hover:bg-ink/80 dark:bg-cream dark:hover:bg-cream/80 md:p-10"
            >
              <div className="font-display text-[clamp(3rem,6vw,5rem)] leading-none tracking-tightest"
                style={{ color: accent }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
              </div>
              <div className="text-sm text-cream/80 dark:text-ink/80">{stat.label}</div>
              {/* Subtle grid corner mark */}
              <span className="absolute right-4 top-4 h-1 w-1 rounded-full bg-cream/20 dark:bg-ink/20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Deliverables — list of what shipped ───
function Deliverables({ items, accent }) {
  if (!items?.length) return null
  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <div className="label mb-4 flex items-center gap-2 text-muted dark:text-dark-muted">
    Deliverables
              </div>
              <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
                What I delivered.
              </h2>
              <p className="mt-6 text-muted dark:text-dark-muted">
                Design flows, systems, and handoff assets. Release status and measured results are described separately.
              </p>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="grid gap-3">
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-white/40 px-5 py-4 transition-all hover:border-transparent hover:bg-white/80 dark:border-dark-line dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xs transition-all group-hover:border-transparent group-hover:text-cream dark:border-dark-line"
                    style={{ '--hover-bg': accent }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
                  >
                    ✓
                  </span>
                  <span className="text-ink dark:text-dark-ink">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Reception callout — small but punchy ───
function Reception({ quote, accent, attribution, requireAttribution }) {
  if (!quote || hasDraftText(quote) || (requireAttribution && !(attribution?.role && attribution?.context && attribution?.approved === true))) return null
  return (
    <section className="border-t border-line py-20 dark:border-dark-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl rounded-3xl border p-8 md:p-12"
          style={{ borderColor: `${accent}40`, background: `${accent}08` }}
        >
          <div className="label mb-4 flex items-center gap-2" style={{ color: accent }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            Reception
          </div>
          <p className="font-display text-xl italic leading-relaxed tracking-tighter2 text-ink dark:text-dark-ink md:text-2xl">
            {quote}
          </p>
          {attribution?.role && attribution?.context && <p className="mt-5 text-sm text-muted dark:text-dark-muted">{attribution.role} · {attribution.context}</p>}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Principles — four-up grid of the rules behind the work ───
function Principles({ principles, accent }) {
  if (!principles?.length) return null
  return (
    <section className="border-t border-line py-20 dark:border-dark-line md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 max-w-3xl">
          <div className="label mb-4 text-muted dark:text-dark-muted">Principles</div>
          <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
            Four rules that drove every 3.0 decision.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-line p-6 transition-colors duration-300 dark:border-dark-line md:p-8"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}80` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 font-display font-bold leading-none tracking-tightest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ fontSize: '7rem', color: `${accent}10` }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="label relative mb-3 tabular-nums" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="relative font-display text-xl text-ink dark:text-dark-ink md:text-2xl">
                {p.title}
              </h3>
              <p className="relative mt-3 text-ink/80 dark:text-dark-ink/80">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Decisions and trade-offs — three-column table ───
function DecisionsTable({ decisions, accent }) {
  if (!decisions?.length) return null
  return (
    <section id="decisions" className="border-t border-line py-20 dark:border-dark-line md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 max-w-3xl">
          <div className="label mb-4 text-muted dark:text-dark-muted">Decisions and trade-offs</div>
          <h2 className="display-lg text-[clamp(2rem,4vw,3.5rem)] text-ink dark:text-dark-ink">
            What we chose, and why.
          </h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line dark:border-dark-line">
          <div className="hidden grid-cols-12 gap-6 border-b border-line bg-ink/5 px-6 py-4 dark:border-dark-line dark:bg-cream/5 md:grid">
            <div className="label col-span-3 text-muted dark:text-dark-muted">We chose</div>
            <div className="label col-span-3 text-muted dark:text-dark-muted">Over</div>
            <div className="label col-span-6 text-muted dark:text-dark-muted">Because</div>
          </div>
          {decisions.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`grid grid-cols-1 gap-3 border-b border-line px-6 py-6 transition-colors last:border-b-0 hover:bg-ink/[0.03] dark:border-dark-line dark:hover:bg-cream/[0.03] md:grid-cols-12 md:gap-6 ${
                i % 2 === 1 ? 'bg-ink/[0.015] dark:bg-cream/[0.015]' : ''
              }`}
            >
              <div className="md:col-span-3">
                <div className="label mb-1 text-muted dark:text-dark-muted md:hidden">We chose</div>
                <div className="font-medium text-ink dark:text-dark-ink">{d.chose}</div>
              </div>
              <div className="md:col-span-3">
                <div className="label mb-1 text-muted dark:text-dark-muted md:hidden">Over</div>
                <div className="flex items-start gap-2 text-ink/70 dark:text-dark-ink/70">
                  <span
                    aria-hidden="true"
                    className="mt-[0.4em] hidden text-xs opacity-50 md:inline"
                    style={{ color: accent }}
                  >
                    ←
                  </span>
                  <span>{d.over}</span>
                </div>
              </div>
              <div className="md:col-span-6">
                <div className="label mb-1 text-muted dark:text-dark-muted md:hidden">Because</div>
                <div className="text-ink/85 dark:text-dark-ink/85">{d.because}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main case study page ───
export default function CaseStudy() {
  const { user, loading: authLoading } = useAuth()
  const { slug } = useParams()
  const project = getSelectedProjects().find(project => project.slug === slug) || getProject(slug) || (slug === lemaProject.slug ? lemaProject : null)

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [slug])

  if (project?.hidden && authLoading) return <div className="min-h-screen grid place-items-center" role="status">Loading preview…</div>
  if (!project || (project.hidden && !user)) return <NotFound />
  const notes = getCaseStudyNotes(project)
  const decisions = project.decisions?.length ? project.decisions : notes.decisions
  const chapters = getCaseStudyChapters(project)
  const navigationSections = [{ id: 'snapshot', label: 'The short version' }, { id: 'problem', label: 'The problem' }, ...((chapters.length || project.approach?.length) ? [{ id: 'process', label: 'Design story' }] : []), ...(decisions?.length ? [{ id: 'decisions', label: 'Key decisions' }] : []), { id: 'results', label: 'Results & lessons' }]
  const wordCount = [project.overview, project.challenge, project.outcome, project.reflection, ...(project.approach || []), ...(project.chapters || []).map(c => c.body)].join(' ').replace(/<[^>]*>/g, '').split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const next = getNextProject(slug)
  const accent = project.accent || '#6D28D9'

  return (
    <article className="poet-case-study" key={slug} style={{ '--case-accent': accent }}>
      <CaseStudyHero project={project} readingTime={readingTime} />
      <CaseStudyNavigation slug={slug} sections={navigationSections} />
      <CaseStudyOverview project={project} />

      {/* ─── The story: overview ─── */}
      <StoryBlock label="Context and collaboration" heading="The brief. My part in it." accent={accent}>
        <div
          className="space-y-5 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>b]:font-semibold [&>strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: richHtml(project.overview) }}
        />
      </StoryBlock>

      {/* ─── Challenge ─── */}
      <StoryBlock id="problem" label="Problem framing" heading="What had to change." accent={accent}>
        <div
          className="space-y-5 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>b]:font-semibold [&>strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: richHtml(project.challenge) }}
        />
      </StoryBlock>

      {/* ─── Pull quote (mid-story breakpoint) ─── */}
      {project.pullQuote && <PullQuote quote={project.pullQuote} accent={accent} />}

      {/* ─── Principles (public, 3.0 projects) ─── */}
      <Principles principles={project.principles} accent={accent} />

      {/* ─── Chapters or legacy image gallery ─── */}
      <CaseStudyChapters chapters={chapters} title={project.title} />
      <CaseStudyGallery images={project.images} title={project.title} />

      {/* ─── Approach (legacy projects only) ─── */}
      {!chapters.length && project.approach?.length > 0 && (
        <StoryBlock id="process" label="Process and iteration" heading="How I got there." accent={accent}>
          <ol className="space-y-0">
            {project.approach.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="flex gap-5 border-b border-line py-6 dark:border-dark-line"
              >
                <span className="label shrink-0 pt-1 tabular-nums" style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-lg leading-relaxed text-ink dark:text-dark-ink [&>b]:font-semibold [&>strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: richHtml(step) }}
                />
              </motion.li>
            ))}
          </ol>
        </StoryBlock>
      )}

      <DecisionsTable decisions={decisions} accent={accent} />
      <CaseStudyEvidence slug={slug} />

      {/* ─── Outcome prose (legacy projects only) ─── */}
      {project.outcome && (
        <StoryBlock id="results" label="Results and delivery" heading="What changed." accent={accent}>
          <div
            className="space-y-5 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>b]:font-semibold [&>strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: richHtml(project.outcome) }}
          />
        </StoryBlock>
      )}

      <CaseStudyComparisons items={project.comparisons} />

      {/* ─── Deliverables list (legacy projects only) ─── */}
      <Deliverables items={project.deliverables} accent={accent} />

      {/* ─── Outcome stats grid — honest status framing when project.statusNote is set ─── */}
      <div id={project.outcome ? undefined : 'results'} className="case-results-anchor" />
      <OutcomeStats
        stats={project.outcomeStats}
        accent={accent}
        intro={project.statusNote}
        label="✦ Scope of the design delivery"
        heading="What the work covers."
      />

      {/* ─── Reception callout (legacy projects only) ─── */}
      <Reception quote={project.reception} accent={accent} attribution={project.receptionAttribution} requireAttribution={slug === 'landmark-events'} />

      {/* ─── Reflection ─── */}
      {project.reflection && (
        <section className="border-t border-line dark:border-dark-line">
          <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-3xl">
              <div className="label mb-6 flex items-center gap-2 text-muted dark:text-dark-muted">
    Reflection
              </div>
              <div
                className="text-lg leading-relaxed text-ink/90 dark:text-dark-ink/90 [&>p]:mb-5 [&>p:last-child]:mb-0 [&>b]:font-semibold [&>strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: richHtml(project.reflection) }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── Tags ─── */}
      <section className="border-t border-line py-12 dark:border-dark-line">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-3 px-6 md:px-10">
          {project.tags.map((t) => (
            <span key={t} className="label rounded-full border border-line px-4 py-2 text-muted dark:border-dark-line dark:text-dark-muted">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Next project ─── */}
      {next && next.slug !== slug && (
      <section className="border-t border-line dark:border-dark-line">
        <Link to={`/work/${next.slug}`}
          className="group relative flex flex-col items-start justify-between gap-8 overflow-hidden px-6 py-16 transition-colors md:flex-row md:items-center md:px-10 md:py-28"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: next.accent || accent }} />
          <div className="relative">
            <div className="label mb-4 text-muted group-hover:text-cream/70 dark:text-dark-muted">Next case study →</div>
            <h3 className="display-hero text-[clamp(2.5rem,8vw,7rem)] text-ink group-hover:text-cream dark:text-dark-ink">
              {next.title}
            </h3>
            <p className="mt-3 max-w-md text-muted group-hover:text-cream/70 dark:text-dark-muted">
              {next.tagline}
            </p>
          </div>
          <div className="relative h-36 w-full max-w-[280px] overflow-hidden rounded-2xl border border-line dark:border-dark-line md:h-48 md:w-[320px]">
            <img src={next.cover} alt={next.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </Link>
      </section>
      )}
    </article>
  )
}
