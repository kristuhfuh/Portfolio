import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { normalizeDriveUrl } from '../lib/cms.js'

const inputCls = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#141414] outline-none transition-colors placeholder:text-[#141414]/30 focus:border-[#6D28D9]/50 focus:ring-2 focus:ring-[#6D28D9]/8'

async function uploadToSupabase(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const filename = `${Date.now()}-${base}.${ext}`
  const { error } = await supabase.storage.from('media').upload(filename, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(filename)
  return data.publicUrl
}

export default function MediaUpload({
  value = '',
  onChange,
  label = 'Media',
  accept = 'image/*',  // 'image/*' or 'video/*'
}) {
  const [tab, setTab]         = useState('url')
  const [urlInput, setUrlInput] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState('')
  const fileRef = useRef(null)

  const isImage = accept.includes('image')
  const isVideo = accept.includes('video')

  const applyUrl = (raw) => {
    const cleaned = raw.trim()
    if (!cleaned) return
    const normalized = cleaned.includes('drive.google.com') ? normalizeDriveUrl(cleaned) : cleaned
    onChange(normalized)
    setUrlInput(normalized)
    setError('')
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    setProgress(10)

    try {
      // Fake progress ticks while upload is in flight
      const ticker = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 400)
      const url = await uploadToSupabase(file)
      clearInterval(ticker)
      setProgress(100)
      onChange(url)
      setUrlInput(url)
      setTimeout(() => setProgress(0), 800)
    } catch (err) {
      setError(`Upload failed: ${err.message}`)
      setProgress(0)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const tabs = [
    { id: 'url',   label: 'URL' },
    { id: 'drive', label: 'Google Drive' },
    { id: 'file',  label: 'Upload file' },
  ]

  return (
    <div className="space-y-3">
      {/* Tab strip */}
      <div className="flex gap-1 rounded-lg border border-black/8 bg-[#f5f3ee] p-1">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition-all ${
              tab === t.id
                ? 'bg-white text-[#141414] shadow-sm'
                : 'text-[#141414]/40 hover:text-[#141414]/70'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input className={inputCls} value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder={isImage ? 'https://example.com/photo.jpg' : 'https://example.com/video.mp4'}
            onKeyDown={e => e.key === 'Enter' && applyUrl(urlInput)} />
          <button type="button" onClick={() => applyUrl(urlInput)}
            className="shrink-0 rounded-xl bg-[#141414] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9] transition-colors">
            Apply
          </button>
        </div>
      )}

      {tab === 'drive' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input className={inputCls} value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://drive.google.com/file/d/..." />
            <button type="button" onClick={() => applyUrl(urlInput)}
              className="shrink-0 rounded-xl bg-[#141414] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9] transition-colors">
              Apply
            </button>
          </div>
          <p className="text-[11px] text-[#141414]/40">Share file → "Anyone with the link" → paste here.</p>
        </div>
      )}

      {tab === 'file' && (
        <div>
          <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-black/10 bg-[#f5f3ee] px-4 py-8 text-center transition-colors hover:border-[#6D28D9]/40 hover:bg-[#6D28D9]/4 ${uploading ? 'pointer-events-none opacity-70' : ''}`}>
            <input ref={fileRef} type="file" accept={accept} onChange={handleFile}
              disabled={uploading} className="sr-only" />
            {uploading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#141414]/10 border-t-[#6D28D9]" />
                <p className="text-sm text-[#141414]/50">Uploading…</p>
                {progress > 0 && (
                  <div className="w-full max-w-[200px] overflow-hidden rounded-full bg-black/8 h-1.5">
                    <div className="h-full rounded-full bg-[#6D28D9] transition-all duration-300"
                      style={{ width: `${progress}%` }} />
                  </div>
                )}
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" className="text-[#141414]/30">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-[#141414]">
                    Click to upload {isImage ? 'image' : 'video'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#141414]/40">
                    {isImage ? 'JPG, PNG, WebP, GIF' : 'MP4, WebM, MOV'}
                  </p>
                </div>
              </>
            )}
          </label>
          {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative overflow-hidden rounded-xl border border-black/8">
          {isVideo && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov') || value.includes('video')) ? (
            <video src={value} className="h-28 w-full object-cover" muted playsInline />
          ) : (
            <img src={value} alt="" className="h-28 w-full object-cover" />
          )}
          <button type="button" onClick={() => { onChange(''); setUrlInput('') }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
