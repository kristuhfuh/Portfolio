import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import { addContact, getPageContent } from '../lib/cms.js'
import { sanitizeRichText, safeLink } from '../lib/richText.js'
import { normalizeContact } from '../lib/contact.js'

function richHtml(content = '') {
  if (/<[a-z][\s\S]*>/i.test(content)) return sanitizeRichText(content)
  return content.replace(/\n/g, '<br>')
}

const links = [
  { label: 'Email', key: 'email', prefix: 'mailto:' },
  { label: 'LinkedIn', key: 'linkedin', prefix: '' },
  { label: 'Twitter', key: 'twitter', prefix: '' },
  { label: 'Dribbble', key: 'dribbble', prefix: '' },
]

// Line-curtain reveal - line of text slides up from below its own clip
function LineReveal({ children, delay = 0, className = '' }) {
  const reduced = useReducedMotion()
  return (
    <motion.span className={`block overflow-hidden ${className}`} style={{ lineHeight: 1.1 }} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-5%' }}>
      <motion.span
        className="block"
        variants={{ hidden: { y: '106%' }, visible: { y: '0%' } }}
        transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

// Magnetic CTA button - follows cursor within hover zone
function MagneticButton({ children, href, className = '' }) {
  const reduced = useReducedMotion()
  const btnRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 350, damping: 28 })
  const sy = useSpring(my, { stiffness: 350, damping: 28 })

  const onMove = (e) => {
    if (!btnRef.current || reduced) return
    const rect = btnRef.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.32)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.32)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.a
      ref={btnRef}
      href={href}
      style={reduced ? undefined : { x: sx, y: sy }}
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
  const sending = useRef(false)

  const updateField = event => {
    event.currentTarget.setCustomValidity('')
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }
  const cleanField = event => {
    const field = event.target.name
    setForm(current => ({ ...current, [field]: normalizeContact(current)[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending.current) return
    const cleaned = normalizeContact(form)
    setForm(cleaned)
    e.currentTarget.elements.namedItem('name').setCustomValidity(cleaned.name ? '' : 'Please enter your name.')
    e.currentTarget.elements.namedItem('message').setCustomValidity(cleaned.message ? '' : 'Please write a message.')
    if (!e.currentTarget.reportValidity()) return
    sending.current = true
    setStatus('sending')
    setSentName(cleaned.name.split(' ')[0])
    try {
      await addContact(cleaned)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    } finally { sending.current = false }
  }

  const inputCls =
    'contact-input w-full text-sm outline-none transition-[border-color,box-shadow] duration-200'

  return (
    <section
      id="contact"
      className="poet-contact relative overflow-hidden"
    >
      {/* Decorative spinning ring */}
      <div className="pointer-events-none absolute right-10 top-16 hidden opacity-[0.06] md:block">
        <div className="animate-spin-slow-30 h-[320px] w-[320px] rounded-full border-[1.5px] border-cream dark:border-ink" style={{ borderStyle: 'dashed' }} />
      </div>
      <div className="pointer-events-none absolute right-24 top-28 hidden opacity-[0.04] md:block">
        <div className="animate-spin-ccw-22 h-[180px] w-[180px] rounded-full border-[1.5px] border-cream dark:border-ink" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-6 md:px-10 md:py-8">

        {/* Headline - line curtain reveal, driven by CMS */}
        <h2 className="display-hero text-[clamp(3rem,9.5vw,9rem)] leading-[0.9]">
          {headingLines.map((line, i) => (
            <LineReveal
              key={i}
              delay={i * 0.05}
              className={i === 1 && headingLines.length >= 3 ? 'text-accentSoft' : ''}
            >
              {line}
            </LineReveal>
          ))}
        </h2>

        {/* Decorative horizontal rule */}
        <motion.div
          initial={false}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.28, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px bg-gradient-to-r from-cream/20 via-accentSoft/40 to-transparent"
          style={{ transformOrigin: 'left center' }}
        />

        <div className="mt-16 grid gap-16 md:grid-cols-12">

          {/* Left - form + availability */}
          <div className="md:col-span-5">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: 0.1 }}
            >
              <AvailabilityBadge className="!text-cream/65 dark:!text-ink/65" label={content.availabilityLabel} />
              <p
                className="mt-6 max-w-sm text-cream/75 dark:text-ink/75"
                dangerouslySetInnerHTML={{ __html: richHtml(content.description) }}
              />
            </motion.div>

            {/* Contact form / Success state */}
            {status === 'sent' ? (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10"
                role="status"
              >
                <div className="rounded-2xl border border-cream/15 p-8 dark:border-ink/15">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-cream dark:text-ink">
                    {content.successHeading}, {sentName}.
                  </h3>
                  <p className="mt-3 text-cream/65 dark:text-ink/65 leading-relaxed">
                    {content.successDescription}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="#work"
                      className="label inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-cream transition-colors hover:border-cream/50 dark:border-ink/20 dark:text-ink dark:hover:border-ink/50"
                    >
                      {content.workLinkLabel}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </a>
                    <button
                      onClick={() => setStatus('')}
                      className="label text-cream/35 transition-colors hover:text-cream/65 dark:text-ink/35 dark:hover:text-ink/65"
                    >
                      {content.anotherMessageLabel} →
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: 0 }}
                onSubmit={handleSubmit}
                aria-busy={status === 'sending'}
                className="mt-10 space-y-4"
              >
                <p className="sr-only" role="status">{status === 'sending' ? content.sendingLabel : ''}</p>
                {status === 'error' && <p className="contact-form-error" role="alert">{content.errorText} <a className="underline" href={`mailto:${content.email}`}>{content.emailFallbackLabel}</a>.</p>}
                <input
                  className={inputCls}
                  placeholder={content.namePlaceholder}
                  aria-label={content.namePlaceholder}
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField}
                  onBlur={cleanField}
                  required
                />
                <input
                  className={inputCls}
                  type="email"
                  placeholder={content.emailPlaceholder}
                  aria-label={content.emailPlaceholder}
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  onBlur={cleanField}
                  required
                />
                <textarea
                  className={inputCls + ' min-h-[130px] resize-y'}
                  placeholder={content.messagePlaceholder}
                  aria-label={content.messagePlaceholder}
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  onBlur={cleanField}
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
                  {status === 'sending' ? content.sendingLabel : content.submitLabel}
                  {status !== 'sending' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </motion.form>
            )}
          </div>

          {/* Right - social links */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, delay: 0 }}
            className="md:col-span-6 md:col-start-7"
          >
            <ul className="contact-links border-t border-cream/10 dark:border-ink/10">
              {links.filter(link => { const value = content[link.key]; if (!value) return false; if (link.key === 'email') return true; try { return !!safeLink(value) && new URL(value).pathname !== '/' } catch { return false } }).map((l, idx) => {
                const value = content[l.key] || ''
                const href = l.prefix ? l.prefix + value : value
                return (
                  <motion.li
                    key={l.label}
                    initial={false}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.28, delay: 0 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
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
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: 0 }}
              className="mt-12 flex justify-start"
            >
              <MagneticButton
                href={`mailto:${content.email || ''}`}
                className="group inline-flex items-center gap-4 rounded-full border border-cream/20 px-8 py-5 text-cream transition-[background-color,border-color] duration-200 hover:border-accent hover:bg-accent dark:border-ink/20 dark:text-ink dark:hover:border-accent dark:hover:bg-accent dark:hover:text-cream"
              >
                <span className="label tracking-widest">{content.emailCta}</span>
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
