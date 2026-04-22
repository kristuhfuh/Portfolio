import { projects as staticProjects } from '../data/projects.js'

const PROJECTS_KEY = 'cms_projects'
const CONTACTS_KEY = 'cms_contacts'
const PAGES_KEY = 'cms_pages'
const BEYOND_KEY = 'cms_beyond_pixels'

// ─── Helpers ───
function get(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

// ─── Projects ───
const SCHEMA_VERSION = 'v2-story'
const VERSION_KEY = 'cms_schema_version'

export function getProjects() {
  const currentVersion = get(VERSION_KEY, null)
  if (currentVersion !== SCHEMA_VERSION) {
    // Schema bumped — reseed from static data so new fields (hook, outcomeStats, deliverables, reception, pullQuote) populate
    set(PROJECTS_KEY, staticProjects)
    set(VERSION_KEY, SCHEMA_VERSION)
    return staticProjects
  }
  const saved = get(PROJECTS_KEY, null)
  if (saved) return saved
  set(PROJECTS_KEY, staticProjects)
  return staticProjects
}
export function getProjectBySlug(slug) { return getProjects().find(p => p.slug === slug) }
export function saveProject(project) {
  const all = getProjects()
  const idx = all.findIndex(p => p.slug === project.slug)
  if (idx >= 0) all[idx] = project
  else all.push(project)
  set(PROJECTS_KEY, all)
  return all
}
export function deleteProject(slug) {
  const all = getProjects().filter(p => p.slug !== slug)
  set(PROJECTS_KEY, all)
  return all
}
export function toggleProjectVisibility(slug) {
  const all = getProjects()
  const project = all.find(p => p.slug === slug)
  if (project) {
    project.hidden = !project.hidden
    set(PROJECTS_KEY, all)
  }
  return all
}
export function reorderProjects(projects) { set(PROJECTS_KEY, projects); return projects }

// ─── Contacts ───
export function getContacts() { return get(CONTACTS_KEY, []) }
export function addContact(contact) {
  const all = getContacts()
  all.unshift({ ...contact, id: Date.now().toString(), date: new Date().toISOString(), read: false })
  set(CONTACTS_KEY, all)
  return all
}
export function markContactRead(id) {
  const all = getContacts().map(c => c.id === id ? { ...c, read: true } : c)
  set(CONTACTS_KEY, all)
  return all
}
export function deleteContact(id) {
  const all = getContacts().filter(c => c.id !== id)
  set(CONTACTS_KEY, all)
  return all
}

// ─── Page Content ───
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
export function getPageContent(page) { return get(PAGES_KEY, defaultPages)[page] || defaultPages[page] || {} }
export function savePageContent(page, content) {
  const all = get(PAGES_KEY, defaultPages)
  all[page] = content
  set(PAGES_KEY, all)
  return all
}

// ─── Beyond Pixels ───
const defaultBeyond = [
  {
    id: '1',
    label: 'Manchester United',
    image: 'https://framerusercontent.com/images/dv6sGlBIamdjK4SL6YPpBLpToo.webp?width=1080&height=1920',
    video: '',
  },
  {
    id: '2',
    label: 'Writing',
    image: 'https://framerusercontent.com/images/ZHIt9YIFYeLBu2dJ8cKcoboQ.webp?width=736&height=1308',
    video: '',
  },
  {
    id: '3',
    label: 'Singing',
    image: 'https://framerusercontent.com/images/O5WZbSaRHIZXN5o8Lj0icnsV8I.png?width=1080&height=1920',
    video: 'https://framerusercontent.com/assets/HiUkiCE55FsErhCY7E864g2WhxE.mp4',
  },
  {
    id: '4',
    label: 'Cinema',
    image: 'https://framerusercontent.com/images/JHDEnCL7px098imQz7F1WCGe8.jpg?width=1152&height=2047',
    video: 'https://framerusercontent.com/assets/Qleydm67MhORDaXzrJz3w3Am95Q.mp4',
  },
]
export function getBeyondPixels() { return get(BEYOND_KEY, defaultBeyond) }
export function saveBeyondPixels(items) { set(BEYOND_KEY, items); return items }
