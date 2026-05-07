import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadContacts, markContactRead, deleteContact } from '../lib/cms.js'

function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D28D9]/10 text-sm font-semibold text-[#6D28D9]">
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    loadContacts().then(data => { setContacts(data); setLoading(false) })
  }, [])

  const unread = contacts.filter(c => !c.read).length

  const handleSelect = (c) => {
    setSelected(c)
    if (!c.read) {
      const updated = markContactRead(c.id)
      setContacts(Array.isArray(updated) ? updated : contacts.map(x => x.id === c.id ? { ...x, read: true } : x))
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this message?')) return
    deleteContact(id)
    setContacts(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#141414]/10 border-t-[#6D28D9]" />
    </div>
  )

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <p className="text-[#141414]/40 text-sm">{contacts.length} total</p>
          {unread > 0 && (
            <span className="rounded-full bg-[#6D28D9]/10 px-2.5 py-0.5 text-xs text-[#6D28D9]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{unread} unread</span>
          )}
        </div>
      </motion.div>

      {contacts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black/5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" className="text-[#141414]/30">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <p className="font-medium text-[#141414]">No messages yet</p>
          <p className="mt-1 text-sm text-[#141414]/40">When visitors submit your contact form, they'll appear here.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">

          {/* ── Message list ── */}
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <motion.button key={c.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => handleSelect(c)}
                className={`w-full rounded-2xl border p-4 text-left transition-all duration-150 ${
                  selected?.id === c.id
                    ? 'border-[#6D28D9]/30 bg-[#6D28D9]/5 shadow-sm'
                    : 'border-black/6 bg-white hover:border-black/10 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm ${!c.read ? 'font-semibold text-[#141414]' : 'font-medium text-[#141414]/60'}`}>
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-[#141414]/30"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(c.date || c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-[#141414]/40">{c.email}</div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-[#141414]/60">{c.message}</p>
                  </div>
                  {!c.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6D28D9]" />}
                </div>
              </motion.button>
            ))}
          </div>

          {/* ── Detail pane ── */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-black/6 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={selected.name} />
                    <div>
                      <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
                        className="text-xl text-[#141414]">{selected.name}</h2>
                      <a href={`mailto:${selected.email}`}
                        className="text-sm text-[#6D28D9] hover:underline">{selected.email}</a>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(selected.id)}
                    className="shrink-0 rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-50">
                    Delete
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#141414]/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(selected.date || selected.created_at).toLocaleString()}
                </p>

                <div className="mt-6 rounded-xl bg-[#f5f3ee] p-4 text-sm leading-relaxed text-[#141414]/80 whitespace-pre-wrap">
                  {selected.message}
                </div>

                <div className="mt-6">
                  <a href={`mailto:${selected.email}?subject=Re: your message`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#141414] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15">
                    Reply via email
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white">
                <p className="text-sm text-[#141414]/30">Select a message to read</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
