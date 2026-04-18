# Portfolio Enhancements - Feature Documentation

## 🎨 New Features Added

### 1. **Page Loader** (`PageLoader.jsx`)
- Smooth entrance animation with progress bar
- Animated logo reveal
- Automatically dismisses after page loads
- Location: `src/components/PageLoader.jsx`

### 2. **Custom Cursor** (`CustomCursor.jsx`)
- Magnetic cursor with follow effect
- Hover state enlargement on interactive elements
- Click state shrink animation
- Mix-blend-difference mode for visibility on any background
- Hidden on mobile/tablet (< 1024px)
- Location: `src/components/CustomCursor.jsx`

### 3. **Hero Image Box** (`HeroImageBox.jsx`)
- Two stacked images with circular reveal effect
- Mouse-follow reveal mask showing bottom image
- Hover hint badge ("Hover to reveal")
- Gradient overlay for polish
- Location: `src/components/HeroImageBox.jsx`
- **To customize images:** Edit the image URLs in the component (lines 19 & 28)

### 4. **Parallax Animations** (`Parallax.jsx`)
- `ParallaxSection` - Wraps any content with scroll-based motion
- `ParallaxImage` - Images with scale and opacity effects
- `ParallaxText` - Text with fade and movement
- Usage:
  ```jsx
  import ParallaxSection from './components/Parallax'
  
  <ParallaxSection speed={0.5}>
    <YourContent />
  </ParallaxSection>
  ```

### 5. **Media Upload Component** (`MediaUpload.jsx`)
Three upload methods in one component:

#### **URL Link**
- Paste any direct image/video URL
- Click "Add URL" to set

#### **Google Drive**
- Paste Google Drive share link
- Automatically converts to direct link format
- **Important:** File must be publicly accessible
- Format: `https://drive.google.com/file/d/FILE_ID/view`

#### **File Upload**
- Click or drag to upload
- Shows upload progress
- Preview after upload
- Accepts images and videos

#### Usage in Admin Forms:
```jsx
import MediaUpload from '../components/MediaUpload'

<MediaUpload
  value={coverImage}
  onChange={setCoverImage}
  label="Cover Image"
  accept="image/*"
/>
```

**Props:**
- `value` - Current media URL
- `onChange` - Callback with new URL
- `label` - Field label text
- `accept` - File types (default: `'image/*,video/*'`)

### 6. **Micro-Interactions Throughout**
- Hover effects on project cards
- Smooth transitions on all interactive elements
- Scale animations on buttons
- Fade-in animations on scroll
- Magnetic link underlines

## 🎯 CSS Updates

### Cursor Hiding (Desktop Only)
```css
@media (min-width: 1024px) {
  * {
    cursor: none !important;
  }
}
```

### Smooth Scroll
```css
html {
  scroll-behavior: smooth;
}
```

## 📦 Integration Points

### App.jsx Changes
- Added `<PageLoader />` component
- Added `<CustomCursor />` component
- Both render on all public routes (not admin)

### Hero.jsx Changes
- Imported `HeroImageBox` component
- Updated grid layout to accommodate image box
- Moved "Focus" and "Open to" info to left column
- Image box in right column with flexbox centering

## 🚀 How to Use MediaUpload in Admin

Replace the old image input:
```jsx
// OLD
<input
  type="url"
  value={cover}
  onChange={(e) => setCover(e.target.value)}
/>

// NEW
<MediaUpload
  value={cover}
  onChange={setCover}
  label="Cover Image"
  accept="image/*"
/>
```

## 🎨 Customization

### Change Hero Images
Edit `/src/components/HeroImageBox.jsx`:
```jsx
// Line 19 - Bottom image
<img src="YOUR_IMAGE_URL" />

// Line 28 - Top image (revealed on hover)
<img src="YOUR_IMAGE_URL" />
```

### Adjust Parallax Speed
In `Parallax.jsx`, change the `speed` prop:
- Lower values (0.1-0.3) = subtle movement
- Higher values (0.5-1.0) = dramatic movement

### Customize Cursor
Edit `/src/components/CustomCursor.jsx`:
- Size: Change `w-3 h-3` and `w-10 h-10`
- Color: Change `bg-black dark:bg-white`
- Blend mode: Change `mix-blend-difference`

## 🛠️ Build & Deploy

```bash
npm install
npm run build
```

Build output:
- `dist/index.html` - 1.28 kB
- `dist/assets/index.css` - 41.58 kB (8.07 kB gzipped)
- `dist/assets/index.js` - 416.18 kB (128.82 kB gzipped)

## ⚡ Performance Notes

- Custom cursor only renders on desktop (>1024px)
- Page loader dismissed after initial load (not on route changes)
- Parallax uses `requestAnimationFrame` for smooth performance
- All animations use GPU-accelerated transforms

## 🎯 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Custom cursor disabled, all other features work

---

**Login:** akpogumachristopher@gmail.com / password
