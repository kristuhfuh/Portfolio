import Hero from '../components/Hero.jsx'
import Marquee from '../components/Marquee.jsx'
import Statement from '../components/Statement.jsx'
import Work from '../components/Work.jsx'
import OtherDesigns from '../components/OtherDesigns.jsx'
import Process from '../components/Process.jsx'
import Experience from '../components/Experience.jsx'
import About from '../components/About.jsx'
import BeyondPixels from '../components/BeyondPixels.jsx'
import WorkGallery from '../components/ContactGallery.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <Work />
      <OtherDesigns />
      <Process />
      <Experience />
      <About />
      <BeyondPixels />
      <WorkGallery />
      <Contact />
    </>
  )
}
