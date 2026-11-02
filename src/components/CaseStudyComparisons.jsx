export default function CaseStudyComparisons({ items }) {
  if (!items?.length) return null
  return (
    <section className="case-comparisons" aria-labelledby="comparisons-heading">
      <div className="comparisons-intro"><p className="eyebrow">Before / After</p><h2 id="comparisons-heading">What changed<br />in the build.</h2><p>Implementation observations and an internal design review. The project is in development and testing.</p></div>
      <div className="comparison-items">{items.map(item => <article className="comparison-item" key={item.label}><h3>{item.label}</h3><dl><div><dt>Before</dt><dd>{item.before}</dd></div><div><dt>After</dt><dd>{item.after}</dd></div></dl><p>{item.note}</p></article>)}</div>
    </section>
  )
}
