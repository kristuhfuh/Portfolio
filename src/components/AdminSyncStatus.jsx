import { useSyncExternalStore } from 'react'
import { getCMSSyncState, subscribeCMSSync, retryFailedSaves } from '../lib/cms.js'

export default function AdminSyncStatus() {
  const state = useSyncExternalStore(subscribeCMSSync, getCMSSyncState)
  const label = state.pending ? 'Saving…' : state.failed ? 'Saved locally' : state.lastSavedAt ? 'All changes synced' : 'Ready to edit'
  return <div className={`admin-sync ${state.failed ? 'has-error' : ''}`}><span className="admin-sync-dot" /><span role="status" aria-live="polite">{label}</span>{state.failed > 0 && !state.pending && <button type="button" onClick={retryFailedSaves}>Retry sync</button>}</div>
}
