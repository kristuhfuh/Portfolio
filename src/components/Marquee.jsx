import { useState } from 'react'
import { Burst } from './DesignMarks.jsx'

const words = ['A little more feeling.', 'A little less ordinary.', 'A lot more you.']

export default function Marquee() {
  const [paused, setPaused] = useState(false)
  return (
    <section className={`poet-marquee marquee-pause ${paused ? 'is-paused' : ''}`} aria-label="A little more feeling. A little less ordinary. A lot more you.">
      <div className="poet-marquee-track animate-marquee" aria-hidden="true">
        {[0, 1].map(copy => <div className="poet-marquee-copy" key={copy}>{words.map(word => <span key={word}>{word}<Burst /></span>)}</div>)}
      </div>
      <button type="button" className="marquee-toggle" aria-label={paused ? 'Play moving text' : 'Pause moving text'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
    </section>
  )
}
