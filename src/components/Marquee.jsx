import { motion } from 'framer-motion'

const items = [
  { text: 'Product Design', italic: false },
  { text: 'UI / UX', italic: true },
  { text: 'Framer Development', italic: false },
  { text: 'Design Systems', italic: true },
  { text: 'Prototyping', italic: false },
  { text: 'Brand Identity', italic: true },
  { text: 'Mobile Apps', italic: false },
  { text: 'Web Applications', italic: true },
  { text: 'Research', italic: false },
  { text: 'Motion & Interaction', italic: true },
  { text: 'Available for work', italic: false },
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <section className="marquee-pause border-y border-line bg-ink py-8 text-cream dark:border-dark-line dark:bg-cream dark:text-ink">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-12 whitespace-nowrap pr-12">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className={`display-lg text-[2.25rem] md:text-[3rem] ${item.italic ? 'italic' : ''}`}>
                {item.text}
              </span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="inline-block text-accent"
              >
                ✦
              </motion.span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
