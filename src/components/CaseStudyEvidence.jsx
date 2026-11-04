import { caseStudyEvidence } from '../data/caseStudyEvidence.js'

export default function CaseStudyEvidence({ slug }) {
  const items = caseStudyEvidence[slug]
  if (!items?.length) return null
  return (
    <section className="case-chapters case-evidence-trail" aria-labelledby="evidence-heading">
      <div className="case-section-intro">
        <p className="eyebrow">Decisions and validation</p>
        <h2 id="evidence-heading">From evidence<br /><em>to a design decision.</em></h2>
      </div>
      {items.map((item, index) => (
        <div className="case-chapter" key={item.title}>
          <div className="case-chapter-heading"><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3></div>
          <dl className="case-evidence-steps">
            <div><dt>Evidence available</dt><dd>{item.evidence}</dd></div>
            <div><dt>The design decision</dt><dd>{item.decision}</dd></div>
            <div><dt>Validation and limits</dt><dd>{item.validation}</dd></div>
          </dl>
        </div>
      ))}
    </section>
  )
}
