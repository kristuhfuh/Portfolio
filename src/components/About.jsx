import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { tools, recognition } from '../data/experience.js'
import { getPageContent } from '../lib/cms.js'
import BeyondPixels from './BeyondPixels.jsx'

// Word-by-word reveal for body text
function WordReveal({ text, className = '', delay = 0 }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.28em', marginBottom: '0.05em', verticalAlign: 'bottom' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '106%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{
              delay: delay + Math.min(i * 0.025, 0.7),
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Photo parallax — stronger offset for drama
  const photoY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.08, 1])

  const content = getPageContent('about')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-line py-24 dark:border-dark-line md:py-36"
    >
      {/* Atmospheric orb */}
      <div className="pointer-events-none absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      <div className="pointer-events-none absolute left-0 bottom-20 h-[250px] w-[250px] rounded-full bg-violet-400/4 blur-[80px]" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">

          {/* Left — photo + intro */}
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

            {/* Parallax photo with clip reveal */}
            <motion.div
              style={{ y: photoY }}
              className="relative mb-10 overflow-hidden rounded-3xl border border-line dark:border-dark-line"
            >
              <motion.img
                style={{ scale: photoScale }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                src={content.photo}
                alt="Christopher Akpoguma"
                className="h-auto max-h-[500px] w-full object-cover object-top"
              />

              {/* Subtle grain on photo */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                }}
              />
            </motion.div>

            {/* Heading — word-by-word */}
            <h2 className="display-lg text-[clamp(2.25rem,5vw,3.6rem)] text-ink dark:text-dark-ink">
              <WordReveal text="The Design Poet" delay={0} />
              <br />
              <span className="italic text-accent">
                <WordReveal text="— with a straight job." delay={0.2} />
              </span>
            </h2>

            {/* Bio — paragraph-level stagger */}
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/82 dark:text-dark-ink/82">
              {content.bio.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{
                    duration: 0.65,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right — skills + recognition + beyond */}
          <div className="md:col-span-6 md:col-start-7">

            {/* The Kit */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-line bg-white/50 p-8 backdrop-blur dark:border-dark-line dark:bg-white/[0.025] md:p-10"
            >
              <div className="label mb-6 text-muted dark:text-dark-muted">The Kit</div>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink transition-colors hover:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>

              <div className="label mb-5 mt-10 text-muted dark:text-dark-muted">Track record</div>
              <ul className="space-y-5">
                {recognition.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex gap-3 text-ink dark:text-dark-ink"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
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
