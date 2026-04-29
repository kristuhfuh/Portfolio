import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { experience } from '../data/experience.js'

export default function Experience() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)

  // Sticky heading parallax
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const headingY = useTransform(sectionProgress, [0, 1], [24, -24])

  // Timeline line scroll draw — scoped to the job list
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  })
  const lineScaleY = useTransform(listProgress, [0, 1], [0, 1])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="border-t border-line py-24 dark:border-dark-line md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">

          {/* Left — sticky heading */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <motion.div style={{ y: headingY }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="label mb-5 text-muted dark:text-dark-muted"
                >
                  ✦ Experience
                </motion.div>

                <h2 className="display-lg text-[clamp(2.25rem,5vw,4rem)] text-ink dark:text-dark-ink">
                  {['Where', "I've", 'shown'].map((word, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden"
                      style={{ marginRight: '0.28em', verticalAlign: 'bottom' }}
                    >
                      <motion.span
                        className="inline-block"
                        initial={{ y: '106%' }}
                        whileInView={{ y: '0%' }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                  <br />
                  <span className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
                    <motion.em
                      className="inline-block italic text-accent"
                      initial={{ y: '106%' }}
                      whileInView={{ y: '0%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                      up.
                    </motion.em>
                  </span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 max-w-sm text-muted dark:text-dark-muted"
                >
                  Four years of professional design work across real estate, SaaS,
                  consumer apps, and government-facing platforms.
                </motion.p>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.32 }}
                  className="mt-10 flex gap-8"
                >
                  {[
                    { value: '4+', label: 'Years' },
                    { value: '15+', label: 'Projects' },
                    { value: '5', label: 'Companies' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="font-display text-3xl text-ink dark:text-dark-ink"
                        style={{ letterSpacing: '-0.04em' }}>
                        {stat.value}
                      </div>
                      <div className="label text-muted dark:text-dark-muted">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right — animated timeline */}
          <div className="md:col-span-8" ref={listRef}>
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute left-[11px] top-0 bottom-0 w-px overflow-hidden bg-line dark:bg-dark-line">
                <motion.div
                  className="absolute left-0 right-0 top-0 bg-accent"
                  style={{ scaleY: lineScaleY, transformOrigin: 'top center', bottom: 0 }}
                />
              </div>

              <ol>
                {experience.map((job, i) => (
                  <motion.li
                    key={job.company + job.start}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative border-b border-line py-8 pl-10 dark:border-dark-line"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-9 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-accent bg-cream dark:bg-dark-bg"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    </motion.div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Date */}
                      <div className="col-span-12 md:col-span-3">
                        <span className="label tabular-nums text-muted dark:text-dark-muted">
                          {job.start} — {job.end}
                        </span>
                      </div>

                      {/* Job details */}
                      <div className="col-span-12 md:col-span-9">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className="font-display text-2xl text-ink dark:text-dark-ink md:text-[1.75rem]">
                            {job.company}
                          </h3>
                          <span className="label shrink-0 text-muted dark:text-dark-muted">
                            {job.location}
                          </span>
                        </div>
                        <div className="mt-1 text-accent">{job.role}</div>
                        <p className="mt-3 max-w-xl text-muted dark:text-dark-muted">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
                <li className="border-b border-line dark:border-dark-line" />
              </ol>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
