import { useState, useRef } from 'react';

function convertDrive(raw) {
  const match = raw.match(/\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : raw;
}

const inputCls = 'flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink';

export default function GalleryImageManager({ images = [], onChange }) {
  const [method, setMethod] = useState(null); // null = show zone, 'url'|'drive'|'file'
  const [input, setInput] = useState('');
  const [draggingOver, setDraggingOver] = useState(false);
  const fileRef = useRef(null);

  const addImage = (url) => {
    if (!url) return;
    onChange([...images, { url, caption: '' }]);
    setInput('');
    setMethod(null);
  };

  const handleAdd = () => {
    if (!input.trim()) return;
    addImage(method === 'drive' ? convertDrive(input.trim()) : input.trim());
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) addImage(URL.createObjectURL(file));
  };

  const updateCaption = (i, caption) =>
    onChange(images.map((img, idx) => idx === i ? { ...img, caption } : img));

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const move = (i, dir) => {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">

      {/* ── Upload zone ── */}
      {method === null && (
        <div
          onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition-colors ${
            draggingOver
              ? 'border-accent bg-accent/5'
              : 'border-line dark:border-dark-line hover:border-accent/50'
          }`}
        >
          {/* Upload icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-line dark:bg-dark-line">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
              className="text-muted dark:text-dark-muted">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-ink dark:text-dark-ink">Drop an image here</p>
            <p className="mt-0.5 text-xs text-muted dark:text-dark-muted">or choose how to add one</p>
          </div>

          {/* Method buttons */}
          <div className="flex gap-2">
            <button type="button" onClick={() => setMethod('file')}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent dark:border-dark-line dark:bg-white/5 dark:text-dark-ink">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Upload File
            </button>
            <button type="button" onClick={() => setMethod('url')}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent dark:border-dark-line dark:bg-white/5 dark:text-dark-ink">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              URL Link
            </button>
            <button type="button" onClick={() => setMethod('drive')}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-accent hover:text-accent dark:border-dark-line dark:bg-white/5 dark:text-dark-ink">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
              </svg>
              Google Drive
            </button>
          </div>
        </div>
      )}

      {/* ── File picker ── */}
      {method === 'file' && (
        <div className="rounded-xl border border-line p-4 dark:border-dark-line space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink dark:text-dark-ink">Upload from device</p>
            <button type="button" onClick={() => setMethod(null)} className="text-xs text-muted hover:text-ink dark:text-dark-muted">← Back</button>
          </div>
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line py-8 transition hover:border-accent dark:border-dark-line">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-muted dark:text-dark-muted">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-sm text-muted dark:text-dark-muted">Click to choose a file</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      )}

      {/* ── URL input ── */}
      {method === 'url' && (
        <div className="rounded-xl border border-line p-4 dark:border-dark-line space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink dark:text-dark-ink">Add from URL</p>
            <button type="button" onClick={() => setMethod(null)} className="text-xs text-muted hover:text-ink dark:text-dark-muted">← Back</button>
          </div>
          <div className="flex gap-2">
            <input type="url" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="https://example.com/image.jpg"
              className={inputCls} autoFocus />
            <button type="button" onClick={handleAdd}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">
              Add
            </button>
          </div>
        </div>
      )}

      {/* ── Google Drive ── */}
      {method === 'drive' && (
        <div className="rounded-xl border border-line p-4 dark:border-dark-line space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink dark:text-dark-ink">Add from Google Drive</p>
            <button type="button" onClick={() => setMethod(null)} className="text-xs text-muted hover:text-ink dark:text-dark-muted">← Back</button>
          </div>
          <div className="flex gap-2">
            <input type="url" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="https://drive.google.com/file/d/..."
              className={inputCls} autoFocus />
            <button type="button" onClick={handleAdd}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">
              Add
            </button>
          </div>
          <p className="text-[11px] text-muted dark:text-dark-muted">
            Set the file to "Anyone with the link" in Google Drive before adding.
          </p>
        </div>
      )}

      {/* ── Image list ── */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-line bg-white/50 p-3 dark:border-dark-line dark:bg-white/[0.03]">
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-line dark:border-dark-line bg-line dark:bg-dark-line">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input type="text" value={img.caption || ''} onChange={e => updateCaption(i, e.target.value)}
                  placeholder="Caption (shown as pill on image)…"
                  className="w-full rounded-lg border border-line bg-cream px-3 py-1.5 text-xs text-ink outline-none focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink" />
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
                    className="rounded-md border border-line px-2 py-1 text-[10px] text-muted hover:bg-line disabled:opacity-30 dark:border-dark-line dark:text-dark-muted dark:hover:bg-dark-line">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} title="Move down"
                    className="rounded-md border border-line px-2 py-1 text-[10px] text-muted hover:bg-line disabled:opacity-30 dark:border-dark-line dark:text-dark-muted dark:hover:bg-dark-line">↓</button>
                  <span className="flex-1" />
                  <button type="button" onClick={() => remove(i)}
                    className="rounded-md border border-line px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 dark:border-dark-line dark:hover:bg-red-900/20">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
