import { useState } from 'react';
import { motion } from 'framer-motion';
import { getPageContent, normalizeDriveUrl } from '../lib/cms.js';

export default function HeroImageBox() {
  const [isHovering, setIsHovering] = useState(false);
  const hero = getPageContent('hero');

  const topSrc = normalizeDriveUrl(hero.topImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=1200&fit=crop');
  const bottomSrc = normalizeDriveUrl(hero.bottomImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop');
  const topFocus = hero.topImageFocus || { x: 50, y: 50 };
  const bottomFocus = hero.bottomImageFocus || { x: 50, y: 50 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden cursor-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Bottom image — always visible underneath */}
      <div className="absolute inset-0">
        <img
          src={bottomSrc}
          alt="Reveal"
          className="w-full h-full object-cover"
          style={{ objectPosition: `${bottomFocus.x}% ${bottomFocus.y}%` }}
        />
      </div>

      {/* Top image — wipes upward on hover to reveal bottom */}
      <motion.div
        className="absolute inset-0"
        animate={{
          clipPath: isHovering
            ? 'inset(100% 0 0 0 round 0px)'
            : 'inset(0% 0 0 0 round 0px)',
        }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        <img
          src={topSrc}
          alt="Portfolio"
          className="w-full h-full object-cover"
          style={{ objectPosition: `${topFocus.x}% ${topFocus.y}%` }}
        />
        {/* Gradient overlay on top image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>

      {/* Hover hint */}
      <motion.div
        animate={{ opacity: isHovering ? 0 : 1, y: isHovering ? 4 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-6 right-6 text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none"
      >
        Hover to reveal
      </motion.div>
    </motion.div>
  );
}
