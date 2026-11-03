import { useCallback, useEffect, useRef, useState } from 'react'

export function useEditorDraft(name, value, ready = true) {
  const key = `cms_editor_draft_${name}`
  const serialized = JSON.stringify(value)
  const baseline = useRef(null)
  const [revision, setRevision] = useState(0)
  const [recovery, setRecovery] = useState(null)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => { baseline.current = null; setRecovery(null) }, [key])
  useEffect(() => {
    if (!ready || baseline.current !== null) return
    baseline.current = serialized
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      if (saved?.value && JSON.stringify(saved.value) !== serialized) setRecovery(saved.value)
    } catch { /* A malformed local draft should not block the editor. */ }
    setRevision(current => current + 1)
  }, [ready, key, serialized])
  const dirty = ready && baseline.current !== null && serialized !== baseline.current
  useEffect(() => {
    if (!dirty) return
    const persist = () => { try { localStorage.setItem(key, JSON.stringify({ value: JSON.parse(serialized), updatedAt: Date.now() })); return true } catch { return false } }
    const timer = setTimeout(() => setStorageError(!persist()), 450)
    return () => { clearTimeout(timer); persist() }
  }, [key, serialized, dirty])
  useEffect(() => {
    if (!dirty) return
    let leaving = false
    const unload = event => { if (!leaving) { event.preventDefault(); event.returnValue = '' } }
    const navigate = event => {
      const link = event.target.closest?.('a[href]')
      if (!link || link.target === '_blank' || link.hasAttribute('download') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const destination = new URL(link.href, location.href)
      if (destination.pathname === location.pathname && destination.origin === location.origin) return
      if (!window.confirm('You have unsaved changes. Leave this editor? A local draft will be kept on this device.')) { event.preventDefault(); event.stopPropagation() }
      else leaving = true
    }
    window.addEventListener('beforeunload', unload)
    document.addEventListener('click', navigate, true)
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', navigate, true) }
  }, [dirty])
  const markSaved = useCallback(nextBaseline => {
    baseline.current = nextBaseline === undefined ? serialized : JSON.stringify(nextBaseline)
    try {
      if (serialized !== baseline.current) localStorage.setItem(key, JSON.stringify({ value: JSON.parse(serialized), updatedAt: Date.now() }))
      else localStorage.removeItem(key)
    } catch { setStorageError(true) }
    setRecovery(null); setRevision(current => current + 1)
  }, [key, serialized])
  const discardRecovery = () => { try { localStorage.removeItem(key) } catch {} setRecovery(null) }
  return { dirty, recovery, dismissRecovery: () => setRecovery(null), discardRecovery, markSaved, storageError, revision }
}
