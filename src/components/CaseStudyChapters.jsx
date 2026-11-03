import { motion } from 'framer-motion'
import { formatCaseStudyText } from '../lib/caseStudyText.js'
import CaseStudyMedia from './CaseStudyMedia.jsx'

export default function CaseStudyChapters({ chapters, title }) {
  if (!chapters?.length) return null
  return <section id="process" className="case-chapters case-prose"><div className="case-section-intro"><p className="eyebrow">The thinking behind the interface</p><h2>A few decisions.<br /><span>A bigger picture.</span></h2></div><div>{chapters.map((chapter, index) => <motion.article key={`${chapter.title}-${index}`} className="case-chapter" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-5%' }} transition={{ duration: 0.5 }}><div className="case-chapter-heading"><span>{chapter.number || String(index + 1).padStart(2, '0')}</span><h3>{chapter.title}</h3></div><div className="case-chapter-body"><div dangerouslySetInnerHTML={{ __html: formatCaseStudyText(chapter.body) }} />{chapter.takeaway && <p className="case-chapter-takeaway"><span>Design choice</span>{chapter.takeaway}</p>}</div>{(chapter.image || chapter.video) && <div className="case-chapter-visual"><CaseStudyMedia src={chapter.video || chapter.image} type={chapter.video ? 'video' : 'image'} title={`${title} — ${chapter.title}`} caption={chapter.caption} /></div>}</motion.article>)}</div></section>
}
