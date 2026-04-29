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
  { text: 'User Research', italic: false },
  { text: 'Motion & Interaction', italic: true },
  { text: 'Available for work', italic: false },
]

const Star = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
    className="inline-block shrink-0 text-accent"
  >
    ✦
  </motion.span>
)

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <section className="marquee-pause border-y border-line bg-ink py-7 text-cream dark:border-dark-line dark:bg-cream dark:text-ink">
      {/* Forward marquee */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              <span
                className={`font-display text-[clamp(1.8rem,4vw,3rem)] leading-none ${
                  item.italic ? 'italic' : ''
                }`}
                style={{ letterSpacing: '-0.03em' }}
              >
                {item.text}
              </span>
              <Star />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
