import { useState } from 'react'
import { motion } from 'framer-motion'
import { getPageContent, savePageContent, getBeyondPixels, saveBeyondPixels } from '../lib/cms.js'
import ImageFocalPoint from '../components/ImageFocalPoint.jsx'
import RichTextField from '../components/RichTextField.jsx'

const inputCls = 'w-full rounded-lg border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink'
const textareaCls = inputCls + ' min-h-[120px] resize-y'

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-line bg-white/60 backdrop-blur dark:border-dark-line dark:bg-white/[0.03]">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left">
        <h2 className="font-display text-xl text-ink dark:text-dark-ink">{title}</h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="space-y-4 border-t border-line px-6 pb-6 pt-4 dark:border-dark-line">{children}</div>}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label mb-1.5 block text-muted dark:text-dark-muted">{label}</label>
      {children}
    </div>
  )
}

export default function AdminPages() {
  const [hero, setHero] = useState(getPageContent('hero'))
  const [about, setAbout] = useState(getPageContent('about'))
  const [contact, setContact] = useState(getPageContent('contact'))
  const [beyond, setBeyond] = useState(getBeyondPixels())
  const [saved, setSaved] = useState('')

  const save = (page, data) => {
    if (page === 'beyond') saveBeyondPixels(data)
    else savePageContent(page, data)
    setSaved(page)
    setTimeout(() => setSaved(''), 2000)
  }

  const updateBeyondItem = (idx, key, value) => {
    const items = [...beyond]
    items[idx] = { ...items[idx], [key]: value }
    setBeyond(items)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl text-ink dark:text-dark-ink">Page Content</h1>
        <p className="mt-2 text-muted dark:text-dark-muted">Edit the text and media on every section of your portfolio.</p>
      </motion.div>

      <div className="mt-8 space-y-4">
        {/* Hero */}
        <Section title="Hero Section" defaultOpen>
          <Field label="Headline (use \n for line breaks)">
            <textarea className={textareaCls} value={hero.headline} onChange={e => setHero({ ...hero, headline: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <RichTextField value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Hero subtitle…" minHeight={100} />
          </Field>
          <Field label="Focus"><input className={inputCls} value={hero.focus} onChange={e => setHero({ ...hero, focus: e.target.value })} /></Field>
          <Field label="Open To"><input className={inputCls} value={hero.openTo} onChange={e => setHero({ ...hero, openTo: e.target.value })} /></Field>
          <Field label="CV / Resume URL">
            <input className={inputCls} value={hero.cvUrl || ''} onChange={e => setHero({ ...hero, cvUrl: e.target.value })}
              placeholder="Paste a Google Drive or direct link to your CV PDF" />
            <p className="mt-1.5 text-[11px] text-muted dark:text-dark-muted">For Google Drive: share the file → "Anyone with the link" → paste the link here.</p>
          </Field>

          <div className="pt-2 border-t border-line dark:border-dark-line">
            <p className="label mb-4 text-muted dark:text-dark-muted">Hero Image Reveal — click image to set crop focus</p>
            <div className="grid gap-6 md:grid-cols-2">
              <ImageFocalPoint
                label="Top Image (shown by default)"
                imageValue={hero.topImage}
                focusValue={hero.topImageFocus}
                onImageChange={v => setHero({ ...hero, topImage: v })}
                onFocusChange={v => setHero({ ...hero, topImageFocus: v })}
              />
              <ImageFocalPoint
                label="Bottom Image (revealed on hover)"
                imageValue={hero.bottomImage}
                focusValue={hero.bottomImageFocus}
                onImageChange={v => setHero({ ...hero, bottomImage: v })}
                onFocusChange={v => setHero({ ...hero, bottomImageFocus: v })}
              />
            </div>
          </div>

          <button onClick={() => save('hero', hero)}
            className={`label mt-2 rounded-lg px-5 py-2.5 text-cream ${saved === 'hero' ? 'bg-emerald-500' : 'bg-accent'}`}>
            {saved === 'hero' ? '✓ Saved' : 'Save Hero'}
          </button>
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field label="Heading">
            <RichTextField value={about.heading} onChange={v => setAbout({ ...about, heading: v })} placeholder="Section heading…" singleLine />
          </Field>
          <Field label="Bio">
            <RichTextField value={about.bio} onChange={v => setAbout({ ...about, bio: v })} placeholder="Your bio…" minHeight={200} />
          </Field>
          <Field label="Photo URL"><input className={inputCls} value={about.photo} onChange={e => setAbout({ ...about, photo: e.target.value })} /></Field>
          {about.photo && <img src={about.photo} alt="preview" className="h-40 w-32 rounded-xl object-cover" />}
          <button onClick={() => save('about', about)}
            className={`label mt-2 rounded-lg px-5 py-2.5 text-cream ${saved === 'about' ? 'bg-emerald-500' : 'bg-accent'}`}>
            {saved === 'about' ? '✓ Saved' : 'Save About'}
          </button>
        </Section>

        {/* Beyond the Pixels */}
        <Section title="Beyond the Pixels (4-box grid)">
          <p className="text-sm text-muted dark:text-dark-muted">Each box shows a placeholder image. On hover, the video plays. Leave video empty for image-only boxes.</p>
          <div className="space-y-6">
            {beyond.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-line p-4 dark:border-dark-line">
                <div className="mb-3 text-sm font-medium text-ink dark:text-dark-ink">Box {i + 1}</div>
                <div className="space-y-3">
                  <Field label="Label"><input className={inputCls} value={item.label} onChange={e => updateBeyondItem(i, 'label', e.target.value)} /></Field>
                  <Field label="Image URL"><input className={inputCls} value={item.image} onChange={e => updateBeyondItem(i, 'image', e.target.value)} /></Field>
                  <Field label="Video URL (optional — plays on hover)"><input className={inputCls} value={item.video || ''} onChange={e => updateBeyondItem(i, 'video', e.target.value)} placeholder="https://....mp4" /></Field>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => save('beyond', beyond)}
            className={`label mt-2 rounded-lg px-5 py-2.5 text-cream ${saved === 'beyond' ? 'bg-emerald-500' : 'bg-accent'}`}>
            {saved === 'beyond' ? '✓ Saved' : 'Save Beyond Pixels'}
          </button>
        </Section>

        {/* Contact */}
        <Section title="Contact Section">
          <Field label="Heading">
            <RichTextField value={contact.heading} onChange={v => setContact({ ...contact, heading: v })} placeholder="Contact heading…" minHeight={80} />
          </Field>
          <Field label="Description">
            <RichTextField value={contact.description} onChange={v => setContact({ ...contact, description: v })} placeholder="Contact description…" minHeight={100} />
          </Field>
          <Field label="Email"><input className={inputCls} value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></Field>
          <Field label="LinkedIn URL"><input className={inputCls} value={contact.linkedin} onChange={e => setContact({ ...contact, linkedin: e.target.value })} /></Field>
          <Field label="Twitter URL"><input className={inputCls} value={contact.twitter} onChange={e => setContact({ ...contact, twitter: e.target.value })} /></Field>
          <Field label="Dribbble URL"><input className={inputCls} value={contact.dribbble} onChange={e => setContact({ ...contact, dribbble: e.target.value })} /></Field>
          <button onClick={() => save('contact', contact)}
            className={`label mt-2 rounded-lg px-5 py-2.5 text-cream ${saved === 'contact' ? 'bg-emerald-500' : 'bg-accent'}`}>
            {saved === 'contact' ? '✓ Saved' : 'Save Contact'}
          </button>
        </Section>
      </div>
    </div>
  )
}
