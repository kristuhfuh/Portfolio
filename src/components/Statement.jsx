import { motion } from 'framer-motion'

const stats = [
  { value: '15+', label: 'Projects shipped' },
  { value: '4',   label: 'Years of craft' },
  { value: '5',   label: 'Industries touched' },
]

export default function Statement() {
  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">

        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="label mb-12 text-muted dark:text-dark-muted">
          ✦ Approach
        </motion.p>

        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {/* Left: statement */}
          <motion.div
            initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.25] text-ink dark:text-dark-ink">
              My focus is on blending clear strategy, thoughtful design, and user empathy to craft{' '}
              <em className="italic text-accent">experiences that solve real problems</em>.
            </p>
          </motion.div>

          {/* Right: impact stats */}
          <motion.div
            initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-baseline gap-4 border-b border-line pb-8 last:border-0 last:pb-0 dark:border-dark-line">
                <span className="display-lg text-[clamp(2.8rem,5vw,4rem)] leading-none text-ink dark:text-dark-ink">
                  {s.value}
                </span>
                <span className="label text-muted dark:text-dark-muted">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
