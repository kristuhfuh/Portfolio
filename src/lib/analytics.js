import { supabase } from './supabase.js'

const SESSION_KEY = 'portfolio_sid'

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

// Cache location per session to avoid hitting the API on every page change
const LOC_KEY = 'portfolio_loc'
async function getLocation() {
  const cached = sessionStorage.getItem(LOC_KEY)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through */ }
  }
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    const d = await res.json()
    const loc = { ip: d.ip, country: d.country_name, city: d.city, region: d.region }
    sessionStorage.setItem(LOC_KEY, JSON.stringify(loc))
    return loc
  } catch {
    return {}
  }
}

export async function trackPageView(page) {
  if (page.startsWith('/admin')) return

  const sid = getSessionId()
  const loc = await getLocation()

  supabase.from('page_views').insert({
    session_id: sid,
    page,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    screen_width: screen.width,
    screen_height: screen.height,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...loc,
  }).then(({ error }) => {
    if (error) console.warn('[analytics] page_view insert failed:', error.message)
  })

  if (window.gtag) {
    window.gtag('event', 'page_view', { page_path: page })
  }
}

export function trackClick(element, page) {
  if (page?.startsWith('/admin')) return

  const sid = getSessionId()
  supabase.from('click_events').insert({
    session_id: sid,
    element,
    page: page || window.location.pathname,
  }).then(({ error }) => {
    if (error) console.warn('[analytics] click insert failed:', error.message)
  })

  if (window.gtag) {
    window.gtag('event', 'click', { element, page })
  }
}

// ─── Admin reads ───────────────────────────────────────────────────────────────

export async function fetchAnalytics() {
  const since = new Date()
  since.setDate(since.getDate() - 30)

  const [viewsRes, clicksRes] = await Promise.all([
    supabase
      .from('page_views')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false }),
    supabase
      .from('click_events')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false }),
  ])

  const views = viewsRes.data || []
  const clicks = clicksRes.data || []

  const today = new Date().toDateString()
  const viewsToday = views.filter(v => new Date(v.created_at).toDateString() === today).length

  const uniqueVisitors = new Set(views.map(v => v.session_id)).size

  const pageCounts = {}
  for (const v of views) {
    pageCounts[v.page] = (pageCounts[v.page] || 0) + 1
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }))

  const clickCounts = {}
  for (const c of clicks) {
    clickCounts[c.element] = (clickCounts[c.element] || 0) + 1
  }
  const topClicks = Object.entries(clickCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([element, count]) => ({ element, count }))

  return {
    totalViews: views.length,
    viewsToday,
    uniqueVisitors,
    topPages,
    topClicks,
    recent: views.slice(0, 8),
  }
}
