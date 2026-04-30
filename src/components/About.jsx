import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { tools, recognition } from '../data/experience.js'
import { getPageContent } from '../lib/cms.js'
import BeyondPixels from './BeyondPixels.jsx'

// Renders CMS content that may be HTML (RichTextField) or plain text (\n\n paragraphs)
function richHtml(content = '') {
  if (/<[a-z][\s\S]*>/i.test(content)) return content
  return content
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.05, 1])

  const content = getPageContent('about')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="border-t border-line py-24 dark:border-dark-line md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-5 italic text-lg text-muted dark:text-dark-muted"
        >
          / Who Am I /
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
        >
          Pushing Boundaries{' '}
          <span className="text-accent">since 2022.</span>
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-12">
          {/* Left: photo */}
          <div className="md:col-span-5">
            <motion.div
              style={{ y: photoY }}
              className="overflow-hidden rounded-3xl border border-line dark:border-dark-line"
            >
              <motion.img
                style={{ scale: photoScale }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                src={content.photo}
                alt="Christopher Akpoguma"
                className="h-auto max-h-[580px] w-full object-cover object-top"
              />
            </motion.div>
          </div>

          {/* Right: bio + tools + recognition */}
          <div className="md:col-span-7">
            {/* Bio — dangerouslySetInnerHTML so RichTextField HTML renders correctly */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg leading-relaxed text-ink/82 dark:text-dark-ink/82 [&>p]:mb-5 [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: richHtml(content.bio) }}
            />

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <div className="label mb-4 text-muted dark:text-dark-muted">The Kit</div>
              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink hover:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Track record */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <div className="label mb-4 text-muted dark:text-dark-muted">Track record</div>
              <ul className="space-y-3">
                {recognition.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="flex gap-3 text-ink dark:text-dark-ink"
                  >
                    <span className="mt-2.5 inline-block h-1 w-5 shrink-0 bg-accent" />
                    <span>{r}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Beyond the Pixels */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-10"
            >
              <BeyondPixels />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
