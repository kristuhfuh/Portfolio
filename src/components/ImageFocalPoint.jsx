import { useState, useRef } from 'react';
import { normalizeDriveUrl } from '../lib/cms.js';
import { supabase } from '../lib/supabase.js';

export default function ImageFocalPoint({ label, imageValue, focusValue, onImageChange, onFocusChange }) {
  const [uploadMethod, setUploadMethod] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const containerRef = useRef(null);

  const focus = focusValue || { x: 50, y: 50 };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(filename);
      onImageChange(data.publicUrl);
    } catch {
      setUploadError('Upload failed — check that your Supabase "media" bucket exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) onImageChange(urlInput.trim());
  };

  const handleDriveSubmit = () => {
    if (!urlInput.trim()) return;
    onImageChange(normalizeDriveUrl(urlInput.trim()));
  };

  const getFocusFromEvent = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    onFocusChange({ x, y });
  };

  const methods = [
    { id: 'url', label: 'URL Link' },
    { id: 'drive', label: 'Google Drive' },
    { id: 'file', label: 'Upload File' },
  ];

  return (
    <div className="space-y-3">
      <label className="label mb-1.5 block text-muted">{label}</label>

      {/* Method tabs */}
      <div className="flex gap-1 rounded-lg border border-line p-1 w-fit">
        {methods.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setUploadMethod(m.id); setUrlInput(''); }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              uploadMethod === m.id
                ? 'bg-accent text-cream'
                : 'text-muted hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* URL */}
      {uploadMethod === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button type="button" onClick={handleUrlSubmit}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">
            Set
          </button>
        </div>
      )}

      {/* Google Drive */}
      {uploadMethod === 'drive' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDriveSubmit()}
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button type="button" onClick={handleDriveSubmit}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90">
              Set
            </button>
          </div>
          <p className="text-xs text-muted">
            Paste a Google Drive share link. Make sure the file is set to "Anyone with the link".
          </p>
        </div>
      )}

      {/* File upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full cursor-pointer rounded-lg border border-line bg-cream px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:font-medium file:text-cream disabled:opacity-50"
          />
          {uploading && <p className="text-xs text-muted">Uploading to Supabase…</p>}
          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        </div>
      )}

      {/* Image preview + focal point picker */}
      {imageValue && (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            Click or drag on the image to set the crop focus. Current: {focus.x}% {focus.y}%
          </p>
          <div
            ref={containerRef}
            className="relative aspect-[3/4] w-48 overflow-hidden rounded-xl border-2 border-accent cursor-crosshair select-none"
            onClick={getFocusFromEvent}
            onMouseMove={e => dragging && getFocusFromEvent(e)}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
          >
            <img
              src={imageValue}
              alt="Preview"
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
            <div
              className="absolute pointer-events-none"
              style={{ left: `${focus.x}%`, top: `${focus.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-6 h-px bg-white/90 shadow" />
                <div className="absolute h-6 w-px bg-white/90 shadow" />
                <div className="h-3 w-3 rounded-full border-2 border-white bg-accent/80 shadow" />
              </div>
            </div>
          </div>
          <button type="button" onClick={() => onImageChange('')}
            className="text-xs text-red-500 hover:underline">
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
