import React from 'react';

interface LunarGemIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const LunarGemIcon: React.FC<LunarGemIconProps> = ({
  size = 20,
  className = '',
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none transition-transform duration-300 group-hover:scale-110 ${
        glow ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.55)]' : ''
      } ${className}`}
    >
      <defs>
        <radialGradient id="gemInner" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6b21a8" />
        </radialGradient>
        <linearGradient id="gemFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Hexagonal Star Gem Shape */}
      {/* Top crown */}
      <polygon
        points="16,3 25,9 25,23 16,29 7,23 7,9"
        fill="url(#gemInner)"
        stroke="rgba(254, 240, 138, 0.8)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Internal facets for diamond brilliance */}
      <polygon points="16,3 25,9 16,16 7,9" fill="url(#gemFacet)" opacity="0.9" />
      <polygon points="7,9 16,16 16,29 7,23" fill="#581c87" opacity="0.4" />
      <polygon points="25,9 25,23 16,29 16,16" fill="#7e22ce" opacity="0.3" />

      {/* Center 4-point star reflection */}
      <path
        d="M16 10 Q16 16 22 16 Q16 16 16 22 Q16 16 10 16 Q16 16 16 10 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="1.2" fill="#fffbeb" />
    </svg>
  );
};

export const SpideyCoinIcon = LunarGemIcon;

interface LunarGemDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const LunarGemDisplay: React.FC<LunarGemDisplayProps> = ({
  amount,
  className = '',
  size = 'md',
  showLabel = true,
  glow = true,
  onClick,
}) => {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-bold',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none group font-sans ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <LunarGemIcon size={iconSizes[size]} glow={glow} />
      </div>

      <div className="flex flex-col leading-none">
        <span className={`text-white tracking-wide font-medium ${textSizes[size]}`}>
          {amount.toLocaleString()}
        </span>
        {showLabel && (
          <span className="text-[9px] uppercase tracking-wider text-[#fde047] font-semibold mt-0.5">
            LUNAR GEMS
          </span>
        )}
      </div>
    </div>
  );
};

export const SpideyCoinDisplay = LunarGemDisplay;
