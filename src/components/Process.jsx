import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Listen first.',
    description:
      "Before a single wireframe, I need to understand what problem we're actually solving. I interview, push back on assumptions, and sit with the data until the real question emerges — because building the wrong thing beautifully is still failure.",
  },
  {
    number: '02',
    title: 'Make it real, fast.',
    description:
      "I move from rough concepts to interactive Framer prototypes faster than most designers get to wireframes. You'll see something you can click and test — not a slide deck full of boxes — so we catch wrong turns early.",
  },
  {
    number: '03',
    title: 'Ship, then watch.',
    description:
      "Handoff is not the finish line. I stay close through engineering, care about what actually ships, and track how real people use it. The most useful design insight usually comes the week after launch.",
  },
]

export default function Process() {
  return (
    <section className="poet-process py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="label mb-3 text-muted dark:text-dark-muted"
          >
            ✦ Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display-lg text-[clamp(2.5rem,6vw,5rem)] text-ink dark:text-dark-ink"
          >
            Feeling, meet thinking.
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
                {step.number}
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
