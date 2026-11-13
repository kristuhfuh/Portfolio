import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { getContacts, loadContacts, pendingSaves } from '../lib/cms.js'
import { Burst, Arrow } from '../components/DesignMarks.jsx'
import Modal from '../components/Modal.jsx'
import AdminSyncStatus from '../components/AdminSyncStatus.jsx'
import '../styles/admin.css'

const sections = [{ to: '/admin', end: true, label: 'Overview', number: '01' }, { to: '/admin/projects', label: 'Case studies', number: '02' }, { to: '/admin/pages', label: 'Page content', number: '03' }, { to: '/admin/contacts', label: 'Messages', number: '04' }]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [unread, setUnread] = useState(() => getContacts().filter(contact => !contact.read).length)
  useEffect(() => {
    const update = () => setUnread(getContacts().filter(contact => !contact.read).length)
    loadContacts().then(update).catch(() => {})
    window.addEventListener('cms-contacts-changed', update)
    return () => window.removeEventListener('cms-contacts-changed', update)
  }, [])
  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    const warn = event => { if (pendingSaves > 0) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [])
  const title = sections.find(section => section.end ? pathname === section.to : pathname.startsWith(section.to))?.label || 'Studio'
  function navigation() { return <nav aria-label="Portfolio administration">{sections.map(section => <NavLink key={section.to} to={section.to} end={section.end} onClick={() => setMenu(false)}><span>{section.number}</span>{section.label}{section.label === 'Messages' && unread > 0 && <b>{unread}</b>}</NavLink>)}</nav> }
  return <div className="admin-shell">
    <aside className="admin-sidebar"><NavLink to="/admin" className="admin-brand"><Burst /><span>christopher.<small>The portfolio studio</small></span></NavLink>{navigation()}<div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer">View portfolio <Arrow /></a><div className="admin-account"><span>{user?.email}</span><button type="button" onClick={() => { logout(); navigate('/admin/login') }}>Sign out</button></div></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><div><button className="admin-menu-trigger" aria-label="Open admin navigation" aria-expanded={menu} onClick={() => setMenu(true)}>☰</button><span className="admin-breadcrumb">Studio <span>/</span> <strong>{title}</strong></span></div><AdminSyncStatus /></header><main className="admin-main"><Outlet /></main><footer className="admin-workspace-footer"><span>A little care behind every pixel.</span><a href="/" target="_blank" rel="noreferrer">View portfolio ↗</a></footer></div>
    {menu && <Modal className="admin-navigation-dialog" label="Admin navigation" onClose={() => setMenu(false)}>{navigation()}<a href="/" target="_blank" rel="noreferrer">View portfolio ↗</a></Modal>}
  </div>
}
