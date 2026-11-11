export default function AvailabilityBadge({ className = '', label = 'Available for work' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="label text-muted dark:text-dark-muted">{label}</span>
    </div>
  )
}
