import { motion } from 'framer-motion'
import { getPageContent } from '../lib/cms.js'

export default function Process() {
  const content = getPageContent('process')
  const steps = content.steps || []
  return (
    <section className="poet-process py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
          >
            {content.heading}
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={`${step.title}-${i}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="process-step relative"
            >
              {/* Number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                className="process-number"
              >
                {String(i + 1).padStart(2, '0')}
              </motion.div>

              <h3 className="display-lg text-[clamp(1.6rem,2.5vw,2.2rem)] text-ink dark:text-dark-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-muted dark:text-dark-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
