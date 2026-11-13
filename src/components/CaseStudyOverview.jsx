import { getCaseStudyNotes } from '../data/caseStudyNotes.js'

export default function CaseStudyOverview({ project }) {
  const notes = getCaseStudyNotes(project)
  const facts = [
    ['The problem', notes.problem],
    ['My contribution', notes.contribution],
    ['The result', notes.result],
  ].filter(([, text]) => text)
  return (
    <section id="snapshot" className="case-snapshot" aria-labelledby="snapshot-heading">
      <div className="case-snapshot-header"><h2 id="snapshot-heading">The project,<br /><em>at a glance.</em></h2>{notes.audience && <div className="case-audience"><span>Designed for</span><p>{notes.audience}</p></div>}</div>
      <div className="case-snapshot-body"><dl>{facts.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>{notes.constraint && <p className="case-constraint"><strong>The constraint</strong>{notes.constraint}</p>}{notes.evidence && <p className="case-evidence"><strong>What the evidence supports</strong>{notes.evidence}</p>}{notes.strengths?.length > 0 && <ul className="case-strengths" aria-label="Skills demonstrated">{notes.strengths.map(strength => <li key={strength}>{strength}</li>)}</ul>}</div>
    </section>
  )
}
