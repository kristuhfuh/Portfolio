import { useState, useRef } from 'react';

/**
 * Lets the admin upload an image and click to set the focal point (crop focus).
 * Stores { x, y } as percentages. Renders the image with objectPosition.
 */
export default function ImageFocalPoint({ label, imageValue, focusValue, onImageChange, onFocusChange }) {
  const [uploadMethod, setUploadMethod] = useState('url');
  const [urlInput, setUrlInput] = useState(imageValue || '');
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const focus = focusValue || { x: 50, y: 50 };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    onImageChange(localUrl);
    setUrlInput(localUrl);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) onImageChange(urlInput.trim());
  };

  const getFocusFromEvent = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    onFocusChange({ x, y });
  };

  return (
    <div className="space-y-3">
      <label className="label mb-1.5 block text-muted dark:text-dark-muted">{label}</label>

      {/* Method tabs */}
      <div className="flex gap-1 rounded-lg border border-line p-1 dark:border-dark-line w-fit">
        {['url', 'file'].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setUploadMethod(m)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              uploadMethod === m
                ? 'bg-accent text-cream'
                : 'text-muted hover:text-ink dark:text-dark-muted dark:hover:text-dark-ink'
            }`}
          >
            {m === 'url' ? 'URL' : 'Upload File'}
          </button>
        ))}
      </div>

      {uploadMethod === 'url' ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-accent dark:border-dark-line dark:bg-dark-bg dark:text-dark-ink"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-cream hover:opacity-90"
          >
            Set
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full cursor-pointer rounded-lg border border-line bg-cream px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:font-medium file:text-cream dark:border-dark-line dark:bg-dark-bg"
        />
      )}

      {imageValue && (
        <div className="space-y-2">
          <p className="text-xs text-muted dark:text-dark-muted">
            Click on the image to set the crop focus point. Current: {focus.x}% {focus.y}%
          </p>
          {/* Interactive focal point picker */}
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
            {/* Focal point crosshair */}
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
        </div>
      )}
    </div>
  );
}
