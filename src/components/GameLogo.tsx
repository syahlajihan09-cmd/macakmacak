import React from 'react';
import { motion } from 'motion/react';

export interface GameLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const GameLogo: React.FC<GameLogoProps> = ({ size = 'md' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Playful Floating Mini Food & Utensils */}
      <div className="flex items-center justify-center gap-4 mb-1">
        {/* Steam Puffs */}
        <motion.span
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="text-lg sm:text-2xl"
        >
          ♨️
        </motion.span>
        {/* Chef Hat with gentle bounce */}
        <motion.span
          animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="text-2xl sm:text-4xl filter drop-shadow-sm"
        >
          👨‍🍳
        </motion.span>
        {/* Sparkle Food */}
        <motion.span
          animate={{ y: [0, -6, 0], rotate: [6, -6, 6] }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut', delay: 0.3 }}
          className="text-lg sm:text-2xl"
        >
          🍳
        </motion.span>
      </div>

      {/* Main Stylized Rounded Text */}
      <div className="relative flex items-center justify-center">
        {/* Left Utensil: Spatula */}
        <motion.div
          animate={{ rotate: [-8, 4, -8] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="mr-2 text-2xl sm:text-4xl transform -rotate-12 hidden sm:block"
        >
          🍳
        </motion.div>

        {/* Big Bold Playful Text */}
        <div className="relative text-center">
          <h1
            className={`font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFF275] via-[#FF8A3D] to-[#E55934] drop-shadow-[0_4px_0_#4E1D00] ${
              isLarge
                ? 'text-5xl sm:text-7xl lg:text-8xl'
                : isSmall
                ? 'text-2xl sm:text-3xl'
                : 'text-4xl sm:text-6xl'
            }`}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 4px 12px rgba(229,89,52,0.3)',
            }}
          >
            MASAK MASAK
          </h1>
        </div>

        {/* Right Utensil: Whisk / Fork */}
        <motion.div
          animate={{ rotate: [8, -4, 8] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
          className="ml-2 text-2xl sm:text-4xl transform rotate-12 hidden sm:block"
        >
          🥄
        </motion.div>
      </div>

      {/* Subtitle Ribbon */}
      <div className="mt-2 flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFF0E0] border-2 border-[#FF8A3D]/40 text-[#4E1D00] shadow-sm">
        <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
          🍳 Game Cooking & Restaurant Management 🍔
        </span>
      </div>
    </div>
  );
};
