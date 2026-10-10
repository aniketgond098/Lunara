import React from 'react';

interface LuniAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: 'idle' | 'thinking' | 'happy' | 'speaking';
  className?: string;
  showBadge?: boolean;
}

export const LuniAvatar: React.FC<LuniAvatarProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
  showBadge = false,
}) => {
  const pixelSizes = {
    xs: 24,
    sm: 32,
    md: 46,
    lg: 64,
    xl: 88,
  };

  const dim = pixelSizes[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Outer Cosmic Halo Ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#c4b5fd]/25 via-[#fef08a]/20 to-[#f472b6]/20 blur-md transition-all duration-500 ${
          state === 'thinking'
            ? 'animate-pulse scale-125'
            : state === 'speaking'
            ? 'scale-110'
            : 'scale-100'
        }`}
      />

      {/* Mascot SVG: "Luni" - The Cute Celestial Moon Sprite */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(196,181,253,0.6)] ${
          state === 'happy' ? 'animate-bounce' : 'animate-float'
        }`}
      >
        <defs>
          <radialGradient id="luniBody" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ede9fe" />
            <stop offset="85%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
          <linearGradient id="luniHalo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Floating Golden Starlight Halo */}
        <ellipse
          cx="32"
          cy="12"
          rx="16"
          ry="4"
          fill="none"
          stroke="url(#luniHalo)"
          strokeWidth="1.8"
          strokeDasharray={state === 'thinking' ? '3 3' : 'none'}
          className={state === 'thinking' ? 'animate-spin origin-[32px_12px]' : ''}
        />

        {/* Floating Moon Sprite Body */}
        <circle cx="32" cy="34" r="18" fill="url(#luniBody)" stroke="#ffffff" strokeWidth="1.2" />

        {/* Cute Crescent Moon Crown / Tiara */}
        <path
          d="M32 18 C30 22 34 24 32 26 C35 24 35 20 32 18 Z"
          fill="#fef08a"
          stroke="#f59e0b"
          strokeWidth="0.5"
        />

        {/* Rosy Cheeks */}
        <circle cx="21" cy="38" r="3.2" fill="#f472b6" opacity="0.65" />
        <circle cx="43" cy="38" r="3.2" fill="#f472b6" opacity="0.65" />

        {/* Eyes based on state */}
        {state === 'thinking' ? (
          // Swirling starlight eyes
          <g>
            <circle cx="25" cy="32" r="2.5" fill="#312e81" />
            <circle cx="39" cy="32" r="2.5" fill="#312e81" />
            <path d="M23 30 L27 34" stroke="#fef08a" strokeWidth="1" />
            <path d="M37 30 L41 34" stroke="#fef08a" strokeWidth="1" />
          </g>
        ) : state === 'happy' ? (
          // Joyful smiling curved eyes (^ ^)
          <g>
            <path d="M21 33 Q25 28 29 33" stroke="#312e81" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M35 33 Q39 28 43 33" stroke="#312e81" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Sparkly anime starlight eyes
          <g>
            <circle cx="25" cy="32" r="3.2" fill="#1e1b4b" />
            <circle cx="39" cy="32" r="3.2" fill="#1e1b4b" />
            {/* White highlights */}
            <circle cx="24" cy="30.5" r="1.3" fill="#ffffff" />
            <circle cx="38" cy="30.5" r="1.3" fill="#ffffff" />
            <circle cx="26.5" cy="33.5" r="0.7" fill="#ffffff" />
            <circle cx="40.5" cy="33.5" r="0.7" fill="#ffffff" />
          </g>
        )}

        {/* Sweet Smile */}
        <path
          d={state === 'happy' ? 'M28 39 Q32 44 36 39' : 'M29 39 Q32 42 35 39'}
          stroke="#312e81"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill={state === 'happy' ? '#f472b6' : 'none'}
        />

        {/* Star Sparkle on Cheek */}
        <path d="M14 26 L16 28 L14 30 L12 28 Z" fill="#fef08a" opacity="0.8" />
        <path d="M50 24 L51.5 25.5 L50 27 L48.5 25.5 Z" fill="#fbcfe8" opacity="0.8" />
      </svg>

      {/* Online indicator badge */}
      {showBadge && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-[#050814] shadow-[0_0_8px_#34d399]" />
      )}
    </div>
  );
};

export const WebbyAvatar = LuniAvatar;
