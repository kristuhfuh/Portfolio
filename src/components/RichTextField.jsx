import { useRef, useEffect, useState, useCallback } from 'react';

const TOOLBAR = [
  [
    { cmd: 'bold',          label: 'Bold',          icon: <b>B</b> },
    { cmd: 'italic',        label: 'Italic',        icon: <i>I</i> },
    { cmd: 'underline',     label: 'Underline',     icon: <u>U</u> },
    { cmd: 'strikeThrough', label: 'Strikethrough', icon: <s>S</s> },
  ],
  [
    { cmd: 'formatBlock', arg: 'h2', label: 'Heading 2', icon: <span className="font-bold text-[11px]">H2</span> },
    { cmd: 'formatBlock', arg: 'h3', label: 'Heading 3', icon: <span className="font-bold text-[11px]">H3</span> },
    { cmd: 'formatBlock', arg: 'p',  label: 'Paragraph', icon: <span className="text-[11px]">¶</span> },
  ],
  [
    { cmd: 'insertUnorderedList', label: 'Bullet list',   icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
        <circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    )},
    { cmd: 'insertOrderedList', label: 'Numbered list', icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/>
        <path d="M4 6h1.5M4 12h1.5M4 18h1.5" strokeLinecap="round"/>
      </svg>
    )},
  ],
  [
    { cmd: 'justifyLeft',   label: 'Align left',   icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
      </svg>
    )},
    { cmd: 'justifyCenter', label: 'Center',       icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    )},
    { cmd: 'justifyRight',  label: 'Align right',  icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
      </svg>
    )},
  ],
  [
    { cmd: 'removeFormat', label: 'Clear formatting', icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6l12 12M18 6L6 18"/>
      </svg>
    )},
  ],
];

function toHtml(val) {
  if (!val) return '';
  if (/<[a-z][\s\S]*>/i.test(val)) return val;
  return val.replace(/\n/g, '<br>');
}

export default function RichTextField({ value = '', onChange, placeholder = '', singleLine = false, minHeight = 120 }) {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});

  // Sync external value into DOM only when not focused
  useEffect(() => {
    const el = editorRef.current;
    if (!el || document.activeElement === el) return;
    const html = toHtml(value);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [value]);

  const exec = useCallback((cmd, arg) => {
    editorRef.current?.focus();
    // eslint-disable-next-line no-restricted-globals
    document.execCommand(cmd, false, arg || null);
    onChange(editorRef.current?.innerHTML || '');
    updateActiveFormats();
  }, [onChange]);

  const updateActiveFormats = () => {
    const formats = {};
    ['bold', 'italic', 'underline', 'strikeThrough'].forEach(f => {
      // eslint-disable-next-line no-restricted-globals
      formats[f] = document.queryCommandState(f);
    });
    setActiveFormats(formats);
  };

  const handleKeyDown = (e) => {
    if (singleLine && e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      const map = { b: 'bold', i: 'italic', u: 'underline' };
      if (map[e.key]) {
        e.preventDefault();
        exec(map[e.key]);
      }
    }
  };

  const isEmpty = !value || value === '<br>';
  const style = singleLine
    ? { minHeight: 'unset', whiteSpace: 'nowrap', overflowX: 'auto' }
    : { minHeight };

  return (
    <div className={`relative rounded-lg border transition-colors ${focused ? 'border-accent ring-1 ring-accent' : 'border-line dark:border-dark-line'}`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5 transition-colors ${focused ? 'border-accent/30 bg-accent/5' : 'border-line dark:border-dark-line'} dark:border-dark-line rounded-t-lg`}>
        {TOOLBAR.map((group, gi) => (
          <span key={gi} className="contents">
            {gi > 0 && <span className="mx-1 h-4 w-px bg-line dark:bg-dark-line" />}
            {group.map(({ cmd, arg, label, icon }) => (
              <button
                key={cmd + (arg || '')}
                type="button"
                title={label}
                onMouseDown={e => { e.preventDefault(); exec(cmd, arg); }}
                className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors
                  ${activeFormats[cmd]
                    ? 'bg-accent text-cream'
                    : 'text-muted hover:bg-line hover:text-ink dark:text-dark-muted dark:hover:bg-dark-line dark:hover:text-dark-ink'
                  }`}
              >
                {icon}
              </button>
            ))}
          </span>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative">
        {isEmpty && !focused && (
          <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted/50 dark:text-dark-muted/50 select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={() => onChange(editorRef.current?.innerHTML || '')}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="rich-editor w-full px-4 py-3 text-sm text-ink outline-none dark:text-dark-ink bg-cream dark:bg-dark-bg rounded-b-lg"
          style={style}
        />
      </div>
    </div>
  );
}
