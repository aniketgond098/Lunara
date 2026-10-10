import React from 'react';
import { Sparkles, Moon, Star, Flame } from 'lucide-react';

interface MoonPhaseIndicatorProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export interface MoonPhaseData {
  phaseName: string;
  phaseGlyph: string;
  illumination: number; // 0 to 1
  description: string;
  isFullMoon: boolean;
  daysToFullMoon: number;
}

/**
 * Calculates celestial moon phase from consecutive streak duration.
 * A 14-day cycle represents the waxing journey from New Moon (0 days) to Full Moon (14+ days),
 * with Supermoon corona after 28 days!
 */
export function getMoonPhaseFromStreak(streak: number): MoonPhaseData {
  const safeStreak = Math.max(0, streak);

  if (safeStreak === 0) {
    return {
      phaseName: 'New Moon',
      phaseGlyph: '🌑',
      illumination: 0.05,
      description: 'Your orbit rests in stillness. Complete today’s rituals to ignite your first sliver of starlight.',
      isFullMoon: false,
      daysToFullMoon: 14,
    };
  }

  if (safeStreak >= 1 && safeStreak <= 3) {
    const illum = 0.15 + (safeStreak / 3) * 0.15;
    return {
      phaseName: 'Waxing Crescent',
      phaseGlyph: '🌒',
      illumination: illum,
      description: 'A delicate crescent awakens. Your daily commitments begin illuminating the night.',
      isFullMoon: false,
      daysToFullMoon: 14 - safeStreak,
    };
  }

  if (safeStreak >= 4 && safeStreak <= 6) {
    return {
      phaseName: 'First Quarter',
      phaseGlyph: '🌓',
      illumination: 0.5,
      description: 'Equilibrium and poise. Half the lunar face radiates with steady discipline.',
      isFullMoon: false,
      daysToFullMoon: 14 - safeStreak,
    };
  }

  if (safeStreak >= 7 && safeStreak <= 13) {
    const illum = 0.65 + ((safeStreak - 7) / 7) * 0.3;
    return {
      phaseName: 'Waxing Gibbous',
      phaseGlyph: '🌔',
      illumination: illum,
      description: 'Luminous and expanding. You are approaching peak celestial fullness.',
      isFullMoon: false,
      daysToFullMoon: 14 - safeStreak,
    };
  }

  if (safeStreak >= 28) {
    return {
      phaseName: 'Radiant Supermoon',
      phaseGlyph: '🌕',
      illumination: 1.0,
      description: 'Supreme celestial harmony! You have maintained a continuous orbit through multiple full lunar cycles.',
      isFullMoon: true,
      daysToFullMoon: 0,
    };
  }

  // 14 to 27 days
  return {
    phaseName: 'Full Moon',
    phaseGlyph: '🌕',
    illumination: 1.0,
    description: '100% Complete Illumination! Your discipline radiates across your entire personal universe.',
    isFullMoon: true,
    daysToFullMoon: 0,
  };
}

/**
 * MOON PHASE INDICATOR
 * Procedural SVG rendering that dynamically computes the illuminated lunar surface,
 * terminator curve, crater textures, and corona radiance according to the user's streak.
 */
export const MoonPhaseIndicator: React.FC<MoonPhaseIndicatorProps> = ({
  streak,
  className = '',
  size = 'md',
  showDetails = true,
}) => {
  const phaseData = getMoonPhaseFromStreak(streak);
  const { illumination, isFullMoon, phaseName, description, daysToFullMoon } = phaseData;

  // SVG Geometry for the Moon Disc (Radius 42, Center at 50,50)
  const R = 38;
  const cx = 50;
  const cy = 50;

  // Compute terminator curve
  // Fraction p ranges from 0 to 1.
  // Right limb is always illuminated during Waxing.
  // Left side boundary depends on whether p < 0.5 (Crescent: curves right) or p > 0.5 (Gibbous: curves left).
  const p = Math.min(1, Math.max(0, illumination));
  const rX = Math.abs((2 * p - 1) * R);
  const sweepTerminator = p >= 0.5 ? 1 : 0;

  // Construct lit path
  let litPath = '';
  if (p <= 0.05) {
    // New moon: tiny sliver or empty
    litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} A ${R * 0.95} ${R} 0 0 0 ${cx} ${cy - R} Z`;
  } else if (p >= 0.98) {
    // Full moon: complete disc
    litPath = `M ${cx - R} ${cy} a ${R} ${R} 0 1 0 ${R * 2} 0 a ${R} ${R} 0 1 0 -${R * 2} 0 Z`;
  } else {
    // Waxing moon (lit on right, terminator on left)
    // Semicircle from top to bottom on the right, then elliptical arc back to top
    litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} A ${rX} ${R} 0 0 ${sweepTerminator} ${cx} ${cy - R} Z`;
  }

  const dimensionMap = {
    sm: { svgSize: 56, textClass: 'text-xs' },
    md: { svgSize: 84, textClass: 'text-sm' },
    lg: { svgSize: 112, textClass: 'text-base' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#121638]/90 via-[#0a0e24]/90 to-[#1b1236]/90 border border-[#a78bfa]/25 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden select-none ${className}`}>
      {/* Background Soft Nebula Aura */}
      <div
        className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          backgroundColor: isFullMoon ? 'rgba(254, 240, 138, 0.18)' : 'rgba(167, 139, 250, 0.12)',
        }}
      />

      {/* Procedural Moon Phase SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Radiant Corona Aura for Full Moon or high streaks */}
        {isFullMoon && (
          <div className="absolute inset-0 rounded-full bg-[#fef08a]/20 blur-xl animate-pulse -z-10" />
        )}

        <svg
          width={dim.svgSize}
          height={dim.svgSize}
          viewBox="0 0 100 100"
          className="transition-transform duration-500 hover:scale-105"
        >
          <defs>
            {/* Outer Compass Gradient */}
            <linearGradient id="orbitRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>

            {/* Dark unlit lunar side */}
            <radialGradient id="unlitMoonGrad" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#1e2242" />
              <stop offset="60%" stopColor="#0f142e" />
              <stop offset="100%" stopColor="#060918" />
            </radialGradient>

            {/* Illuminated lunar face gradient */}
            <radialGradient id="litMoonGrad" cx="65%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fffbeb" />
              <stop offset="55%" stopColor={isFullMoon ? '#fef08a' : '#ddd6fe'} />
              <stop offset="85%" stopColor={isFullMoon ? '#fde047' : '#c4b5fd'} />
              <stop offset="100%" stopColor={isFullMoon ? '#d97706' : '#8b5cf6'} />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="moonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Crater Pattern Filter */}
            <clipPath id="moonDiscClip">
              <circle cx={cx} cy={cy} r={R} />
            </clipPath>
          </defs>

          {/* Celestial Orbit Guideline */}
          <circle
            cx={cx}
            cy={cy}
            r="46"
            fill="none"
            stroke="url(#orbitRingGrad)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />

          {/* Compass Cardinal Starlight Ticks */}
          <circle cx="50" cy="4" r="1.5" fill="#fef08a" opacity="0.9" />
          <circle cx="96" cy="50" r="1.5" fill="#c4b5fd" opacity="0.8" />
          <circle cx="50" cy="96" r="1.5" fill="#f472b6" opacity="0.8" />
          <circle cx="4" cy="50" r="1.5" fill="#c4b5fd" opacity="0.8" />

          {/* Group clipped to Moon Disc */}
          <g clipPath="url(#moonDiscClip)">
            {/* 1. Base Unlit Moon Body */}
            <circle cx={cx} cy={cy} r={R} fill="url(#unlitMoonGrad)" stroke="#1e293b" strokeWidth="0.5" />

            {/* Unlit Maria (Dark ancient lunar basins) */}
            <circle cx="42" cy="42" r="8" fill="#080c1d" opacity="0.5" />
            <circle cx="34" cy="54" r="6" fill="#080c1d" opacity="0.4" />
            <circle cx="52" cy="62" r="9" fill="#080c1d" opacity="0.4" />

            {/* 2. Illuminated Lunar Surface Path */}
            <path
              d={litPath}
              fill="url(#litMoonGrad)"
              filter={isFullMoon ? 'url(#moonGlowFilter)' : undefined}
            />

            {/* Subtle Illuminated Craters */}
            {p > 0.4 && (
              <>
                <circle cx="62" cy="44" r="5" fill="#e2e8f0" opacity="0.25" />
                <circle cx="68" cy="56" r="7" fill="#cbd5e1" opacity="0.2" />
                <circle cx="56" cy="34" r="3.5" fill="#f8fafc" opacity="0.3" />
              </>
            )}
          </g>

          {/* Subtle Outer Lunar Atmosphere Rim */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={isFullMoon ? '#fef08a' : '#c4b5fd'}
            strokeWidth="1.2"
            strokeOpacity={isFullMoon ? 0.7 : 0.4}
          />

          {/* Star Sparkles around moon if illuminated */}
          {p >= 0.5 && (
            <path
              d="M 88 22 Q 88 26 92 26 Q 88 26 88 30 Q 88 26 84 26 Q 88 26 88 22 Z"
              fill="#fef08a"
              opacity="0.8"
            />
          )}
        </svg>

        {/* Phase Glyph Mini Badge */}
        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/40 text-xs shadow-md">
          <span>{phaseData.phaseGlyph}</span>
        </div>
      </div>

      {/* Moon Phase Telemetry & Description */}
      {showDetails && (
        <div className="flex-1 space-y-1.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] text-[#c4b5fd] uppercase tracking-wider font-semibold font-['Cinzel',serif] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#fef08a]" />
              <span>MOON PHASE INDICATOR</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2e1065] text-[#fef08a] text-[10px] font-semibold border border-[#a78bfa]/30 font-sans">
              {Math.round(illumination * 100)}% ILLUMINATED
            </span>
          </div>

          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Cinzel',serif] tracking-wide">
              {phaseName}
            </h3>
            <span className="text-xs text-[#c4b5fd] font-medium font-sans">
              ({streak} {streak === 1 ? 'Day' : 'Days'} Orbit)
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-xl">
            {description}
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400 font-sans">
            {!isFullMoon ? (
              <span className="text-[#fef08a] font-medium flex items-center gap-1">
                <Star className="w-3 h-3 text-[#fbbf24]" />
                <span>{daysToFullMoon} day{daysToFullMoon === 1 ? '' : 's'} until Full Moon Alignment</span>
              </span>
            ) : (
              <span className="text-[#34d399] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#34d399]" />
                <span>Full Moon Harmony Active! Preserve every daily ritual.</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
