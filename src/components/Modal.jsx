import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ children, onClose, label, className = '' }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    const dialog = ref.current
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(
    <dialog ref={ref} className={`poet-dialog ${className}`} aria-label={label} onCancel={e => { e.preventDefault(); closeRef.current() }} onClick={e => {
      if (e.target !== e.currentTarget) return
      const box = e.currentTarget.getBoundingClientRect()
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) closeRef.current()
    }}>
      <button type="button" className="dialog-close" aria-label="Close" autoFocus onClick={onClose}>×</button>
      {children}
    </dialog>, document.body,
  )
}
