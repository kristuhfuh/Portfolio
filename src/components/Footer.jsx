import LocalTime from './LocalTime.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line py-10 dark:border-dark-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="label text-muted dark:text-dark-muted">
          © {new Date().getFullYear()} Christopher Akpoguma · /kris+tuh+fuh/
        </div>
        <div className="flex items-center gap-6">
          <LocalTime />
          <span className="label text-muted dark:text-dark-muted">
            Set in Fraunces + Inter Tight
          </span>
        </div>
      </div>
    </footer>
  )
}
