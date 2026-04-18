import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroImageBox() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Bottom image - revealed on hover */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop"
          alt="Design workspace"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top image with circular reveal mask */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: isHovering
            ? `circle(${150}px at ${mousePosition.x}px ${mousePosition.y}px)`
            : 'circle(100% at 50% 50%)',
        }}
        transition={{ duration: 0.3 }}
      >
        <img
          src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=1200&fit=crop"
          alt="Creative work"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Hover hint */}
      {!isHovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-6 right-6 text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          Hover to reveal
        </motion.div>
      )}
    </motion.div>
  );
}
