import { useState } from 'react'
import { motion } from 'framer-motion'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import { addContact, getPageContent } from '../lib/cms.js'

const links = [
  { label: 'Email', key: 'email', prefix: 'mailto:' },
  { label: 'LinkedIn', key: 'linkedin', prefix: '' },
  { label: 'Twitter', key: 'twitter', prefix: '' },
  { label: 'Dribbble', key: 'dribbble', prefix: '' },
]

export default function Contact() {
  const content = getPageContent('contact')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // '' | 'sending' | 'sent' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setTimeout(() => {
      addContact(form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(''), 4000)
    }, 600)
  }

  const inputCls = 'w-full rounded-lg border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/30 transition-colors focus:border-accentSoft dark:border-ink/10 dark:bg-ink/5 dark:text-ink dark:placeholder:text-ink/30 dark:focus:border-accent'

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-ink text-cream dark:border-dark-line dark:bg-cream dark:text-ink">
      <div className="pointer-events-none absolute -left-20 top-10 h-[300px] w-[300px] rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-[300px] w-[300px] rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40">
        <div className="label mb-6 text-cream/60 dark:text-ink/60">✦ Contact</div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="display-hero text-[clamp(3rem,10vw,9rem)]"
        >
          {`Let's build`}
          <br />
          <span className="italic text-accentSoft">something worth</span>
          <br />
          the pixels.
        </motion.h2>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          {/* Left — info + form */}
          <div className="md:col-span-5">
            <AvailabilityBadge className="!text-cream/70 dark:!text-ink/70" />
            <p className="mt-6 max-w-sm text-cream/80 dark:text-ink/80">
              {content.description}
            </p>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <input className={inputCls} placeholder="Your name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className={inputCls} type="email" placeholder="Your email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
              <textarea className={inputCls + ' min-h-[120px] resize-y'} placeholder="Your message" value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })} required />

              <button type="submit" disabled={status === 'sending'}
                className={`label inline-flex items-center gap-3 rounded-full px-6 py-4 text-cream transition-all ${
                  status === 'sent' ? 'bg-emerald-500' : 'bg-accent hover:scale-[1.02]'
                }`}>
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : 'Send Message'}
                {status !== 'sent' && status !== 'sending' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                )}
              </button>
            </form>
          </div>

          {/* Right — links */}
          <div className="md:col-span-6 md:col-start-7">
            <ul className="border-t border-cream/10 dark:border-ink/10">
              {links.map((l) => {
                const value = content[l.key] || ''
                const href = l.prefix ? l.prefix + value : value
                return (
                  <li key={l.label} className="border-b border-cream/10 dark:border-ink/10">
                    <a href={href} target="_blank" rel="noreferrer"
                      className="group flex items-center justify-between py-5 transition-colors hover:text-accentSoft">
                      <span className="label">{l.label}</span>
                      <span className="flex items-center gap-4 font-display text-xl tracking-tighter2 md:text-2xl">
                        <span className="max-w-[200px] truncate md:max-w-none">{value}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 transition-transform group-hover:-rotate-45"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
