import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { experience } from '../data/experience.js'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const headingY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section id="experience" ref={ref} className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <motion.div style={{ y: headingY }}>
              <div className="label mb-4 text-muted dark:text-dark-muted">✦ Experience</div>
              <h2 className="display-lg text-[clamp(2.25rem,5vw,4rem)] text-ink dark:text-dark-ink">
                Where I've <em className="italic text-accent">shown up.</em>
              </h2>
              <p className="mt-6 max-w-sm text-muted dark:text-dark-muted">
                Four years of professional design work across real estate, SaaS,
                consumer apps, and government-facing platforms.
              </p>
              </motion.div>
            </div>
          </div>

          <div className="md:col-span-8">
            <ol className="space-y-0">
              {experience.map((job, i) => (
                <motion.li
                  key={job.company + job.start}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid grid-cols-12 gap-4 border-t border-line py-8 dark:border-dark-line"
                >
                  <div className="col-span-12 md:col-span-3">
                    <span className="label text-muted dark:text-dark-muted tabular-nums">
                      {job.start} — {job.end}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl text-ink dark:text-dark-ink md:text-3xl">
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
                </motion.li>
              ))}
              <li className="border-t border-line dark:border-dark-line" />
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
