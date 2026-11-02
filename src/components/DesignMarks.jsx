export function Arrow({ className = '', ...props }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Burst({ className = '', ...props }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI) / 12 - Math.PI / 2
    const radius = i % 2 === 0 ? 49 : 25
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`
  }).join(' ')
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}>
      <polygon points={points} />
    </svg>
  )
}
