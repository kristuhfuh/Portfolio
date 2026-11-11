import { useState } from 'react'
import { Burst } from './DesignMarks.jsx'
import { getPageContent } from '../lib/cms.js'

export default function Marquee() {
  const [paused, setPaused] = useState(false)
  const content = getPageContent('marquee')
  const words = (content.words || []).filter(Boolean)
  if (!words.length) return null
  return (
    <section className={`poet-marquee marquee-pause ${paused ? 'is-paused' : ''}`} aria-label={words.join(' ')}>
      <div className="poet-marquee-track animate-marquee" aria-hidden="true">
        {[0, 1].map(copy => <div className="poet-marquee-copy" key={copy}>{words.map((word, index) => <span key={index}>{word}<Burst /></span>)}</div>)}
      </div>
      <button type="button" className="marquee-toggle" aria-label={paused ? content.playLabel : content.pauseLabel} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
    </section>
  )
}
