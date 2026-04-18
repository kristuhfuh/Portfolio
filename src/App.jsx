import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './lib/theme.jsx'
import { AuthProvider, useAuth } from './lib/auth.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { AdminProjects, AdminProjectEdit } from './pages/AdminProjects.jsx'
import AdminPages from './pages/AdminPages.jsx'
import AdminContacts from './pages/AdminContacts.jsx'

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
    )
  }

  return (
    <div className="grain min-h-screen bg-cream text-ink transition-colors dark:bg-dark-bg dark:text-dark-ink">
      <PageLoader />
      <CustomCursor />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<Home />} />
        </Routes>
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
