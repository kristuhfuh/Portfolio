import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { getContacts } from '../lib/cms.js'

const nav = [
  {
    to: '/admin', end: true, label: 'Overview',
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  },
  {
    to: '/admin/projects', label: 'Projects',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  },
  {
    to: '/admin/pages', label: 'Page Content',
    icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
  },
  {
    to: '/admin/contacts', label: 'Messages',
    icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>,
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const unread = getContacts().filter(c => !c.read).length

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const sectionTitle = nav.find(n => n.end ? pathname === n.to : pathname.startsWith(n.to))?.label ?? 'Admin'

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] [&_*]:!cursor-auto" style={{ fontFamily: "'Geist Sans', sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#141414]">

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
              className="text-lg text-white leading-none">C</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#6D28D9] ring-2 ring-[#141414]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Christopher</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>CMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 transition-colors ${isActive ? 'text-[#a78bfa]' : 'text-white/50 group-hover:text-white/80'}`}>
                    {item.icon}
                  </svg>
                  <span>{item.label}</span>
                  {item.label === 'Messages' && unread > 0 && (
                    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6D28D9] px-1.5 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-6 space-y-2">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white/90">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View live site
          </a>

          <div className="mx-3 border-t border-white/8" />

          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6D28D9] text-[11px] font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? 'C'}
            </div>
            <span className="min-w-0 flex-1 truncate text-xs text-white/60">{user?.email}</span>
            <button onClick={handleLogout} title="Sign out"
              className="shrink-0 text-white/50 transition-colors hover:text-red-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/6 bg-[#f5f3ee]/90 px-8 py-4 backdrop-blur">
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
            className="text-xl text-[#141414] tracking-tight">{sectionTitle}</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-[#141414]/60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
