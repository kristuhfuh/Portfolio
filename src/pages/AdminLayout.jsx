import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { getContacts } from '../lib/cms.js'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', end: true },
  { to: '/admin/projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/admin/pages', label: 'Page Content', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { to: '/admin/contacts', label: 'Contacts', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const unread = getContacts().filter(c => !c.read).length

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-dark-bg [&_*]:!cursor-auto">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-white/70 backdrop-blur-xl dark:border-dark-line dark:bg-white/[0.02]">
        <div className="flex items-center gap-3 border-b border-line px-6 py-5 dark:border-dark-line">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" className="fill-ink dark:fill-cream" />
            <text x="16" y="22" fontFamily="Fraunces, serif" fontSize="18" fontWeight="500" textAnchor="middle" className="fill-cream dark:fill-ink">C</text>
            <circle cx="24" cy="8" r="3" fill="#6D28D9" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-ink dark:text-dark-ink">Portfolio CMS</div>
            <div className="text-xs text-muted dark:text-dark-muted">Content Manager</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 font-medium text-accent'
                    : 'text-muted hover:bg-line/50 hover:text-ink dark:text-dark-muted dark:hover:bg-dark-line/50 dark:hover:text-dark-ink'
                }`
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
              {item.label === 'Contacts' && unread > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-cream">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4 dark:border-dark-line">
          <div className="mb-3 truncate text-xs text-muted dark:text-dark-muted">{user?.email}</div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noreferrer"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-xs text-muted transition-colors hover:bg-line/50 dark:border-dark-line dark:text-dark-muted">
              View Site
            </a>
            <button onClick={handleLogout}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:border-dark-line dark:hover:bg-red-900/20">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex min-h-screen flex-col">
        <div className="flex-1 p-8">
          <Outlet />
        </div>
        <footer className="border-t border-line px-8 py-4 dark:border-dark-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted dark:text-dark-muted">© {new Date().getFullYear()} Christopher Akpoguma · Portfolio CMS</span>
            <a href="/" target="_blank" rel="noreferrer" className="text-xs text-muted transition-colors hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink">
              View live site ↗
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
