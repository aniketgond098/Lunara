import React from 'react';

interface CelestialIconProps {
  className?: string;
  size?: number | string;
  color?: string;
  glow?: boolean;
}

/**
 * LUNARA CELESTIAL EMBLEM
 * An exquisite crescent moon embracing a radiant 4-pointed star
 * with delicate orbital starlight nodes.
 */
export const CelestialIcon: React.FC<CelestialIconProps> = ({
  className = '',
  size = 24,
  color = '#c4b5fd',
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${glow ? 'drop-shadow-[0_0_10px_rgba(196,181,253,0.65)]' : ''} ${className}`}
    >
      <defs>
        <radialGradient id="lunarGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#c4b5fd" />
          <stop offset="85%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
      </defs>

      {/* Soft celestial orbit ring */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="rgba(196, 181, 253, 0.25)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />

      {/* Crescent Moon */}
      <path
        d="M26 8 C16 9 9 17 9 27 C9 36.5 16.5 44 26 44 C31.5 44 36.5 41.5 39.5 37.5 C32 37.5 25 31.5 25 24 C25 16.5 30 10.5 37 8.5 C33.5 8 29.5 8 26 8 Z"
        fill="url(#lunarGrad)"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="0.75"
      />

      {/* Central Radiant 4-Pointed Star */}
      <path
        d="M27 15 Q27 23 35 23 Q27 23 27 31 Q27 23 19 23 Q27 23 27 15 Z"
        fill="url(#starGrad)"
        stroke="#ffffff"
        strokeWidth="0.5"
      />

      {/* Starlight Sparkle Center */}
      <circle cx="27" cy="23" r="1.5" fill="#ffffff" />

      {/* Minor Constellation Dots */}
      <circle cx="14" cy="16" r="1" fill="#fbcfe8" opacity="0.8" />
      <circle cx="38" cy="15" r="1" fill="#fef08a" opacity="0.9" />
      <circle cx="34" cy="33" r="1" fill="#c4b5fd" opacity="0.8" />
    </svg>
  );
};
