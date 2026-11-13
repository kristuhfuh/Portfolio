import { projects as staticProjects } from '../data/projects.js'
import { homepageDefaults } from '../data/homepageContent.js'
import { supabase } from './supabase.js'
import { normalizeContact } from './contact.js'

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

// ─── Pending saves counter (used by AdminLayout to warn on tab close) ─────────
export let pendingSaves = 0
const syncListeners = new Set()
const savedFailedKeys = lsGet('cms_failed_write_keys', [])
const failedWrites = new Map((Array.isArray(savedFailedKeys) ? savedFailedKeys : []).filter(key => typeof key === 'string' && key.startsWith('cms_')).map(key => [key, lsGet(key, null)]).filter(([, value]) => value !== null))
const writeQueues = new Map()
let syncSnapshot = { pending: 0, failed: failedWrites.size, lastSavedAt: null }
export const getCMSSyncState = () => syncSnapshot
export function subscribeCMSSync(listener) { syncListeners.add(listener); return () => syncListeners.delete(listener) }
function emitSync(lastSavedAt = syncSnapshot.lastSavedAt) {
  try {
    if (failedWrites.size) lsSet('cms_failed_write_keys', [...failedWrites.keys()])
    else localStorage.removeItem('cms_failed_write_keys')
  } catch { /* Cloud saves should still finish if browser storage is unavailable. */ }
  syncSnapshot = { pending: pendingSaves, failed: failedWrites.size, lastSavedAt }
  syncListeners.forEach(listener => listener())
}
export async function retryFailedSaves() {
  return Promise.all([...failedWrites.entries()].map(([key, value]) => dbSet(key, value)))
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
  const value = JSON.parse(JSON.stringify(val))
  const ts = Date.now()
  localStorage.setItem(`${key}_ts`, ts)
  pendingSaves++
  emitSync()
  const task = (writeQueues.get(key) || Promise.resolve()).then(async () => {
    try {
      const { error } = await supabase.from('settings').upsert(
        [{ key, value }, { key: `${key}_ts`, value: ts }], { onConflict: 'key' },
      )
      if (error) throw error
      failedWrites.delete(key)
      return true
    } catch {
      failedWrites.set(key, value)
      return false
    } finally {
      pendingSaves--
      emitSync(failedWrites.has(key) ? syncSnapshot.lastSavedAt : Date.now())
    }
  })
  writeQueues.set(key, task)
  task.finally(() => { if (writeQueues.get(key) === task) writeQueues.delete(key) })
  return task
}

// ─── Boot: pull latest data from Supabase into localStorage ───────────────────
export async function initCMS() {
  try {
    const contentKeys = ['cms_projects', 'cms_pages', 'cms_beyond_pixels', 'cms_contact_gallery', 'cms_other_designs', 'cms_projects_backup_index']
    const result = await Promise.race([
      supabase.from('settings').select('key, value').in('key', contentKeys.flatMap(key => [key, `${key}_ts`])),
      new Promise(resolve => setTimeout(() => resolve({ data: null, error: 'timeout' }), 4000)),
    ])
    const { data, error } = result
    if (error) { console.warn('[Supabase] read failed:', error); return }
    if (!data) return

    // Build a map of all remote values (including _ts timestamp keys)
    const remote = {}
    data.forEach(({ key, value }) => { remote[key] = value })

    Object.keys(remote).forEach(key => {
      if (key.endsWith('_ts')) return // handled via the data key loop
      const remoteTs = typeof remote[`${key}_ts`] === 'number' ? remote[`${key}_ts`] : -1
      const localTs = Number(localStorage.getItem(`${key}_ts`) || -1)
      // Only overwrite local data if Supabase has an equal or newer version.
      // This prevents a stale Supabase copy from clobbering a fresh local save
      // when the Supabase sync previously failed.
      if (remoteTs >= localTs) {
        lsSet(key, remote[key])
        if (remoteTs > 0) localStorage.setItem(`${key}_ts`, remoteTs)
      }
    })
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
const SCHEMA_VERSION = 'v6'

// ─── Snapshot safeguard ──────────────────────────────────────────────────────
// Any migration that is about to mutate cms_projects first snapshots the current
// state to both localStorage and Supabase under a timestamped key. If a migration
// goes wrong (eg a force-reset wipes admin edits), restoreProjectBackup(key) can
// put it back. Snapshots are not auto-pruned - they are small and recovery matters
// more than storage neatness.
function snapshotProjectsBeforeMigration(saved) {
  if (!saved || !saved.length) return
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupKey = `cms_projects_backup_${timestamp}`
  try {
    lsSet(backupKey, saved)
    // Fire-and-forget - if Supabase sync fails the localStorage copy still exists.
    dbSet(backupKey, saved)
    // Append to the local index so listProjectBackups can enumerate them.
    const index = lsGet('cms_projects_backup_index', [])
    index.push({ key: backupKey, timestamp, size: saved.length })
    lsSet('cms_projects_backup_index', index)
    dbSet('cms_projects_backup_index', index)
    // eslint-disable-next-line no-console
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[CMS] snapshot failed:', e)
  }
}

export function listProjectBackups() {
  return lsGet('cms_projects_backup_index', [])
}

// Restore a specific backup. Writes the backup's data to cms_projects
// (both local and Supabase) with a fresh timestamp so initCMS doesn't
// overwrite it on the next page load.
export async function restoreProjectBackup(backupKey) {
  const data = lsGet(backupKey, null) || await dbGet(backupKey)
  if (!data) throw new Error(`Backup not found: ${backupKey}`)
  lsSet(PROJECTS_KEY, data)
  const cloudSynced = await dbSet(PROJECTS_KEY, data)
  return { restored: data.length, cloudSynced }
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export function getProjects() {
  const currentVersion = lsGet(VERSION_KEY, null)
  const saved = lsGet(PROJECTS_KEY, null)
  // Public reads never save defaults or migrations back to the cloud.
  const projects = Array.isArray(saved) ? saved : staticProjects
  return projects.map(project => currentVersion !== SCHEMA_VERSION
    ? { ...staticProjects.find(item => item.slug === project.slug), ...project }
    : { ...project })
}

export function getProjectBySlug(slug) { return getProjects().find(p => p.slug === slug) }

export async function saveProject(project, { originalSlug = project.slug } = {}) {
  if (!String(project.title || '').trim()) throw new Error('Give the case study a title before saving.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || project.slug === 'new') throw new Error('Use a URL name with lowercase letters, numbers, and single hyphens.')
  const all = getProjects()
  const idx = all.findIndex(p => p.slug === originalSlug)
  if (all.some((p, i) => p.slug === project.slug && i !== idx)) throw new Error('That URL name is already used by another case study.')
  if (lsGet(VERSION_KEY, null) !== SCHEMA_VERSION) snapshotProjectsBeforeMigration(lsGet(PROJECTS_KEY, null))
  if (idx >= 0) all[idx] = project
  else all.push(project)
  lsSet(PROJECTS_KEY, all)
  lsSet(VERSION_KEY, SCHEMA_VERSION)
  const cloudSynced = await dbSet(PROJECTS_KEY, all)
  return { data: all, cloudSynced }
}

export async function deleteProject(slug) {
  const all = getProjects().filter(p => p.slug !== slug)
  lsSet(PROJECTS_KEY, all)
  const cloudSynced = await dbSet(PROJECTS_KEY, all)
  return { data: all, cloudSynced }
}

export async function toggleProjectVisibility(slug) {
  const all = getProjects().map(project => project.slug === slug ? { ...project, hidden: !project.hidden } : project)
  lsSet(PROJECTS_KEY, all)
  const cloudSynced = await dbSet(PROJECTS_KEY, all)
  return { data: all, cloudSynced }
}

export function reorderProjects(projects) {
  lsSet(PROJECTS_KEY, projects)
  dbSet(PROJECTS_KEY, projects)
  return projects
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export function getContacts() { return lsGet(CONTACTS_KEY, []) }

export async function addContact(contact) {
  const cleaned = normalizeContact(contact)
  if (!cleaned.name || !cleaned.email || !cleaned.message) throw new Error('Please add your name, email, and message.')
  const entry = { ...cleaned, date: new Date().toISOString(), read: false }
  // Write to Supabase contacts table
  const { error } = await supabase.from('contacts').insert({
    name:    entry.name,
    email:   entry.email,
    message: entry.message,
  })
  if (error) throw new Error('Your message could not be delivered. Please try again or email me directly.')
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
  if (error) throw new Error('Messages could not be loaded. Your cached messages are still available.')
  if (!data) return []
  lsSet(CONTACTS_KEY, data)
  return data
}

export async function markContactRead(id) {
  const { error } = await supabase.from('contacts').update({ read: true }).eq('id', id)
  if (error) throw new Error('The read status was not saved. Try opening this message again.')
  const all = getContacts().map(c => c.id === id ? { ...c, read: true } : c)
  lsSet(CONTACTS_KEY, all)
  window.dispatchEvent(new Event('cms-contacts-changed'))
  return all
}

export async function deleteContact(id) {
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error('The message could not be deleted. Please try again.')
  const all = getContacts().filter(c => c.id !== id)
  lsSet(CONTACTS_KEY, all)
  window.dispatchEvent(new Event('cms-contacts-changed'))
  return all
}

// ─── Page Content ─────────────────────────────────────────────────────────────
const defaultPages = {
  ...homepageDefaults,
  hero: {
    headline: 'Christopher Akpoguma',
    expression: 'Design you\ncan feel.',
    roleLabel: 'Product designer.',
    subtitle: "I’m a product designer connecting customer experiences with the operational tools behind them - from consumer apps and booking journeys to enterprise systems.",
    focus: 'Also building with Framer and AI.',
    openTo: 'Full-time · Contract · Select freelance',
    location: 'Lagos, NG', timezoneLabel: 'Working everywhere',
    workCta: 'Explore my work', cvLabel: 'Get my CV', scrollLabel: 'Take a little scroll',
    artImage: '/images/design-poet-art.svg', artCaption: 'A little outside the lines.',
    portraitDefault: 'Christopher, in real life.', portraitAlternate: 'A little less buttoned up.',
    portraitButtonLabel: "Show Christopher's other portrait",
    noteIntro: 'Made of', noteLineOne: 'curiosity', noteLineTwo: '& a little', noteLineThree: 'chaos.', sticker: '100%\nmyself.',
    cvUrl: '',
    topImage: '/images/hero-top.jpg',
    topImageFocus: { x: 50, y: 50 },
    bottomImage: '/images/hero-bottom.jpg',
    bottomImageFocus: { x: 50, y: 50 },
  },
  about: {
    heading: 'The Design Poet - with a straight job.',
    bio: `I am Christopher /kris+tuh+fuh/ - a Product Designer with a hunger for turning simple and complex ideas into engaging experiences.\n\nMy journey was set on the grounds of curiosity and a drive to modernise digital products. Along the way I have contributed my skills to over 15 projects across real estate, fintech, events, fashion, and travel.\n\nBeyond the pixels, I see design as a means of communicating what my mind dreams into what the user requires. I care how a button feels, but I care more about why someone needs the button at all.`,
    photo: '/images/hero-top.jpg',
    photoAlt: 'Christopher Akpoguma',
  },
  contact: {
    heading: `Let's build\nsomething worth\nthe pixels.`,
    description: 'Working from Lagos with teams globally. Responses within 24 hours on weekdays. If you need a quick brief or a long collaboration - either door is open.',
    email: 'akpogumachristopher@gmail.com',
    linkedin: 'https://linkedin.com/in/christopher-akpoguma',
    twitter: 'https://twitter.com/',
    dribbble: 'https://dribbble.com/',
    availabilityLabel: 'Available for work', submitLabel: 'Send Message',
    namePlaceholder: 'Your name', emailPlaceholder: 'Your email', messagePlaceholder: 'Your message',
    sendingLabel: 'Sending...', errorText: 'Your message couldn’t be delivered. Your text is still here - try again, or', emailFallbackLabel: 'email me directly',
    successHeading: 'Got it', successDescription: 'Message received. I reply to every enquiry within 24 hours on weekdays - usually faster.',
    workLinkLabel: 'View my work', anotherMessageLabel: 'Send another message',
    emailCta: 'Open to new work',
  },
}

export function getPageContent(page) {
  const defaults = defaultPages[page] || {}
  const saved = lsGet(PAGES_KEY, {})[page] || {}
  const result = { ...defaults, ...saved }
  // Earlier templates displayed newer copy than the values stored in the CMS.
  // Normalize only those old defaults so the editor shows what visitors see.
  if (page === 'hero') {
    if (result.headline === 'Christopher\nAkpoguma') result.headline = defaults.headline
    if (result.subtitle === 'I turn complex ideas into intuitive products. A little bold. A little unexpected. Always made for the person on the other side.' || result.subtitle?.startsWith('Product Designer turning complex ideas into interfaces people actually finish using.')) result.subtitle = defaults.subtitle
    if (result.focus === 'Product design · Framer development') result.focus = defaults.focus
  }
  return result
}

export async function savePageContent(page, content) {
  const all = lsGet(PAGES_KEY, defaultPages)
  all[page] = content
  lsSet(PAGES_KEY, all)
  const cloudSynced = await dbSet(PAGES_KEY, all)
  return { data: all, cloudSynced }
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
export async function saveContactGallery(items) {
  lsSet(GALLERY_KEY, items)
  const cloudSynced = await dbSet(GALLERY_KEY, items)
  return { data: items, cloudSynced }
}

// ─── Beyond Pixels ────────────────────────────────────────────────────────────
const defaultBeyond = [
  { id: '1', label: 'Manchester United', image: 'https://framerusercontent.com/images/dv6sGlBIamdjK4SL6YPpBLpToo.webp?width=1080&height=1920', video: '' },
  { id: '2', label: 'Writing', image: 'https://framerusercontent.com/images/ZHIt9YIFYeLBu2dJ8cKcoboQ.webp?width=736&height=1308', video: '' },
  { id: '3', label: 'Singing', image: 'https://framerusercontent.com/images/O5WZbSaRHIZXN5o8Lj0icnsV8I.png?width=1080&height=1920', video: 'https://framerusercontent.com/assets/HiUkiCE55FsErhCY7E864g2WhxE.mp4' },
  { id: '4', label: 'Cinema', image: 'https://framerusercontent.com/images/JHDEnCL7px098imQz7F1WCGe8.jpg?width=1152&height=2047', video: 'https://framerusercontent.com/assets/Qleydm67MhORDaXzrJz3w3Am95Q.mp4' },
]

export function getBeyondPixels() { return lsGet(BEYOND_KEY, defaultBeyond) }
export async function saveBeyondPixels(items) {
  lsSet(BEYOND_KEY, items)
  const cloudSynced = await dbSet(BEYOND_KEY, items)
  return { data: items, cloudSynced }
}

// ─── Other Designs ────────────────────────────────────────────────────────────
const OTHER_DESIGNS_KEY = 'cms_other_designs'
const defaultOtherDesigns = []

export function getOtherDesigns() { return lsGet(OTHER_DESIGNS_KEY, defaultOtherDesigns) }
export async function saveOtherDesigns(items) {
  lsSet(OTHER_DESIGNS_KEY, items)
  const cloudSynced = await dbSet(OTHER_DESIGNS_KEY, items)
  return { data: items, cloudSynced }
}
