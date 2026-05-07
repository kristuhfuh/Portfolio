import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, getContacts } from '../lib/cms.js'
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
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${sub > 0 ? 'bg-[#6D28D9]/10 text-[#6D28D9]' : 'bg-black/5 text-black/30'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sub > 0 ? `${sub} new` : 'none new'}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-[#141414]/50">{label}</p>
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
        <div className="mt-0.5 truncate text-sm text-[#141414]/50">{desc}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" className="shrink-0 text-black/20 transition-transform group-hover:translate-x-0.5 group-hover:text-[#6D28D9]">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

export default function AdminDashboard() {
  const projects = getProjects()
  const contacts = getContacts()
  const unread   = contacts.filter(c => !c.read).length
  const [showAI, setShowAI] = useState(false)

  return (
    <div className="max-w-3xl">
      <AnimatePresence>{showAI && <AIGenerateModal onClose={() => setShowAI(false)} />}</AnimatePresence>

      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <p className="text-sm text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </p>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
          className="mt-1 text-4xl leading-tight text-[#141414]">
          {greeting()},<br />Christopher.
        </h2>
        <p className="mt-2 text-[#141414]/50">Here's what's happening with your portfolio.</p>
      </motion.div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <StatCard index={1} value={projects.length} label="Case studies published" accent="text-[#141414]" />
        <StatCard index={2} value={contacts.length} label="Total messages received" sub={unread} accent="text-[#6D28D9]" />
        <StatCard index={3} value={projects.filter(p => !p.hidden).length} label="Projects visible on site" accent="text-emerald-500" />
      </div>

      {/* AI Generate */}
      <motion.div {...fadeUp(4)} className="mt-6">
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
                <div className="mt-0.5 text-sm text-[#141414]/50">Draft a full case study narrative instantly</div>
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
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>{f}</span>
            ))}
          </div>
        </button>
      </motion.div>

      {/* Quick actions */}
      <motion.div {...fadeUp(5)} className="mt-8">
        <p className="mb-3 text-xs text-[#141414]/40 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Quick Actions</p>
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

      {/* Recent messages */}
      {contacts.length > 0 && (
        <motion.div {...fadeUp(6)} className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-[#141414]/40 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Recent Messages</p>
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
                    <span className={`text-sm font-medium ${c.read ? 'text-[#141414]/50' : 'text-[#141414]'}`}>{c.name}</span>
                    <span className="shrink-0 text-xs text-[#141414]/30"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {new Date(c.date || c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[#141414]/40">{c.message}</p>
                </div>
                {!c.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6D28D9]" />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
