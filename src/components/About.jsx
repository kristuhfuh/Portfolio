import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { tools, recognition } from '../data/experience.js'
import { getPageContent } from '../lib/cms.js'
import BeyondPixels from './BeyondPixels.jsx'

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.06, 1])

  const content = getPageContent('about')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-line py-24 dark:border-dark-line md:py-36"
    >
      {/* Atmospheric orb */}
      <div className="pointer-events-none absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-accent/5 blur-[90px]" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">

          {/* Left */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="label mb-8 text-muted dark:text-dark-muted"
            >
              ✦ About
            </motion.div>

            {/* Photo with parallax */}
            <motion.div
              style={{ y: photoY }}
              className="relative mb-10 overflow-hidden rounded-3xl border border-line dark:border-dark-line"
            >
              <motion.img
                style={{ scale: photoScale }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                src={content.photo}
                alt="Christopher Akpoguma"
                className="h-auto max-h-[500px] w-full object-cover object-top"
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="display-lg text-[clamp(2.25rem,5vw,3.6rem)] text-ink dark:text-dark-ink"
            >
              The Design Poet —{' '}
              <em className="italic text-accent">with a straight job.</em>
            </motion.h2>

            {/* Bio */}
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/82 dark:text-dark-ink/82">
              {content.bio.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-6 md:col-start-7">
            {/* The Kit */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-line bg-white/50 p-8 backdrop-blur dark:border-dark-line dark:bg-white/[0.025] md:p-10"
            >
              <div className="label mb-6 text-muted dark:text-dark-muted">The Kit</div>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.38, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink transition-colors hover:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>

              <div className="label mb-5 mt-10 text-muted dark:text-dark-muted">Track record</div>
              <ul className="space-y-4">
                {recognition.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-3 text-ink dark:text-dark-ink"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.09 + 0.18, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-2 inline-block h-1 w-6 shrink-0 bg-accent"
                      style={{ transformOrigin: 'left center' }}
                    />
                    <span>{r}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Beyond the Pixels */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
