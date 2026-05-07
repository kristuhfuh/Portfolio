import { projects as staticProjects } from '../data/projects.js'
import { supabase } from './supabase.js'

// ─── Google Drive URL normaliser ───────────────────────────────────────────────
export function normalizeDriveUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (url.includes('lh3.googleusercontent.com/d/')) return url
  const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&\s]+)/)
  if (thumbMatch) return `https://lh3.googleusercontent.com/d/${thumbMatch[1]}`
  const fileMatch = url.match(/\/file\/d\/([^/?#\s]+)/)
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*?id=([^&\s]+)/)
  if (ucMatch) return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`
  return url
}

// ─── localStorage helpers (fast sync reads) ───────────────────────────────────
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ─── Supabase helpers (async, fire-and-forget on writes) ──────────────────────
async function dbGet(key) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()
  if (error || !data) return null
  return data.value
}

async function dbSet(key, val) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value: val }, { onConflict: 'key' })
  if (error) console.error('[Supabase] write failed:', error.message, error)
}

// ─── Boot: pull latest data from Supabase into localStorage ───────────────────
export async function initCMS() {
  try {
    const result = await Promise.race([
      supabase.from('settings').select('key, value'),
      new Promise(resolve => setTimeout(() => resolve({ data: null, error: 'timeout' }), 4000)),
    ])
    const { data, error } = result
    if (error) { console.warn('[Supabase] read failed:', error); return }
    if (!data) return
    data.forEach(({ key, value }) => lsSet(key, value))
  } catch (e) {
    console.warn('[Supabase] initCMS error:', e)
  }
}

// ─── Keys ─────────────────────────────────────────────────────────────────────
const PROJECTS_KEY  = 'cms_projects'
const CONTACTS_KEY  = 'cms_contacts'
const PAGES_KEY     = 'cms_pages'
const BEYOND_KEY    = 'cms_beyond_pixels'
const GALLERY_KEY   = 'cms_contact_gallery'
const VERSION_KEY   = 'cms_schema_version'
const SCHEMA_VERSION = 'v2-story'

// ─── Projects ─────────────────────────────────────────────────────────────────
export function getProjects() {
  const currentVersion = lsGet(VERSION_KEY, null)
  const saved = lsGet(PROJECTS_KEY, null)

  if (currentVersion !== SCHEMA_VERSION) {
    if (saved && saved.length) {
      const merged = saved.map(savedP => {
        const staticP = staticProjects.find(p => p.slug === savedP.slug)
        return staticP ? { ...staticP, ...savedP } : savedP
      })
      staticProjects.forEach(sp => {
        if (!merged.find(p => p.slug === sp.slug)) merged.push(sp)
      })
      lsSet(PROJECTS_KEY, merged)
      lsSet(VERSION_KEY, SCHEMA_VERSION)
      return merged
    }
    lsSet(PROJECTS_KEY, staticProjects)
    lsSet(VERSION_KEY, SCHEMA_VERSION)
    return staticProjects
  }

  return saved || staticProjects
}

export function getProjectBySlug(slug) { return getProjects().find(p => p.slug === slug) }

export function saveProject(project) {
  const all = getProjects()
  const idx = all.findIndex(p => p.slug === project.slug)
  if (idx >= 0) all[idx] = project
  else all.push(project)
  lsSet(PROJECTS_KEY, all)
  dbSet(PROJECTS_KEY, all)
  return all
}

export function deleteProject(slug) {
  const all = getProjects().filter(p => p.slug !== slug)
  lsSet(PROJECTS_KEY, all)
  dbSet(PROJECTS_KEY, all)
  return all
}

export function toggleProjectVisibility(slug) {
  const all = getProjects()
  const project = all.find(p => p.slug === slug)
  if (project) {
    project.hidden = !project.hidden
    lsSet(PROJECTS_KEY, all)
    dbSet(PROJECTS_KEY, all)
  }
  return all
}

export function reorderProjects(projects) {
  lsSet(PROJECTS_KEY, projects)
  dbSet(PROJECTS_KEY, projects)
  return projects
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export function getContacts() { return lsGet(CONTACTS_KEY, []) }

export async function addContact(contact) {
  const entry = { ...contact, date: new Date().toISOString(), read: false }
  // Write to Supabase contacts table
  await supabase.from('contacts').insert({
    name:    entry.name,
    email:   entry.email,
    message: entry.message,
  })
  // Also keep a local copy
  const all = getContacts()
  all.unshift({ ...entry, id: Date.now().toString() })
  lsSet(CONTACTS_KEY, all)
  return all
}

export async function loadContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return getContacts()
  lsSet(CONTACTS_KEY, data)
  return data
}

export function markContactRead(id) {
  const all = getContacts().map(c => c.id === id ? { ...c, read: true } : c)
  lsSet(CONTACTS_KEY, all)
  supabase.from('contacts').update({ read: true }).eq('id', id)
  return all
}

export function deleteContact(id) {
  const all = getContacts().filter(c => c.id !== id)
  lsSet(CONTACTS_KEY, all)
  supabase.from('contacts').delete().eq('id', id)
  return all
}

// ─── Page Content ─────────────────────────────────────────────────────────────
const defaultPages = {
  hero: {
    headline: 'Christopher\nAkpoguma',
    subtitle: 'Product Designer turning complex ideas into interfaces people actually finish using. Four years across real estate, fintech, events, and consumer apps — with a specialty in Framer for production-ready prototypes and web.',
    focus: 'Product design · Framer development',
    openTo: 'Full-time · Contract · Select freelance',
    cvUrl: '',
    topImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=1200&fit=crop',
    topImageFocus: { x: 50, y: 50 },
    bottomImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop',
    bottomImageFocus: { x: 50, y: 50 },
  },
  about: {
    heading: 'The Design Poet — with a straight job.',
    bio: `I am Christopher /kris+tuh+fuh/ — a Product Designer with a hunger for turning simple and complex ideas into engaging experiences.\n\nMy journey was set on the grounds of curiosity and a drive to modernise digital products. Along the way I have contributed my skills to over 15 projects across real estate, fintech, events, fashion, and travel.\n\nBeyond the pixels, I see design as a means of communicating what my mind dreams into what the user requires. I care how a button feels, but I care more about why someone needs the button at all.`,
    photo: 'https://framerusercontent.com/images/JHDEnCL7px098imQz7F1WCGe8.jpg?width=1152&height=2047',
  },
  contact: {
    heading: `Let's build\nsomething worth\nthe pixels.`,
    description: 'Working from Lagos with teams globally. Responses within 24 hours on weekdays. If you need a quick brief or a long collaboration — either door is open.',
    email: 'akpogumachristopher@gmail.com',
    linkedin: 'https://linkedin.com/in/christopher-akpoguma',
    twitter: 'https://twitter.com/',
    dribbble: 'https://dribbble.com/',
  },
}

export function getPageContent(page) {
  return lsGet(PAGES_KEY, defaultPages)[page] || defaultPages[page] || {}
}

export function savePageContent(page, content) {
  const all = lsGet(PAGES_KEY, defaultPages)
  all[page] = content
  lsSet(PAGES_KEY, all)
  dbSet(PAGES_KEY, all)
  return all
}

// ─── Contact Gallery ──────────────────────────────────────────────────────────
const defaultGallery = [
  { id: '1', type: 'image', src: 'https://framerusercontent.com/images/3C0VOTTkKKwN2ontWnhZfDoAbzI.png?width=1722&height=2084', poster: '', caption: 'Landmark Citizen App' },
  { id: '2', type: 'image', src: 'https://framerusercontent.com/images/HdRijaIyFVF9IsZtaToNSjQZliE.png?width=904&height=1200', poster: '', caption: 'Pixel Pulse Identity' },
  { id: '3', type: 'image', src: 'https://framerusercontent.com/images/JHDEnCL7px098imQz7F1WCGe8.jpg?width=1152&height=2047', poster: '', caption: '' },
  { id: '4', type: 'image', src: 'https://framerusercontent.com/images/9rxzSGbFPzINONwbQL9Fckii4Qc.webp?width=1134&height=893', poster: '', caption: 'We Are Wear' },
  { id: '5', type: 'image', src: 'https://framerusercontent.com/images/lR97iC7TvTLzZJIa88VIn4qKw.webp?width=1920&height=1072', poster: '', caption: 'FlySmart Platform' },
  { id: '6', type: 'image', src: '/images/landmark-events/Events.webp', poster: '', caption: 'Landmark Events' },
  { id: '7', type: 'image', src: 'https://framerusercontent.com/images/A96w4ZpC5F1QA39OE7wySL4yBg4.webp?width=2400&height=1800', poster: '', caption: 'Landmark Citizen App' },
]

export function getContactGallery() { return lsGet(GALLERY_KEY, defaultGallery) }
export function saveContactGallery(items) {
  lsSet(GALLERY_KEY, items)
  dbSet(GALLERY_KEY, items)
  return items
}

// ─── Beyond Pixels ────────────────────────────────────────────────────────────
const defaultBeyond = [
  { id: '1', label: 'Manchester United', image: 'https://framerusercontent.com/images/dv6sGlBIamdjK4SL6YPpBLpToo.webp?width=1080&height=1920', video: '' },
  { id: '2', label: 'Writing', image: 'https://framerusercontent.com/images/ZHIt9YIFYeLBu2dJ8cKcoboQ.webp?width=736&height=1308', video: '' },
  { id: '3', label: 'Singing', image: 'https://framerusercontent.com/images/O5WZbSaRHIZXN5o8Lj0icnsV8I.png?width=1080&height=1920', video: 'https://framerusercontent.com/assets/HiUkiCE55FsErhCY7E864g2WhxE.mp4' },
  { id: '4', label: 'Cinema', image: 'https://framerusercontent.com/images/JHDEnCL7px098imQz7F1WCGe8.jpg?width=1152&height=2047', video: 'https://framerusercontent.com/assets/Qleydm67MhORDaXzrJz3w3Am95Q.mp4' },
]

export function getBeyondPixels() { return lsGet(BEYOND_KEY, defaultBeyond) }
export function saveBeyondPixels(items) {
  lsSet(BEYOND_KEY, items)
  dbSet(BEYOND_KEY, items)
  return items
}
