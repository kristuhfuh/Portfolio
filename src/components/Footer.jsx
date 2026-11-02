import LocalTime from './LocalTime.jsx'
import { Burst } from './DesignMarks.jsx'

export default function Footer() {
  return (
    <footer className="poet-footer">
      <div className="footer-top"><span>© {new Date().getFullYear()} Christopher Akpoguma</span><span>Made with feeling, in Lagos.</span><LocalTime /><a href="#main-content">Back to top ↑</a></div>
      <div className="footer-wordmark" aria-hidden="true">the design poet<Burst /></div>
    </footer>
  )
}
