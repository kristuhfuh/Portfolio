import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getContacts, markContactRead, deleteContact } from '../lib/cms.js'

export default function AdminContacts() {
  const [contacts, setContacts] = useState(getContacts())
  const [selected, setSelected] = useState(null)

  const handleRead = (id) => {
    setContacts(markContactRead(id))
    const c = contacts.find(x => x.id === id)
    setSelected(c ? { ...c, read: true } : null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this message?')) return
    setContacts(deleteContact(id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = contacts.filter(c => !c.read).length

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl text-ink dark:text-dark-ink">Contact Messages</h1>
        <p className="mt-2 text-muted dark:text-dark-muted">
          {contacts.length} messages · {unread} unread
        </p>
      </motion.div>

      {contacts.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-line dark:bg-dark-line">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-muted dark:text-dark-muted">No messages yet.</p>
          <p className="mt-1 text-sm text-muted dark:text-dark-muted">When visitors submit your contact form, messages will appear here.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* List */}
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <motion.button key={c.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => { setSelected(c); handleRead(c.id) }}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selected?.id === c.id
                    ? 'border-accent bg-accent/5'
                    : 'border-line bg-white/60 hover:border-accent/30 dark:border-dark-line dark:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c.read ? 'bg-transparent' : 'bg-accent'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <span className={`truncate text-sm ${c.read ? 'text-muted dark:text-dark-muted' : 'font-medium text-ink dark:text-dark-ink'}`}>{c.name}</span>
                      <span className="shrink-0 text-[10px] text-muted dark:text-dark-muted">{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                    <div className="truncate text-xs text-muted dark:text-dark-muted">{c.email}</div>
                    <p className="mt-1 line-clamp-1 text-xs text-ink/60 dark:text-dark-ink/60">{c.message}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-line bg-white/60 p-6 backdrop-blur dark:border-dark-line dark:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-2xl text-ink dark:text-dark-ink">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-accent hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => handleDelete(selected.id)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:border-dark-line dark:hover:bg-red-900/20">
                    Delete
                  </button>
                </div>
                <div className="mt-1 text-xs text-muted dark:text-dark-muted">
                  {new Date(selected.date).toLocaleString()}
                </div>
                <div className="mt-6 whitespace-pre-wrap text-ink/85 dark:text-dark-ink/85">
                  {selected.message}
                </div>
                <div className="mt-6 border-t border-line pt-4 dark:border-dark-line">
                  <a href={`mailto:${selected.email}`}
                    className="label inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-cream transition-transform hover:scale-[1.02]">
                    Reply via Email
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-line py-20 dark:border-dark-line">
                <p className="text-sm text-muted dark:text-dark-muted">Select a message to read</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
