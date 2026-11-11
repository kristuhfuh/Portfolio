import { useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { getPageContent } from '../lib/cms.js'
import { Arrow, Burst } from './DesignMarks.jsx'

const ease = [0.22, 1, 0.36, 1]

function HeroCollage({ hero }) {
  const [casual, setCasual] = useState(false)
  const reduced = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 100, damping: 22 })
  const y = useSpring(my, { stiffness: 100, damping: 22 })
  const rotate = useTransform(x, [-24, 24], [-3, 3])

  function move(event) {
    if (reduced || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 44)
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 30)
  }

  return (
    <div className="hero-collage" onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0) }}>
      <motion.div className="collage-art" style={reduced ? undefined : { x, y, rotate }} aria-hidden="true">
        <img src={hero.artImage} alt="" fetchPriority="high" />
        <span className="collage-art-caption">{hero.artCaption}</span>
      </motion.div>
      <motion.figure className="collage-portrait" style={reduced ? undefined : { x, y }}>
        <div className="collage-portrait-image"><img src={casual ? hero.bottomImage || '/images/hero-bottom.jpg' : hero.topImage || '/images/hero-top.jpg'} alt={casual ? `Another side of ${hero.headline}` : hero.headline} style={{ objectPosition: `${(casual ? hero.bottomImageFocus : hero.topImageFocus)?.x ?? 50}% ${(casual ? hero.bottomImageFocus : hero.topImageFocus)?.y ?? 40}%` }} fetchPriority="high" /></div>
        <figcaption><button type="button" onClick={() => setCasual(!casual)} aria-pressed={casual} aria-label={hero.portraitButtonLabel}><span>{casual ? hero.portraitAlternate : hero.portraitDefault}</span><span aria-hidden="true">↻</span></button></figcaption>
      </motion.figure>
      <motion.div className="collage-note" style={reduced ? undefined : { rotate }} aria-hidden="true">
        <span>{hero.noteIntro}</span><strong>{hero.noteLineOne}<br />{hero.noteLineTwo}<br /><em>{hero.noteLineThree}</em></strong>
        <svg viewBox="0 0 100 38" fill="none"><path d="M5 25C30-5 75 0 84 13c11 18-52 26-51 10C35 2 91 6 96 10" stroke="currentColor" strokeWidth="2" /></svg>
      </motion.div>
      <div className="collage-sticker" aria-hidden="true"><Burst /><span style={{ whiteSpace: 'pre-line' }}>{hero.sticker}</span></div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const hero = getPageContent('hero')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [0, -65])
  const headline = String(hero.headline || 'Christopher Akpoguma').replace(/\s+/g, ' ').trim()
  const expression = String(hero.expression || '').replace(/<[^>]*>/g, '').trim() || 'Design you\ncan feel.'
  const headingLines = expression.split('\n').map(line => line.trim()).filter(Boolean)
  const intro = String(hero.subtitle || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')
  const cvMatch = hero.cvUrl?.match(/\/file\/d\/([^/?#]+)/)
  const cvUrl = cvMatch ? `https://drive.google.com/uc?export=download&id=${cvMatch[1]}` : hero.cvUrl

  return (
    <section ref={ref} className="poet-hero" aria-labelledby="hero-heading">
      <div className="hero-topline">
        <span><span className="availability-dot" />{hero.openTo || 'Open for a good collaboration'}</span>
        <span>{hero.location} <span className="hero-timezone">↗ {hero.timezoneLabel}</span></span>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="hero-intro">
            {headline.replace(/\.$/, '')}.<br /><span>{hero.roleLabel}</span>
          </motion.p>
          <h1 id="hero-heading" className="hero-title" aria-label={headingLines.join(' ')}>{headingLines.map((line, index) => { const words = line.split(' '); const last = index === headingLines.length - 1; return <span className="hero-line" key={index}><motion.span initial={{ y: reduced ? 0 : '110%' }} animate={{ y: 0 }} transition={{ duration: 0.95, delay: 0.1 + index * 0.12, ease }}>{last ? <>{words.slice(0, -1).join(' ')}<em>{words[words.length - 1]}</em><Burst className="hero-title-burst" /></> : line}</motion.span></span> })}</h1>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease }} className="hero-bottom-copy">
            <p>{intro}</p>
            <div className="hero-actions">
              <a href="#work" className="poet-button poet-button-lime" data-track="hero-view-work">{hero.workCta} <Arrow /></a>
              {cvUrl && <a href={cvUrl} target="_blank" rel="noreferrer" className="hero-cv" data-track="hero-download-cv">{hero.cvLabel} ↗</a>}
            </div>
          </motion.div>
        </div>
        <motion.div className="hero-art-stage" initial={{ opacity: 0, scale: 0.9, rotate: reduced ? 0 : 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, delay: 0.2, ease }} style={reduced ? undefined : { y: artY }}>
          <HeroCollage hero={hero} />
        </motion.div>
      </div>
      <div className="hero-footnote"><span>{hero.focus}</span><a href="#work">{hero.scrollLabel} <span>↓</span></a></div>
    </section>
  )
}
