import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { tools, recognition } from '../data/experience.js'
import { getPageContent } from '../lib/cms.js'
import BeyondPixels from './BeyondPixels.jsx'

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const content = getPageContent('about')

  return (
    <section id="about" ref={sectionRef} className="relative border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="pointer-events-none absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-accent/5 blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="label mb-6 text-muted dark:text-dark-muted">✦ About</div>

            {/* Parallax photo */}
            <motion.div style={{ y: photoY }}
              className="mb-10 overflow-hidden rounded-3xl border border-line dark:border-dark-line"
            >
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                src={content.photo}
                alt="Christopher Akpoguma"
                className="h-auto max-h-[480px] w-full object-cover object-top"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="display-lg text-[clamp(2.25rem,5vw,3.5rem)] text-ink dark:text-dark-ink"
            >
              The <em className="italic text-accent">Design Poet</em> — with a straight job.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85 dark:text-dark-ink/85"
            >
              {content.bio.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </motion.div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-line bg-white/40 p-8 backdrop-blur dark:border-dark-line dark:bg-white/[0.02] md:p-10"
            >
              <div className="label mb-6 text-muted dark:text-dark-muted">The Kit</div>
              <div className="flex flex-wrap gap-3">
                {tools.map((t) => (
                  <motion.span key={t} whileHover={{ scale: 1.05 }}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-ink transition-colors hover:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                  >{t}</motion.span>
                ))}
              </div>

              <div className="label mb-6 mt-10 text-muted dark:text-dark-muted">Track record</div>
              <ul className="space-y-4">
                {recognition.map((r, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-3 text-ink dark:text-dark-ink"
                  >
                    <span className="mt-2 inline-block h-1 w-6 shrink-0 bg-accent" />
                    <span>{r}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Beyond the Pixels — 4-box hover video grid */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8"
            >
              <BeyondPixels />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
