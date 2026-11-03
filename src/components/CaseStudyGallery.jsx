import { useState } from 'react'
import { normalizeDriveUrl } from '../lib/cms.js'
import CaseStudyMedia from './CaseStudyMedia.jsx'

export default function CaseStudyGallery({ images = [], title }) {
  const [index, setIndex] = useState(0)
  const items = images.map(image => typeof image === 'string' ? { url: image, type: /\.(mp4|webm|mov)(\?|$)/i.test(image) ? 'video' : 'image' } : image).filter(image => image.url)
  const active = items[index] || items[0]
  if (!active) return null
  const select = direction => setIndex(current => (current + direction + items.length) % items.length)
  return <section id="visuals" className="case-visuals" aria-labelledby="visuals-heading" onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); select(event.key === 'ArrowRight' ? 1 : -1) } }}><div className="case-visuals-heading"><div><p className="eyebrow">Look a little closer</p><h2 id="visuals-heading">The work, in detail.</h2></div><div className="case-visuals-controls"><span role="status" aria-live="polite">{index + 1} / {items.length}</span><button type="button" aria-label="Previous project visual" disabled={items.length < 2} onClick={() => select(-1)}>←</button><button type="button" aria-label="Next project visual" disabled={items.length < 2} onClick={() => select(1)}>→</button></div></div><CaseStudyMedia key={active.url} src={active.url} poster={active.poster} type={active.type || 'image'} title={active.alt || active.caption || `${title} — design visual ${index + 1}`} caption={active.caption} />{items.length > 1 && <div className="case-visuals-thumbnails" role="group" aria-label="Choose a project visual">{items.map((image, itemIndex) => <button key={`${image.url}-${itemIndex}`} type="button" aria-pressed={index === itemIndex} aria-label={`Show ${image.caption || `project visual ${itemIndex + 1}`}`} onClick={() => setIndex(itemIndex)}>{image.type !== 'video' || image.poster ? <img src={normalizeDriveUrl(image.poster || image.url)} alt="" loading="lazy" /> : <span>Film {itemIndex + 1}</span>}</button>)}</div>}</section>
}
