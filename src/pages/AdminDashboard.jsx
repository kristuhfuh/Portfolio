import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, getContacts } from '../lib/cms.js'
import { fetchAnalytics } from '../lib/analytics.js'
import AIGenerateModal from '../components/AIGenerateModal.jsx'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } },
})

function StatCard({ value, label, sub, accent, index }) {
  return (
    <motion.div {...fadeUp(index)}
      className="rounded-2xl border border-black/6 bg-white p-6"
    >
      <div className="flex items-start justify-between">
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
          className={`text-5xl leading-none ${accent}`}>{value}</span>
        {sub !== undefined && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${sub > 0 ? 'bg-[#6D28D9]/10 text-[#6D28D9]' : 'bg-black/8 text-[#141414]/55'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sub > 0 ? `${sub} new` : 'none new'}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-[#141414]/60">{label}</p>
    </motion.div>
  )
}

function QuickAction({ to, icon, title, desc, accent }) {
  return (
    <Link to={to}
      className="group flex items-center gap-4 rounded-2xl border border-black/6 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-[#141414]">{title}</div>
        <div className="mt-0.5 truncate text-sm text-[#141414]/60">{desc}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" className="shrink-0 text-black/20 transition-transform group-hover:translate-x-0.5 group-hover:text-[#6D28D9]">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

function DeviceIcon({ ua }) {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua)
  return isMobile
    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function AnalyticsPanel({ data }) {
  const mono = { fontFamily: "'JetBrains Mono', monospace" }
  const label = 'text-xs text-[#141414]/55 uppercase tracking-widest'

  if (data === null) {
    return (
      <div className="space-y-4">
        <p className={label} style={mono}>Site Analytics · Last 30 days</p>
        <div className="rounded-2xl border border-black/6 bg-white p-6 text-center text-sm text-[#141414]/40">Loading…</div>
      </div>
    )
  }
  if (!data) return null

  const { totalViews, viewsToday, uniqueVisitors, topPages, topClicks, recent } = data

  return (
    <div className="space-y-4">
      <p className={label} style={mono}>Site Analytics · Last 30 days</p>

      {/* 3 stat pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: totalViews, label: 'Views' },
          { value: uniqueVisitors, label: 'Visitors' },
          { value: viewsToday, label: 'Today' },
        ].map(({ value, label: l }) => (
          <div key={l} className="rounded-2xl border border-black/6 bg-white p-4 text-center">
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
              className="block text-3xl leading-none text-[#141414]">{value}</span>
            <p className="mt-1.5 text-[11px] text-[#141414]/50">{l}</p>
          </div>
        ))}
      </div>

      {/* Top pages */}
      <div className="rounded-2xl border border-black/6 bg-white p-5">
        <p className="mb-3 text-[10px] font-medium text-[#141414]/45 uppercase tracking-widest" style={mono}>Top Pages</p>
        {topPages.length === 0
          ? <p className="text-xs text-[#141414]/35">No data yet</p>
          : topPages.map(({ page, count }) => (
            <div key={page} className="flex items-center justify-between py-1.5">
              <span className="min-w-0 truncate text-xs text-[#141414]">{page}</span>
              <span className="ml-3 shrink-0 rounded-full bg-[#6D28D9]/10 px-2 py-0.5 text-[10px] text-[#6D28D9]"
                style={mono}>{count}</span>
            </div>
          ))}
      </div>

      {/* Top clicks */}
      <div className="rounded-2xl border border-black/6 bg-white p-5">
        <p className="mb-3 text-[10px] font-medium text-[#141414]/45 uppercase tracking-widest" style={mono}>Top Clicks</p>
        {topClicks.length === 0
          ? <p className="text-xs text-[#141414]/35">No data yet</p>
          : topClicks.map(({ element, count }) => (
            <div key={element} className="flex items-center justify-between py-1.5">
              <span className="min-w-0 truncate text-xs text-[#141414]">{element}</span>
              <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600"
                style={mono}>{count}</span>
            </div>
          ))}
      </div>

      {/* Recent visits */}
      {recent.length > 0 && (
        <div className="rounded-2xl border border-black/6 bg-white">
          <div className="border-b border-black/5 px-5 py-3.5">
            <p className="text-[10px] font-medium text-[#141414]/45 uppercase tracking-widest" style={mono}>Recent Visits</p>
          </div>
          <div className="divide-y divide-black/5">
            {recent.map(v => (
              <div key={v.id} className="flex items-center gap-2.5 px-5 py-2.5 text-[11px]">
                <span className="shrink-0 text-[#141414]/35"><DeviceIcon ua={v.user_agent || ''} /></span>
                <span className="min-w-0 flex-1 truncate text-[#141414]">{v.page}</span>
                {(v.city || v.country) && (
                  <span className="shrink-0 text-[#141414]/40">{[v.city, v.country].filter(Boolean).join(', ')}</span>
                )}
                <span className="shrink-0 text-[#141414]/30" style={mono}>{timeAgo(v.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const projects = getProjects()
  const contacts = getContacts()
  const unread   = contacts.filter(c => !c.read).length
  const [showAI, setShowAI] = useState(false)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => setAnalytics(false))
  }, [])

  const mono = { fontFamily: "'JetBrains Mono', monospace" }

  return (
    <div className="w-full">
      <AnimatePresence>{showAI && <AIGenerateModal onClose={() => setShowAI(false)} />}</AnimatePresence>

      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <p className="text-sm text-[#141414]/55" style={mono}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </p>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
          className="mt-1 text-4xl leading-tight text-[#141414]">
          {greeting()}, Christopher.
        </h2>
        <p className="mt-2 text-[#141414]/60">Here's what's happening with your portfolio.</p>
      </motion.div>

      {/* ── Content stats ─────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard index={1} value={projects.length} label="Case studies published" accent="text-[#141414]" />
        <StatCard index={2} value={contacts.length} label="Total messages received" sub={unread} accent="text-[#6D28D9]" />
        <StatCard index={3} value={projects.filter(p => !p.hidden).length} label="Projects visible on site" accent="text-emerald-500" />
      </div>

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left column — actions + messages */}
        <div className="col-span-7 space-y-6">

          {/* AI Generate */}
          <motion.div {...fadeUp(4)}>
            <button onClick={() => setShowAI(true)}
              className="group w-full rounded-2xl border border-[#6D28D9]/20 bg-gradient-to-br from-[#6D28D9]/5 to-[#6D28D9]/10 p-6 text-left transition-all hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D28D9] shadow-lg shadow-[#6D28D9]/30">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
                      className="text-lg text-[#141414]">Generate with Claude AI</div>
                    <div className="mt-0.5 text-sm text-[#141414]/60">Draft a full case study narrative instantly</div>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" className="shrink-0 text-[#6D28D9] transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Classic', 'Story Arc', 'Metrics-First', 'Design Sprint', 'Research Deep-Dive', 'Design System'].map(f => (
                  <span key={f} className="rounded-full border border-[#6D28D9]/15 bg-[#6D28D9]/5 px-3 py-1 text-xs text-[#6D28D9]"
                    style={mono}>{f}</span>
                ))}
              </div>
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div {...fadeUp(5)}>
            <p className="mb-3 text-xs text-[#141414]/55 uppercase tracking-widest" style={mono}>Quick Actions</p>
            <div className="space-y-2">
              <QuickAction to="/admin/projects/new" title="Add a new case study"
                desc="Start from scratch with a blank project"
                accent="bg-[#141414]"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}
              />
              <QuickAction to="/admin/pages" title="Edit page content"
                desc="Update hero, about, contact and gallery"
                accent="bg-[#6D28D9]"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
              />
              <QuickAction to="/admin/contacts" title={`View messages ${unread > 0 ? `· ${unread} unread` : ''}`}
                desc="Read and reply to contact form submissions"
                accent="bg-emerald-500"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
              />
            </div>
          </motion.div>

          {/* Recent Messages */}
          {contacts.length > 0 && (
            <motion.div {...fadeUp(6)}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-[#141414]/55 uppercase tracking-widest" style={mono}>Recent Messages</p>
                <Link to="/admin/contacts" className="text-xs text-[#6D28D9] hover:underline">View all →</Link>
              </div>
              <div className="space-y-2">
                {contacts.slice(0, 3).map((c, i) => (
                  <motion.div key={c.id} {...fadeUp(7 + i)}
                    className="flex items-start gap-4 rounded-2xl border border-black/6 bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D28D9]/10 text-sm font-semibold text-[#6D28D9]">
                      {c.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${c.read ? 'text-[#141414]/55' : 'text-[#141414]'}`}>{c.name}</span>
                        <span className="shrink-0 text-xs text-[#141414]/50" style={mono}>
                          {new Date(c.date || c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[#141414]/55">{c.message}</p>
                    </div>
                    {!c.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6D28D9]" />}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column — analytics */}
        <motion.div {...fadeUp(3)} className="col-span-5">
          <AnalyticsPanel data={analytics} />
        </motion.div>

      </div>
    </div>
  )
}
