import LocalTime from './LocalTime.jsx'
import { Burst } from './DesignMarks.jsx'
import { getPageContent } from '../lib/cms.js'

export default function Footer() {
  const content = getPageContent('site')
  return (
    <footer className="poet-footer">
      <div className="footer-top"><span>© {new Date().getFullYear()} {content.copyrightName}</span><span>{content.footerNote}</span><LocalTime city={content.timeCity} tz={content.timeZone} /><a href="#main-content">{content.backToTop} ↑</a></div>
      <div className="footer-wordmark" aria-hidden="true">{content.footerWordmark}<Burst /></div>
    </footer>
  )
}
