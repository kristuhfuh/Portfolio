import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import { addContact, getPageContent } from '../lib/cms.js'

function richHtml(content = '') {
  if (/<[a-z][\s\S]*>/i.test(content)) return content
  return content.replace(/\n/g, '<br>')
}

const links = [
  { label: 'Email', key: 'email', prefix: 'mailto:' },
  { label: 'LinkedIn', key: 'linkedin', prefix: '' },
  { label: 'Twitter', key: 'twitter', prefix: '' },
  { label: 'Dribbble', key: 'dribbble', prefix: '' },
]

// Line-curtain reveal — line of text slides up from below its own clip
function LineReveal({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`} style={{ lineHeight: 1.1 }}>
      <motion.span
        className="block"
        initial={{ y: '106%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// Magnetic CTA button — follows cursor within hover zone
function MagneticButton({ children, href, className = '' }) {
  const btnRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 350, damping: 28 })
  const sy = useSpring(my, { stiffness: 350, damping: 28 })

  const onMove = (e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.32)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.32)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.a
      ref={btnRef}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.a>
  )
}

// Parse heading from CMS (plain \n or HTML) into an array of lines
function parseHeadingLines(heading) {
  const fallback = ["Let's build", "something worth", "the pixels."]
  if (!heading) return fallback
  const plain = heading
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim()
  const lines = plain.split('\n').map(l => l.trim()).filter(Boolean)
  return lines.length ? lines : fallback
}

export default function Contact() {
  const content = getPageContent('contact')
  const headingLines = parseHeadingLines(content.heading)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [sentName, setSentName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setSentName(form.name.split(' ')[0])
    await addContact(form)
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  const inputCls =
    'w-full rounded-xl border border-cream/12 bg-cream/6 px-4 py-3.5 text-sm text-cream outline-none placeholder:text-cream/28 transition-[border-color,box-shadow] duration-200 focus:border-accentSoft focus:shadow-[0_0_0_3px_rgba(167,139,250,0.14)] dark:border-ink/10 dark:bg-ink/5 dark:text-ink dark:placeholder:text-ink/28 dark:focus:border-accent'

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line bg-ink text-cream dark:border-dark-line dark:bg-cream dark:text-ink"
    >
      {/* Decorative spinning ring */}
      <div className="pointer-events-none absolute right-10 top-16 hidden opacity-[0.06] md:block">
        <div className="animate-spin-slow-30 h-[320px] w-[320px] rounded-full border-[1.5px] border-cream dark:border-ink" style={{ borderStyle: 'dashed' }} />
      </div>
      <div className="pointer-events-none absolute right-24 top-28 hidden opacity-[0.04] md:block">
        <div className="animate-spin-ccw-22 h-[180px] w-[180px] rounded-full border-[1.5px] border-cream dark:border-ink" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-6 md:px-10 md:py-8">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="label mb-4 text-cream/55 dark:text-ink/55"
        >
          ✦ Contact
        </motion.div>

        {/* Headline — line curtain reveal, driven by CMS */}
        <h2 className="display-hero text-[clamp(3rem,9.5vw,9rem)] leading-[0.9]">
          {headingLines.map((line, i) => (
            <LineReveal
              key={i}
              delay={i * 0.14}
              className={i === 1 && headingLines.length >= 3 ? 'text-accentSoft' : ''}
            >
              {line}
            </LineReveal>
          ))}
        </h2>

        {/* Decorative horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px bg-gradient-to-r from-cream/20 via-accentSoft/40 to-transparent"
          style={{ transformOrigin: 'left center' }}
        />

        <div className="mt-16 grid gap-16 md:grid-cols-12">

          {/* Left — form + availability */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <AvailabilityBadge className="!text-cream/65 dark:!text-ink/65" />
              <p
                className="mt-6 max-w-sm text-cream/75 dark:text-ink/75"
                dangerouslySetInnerHTML={{ __html: richHtml(content.description) }}
              />
            </motion.div>

            {/* Contact form / Success state */}
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10"
              >
                <div className="rounded-2xl border border-cream/15 p-8 dark:border-ink/15">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-cream dark:text-ink">
                    Got it, {sentName}.
                  </h3>
                  <p className="mt-3 text-cream/65 dark:text-ink/65 leading-relaxed">
                    Message received. I reply to every enquiry within 24 hours on weekdays — usually faster.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="#work"
                      className="label inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-cream transition-colors hover:border-cream/50 dark:border-ink/20 dark:text-ink dark:hover:border-ink/50"
                    >
                      View my work
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </a>
                    <button
                      onClick={() => setStatus('')}
                      className="label text-cream/35 transition-colors hover:text-cream/65 dark:text-ink/35 dark:hover:text-ink/65"
                    >
                      Send another message →
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.18 }}
                onSubmit={handleSubmit}
                className="mt-10 space-y-4"
              >
                <input
                  className={inputCls}
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className={inputCls}
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
                <textarea
                  className={inputCls + ' min-h-[130px] resize-y'}
                  placeholder="Your message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  data-track="contact-send-message"
                  className="label mt-2 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-cream transition-[background-color,transform,box-shadow] duration-200 active:scale-[0.97] disabled:opacity-70 hover:shadow-[0_8px_28px_rgba(109,40,217,0.35)]"
                >
                  {status === 'sending' && (
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                  )}
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                  {status !== 'sending' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </motion.form>
            )}
          </div>

          {/* Right — social links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="md:col-span-6 md:col-start-7"
          >
            <ul className="border-t border-cream/10 dark:border-ink/10">
              {links.map((l, idx) => {
                const value = content[l.key] || ''
                const href = l.prefix ? l.prefix + value : value
                return (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.28 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-cream/10 dark:border-ink/10"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between py-6 transition-[color,transform] duration-150 hover:text-accentSoft active:scale-[0.99]"
                    >
                      <span className="label">{l.label}</span>
                      <span className="flex items-center gap-4 font-display text-xl tracking-tighter2 md:text-2xl">
                        <span className="max-w-[200px] truncate md:max-w-none">{value}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="shrink-0 transition-transform duration-200 group-hover:-rotate-45"
                        >
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            {/* Magnetic CTA email button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-12 flex justify-start"
            >
              <MagneticButton
                href={`mailto:${content.email || ''}`}
                className="group inline-flex items-center gap-4 rounded-full border border-cream/20 px-8 py-5 text-cream transition-[background-color,border-color] duration-200 hover:border-accent hover:bg-accent dark:border-ink/20 dark:text-ink dark:hover:border-accent dark:hover:bg-accent dark:hover:text-cream"
              >
                <span className="label tracking-widest">Open to new work</span>
                <span className="animate-nudge-x inline-block">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
