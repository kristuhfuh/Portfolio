import { useEffect, useState } from 'react'

export default function LocalTime({ city = 'Lagos', tz = 'Africa/Lagos', className = '' }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now)
      setTime(formatted)
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [tz])

  return (
    <span className={`label text-muted dark:text-dark-muted tabular-nums ${className}`}>
      {city} {time}
    </span>
  )
}
