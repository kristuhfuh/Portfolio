import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from '../lib/theme.jsx'
import { getPageContent } from '../lib/cms.js'
import { Arrow, Burst } from './DesignMarks.jsx'
import Modal from './Modal.jsx'

export default function Nav() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const home = pathname === '/'
  const email = getPageContent('contact').email
  const content = getPageContent('site')
  const links = [{ href: '#work', label: content.workNav }, { href: '#about', label: content.personNav }, { href: '#experience', label: content.experienceNav }, { href: '#contact', label: content.contactNav }]
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => setMenuOpen(false), [pathname])
  return (
    <>
      <header className={`poet-nav ${home && !scrolled ? 'on-purple' : ''}`}>
        <div className="poet-nav-inner"><Link to="/" className="poet-brand" aria-label={`${content.copyrightName} — home`}><Burst /><span>{content.brand}<span className="brand-dot">.</span></span></Link>
          <nav className="desktop-navigation" aria-label="Main navigation">{home ? links.map(link => <a key={link.href} href={link.href}>{link.label}</a>) : <Link to="/">← {content.backNav}</Link>}</nav>
          <div className="nav-actions"><button type="button" className="theme-switch" onClick={toggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}><span aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span></button><a className="nav-hello" href={`mailto:${email}`}>{content.talkLabel} <Arrow /></a><button type="button" className="menu-trigger" aria-label="Open navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span /><span /></button></div>
        </div><motion.div className="nav-progress" style={{ scaleX }} />
      </header>
      {menuOpen && <Modal onClose={() => setMenuOpen(false)} label="Navigation" className="navigation-dialog"><p className="eyebrow">{content.menuGreeting}</p><nav aria-label="Mobile navigation">{links.map((link, index) => <a href={home ? link.href : `/${link.href}`} key={link.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{link.label}<Arrow /></a>)}</nav><a className="menu-email" href={`mailto:${email}`}>{email}</a><Burst className="menu-burst" /></Modal>}
    </>
  )
}
