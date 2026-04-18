import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaUpload({ value, onChange, label = 'Media', accept = 'image/*,video/*' }) {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url', 'drive', 'file'
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploading, setUploading] = useState(false);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // For production, you'd upload to a service like Cloudinary, S3, etc.
      // For now, we'll use the local URL
      onChange(localUrl);
      
      // TODO: Implement actual file upload to your storage service
      // const uploadedUrl = await uploadToStorage(file);
      // onChange(uploadedUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDriveLink = () => {
    if (urlInput.trim()) {
      // Convert Google Drive share link to direct link if needed
      let driveUrl = urlInput.trim();
      
      // Convert "https://drive.google.com/file/d/FILE_ID/view" to direct link
      const driveMatch = driveUrl.match(/\/file\/d\/([^\/]+)/);
      if (driveMatch) {
        driveUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      }
      
      onChange(driveUrl);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Upload method tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['url', 'drive', 'file'].map((method) => (
          <button
            key={method}
            onClick={() => setUploadMethod(method)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              uploadMethod === method
                ? 'text-black dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {method === 'url' && 'URL Link'}
            {method === 'drive' && 'Google Drive'}
            {method === 'file' && 'Upload File'}
            {uploadMethod === method && (
              <motion.div
                layoutId="active-method"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Upload interface */}
      <AnimatePresence mode="wait">
        <motion.div
          key={uploadMethod}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {uploadMethod === 'url' && (
            <>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white"
              />
              <button
                onClick={handleUrlSubmit}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Add URL
              </button>
            </>
          )}

          {uploadMethod === 'drive' && (
            <>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Paste a Google Drive share link. Make sure the file is publicly accessible.
              </div>
              <button
                onClick={handleDriveLink}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Add from Drive
              </button>
            </>
          )}

          {uploadMethod === 'file' && (
            <div className="relative">
              <input
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-8 text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:file:bg-white dark:file:text-black dark:hover:file:bg-gray-200"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-800/80">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Preview */}
      {value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-lg border border-gray-200 p-2 dark:border-gray-700"
        >
          {accept.includes('image') && (
            <img
              src={value}
              alt="Preview"
              className="h-32 w-full rounded object-cover"
            />
          )}
          {accept.includes('video') && value.includes('video') && (
            <video
              src={value}
              className="h-32 w-full rounded object-cover"
              controls
            />
          )}
          <button
            onClick={() => onChange('')}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
}
