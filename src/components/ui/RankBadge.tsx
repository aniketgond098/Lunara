import React from 'react';
import { RankTier } from '../../types';
import { RANK_CONFIG } from '../../config/progression';
import { Sparkles } from 'lucide-react';

interface RankBadgeProps {
  rank: RankTier;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  className?: string;
  glow?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 'md',
  showLabel = false,
  className = '',
  glow = true,
}) => {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.E;

  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg font-bold',
    hero: 'w-20 h-20 text-3xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative flex items-center justify-center font-['Cinzel',serif] rounded-xl uppercase tracking-wider select-none transition-transform duration-300 hover:scale-105 ${sizeStyles[size]}`}
        style={{
          backgroundColor: '#0a0e24',
          border: `1.5px solid ${config.color}`,
          boxShadow: glow ? `0 0 16px ${config.glowColor}` : undefined,
          color: config.color,
        }}
      >
        {/* Subtle corner starlight dots */}
        <div
          className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.color, boxShadow: `0 0 4px ${config.color}` }}
        />
        <div
          className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.color, boxShadow: `0 0 4px ${config.color}` }}
        />
        
        <span>{rank}</span>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-white tracking-wide font-['Cinzel',serif]">
              {config.codename}
            </span>
            <Sparkles className="w-3 h-3 text-[#fef08a]" />
          </div>
          <span className="text-[10px] text-[#c4b5fd]/80 font-sans tracking-wider uppercase font-medium">
            Constellation Rank {rank}
          </span>
        </div>
      )}
    </div>
  );
};
