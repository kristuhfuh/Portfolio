import { useEffect, useState } from 'react'
import { normalizeDriveUrl } from '../lib/cms.js'
import Modal from './Modal.jsx'
import { Arrow } from './DesignMarks.jsx'

export default function CaseStudyMedia({ src, poster, type = 'image', title, caption, eager = false, transitionName }) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  const source = type === 'video' ? src : normalizeDriveUrl(src)
  if (!source) return null
  return <figure className="case-media">
    <div className="case-media-surface">{failed ? <div className="case-media-unavailable"><p>This visual couldn’t load.</p><button type="button" onClick={() => setFailed(false)}>Try again</button></div> : type === 'video' ? <video src={source} poster={poster} controls playsInline preload="metadata" aria-label={title} onError={() => setFailed(true)} /> : <button type="button" className="case-media-open" data-case-media aria-label={`Enlarge ${title}`} onClick={() => setOpen(true)}><img src={source} alt={title} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} style={transitionName ? { viewTransitionName: transitionName } : undefined} /><span className="case-media-zoom"><Arrow /><span>Explore the detail</span></span></button>}</div>
    {caption && <figcaption>{caption}</figcaption>}
    {open && <Modal className="case-media-dialog" label={title} onClose={() => setOpen(false)}><img src={source} alt={title} /><div><span>{caption || title}</span><a href={source} target="_blank" rel="noreferrer">Open full size ↗</a></div></Modal>}
  </figure>
}
