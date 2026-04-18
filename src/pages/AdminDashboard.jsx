import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjects, getContacts } from '../lib/cms.js'

const fade = (i) => ({ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } } })

export default function AdminDashboard() {
  const projects = getProjects()
  const contacts = getContacts()
  const unread = contacts.filter(c => !c.read).length

  const stats = [
    { label: 'Case Studies', value: projects.length, color: 'bg-accent' },
    { label: 'Contact Messages', value: contacts.length, color: 'bg-emerald-500' },
    { label: 'Unread Messages', value: unread, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <motion.div initial="hidden" animate="show" variants={fade(0)}>
        <h1 className="font-display text-4xl text-ink dark:text-dark-ink">Dashboard</h1>
        <p className="mt-2 text-muted dark:text-dark-muted">Welcome back, Christopher.</p>
      </motion.div>

      {/* Stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="show" variants={fade(i + 1)}
            className="rounded-2xl border border-line bg-white/60 p-6 backdrop-blur dark:border-dark-line dark:bg-white/[0.03]">
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color} text-cream`}>
              <span className="text-lg font-bold">{s.value}</span>
            </div>
            <div className="text-sm text-muted dark:text-dark-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial="hidden" animate="show" variants={fade(4)} className="mt-8">
        <h2 className="mb-4 font-display text-xl text-ink dark:text-dark-ink">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects/new"
            className="label inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-cream transition-transform hover:scale-[1.02]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            New Case Study
          </Link>
          <Link to="/admin/pages"
            className="label inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-ink transition-colors hover:bg-line/50 dark:border-dark-line dark:text-dark-ink">
            Edit Page Content
          </Link>
          <Link to="/admin/contacts"
            className="label inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-ink transition-colors hover:bg-line/50 dark:border-dark-line dark:text-dark-ink">
            View Messages {unread > 0 && `(${unread} new)`}
          </Link>
        </div>
      </motion.div>

      {/* Recent contacts */}
      <motion.div initial="hidden" animate="show" variants={fade(5)} className="mt-8">
        <h2 className="mb-4 font-display text-xl text-ink dark:text-dark-ink">Recent Messages</h2>
        {contacts.length === 0 ? (
          <p className="text-sm text-muted dark:text-dark-muted">No messages yet. When visitors use your contact form, they will appear here.</p>
        ) : (
          <div className="space-y-3">
            {contacts.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-start gap-4 rounded-xl border border-line bg-white/40 p-4 dark:border-dark-line dark:bg-white/[0.02]">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.read ? 'bg-line dark:bg-dark-line' : 'bg-accent'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-ink dark:text-dark-ink">{c.name}</span>
                    <span className="shrink-0 text-xs text-muted dark:text-dark-muted">{new Date(c.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-muted dark:text-dark-muted">{c.email}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/70 dark:text-dark-ink/70">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
