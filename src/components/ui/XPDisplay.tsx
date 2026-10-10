import React from 'react';
import { getLevelProgress } from '../../config/progression';
import { ProgressBar } from './ProgressBar';
import { Sparkles } from 'lucide-react';

interface XPDisplayProps {
  totalXP: number;
  showLevel?: boolean;
  className?: string;
  compact?: boolean;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  totalXP,
  showLevel = true,
  className = '',
  compact = false,
}) => {
  const { level, currentLevelXP, nextLevelXP, progressPercent } = getLevelProgress(totalXP);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 font-sans text-xs ${className}`}>
        {showLevel && (
          <span className="px-2 py-0.5 rounded-full bg-[#1e1b4b] text-[#c4b5fd] font-semibold border border-[#a78bfa]/30 text-[11px]">
            LVL {level}
          </span>
        )}
        <div className="w-24">
          <ProgressBar progress={progressPercent} color="blue" height="xs" />
        </div>
        <span className="text-slate-300 text-[11px]">
          {currentLevelXP}/{nextLevelXP} XP
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-baseline font-sans">
        <div className="flex items-center gap-2">
          {showLevel && (
            <span className="text-xs font-bold text-[#c4b5fd] tracking-wider uppercase font-['Cinzel',serif]">
              LEVEL {level}
            </span>
          )}
          <span className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-[#fef08a]" />
            STARDUST XP
          </span>
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">{currentLevelXP.toLocaleString()}</span>
          <span className="text-slate-400"> / {nextLevelXP.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-[#0a0e24] border border-[#a78bfa]/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#c4b5fd] to-[#fef08a] rounded-full transition-all duration-500 shadow-[0_0_8px_#c4b5fd]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
