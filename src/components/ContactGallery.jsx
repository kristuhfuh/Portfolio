import { useEffect, useRef, useState } from 'react'
import { useMotionPreference as useReducedMotion } from '../lib/motion.js'
import { getContactGallery, getPageContent, normalizeDriveUrl } from '../lib/cms.js'
import { Arrow, Burst } from './DesignMarks.jsx'
import Modal from './Modal.jsx'

function GalleryCard({ item, index, onSelect, fallbackCaption }) {
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const video = item.type === 'video' ? item.src : item.hoverVideo
  const image = item.type === 'video' ? item.poster : item.src
  function play() {
    if (!video || reduced) return
    const el = videoRef.current
    el?.play().then(() => setPlaying(true)).catch(() => {})
  }
  function stop() { videoRef.current?.pause(); setPlaying(false) }
  return (
    <button type="button" className={`gallery-card ${playing ? 'is-playing' : ''}`} onClick={onSelect} onPointerEnter={play} onPointerLeave={stop} onFocus={play} onBlur={stop} aria-label={`Expand ${item.caption || `gallery image ${index + 1}`}`}>
      <span className="gallery-card-media">
        {image && <img src={normalizeDriveUrl(image)} alt="" loading="lazy" draggable={false} />}
        {video && <video ref={videoRef} src={normalizeDriveUrl(video)} poster={normalizeDriveUrl(image)} muted loop playsInline preload="none" aria-hidden="true" />}
        {!image && <span className="gallery-video-placeholder">{video ? 'Play film ↗' : 'Open image ↗'}</span>}
        <span className="gallery-expand"><Arrow /></span>
      </span>
      <span className="gallery-card-caption"><span>{item.caption || fallbackCaption}</span><span>{String(index + 1).padStart(2, '0')}</span></span>
    </button>
  )
}

export default function WorkGallery() {
  const items = getContactGallery()
  const content = getPageContent('galleryIntro')
  const reduced = useReducedMotion()
  const trackRef = useRef(null)
  const interacting = useRef(false)
  const position = useRef(0)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(null)
  const selectedItem = selected === null ? null : items[selected]

  useEffect(() => {
    const track = trackRef.current
    if (!track || reduced || paused || selected !== null || !items.length) return
    let frame, previous, visible = false, direction = 1
    position.current = track.scrollLeft
    function tick(time) {
      if (visible && !interacting.current) {
        const max = track.scrollWidth - track.clientWidth
        const delta = previous === undefined ? 0 : Math.min(time - previous, 40)
        position.current = Math.max(0, Math.min(max, position.current + delta * 0.028 * direction))
        track.scrollLeft = position.current
        if (position.current >= max) direction = -1
        if (position.current <= 0) direction = 1
      }
      previous = time
      if (visible) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      visible = entry.isIntersecting
      previous = undefined
      if (visible) frame = requestAnimationFrame(tick)
    })
    observer.observe(track)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [items.length, paused, reduced, selected])

  function resume() { position.current = trackRef.current?.scrollLeft || 0; interacting.current = !!trackRef.current?.contains(document.activeElement) }
  function step(direction) {
    setPaused(true)
    trackRef.current?.scrollBy({ left: direction * 310, behavior: reduced ? 'instant' : 'smooth' })
  }

  if (!items.length) return null
  return (
    <section className="poet-gallery" aria-labelledby="gallery-heading">
      <div className="gallery-heading-row"><div><p className="eyebrow">{content.eyebrow}</p><h2 id="gallery-heading">{content.heading} <em>{content.headingAccent}</em><Burst /></h2></div><p style={{ whiteSpace: 'pre-line' }}>{content.description}</p></div>
      <div className="gallery-track" ref={trackRef} onPointerEnter={() => { interacting.current = true }} onPointerLeave={resume} onPointerDown={() => { interacting.current = true }} onPointerUp={resume} onPointerCancel={resume} onFocusCapture={() => { interacting.current = true }} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) resume() }} onWheel={() => setPaused(true)}>
        {items.map((item, index) => <GalleryCard key={item.id} item={item} index={index} fallbackCaption={content.fallbackCaption} onSelect={() => setSelected(index)} />)}
      </div>
      <div className="gallery-controls"><span>{content.controlsLabel}</span><div>{!reduced && <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Play gallery' : 'Pause gallery'} <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>}<button type="button" aria-label="Scroll gallery left" onClick={() => step(-1)}>←</button><button type="button" aria-label="Scroll gallery right" onClick={() => step(1)}>→</button></div></div>
      {selectedItem && <Modal onClose={() => setSelected(null)} label={selectedItem.caption || 'Gallery preview'} className="gallery-dialog">
        <figure>{selectedItem.type === 'video' ? <video src={normalizeDriveUrl(selectedItem.src)} poster={normalizeDriveUrl(selectedItem.poster)} controls autoPlay={!reduced} muted playsInline /> : <img src={normalizeDriveUrl(selectedItem.src)} alt={selectedItem.caption || 'Selected gallery image'} />}{selectedItem.caption && <figcaption>{selectedItem.caption}</figcaption>}</figure>
        <div className="gallery-dialog-navigation"><button type="button" aria-label="Previous gallery item" onClick={() => setSelected((selected - 1 + items.length) % items.length)}>← Previous</button><span>{selected + 1} / {items.length}</span><button type="button" aria-label="Next gallery item" onClick={() => setSelected((selected + 1) % items.length)}>Next →</button></div>
      </Modal>}
    </section>
  )
}
