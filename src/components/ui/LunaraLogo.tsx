import React from 'react';
import { CelestialIcon } from './CelestialIcon';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  glow?: boolean;
  showTagline?: boolean | 'responsive';
}

export const LunaraLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = true,
  showTagline,
}) => {
  const iconBoxSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    hero: 'w-16 h-16',
  };

  const celestialSizes = {
    sm: 22,
    md: 28,
    lg: 34,
    hero: 46,
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.18em]',
    md: 'text-base tracking-[0.25em]',
    lg: 'text-xl tracking-[0.28em]',
    hero: 'text-3xl tracking-[0.32em]',
  };

  // Default tagline to responsive on 'sm' size to prevent mobile overflow
  const effectiveTagline = showTagline !== undefined ? showTagline : (size === 'sm' ? 'responsive' : true);

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 select-none min-w-0 ${className}`}>
      {/* Luminous Celestial Emblem Frame */}
      <div
        className={`relative ${iconBoxSizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#2e1065] border border-[#a78bfa]/40 shrink-0 group transition-all duration-300 hover:border-[#c4b5fd] hover:scale-105 ${
          glow ? 'shadow-[0_0_20px_rgba(167,139,250,0.3)]' : ''
        }`}
      >
        <CelestialIcon size={celestialSizes[size]} glow={glow} />

        {/* Ambient Moonbeam Glow */}
        {glow && (
          <div className="absolute inset-0 bg-[#a78bfa]/15 blur-lg rounded-2xl -z-10" />
        )}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <h1 className={`font-semibold text-white ${textSizes[size]} font-['Cinzel',serif] leading-tight flex items-center gap-1`}>
            <span>LUNARA</span>
          </h1>
          {effectiveTagline !== false && (
            <span
              className={`${
                effectiveTagline === 'responsive' ? 'hidden sm:inline-block' : ''
              } text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-[#c4b5fd]/90 font-sans uppercase font-medium truncate`}
            >
              Grow Into Your Next Chapter.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const WebAscendLogo = LunaraLogo;
