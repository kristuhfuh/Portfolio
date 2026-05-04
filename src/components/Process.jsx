import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Understanding your goals, users, and pain points through structured research, stakeholder interviews, and data analysis. The foundation everything is built on.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Crafting beautiful, functional solutions that balance aesthetics with usability — from rough wireframes to high-fidelity Figma files that are ready for engineering.',
  },
  {
    number: '03',
    title: 'Deliver',
    description:
      'Testing, refining, and shipping. Then monitoring how real users interact with the product to drive continuous improvement and ensure the design holds up in the wild.',
  },
]

export default function Process() {
  return (
    <section className="border-t border-line py-24 dark:border-dark-line md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-3 italic text-lg text-muted dark:text-dark-muted"
          >
            / Our Process /
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
          >
            Here's how it works
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Connector line — starts at THIS step's right edge, spans the gap to the next */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-full top-7 hidden h-px w-10 bg-gradient-to-r from-accent/40 to-accent/10 md:block"
                  style={{ transformOrigin: 'left center' }}
                />
              )}

              {/* Number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/25 bg-accent/8 dark:bg-accent/12"
              >
                <span className="label text-accent">{step.number}</span>
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
