import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './lib/theme.jsx'
import { AuthProvider, useAuth } from './lib/auth.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

// Lazy-loaded — reduces initial bundle by ~40%
const CaseStudy    = lazy(() => import('./pages/CaseStudy.jsx'))
const AdminLogin   = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminLayout  = lazy(() => import('./pages/AdminLayout.jsx'))
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard.jsx'))
const AdminProjects   = lazy(() => import('./pages/AdminProjects.jsx').then(m => ({ default: m.AdminProjects })))
const AdminProjectEdit = lazy(() => import('./pages/AdminProjects.jsx').then(m => ({ default: m.AdminProjectEdit })))
const AdminPages      = lazy(() => import('./pages/AdminPages.jsx'))
const AdminContacts   = lazy(() => import('./pages/AdminContacts.jsx'))

function Spin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-dark-bg">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent dark:border-dark-line dark:border-t-accent" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/admin" replace />
  return children
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Suspense fallback={<Spin />}>
        <Routes>
          <Route path="/admin/login" element={<PublicOnlyRoute><AdminLogin /></PublicOnlyRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:slug" element={<AdminProjectEdit />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div className="grain min-h-screen bg-cream text-ink transition-colors dark:bg-dark-bg dark:text-dark-ink">
      <PageLoader />
      <CustomCursor />
      <Nav />
      <main>
        <Suspense fallback={<Spin />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
