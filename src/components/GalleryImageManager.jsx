import { useState, useRef } from 'react';
import { normalizeDriveUrl } from '../lib/cms.js';
import { supabase } from '../lib/supabase.js';

function convertDrive(raw) {
  return normalizeDriveUrl(raw);
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

// Extract all URLs from pasted text regardless of separator (newline, comma, space)
function extractUrls(text) {
  return (text.match(/https?:\/\/[^\s,]+/g) || [])
    .map(u => u.replace(/[,;.]+$/, '').trim())
    .filter(Boolean);
}

// Guess a human-readable name from the raw URL before conversion
function guessName(raw, idx, baseCount) {
  const driveMatch = raw.match(/\/file\/d\/([^/?#]+)/);
  if (driveMatch) return `Image ${baseCount + idx + 1}`;
  try {
    const parts = new URL(raw).pathname.split('/').filter(Boolean);
    const last = decodeURIComponent(parts[parts.length - 1] || '');
    const name = last.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    if (name.length > 2 && !/^[a-f0-9-]{20,}$/i.test(name)) return name;
  } catch {}
  return `Image ${baseCount + idx + 1}`;
}

export default function GalleryImageManager({ images = [], onChange }) {
  const [method, setMethod] = useState(null);
  const [input, setInput] = useState('');
  const [dropHighlight, setDropHighlight] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [editingUrlIdx, setEditingUrlIdx] = useState(null);
  const [editingUrlValue, setEditingUrlValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  // ── Add helpers ──────────────────────────────────────────────
  const addFromFiles = async (files) => {
    const valid = Array.from(files).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (!valid.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const items = await Promise.all(valid.map(async (f, i) => {
        const ext = f.name.split('.').pop().toLowerCase();
        const base = f.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const filename = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;
        const { error } = await supabase.storage.from('media').upload(filename, f, { upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from('media').getPublicUrl(filename);
        return {
          url: data.publicUrl,
          caption: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          type: f.type.startsWith('video/') ? 'video' : 'image',
        };
      }));
      onChange([...images, ...items]);
      setMethod(null);
    } catch {
      setUploadError('Upload failed — check that your Supabase "media" bucket exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  const addFromUrls = (items) => {
    if (items.length) { onChange([...images, ...items]); setInput(''); setMethod(null); }
  };

  const handleAdd = () => {
    const rawUrls = extractUrls(input);
    if (!rawUrls.length) return;
    const items = rawUrls.map((raw, i) => {
      const url = method === 'drive' ? convertDrive(raw) : raw;
      return { url, caption: guessName(raw, i, images.length), type: isVideoUrl(url) ? 'video' : 'image' };
    });
    addFromUrls(items);
  };

  // ── Item ops ──────────────────────────────────────────────────
  const updateCaption = (i, caption) =>
    onChange(images.map((img, idx) => idx === i ? { ...img, caption } : img));
  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const startEditUrl = (i) => {
    setEditingUrlIdx(i);
    setEditingUrlValue(images[i].url || '');
  };
  const commitEditUrl = (i) => {
    const raw = editingUrlValue.trim();
    if (!raw) { setEditingUrlIdx(null); return; }
    const url = normalizeDriveUrl(raw);
    onChange(images.map((img, idx) => idx === i ? { ...img, url, type: isVideoUrl(url) ? 'video' : 'image' } : img));
    setEditingUrlIdx(null);
  };

  // ── Drag-to-upload (files from OS) ────────────────────────────
  const onZoneDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) setDropHighlight(true);
  };
  const onZoneDrop = (e) => {
    e.preventDefault();
    setDropHighlight(false);
    if (e.dataTransfer.files?.length) addFromFiles(e.dataTransfer.files);
  };

  // ── Drag-to-reorder ───────────────────────────────────────────
  const onItemDragStart = (e, i) => {
    setDragIdx(i);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(i)); // marks as reorder, not file
  };
  const onItemDragOver = (e, i) => {
    if (!e.dataTransfer.types.includes('Files')) { // only for reorder drags
      e.preventDefault();
      setDragOverIdx(i);
    }
  };
  const onItemDrop = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
    const next = [...images];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onChange(next);
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const onItemDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const inputCls = 'w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-accent';

  return (
    <div className="space-y-4">

      {/* ── Drop zone ── */}
      {method === null && (
        <div
          onDragOver={onZoneDragOver}
          onDragLeave={() => setDropHighlight(false)}
          onDrop={onZoneDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition-colors ${
            uploading ? 'border-accent/40 bg-accent/5' : dropHighlight ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/40'
          }`}
        >
          {uploading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              <p className="text-sm text-muted">Uploading to Supabase…</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-line">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-ink">Drop images or videos here</p>
                <p className="mt-0.5 text-xs text-muted">Supports multiple files at once</p>
              </div>
              {uploadError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{uploadError}</p>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Upload Files
                </button>
                <button type="button" onClick={() => setMethod('url')}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  URL Links
                </button>
                <button type="button" onClick={() => setMethod('drive')}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
                  Google Drive
                </button>
              </div>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={e => addFromFiles(e.target.files)} className="hidden" />
        </div>
      )}

      {/* ── URL ── */}
      {method === 'url' && (
        <div className="rounded-xl border border-line p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink">Add from URLs</p>
            <button type="button" onClick={() => setMethod(null)} className="text-xs text-muted hover:text-ink">← Back</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} autoFocus
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/video.mp4"}
            className={inputCls + ' resize-none'} />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted">One URL per line.</p>
            <button type="button" onClick={handleAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">Add All</button>
          </div>
        </div>
      )}

      {/* ── Google Drive ── */}
      {method === 'drive' && (
        <div className="rounded-xl border border-line p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink">Add from Google Drive</p>
            <button type="button" onClick={() => setMethod(null)} className="text-xs text-muted hover:text-ink">← Back</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} autoFocus
            placeholder={"https://drive.google.com/file/d/ABC123/view\nhttps://drive.google.com/file/d/DEF456/view\nhttps://drive.google.com/file/d/GHI789/view"}
            className={inputCls + ' resize-none'} />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted">Paste one link per line — each link becomes one image. Set files to "Anyone with the link".</p>
            <button type="button" onClick={handleAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">Add All</button>
          </div>
        </div>
      )}

      {/* ── Media list with drag-to-reorder ── */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.length > 1 && (
            <p className="text-[11px] text-muted px-1">Drag items to reorder</p>
          )}
          {images.map((item, i) => (
            <div
              key={i}
              draggable
              onDragStart={e => onItemDragStart(e, i)}
              onDragOver={e => onItemDragOver(e, i)}
              onDrop={e => onItemDrop(e, i)}
              onDragEnd={onItemDragEnd}
              className={`flex gap-3 rounded-xl border p-3 transition-all cursor-grab active:cursor-grabbing select-none ${
                dragIdx === i
                  ? 'opacity-40 border-accent scale-[0.98]'
                  : dragOverIdx === i
                  ? 'border-accent bg-accent/5'
                  : 'border-line bg-white/50'
              }`}
            >
              {/* Drag handle */}
              <div className="flex items-center text-muted shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                  <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                  <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                  <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                </svg>
              </div>

              {/* Thumbnail */}
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-line">
                {item.type === 'video' ? (
                  <>
                    <video src={item.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                )}
              </div>

              {/* Caption + controls */}
              <div className="flex flex-1 flex-col gap-2" onMouseDown={e => e.stopPropagation()}>
                <input type="text" value={item.caption || ''} onChange={e => updateCaption(i, e.target.value)}
                  placeholder="Image name / caption…"
                  className="w-full rounded-lg border border-line bg-cream px-3 py-1.5 text-xs text-ink outline-none focus:border-accent cursor-text" />

                {/* Inline URL editor */}
                {editingUrlIdx === i ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={editingUrlValue}
                      onChange={e => setEditingUrlValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEditUrl(i); if (e.key === 'Escape') setEditingUrlIdx(null); }}
                      placeholder="Paste new Drive link or URL…"
                      className="min-w-0 flex-1 rounded-lg border border-accent bg-cream px-2 py-1 text-[11px] text-ink outline-none"
                    />
                    <button type="button" onClick={() => commitEditUrl(i)}
                      className="rounded-md bg-accent px-2 py-1 text-[10px] font-medium text-cream">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingUrlIdx(null)}
                      className="rounded-md border border-line px-2 py-1 text-[10px] text-muted">
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="truncate text-[10px] text-muted cursor-default select-all" title={item.url}>
                    {item.url}
                  </p>
                )}

                <div className="flex gap-1.5 items-center">
                  <span className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                    item.type === 'video'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-black/[0.08] text-[#505050]'
                  }`}>
                    {item.type === 'video' ? '▶ Video' : '⬜ Image'}
                  </span>
                  <span className="flex-1" />
                  <button type="button" onClick={() => startEditUrl(i)}
                    className="rounded-md border border-line px-2 py-1 text-[10px] text-ink hover:border-accent hover:text-accent">
                    Edit URL
                  </button>
                  <button type="button" onClick={() => remove(i)}
                    className="rounded-md border border-line px-2 py-1 text-[10px] text-red-500 hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
