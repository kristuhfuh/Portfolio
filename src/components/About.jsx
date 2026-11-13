import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { getPageContent } from '../lib/cms.js'
import { sanitizeRichText } from '../lib/richText.js'

// Renders CMS content that may be HTML (RichTextField) or plain text (\n\n paragraphs)
function richHtml(content = '') {
  if (/<[a-z][\s\S]*>/i.test(content)) return sanitizeRichText(content)
  return content
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export default function About() {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.05, 1])

  const content = getPageContent('about')
  const extras = getPageContent('aboutExtras')
  const photo = content.photo?.includes('JHDEnCL7px098imQz7F1WCGe8') ? (getPageContent('hero').topImage || '/images/hero-top.jpg') : content.photo

  return (
    <section
      id="about"
      ref={sectionRef}
      className="poet-about py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
        >
          {content.heading
            ? <span dangerouslySetInnerHTML={{ __html: richHtml(content.heading) }} />
            : <>Designing from Lagos, <span className="text-accent">for the world.</span></>
          }
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-12">
          {/* Left: photo */}
          <div className="md:col-span-5">
            <motion.div
              style={reduced ? undefined : { y: photoY }}
              className="poet-about-photo overflow-hidden"
            >
              <motion.img
                style={reduced ? undefined : { scale: photoScale }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                src={photo}
                alt={content.photoAlt}
                loading="lazy"
                className="h-auto max-h-[580px] w-full object-cover object-top"
              />
            </motion.div>
          </div>

          {/* Right: bio + tools + recognition */}
          <div className="md:col-span-7">
            {/* Bio - dangerouslySetInnerHTML so RichTextField HTML renders correctly */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg leading-relaxed text-ink/82 dark:text-dark-ink/82 [&>p]:mb-5 [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: richHtml(content.bio) }}
            />
            {extras.making && <p className="mt-6 text-lg leading-relaxed">{extras.making}</p>}

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <p className="text-sm text-ink/60 dark:text-dark-ink/60">
                <span className="label mr-2 text-muted dark:text-dark-muted">{extras.kitLabel}</span>
                {(extras.tools || []).join(' · ')}
              </p>
            </motion.div>

            {/* Track record */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <div className="label mb-4 text-muted dark:text-dark-muted">{extras.recordLabel}</div>
              <ul className="space-y-3">
                {(extras.recognition || []).map((r, i) => (
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

          </div>
        </div>
      </div>
    </section>
  )
}
