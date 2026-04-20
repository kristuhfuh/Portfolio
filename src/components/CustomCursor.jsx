import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      // tip of the pen is at bottom-left corner of the SVG
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  const stroke = isDark ? '#ffffff' : '#000000';
  const fill = isDark ? '#1a1a1a' : '#ffffff';

  return (
    <>
      {/* Pen tool SVG — tip anchored at pointer */}
      <motion.div
        ref={cursorRef}
        animate={{
          scale: isClicking ? 0.85 : 1,
          rotate: isHovering ? -15 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          willChange: 'transform',
          transformOrigin: '0 0',
          // offset so the pen nib tip sits exactly at the cursor point
          marginLeft: '-2px',
          marginTop: '-30px',
        }}
      >
        <svg
          width="32"
          height="36"
          viewBox="0 0 32 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pen body */}
          <path
            d="M6 30 L14 8 L22 14 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Pen nib highlight */}
          <path
            d="M6 30 L10 19 L14 22 Z"
            fill={stroke}
            stroke={stroke}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Pen cap / top body */}
          <path
            d="M14 8 L22 14 L20 6 Z"
            fill={stroke}
            stroke={stroke}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Plus indicator dot when hovering (add anchor point) */}
          {isHovering && (
            <>
              <circle cx="26" cy="8" r="5" fill={fill} stroke={stroke} strokeWidth="1.5" />
              <line x1="26" y1="5" x2="26" y2="11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="23" y1="8" x2="29" y2="8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </motion.div>

      {/* Tiny ink dot at tip */}
      <motion.div
        ref={dotRef}
        animate={{
          scale: isClicking ? 2.5 : 1,
          opacity: isClicking ? 0.6 : 0.9,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 25 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          willChange: 'transform',
          backgroundColor: stroke,
        }}
      />
    </>
  );
}
