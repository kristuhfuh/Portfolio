import { useState } from 'react'
import { motion } from 'framer-motion'
import { getPageContent, savePageContent, getBeyondPixels, saveBeyondPixels, getContactGallery, saveContactGallery } from '../lib/cms.js'
import ImageFocalPoint from '../components/ImageFocalPoint.jsx'
import RichTextField from '../components/RichTextField.jsx'
import MediaUpload from '../components/MediaUpload.jsx'

const inputCls = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#141414] outline-none transition-colors placeholder:text-[#141414]/30 focus:border-[#6D28D9]/50 focus:ring-2 focus:ring-[#6D28D9]/8'
const textareaCls = inputCls + ' min-h-[120px] resize-y'

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-black/6 bg-white">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
          className="text-lg text-[#141414]">{title}</h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-[#141414]/30 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="space-y-4 border-t border-black/6 px-6 pb-6 pt-4">{children}</div>}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-[#141414]/40"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</label>
      {children}
    </div>
  )
}

export default function AdminPages() {
  const [hero, setHero] = useState(getPageContent('hero'))
  const [about, setAbout] = useState(getPageContent('about'))
  const [contact, setContact] = useState(getPageContent('contact'))
  const [beyond, setBeyond] = useState(getBeyondPixels())
  const [gallery, setGallery] = useState(getContactGallery())
  const [saved, setSaved] = useState('')

  const save = (page, data) => {
    if (page === 'beyond') saveBeyondPixels(data)
    else if (page === 'gallery') saveContactGallery(data)
    else savePageContent(page, data)
    setSaved(page)
    setTimeout(() => setSaved(''), 2000)
  }

  const updateGalleryItem = (idx, key, val) => {
    const next = [...gallery]
    next[idx] = { ...next[idx], [key]: val }
    setGallery(next)
  }
  const addGalleryItem = () => {
    if (gallery.length >= 4) return
    setGallery([...gallery, { id: Date.now().toString(), type: 'image', src: '', poster: '', caption: '' }])
  }
  const removeGalleryItem = (idx) => setGallery(gallery.filter((_, i) => i !== idx))

  const updateBeyondItem = (idx, key, value) => {
    const items = [...beyond]
    items[idx] = { ...items[idx], [key]: value }
    setBeyond(items)
  }

  const SaveBtn = ({ page, label }) => (
    <button onClick={() => save(page, page === 'beyond' ? beyond : page === 'gallery' ? gallery : page === 'hero' ? hero : page === 'about' ? about : contact)}
      className={`mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 ${saved === page ? 'bg-emerald-500' : 'bg-[#141414] hover:shadow-lg hover:shadow-black/15'}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {saved === page ? '✓ Saved' : label}
    </button>
  )

  return (
    <div className="max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-[#141414]/40">Make changes and hit save — updates go live instantly.</p>
      </motion.div>

      <div className="space-y-3">
        {/* Hero */}
        <Section title="Hero" defaultOpen>
          <Field label="Headline (use \n for line breaks)">
            <textarea className={textareaCls} value={hero.headline} onChange={e => setHero({ ...hero, headline: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <RichTextField value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Hero subtitle…" minHeight={100} />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Focus"><input className={inputCls} value={hero.focus} onChange={e => setHero({ ...hero, focus: e.target.value })} /></Field>
            <Field label="Open To"><input className={inputCls} value={hero.openTo} onChange={e => setHero({ ...hero, openTo: e.target.value })} /></Field>
          </div>
          <Field label="CV / Resume URL">
            <input className={inputCls} value={hero.cvUrl || ''} onChange={e => setHero({ ...hero, cvUrl: e.target.value })} placeholder="Google Drive or direct PDF link" />
            <p className="mt-1.5 text-[11px] text-[#141414]/40">Share file → "Anyone with the link" → paste here.</p>
          </Field>
          <div className="border-t border-black/6 pt-4">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Hero Images — click to set crop focus
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <ImageFocalPoint label="Top Image (default)" imageValue={hero.topImage} focusValue={hero.topImageFocus}
                onImageChange={v => setHero({ ...hero, topImage: v })} onFocusChange={v => setHero({ ...hero, topImageFocus: v })} />
              <ImageFocalPoint label="Bottom Image (on hover)" imageValue={hero.bottomImage} focusValue={hero.bottomImageFocus}
                onImageChange={v => setHero({ ...hero, bottomImage: v })} onFocusChange={v => setHero({ ...hero, bottomImageFocus: v })} />
            </div>
          </div>
          <SaveBtn page="hero" label="Save Hero" />
        </Section>

        {/* About */}
        <Section title="About">
          <Field label="Heading">
            <RichTextField value={about.heading} onChange={v => setAbout({ ...about, heading: v })} placeholder="Section heading…" singleLine />
          </Field>
          <Field label="Bio">
            <RichTextField value={about.bio} onChange={v => setAbout({ ...about, bio: v })} placeholder="Your bio…" minHeight={200} />
          </Field>
          <Field label="Photo URL">
            <input className={inputCls} value={about.photo} onChange={e => setAbout({ ...about, photo: e.target.value })} />
          </Field>
          {about.photo && <img src={about.photo} alt="preview" className="h-40 w-32 rounded-xl object-cover" />}
          <SaveBtn page="about" label="Save About" />
        </Section>

        {/* Beyond the Pixels */}
        <Section title="Beyond the Pixels">
          <p className="text-sm text-[#141414]/50">Image shows by default. Video plays on hover. Leave video empty for image-only.</p>
          <div className="space-y-4">
            {beyond.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-black/6 bg-[#f5f3ee] p-4">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Box {i + 1}</p>
                <div className="space-y-4">
                  <Field label="Label">
                    <input className={inputCls} value={item.label} onChange={e => updateBeyondItem(i, 'label', e.target.value)} />
                  </Field>
                  <Field label="Image">
                    <MediaUpload
                      accept="image/*"
                      value={item.image}
                      onChange={v => updateBeyondItem(i, 'image', v)}
                    />
                  </Field>
                  <Field label="Video (optional — plays on hover)">
                    <MediaUpload
                      accept="video/*"
                      value={item.video || ''}
                      onChange={v => updateBeyondItem(i, 'video', v)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <SaveBtn page="beyond" label="Save Beyond Pixels" />
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <Field label="Heading">
            <RichTextField value={contact.heading} onChange={v => setContact({ ...contact, heading: v })} placeholder="Contact heading…" minHeight={80} />
          </Field>
          <Field label="Description">
            <RichTextField value={contact.description} onChange={v => setContact({ ...contact, description: v })} placeholder="Contact description…" minHeight={100} />
          </Field>
          <Field label="Email"><input className={inputCls} value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></Field>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="LinkedIn URL"><input className={inputCls} value={contact.linkedin} onChange={e => setContact({ ...contact, linkedin: e.target.value })} /></Field>
            <Field label="Twitter URL"><input className={inputCls} value={contact.twitter} onChange={e => setContact({ ...contact, twitter: e.target.value })} /></Field>
            <Field label="Dribbble URL"><input className={inputCls} value={contact.dribbble} onChange={e => setContact({ ...contact, dribbble: e.target.value })} /></Field>
          </div>
          <SaveBtn page="contact" label="Save Contact" />
        </Section>

        {/* Gallery */}
        <Section title="Gallery">
          <p className="text-sm text-[#141414]/50">Up to 7 portrait images or videos in the scrolling strip above the contact section.</p>
          <div className="space-y-3">
            {gallery.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-black/6 bg-[#f5f3ee] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Item {i + 1}</p>
                  <button onClick={() => removeGalleryItem(i)} className="text-xs text-red-400 hover:text-red-500">Remove</button>
                </div>
                <div className="space-y-3">
                  <Field label="Type">
                    <select className={inputCls} value={item.type} onChange={e => updateGalleryItem(i, 'type', e.target.value)}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </Field>
                  <Field label={item.type === 'video' ? 'Video URL (.mp4 / .webm)' : 'Image URL'}>
                    <input className={inputCls} value={item.src} onChange={e => updateGalleryItem(i, 'src', e.target.value)} placeholder="https://..." />
                  </Field>
                  {item.type === 'video' && (
                    <Field label="Poster / Thumbnail URL (optional)">
                      <input className={inputCls} value={item.poster || ''} onChange={e => updateGalleryItem(i, 'poster', e.target.value)} placeholder="https://..." />
                    </Field>
                  )}
                  <Field label="Caption (optional)">
                    <input className={inputCls} value={item.caption || ''} onChange={e => updateGalleryItem(i, 'caption', e.target.value)} placeholder="Short description" />
                  </Field>
                  {item.src && item.type === 'image' && <img src={item.src} alt="" className="h-24 w-40 rounded-lg object-cover" />}
                </div>
              </div>
            ))}
          </div>
          {gallery.length < 7 && (
            <button onClick={addGalleryItem}
              className="mt-1 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-[#141414] transition-colors hover:bg-black/5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              Add Item
            </button>
          )}
          <SaveBtn page="gallery" label="Save Gallery" />
        </Section>
      </div>
    </div>
  )
}
