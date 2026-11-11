import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { getPageContent, savePageContent, getBeyondPixels, saveBeyondPixels, getContactGallery, saveContactGallery, getOtherDesigns, saveOtherDesigns } from '../lib/cms.js'
import ImageFocalPoint from '../components/ImageFocalPoint.jsx'
import RichTextField from '../components/RichTextField.jsx'
import MediaUpload from '../components/MediaUpload.jsx'
import Field from '../components/AdminField.jsx'
import DraftRecovery from '../components/DraftRecovery.jsx'
import { useEditorDraft } from '../lib/useEditorDraft.js'
import { getCMSSyncState, subscribeCMSSync } from '../lib/cms.js'
import { AdminHomepageFields, homepageSections } from '../components/AdminHomepageFields.jsx'

const inputCls = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#141414] outline-none transition-colors placeholder:text-[#141414]/30 focus:border-[#6D28D9]/50 focus:ring-2 focus:ring-[#6D28D9]/8'
const textareaCls = inputCls + ' min-h-[120px] resize-y'

function Section({ title, children, defaultOpen = false, name }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  useEffect(() => {
    if (!name) return
    const reveal = () => { if (window.location.hash === `#section-${name}`) setOpen(true) }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [name])
  return (
    <div id={name ? `section-${name}` : undefined} className="rounded-2xl border border-black/6 bg-white scroll-mt-32">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
          className="text-lg text-[#141414]">{title}</h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-[#141414]/30 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div id={id} className="space-y-4 border-t border-black/6 px-6 pb-6 pt-4">{children}</div>}
    </div>
  )
}

export default function AdminPages() {
  const [extras, setExtras] = useState(() => Object.fromEntries(homepageSections.map(section => [section.key, getPageContent(section.key)])))
  const [hero, setHero] = useState(getPageContent('hero'))
  const [about, setAbout] = useState(getPageContent('about'))
  const [contact, setContact] = useState(getPageContent('contact'))
  const [beyond, setBeyond] = useState(getBeyondPixels())
  const [gallery, setGallery] = useState(getContactGallery())
  const [otherDesigns, setOtherDesigns] = useState(getOtherDesigns())
  const [saved, setSaved] = useState('')
  const [syncFailed, setSyncFailed] = useState('')
  const [saving, setSaving] = useState('')
  const [saveError, setSaveError] = useState('')
  const baseline = useRef({ hero, about, contact, beyond, gallery, otherDesigns, ...extras })
  const draft = useEditorDraft('page_content', { hero, about, contact, beyond, gallery, otherDesigns, ...extras })
  const syncState = useSyncExternalStore(subscribeCMSSync, getCMSSyncState)
  useEffect(() => { if (syncFailed && syncState.failed === 0 && syncState.lastSavedAt) { setSaved(syncFailed); setSyncFailed('') } }, [syncFailed, syncState])
  const restoreDraft = value => {
    setHero(value.hero || getPageContent('hero')); setAbout(value.about || getPageContent('about')); setContact(value.contact || getPageContent('contact'))
    setBeyond(value.beyond || []); setGallery(value.gallery || []); setOtherDesigns(value.otherDesigns || [])
    setExtras(Object.fromEntries(homepageSections.map(section => [section.key, value[section.key] || getPageContent(section.key)])))
  }

  const save = async (page, data) => {
    if (saving) return
    setSaving(page); setSaveError('')
    try {
    if (page === 'hero' && !data.expression?.trim()) throw new Error('Add a short hero heading before saving.')
    if (page === 'site') {
      if (!data.timeZone?.trim()) throw new Error('Add a clock time zone before saving.')
      try { new Intl.DateTimeFormat('en', { timeZone: data.timeZone }) } catch { throw new Error('Use a valid time zone such as Africa/Lagos.') }
    }
    let result
    if (page === 'beyond') result = await saveBeyondPixels(data)
    else if (page === 'gallery') result = await saveContactGallery(data)
    else if (page === 'otherDesigns') result = await saveOtherDesigns(data)
    else result = await savePageContent(page, data)
    baseline.current = { ...baseline.current, [page]: data }
    draft.markSaved(baseline.current)
    if (result.cloudSynced) {
      setSaved(page)
      setSyncFailed('')
      setTimeout(() => setSaved(''), 2500)
    } else {
      setSyncFailed(page)
      setSaved('')
    }
    } catch (error) { setSaveError(error.message) }
    finally { setSaving('') }
  }

  const updateGalleryItem = (idx, key, val) => {
    const next = [...gallery]
    next[idx] = { ...next[idx], [key]: val }
    setGallery(next)
  }
  const addGalleryItem = () => {
    setGallery([...gallery, { id: Date.now().toString(), type: 'image', src: '', poster: '', hoverVideo: '', caption: '' }])
  }
  const removeGalleryItem = (idx) => setGallery(gallery.filter((_, i) => i !== idx))

  const updateBeyondItem = (idx, key, value) => {
    const items = [...beyond]
    items[idx] = { ...items[idx], [key]: value }
    setBeyond(items)
  }
  const moveItem = (items, index, direction, setter) => {
    const next = [...items]
    ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
    setter(next)
  }

  const saveButton = (page, label) => (
    <div className="mt-2 flex flex-col gap-1.5">
      <button type="button" disabled={!!saving} onClick={() => save(page, { hero, about, contact, beyond, gallery, otherDesigns, ...extras }[page])}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 ${saved === page ? 'bg-emerald-500' : syncFailed === page ? 'bg-amber-500' : 'bg-[#141414] hover:shadow-lg hover:shadow-black/15'}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {saving === page ? 'Saving…' : saved === page ? '✓ Saved to cloud' : syncFailed === page ? 'Retry save' : label}
      </button>

      {syncFailed === page && (
        <p className="text-xs text-amber-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Cloud sync failed — data saved in this browser only. Check your Supabase settings table permissions.
        </p>
      )}
    </div>
  )

  return (
    <div className="admin-pages">
      <div className="admin-page-heading"><div><p className="eyebrow">The words, the pictures, the personality</p><h1>Make it yours<span>.</span></h1><p>{draft.dirty ? 'You have unsaved changes. Save each section when it’s ready.' : 'Edit a section, then save it to update your portfolio.'}</p></div><a className="admin-button" href="/" target="_blank" rel="noreferrer">View portfolio ↗</a></div>
      <DraftRecovery draft={draft} onRestore={restoreDraft} />
      {saveError && <p className="admin-notice error" role="alert">{saveError}</p>}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-[#141414]/60">Cloud updates become available to visitors after they reload the page.</p>
      </motion.div>
      <nav className="admin-page-jump" aria-label="Homepage sections">{[
        ['hero', 'Hero'], ['work', 'Selected work'], ['marquee', 'Moving text'], ['statement', 'Point of view'],
        ['otherDesignsIntro', 'Other designs intro'], ['otherDesigns', 'Other designs'], ['process', 'Process'],
        ['experience', 'Experience'], ['about', 'About'], ['aboutExtras', 'About details'], ['beyondIntro', 'Beyond intro'],
        ['beyond', 'Beyond images'], ['galleryIntro', 'Gallery intro'], ['gallery', 'Gallery media'],
        ['contact', 'Contact'], ['site', 'Navigation & footer'],
      ].map(([key, label]) => <a key={key} href={`#section-${key}`}>{label}</a>)}</nav>

      <div className="space-y-3">
        {/* Hero */}
        <Section title="Hero" name="hero" defaultOpen>
          <Field label="Your name"><input className={inputCls} value={hero.headline || ''} onChange={event => setHero({ ...hero, headline: event.target.value })} /></Field>
          <Field label="Hero heading (one short line per row)">
            <textarea className={textareaCls} value={hero.expression ?? ''} onChange={e => setHero({ ...hero, expression: e.target.value })} />
          </Field>
          <Field label="Role line"><input className={inputCls} value={hero.roleLabel ?? ''} onChange={event => setHero({ ...hero, roleLabel: event.target.value })} /></Field>
          <Field label="Subtitle">
            <RichTextField value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Hero subtitle…" minHeight={100} />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Focus"><input className={inputCls} value={hero.focus} onChange={e => setHero({ ...hero, focus: e.target.value })} /></Field>
            <Field label="Open To"><input className={inputCls} value={hero.openTo} onChange={e => setHero({ ...hero, openTo: e.target.value })} /></Field>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Location"><input className={inputCls} value={hero.location || ''} onChange={event => setHero({ ...hero, location: event.target.value })} /></Field>
            <Field label="Timezone note"><input className={inputCls} value={hero.timezoneLabel || ''} onChange={event => setHero({ ...hero, timezoneLabel: event.target.value })} /></Field>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Work button"><input className={inputCls} value={hero.workCta || ''} onChange={event => setHero({ ...hero, workCta: event.target.value })} /></Field>
            <Field label="CV button"><input className={inputCls} value={hero.cvLabel || ''} onChange={event => setHero({ ...hero, cvLabel: event.target.value })} /></Field>
            <Field label="Scroll prompt"><input className={inputCls} value={hero.scrollLabel || ''} onChange={event => setHero({ ...hero, scrollLabel: event.target.value })} /></Field>
          </div>
          <Field label="CV / Resume URL">
            <input className={inputCls} value={hero.cvUrl || ''} onChange={e => setHero({ ...hero, cvUrl: e.target.value })} placeholder="Google Drive or direct PDF link" />
            <p className="mt-1.5 text-[11px] text-[#141414]/40">Share file → "Anyone with the link" → paste here.</p>
          </Field>
          <div className="border-t border-black/6 pt-4">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Hero Images — click to set crop focus
            </p>
            <Field label="Abstract artwork"><MediaUpload accept="image/*" value={hero.artImage || ''} onChange={value => setHero({ ...hero, artImage: value })} /></Field>
            <div className="grid gap-6 md:grid-cols-2">
              <ImageFocalPoint label="Top Image (default)" imageValue={hero.topImage} focusValue={hero.topImageFocus}
                onImageChange={v => setHero({ ...hero, topImage: v })} onFocusChange={v => setHero({ ...hero, topImageFocus: v })} />
              <ImageFocalPoint label="Bottom Image (on hover)" imageValue={hero.bottomImage} focusValue={hero.bottomImageFocus}
                onImageChange={v => setHero({ ...hero, bottomImage: v })} onFocusChange={v => setHero({ ...hero, bottomImageFocus: v })} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['artCaption', 'Art caption'], ['portraitDefault', 'First portrait caption'], ['portraitAlternate', 'Second portrait caption'],
              ['portraitButtonLabel', 'Portrait toggle description'], ['noteIntro', 'Art note lead-in'], ['noteLineOne', 'Art note first line'],
              ['noteLineTwo', 'Art note second line'], ['noteLineThree', 'Art note accent line'],
            ].map(([key, label]) => <Field key={key} label={label}><input className={inputCls} value={hero[key] || ''} onChange={event => setHero({ ...hero, [key]: event.target.value })} /></Field>)}
          </div>
          <Field label="Sticker (one line per row)"><textarea className={textareaCls} value={hero.sticker || ''} onChange={event => setHero({ ...hero, sticker: event.target.value })} /></Field>
          {saveButton('hero', 'Save Hero')}
        </Section>

        {/* About */}
        <Section title="About" name="about">
          <Field label="Heading">
            <RichTextField value={about.heading} onChange={v => setAbout({ ...about, heading: v })} placeholder="Section heading…" singleLine />
          </Field>
          <Field label="Bio">
            <RichTextField value={about.bio} onChange={v => setAbout({ ...about, bio: v })} placeholder="Your bio…" minHeight={200} />
          </Field>
          <Field label="Photo URL">
            <input className={inputCls} value={about.photo} onChange={e => setAbout({ ...about, photo: e.target.value })} />
          </Field>
          <Field label="Photo description"><input className={inputCls} value={about.photoAlt || ''} onChange={event => setAbout({ ...about, photoAlt: event.target.value })} /></Field>
          {about.photo && <img src={about.photo} alt="preview" className="h-40 w-32 rounded-xl object-cover" />}
          {saveButton('about', 'Save About')}
        </Section>

        {/* Beyond the Pixels */}
        <Section title="Beyond the Pixels" name="beyond">
          <p className="text-sm text-[#141414]/50">Image shows by default. Video plays on hover. Leave video empty for image-only.</p>
          <div className="space-y-4">
            {beyond.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-black/6 bg-[#f5f3ee] p-4">
                <div className="admin-content-item-heading"><span>Box {i + 1}</span><div><button type="button" aria-label={`Move box ${i + 1} up`} disabled={i === 0} onClick={() => moveItem(beyond, i, -1, setBeyond)}>↑</button><button type="button" aria-label={`Move box ${i + 1} down`} disabled={i === beyond.length - 1} onClick={() => moveItem(beyond, i, 1, setBeyond)}>↓</button><button type="button" onClick={() => setBeyond(beyond.filter((_, index) => index !== i))}>Remove</button></div></div>
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
          <button type="button" className="admin-button" onClick={() => setBeyond([...beyond, { id: crypto.randomUUID(), label: '', image: '', video: '' }])}>+ Add image or video</button>
          {saveButton('beyond', 'Save Beyond Pixels')}
        </Section>

        {/* Contact */}
        <Section title="Contact" name="contact">
          <Field label="Section label"><input className={inputCls} value={contact.eyebrow || ''} onChange={event => setContact({ ...contact, eyebrow: event.target.value })} /></Field>
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
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Availability text"><input className={inputCls} value={contact.availabilityLabel || ''} onChange={event => setContact({ ...contact, availabilityLabel: event.target.value })} /></Field>
            <Field label="Email button"><input className={inputCls} value={contact.emailCta || ''} onChange={event => setContact({ ...contact, emailCta: event.target.value })} /></Field>
            <Field label="Name placeholder"><input className={inputCls} value={contact.namePlaceholder || ''} onChange={event => setContact({ ...contact, namePlaceholder: event.target.value })} /></Field>
            <Field label="Email placeholder"><input className={inputCls} value={contact.emailPlaceholder || ''} onChange={event => setContact({ ...contact, emailPlaceholder: event.target.value })} /></Field>
            <Field label="Message placeholder"><input className={inputCls} value={contact.messagePlaceholder || ''} onChange={event => setContact({ ...contact, messagePlaceholder: event.target.value })} /></Field>
            <Field label="Submit button"><input className={inputCls} value={contact.submitLabel || ''} onChange={event => setContact({ ...contact, submitLabel: event.target.value })} /></Field>
            <Field label="Sending label"><input className={inputCls} value={contact.sendingLabel || ''} onChange={event => setContact({ ...contact, sendingLabel: event.target.value })} /></Field>
            <Field label="Success heading"><input className={inputCls} value={contact.successHeading || ''} onChange={event => setContact({ ...contact, successHeading: event.target.value })} /></Field>
            <Field label="Work link after send"><input className={inputCls} value={contact.workLinkLabel || ''} onChange={event => setContact({ ...contact, workLinkLabel: event.target.value })} /></Field>
            <Field label="Send another label"><input className={inputCls} value={contact.anotherMessageLabel || ''} onChange={event => setContact({ ...contact, anotherMessageLabel: event.target.value })} /></Field>
            <Field label="Email fallback link"><input className={inputCls} value={contact.emailFallbackLabel || ''} onChange={event => setContact({ ...contact, emailFallbackLabel: event.target.value })} /></Field>
          </div>
          <Field label="Success message"><textarea className={textareaCls} value={contact.successDescription || ''} onChange={event => setContact({ ...contact, successDescription: event.target.value })} /></Field>
          <Field label="Delivery error message"><textarea className={textareaCls} value={contact.errorText || ''} onChange={event => setContact({ ...contact, errorText: event.target.value })} /></Field>
          {saveButton('contact', 'Save Contact')}
        </Section>

        {/* Other Designs */}
        <Section title="Other Designs" name="otherDesigns">
          <p className="text-sm text-[#141414]/50">Design screenshots or images shown in a grid on the home page. Add an optional link to open the project.</p>
          <div className="space-y-3">
            {otherDesigns.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-black/6 bg-[#f5f3ee] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Design {i + 1}</p>
                  <div className="admin-content-item-heading"><button type="button" aria-label={`Move design ${i + 1} up`} disabled={i === 0} onClick={() => moveItem(otherDesigns, i, -1, setOtherDesigns)}>↑</button><button type="button" aria-label={`Move design ${i + 1} down`} disabled={i === otherDesigns.length - 1} onClick={() => moveItem(otherDesigns, i, 1, setOtherDesigns)}>↓</button><button type="button" onClick={() => setOtherDesigns(otherDesigns.filter((_, idx) => idx !== i))}>Remove</button></div>
                </div>
                <div className="space-y-4">
                  <Field label="Image">
                    <MediaUpload
                      accept="image/*"
                      value={item.image}
                      onChange={v => {
                        const next = [...otherDesigns]
                        next[i] = { ...next[i], image: v }
                        setOtherDesigns(next)
                      }}
                    />
                  </Field>
                  <Field label="Title (optional)">
                    <input className={inputCls} value={item.title || ''} placeholder="Design name or short description"
                      onChange={e => {
                        const next = [...otherDesigns]
                        next[i] = { ...next[i], title: e.target.value }
                        setOtherDesigns(next)
                      }} />
                  </Field>
                  <Field label="Link (optional)">
                    <input className={inputCls} value={item.link || ''} placeholder="https://... or /work/slug"
                      onChange={e => {
                        const next = [...otherDesigns]
                        next[i] = { ...next[i], link: e.target.value }
                        setOtherDesigns(next)
                      }} />
                    <p className="mt-1.5 text-[11px] text-[#141414]/40">Use a full URL for external sites or a path like /work/my-project for internal pages.</p>
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setOtherDesigns([...otherDesigns, { id: Date.now().toString(), image: '', title: '', link: '' }])}
            className="mt-1 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-[#141414] transition-colors hover:bg-black/5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Add Design
          </button>
          {saveButton('otherDesigns', 'Save Other Designs')}
        </Section>

        {/* Gallery */}
        <Section title="Gallery" name="gallery">
          <p className="text-sm text-[#141414]/50">Up to 7 portrait images or videos in the scrolling strip above the contact section.</p>
          <div className="space-y-3">
            {gallery.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-black/6 bg-[#f5f3ee] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#141414]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Item {i + 1}</p>
                  <div className="admin-content-item-heading"><button type="button" aria-label={`Move gallery item ${i + 1} up`} disabled={i === 0} onClick={() => moveItem(gallery, i, -1, setGallery)}>↑</button><button type="button" aria-label={`Move gallery item ${i + 1} down`} disabled={i === gallery.length - 1} onClick={() => moveItem(gallery, i, 1, setGallery)}>↓</button><button type="button" onClick={() => removeGalleryItem(i)}>Remove</button></div>
                </div>
                <div className="space-y-4">
                  <Field label="Type">
                    <select className={inputCls} value={item.type} onChange={e => updateGalleryItem(i, 'type', e.target.value)}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </Field>
                  <Field label={item.type === 'video' ? 'Video' : 'Image'}>
                    <MediaUpload
                      accept={item.type === 'video' ? 'video/*' : 'image/*'}
                      value={item.src}
                      onChange={v => updateGalleryItem(i, 'src', v)}
                    />
                  </Field>
                  {item.type === 'video' && (
                    <Field label="Poster / Thumbnail (optional)">
                      <MediaUpload
                        accept="image/*"
                        value={item.poster || ''}
                        onChange={v => updateGalleryItem(i, 'poster', v)}
                      />
                    </Field>
                  )}
                  {item.type === 'image' && (
                    <Field label="Hover Video (optional — plays on hover)">
                      <MediaUpload
                        accept="video/*"
                        value={item.hoverVideo || ''}
                        onChange={v => updateGalleryItem(i, 'hoverVideo', v)}
                      />
                    </Field>
                  )}
                  <Field label="Caption (optional)">
                    <input className={inputCls} value={item.caption || ''} onChange={e => updateGalleryItem(i, 'caption', e.target.value)} placeholder="Short description" />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addGalleryItem}
            className="mt-1 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-[#141414] transition-colors hover:bg-black/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Add Item
          </button>
          {saveButton('gallery', 'Save Gallery')}
        </Section>
        {homepageSections.map(section => <Section key={section.key} title={section.title} name={section.key}>
          <AdminHomepageFields section={section} value={extras[section.key]} onChange={value => setExtras(previous => ({ ...previous, [section.key]: value }))} />
          {saveButton(section.key, `Save ${section.title}`)}
        </Section>)}
      </div>
    </div>
  )
}
