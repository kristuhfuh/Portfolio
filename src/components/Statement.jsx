import { motion } from 'framer-motion'

const skills = [
  'Product Design',
  'UI / UX',
  'Framer Development',
  'Design Systems',
  'Usability Testing',
  'User Research',
  'Mobile Apps',
  'Brand Identity',
  'Prototyping',
]

export default function Statement() {
  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 italic text-2xl text-muted dark:text-dark-muted"
        >
          Hallo!
        </motion.p>

        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {/* Left: large statement */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.25] text-ink dark:text-dark-ink"
            >
              focus is on blending clear strategy, thoughtful design, and user empathy to craft{' '}
              <em className="italic text-accent">experiences that solve real problems</em>.
            </p>
          </motion.div>

          {/* Right: skill badges */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="rounded-full border border-line bg-cream px-4 py-2.5 text-sm text-ink transition-colors duration-200 hover:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
