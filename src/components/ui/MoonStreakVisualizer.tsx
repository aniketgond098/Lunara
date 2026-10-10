import React from 'react';
import { Moon, Sparkles, Star } from 'lucide-react';

interface MoonStreakVisualizerProps {
  streak: number;
  longestStreak?: number;
  className?: string;
  showDetails?: boolean;
}

/**
 * MOON STREAK VISUALIZATION
 * Displays 7 recent days as progressive moon phases:
 * New Moon -> Waxing Crescent -> First Quarter -> Waxing Gibbous -> Full Moon.
 * Connected by a luminous starlight filament.
 */
export const MoonStreakVisualizer: React.FC<MoonStreakVisualizerProps> = ({
  streak,
  longestStreak = streak,
  className = '',
  showDetails = true,
}) => {
  const nodeCount = 7;
  const activeNodesCount = Math.min(streak, nodeCount);

  // Array of moon phase SVGs or symbols
  const moonPhaseGlyphs = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗'];

  return (
    <div className={`p-5 rounded-2xl bg-[#090d22]/90 border border-[#a78bfa]/25 font-sans relative overflow-hidden backdrop-blur-md shadow-lg ${className}`}>
      {/* Background Soft Starlight Aurora Accent */}
      <div className="absolute right-0 top-0 bottom-0 w-44 bg-gradient-to-l from-[#a78bfa]/10 via-[#c4b5fd]/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2e1065]/60 border border-[#a78bfa]/40 text-[#c4b5fd]">
            <Moon className="w-4 h-4 fill-[#c4b5fd]/40" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-['Cinzel',serif]">
              MOON STREAK
            </h4>
            <p className="text-[10px] text-[#cbd5e1] font-sans">
              Celestial Consistency Cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1b4b]/80 border border-[#c4b5fd]/30 text-xs text-[#fef08a] font-medium shadow-[0_0_12px_rgba(254,240,138,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span>{streak} {streak === 1 ? 'DAY' : 'DAYS'} IN ORBIT</span>
        </div>
      </div>

      {/* Connected Moon Phases Timeline */}
      <div className="relative py-3 px-2">
        {/* Horizontal Starlight Filament Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#1e293b] z-0">
          <div
            className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#c4b5fd] to-[#fef08a] transition-all duration-700 shadow-[0_0_10px_#c4b5fd]"
            style={{
              width: streak > 0 ? `${Math.min(100, Math.max(12, (activeNodesCount / nodeCount) * 100))}%` : '0%',
            }}
          />
        </div>

        {/* Individual Moon Phase Nodes */}
        <div className="flex items-center justify-between relative z-10">
          {Array.from({ length: nodeCount }).map((_, index) => {
            const isToday = index === nodeCount - 1;
            const isActive = streak > 0 && index >= nodeCount - activeNodesCount;

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 select-none
                    ${
                      isToday
                        ? isActive
                          ? 'bg-[#2e1065] border-2 border-[#fef08a] shadow-[0_0_16px_rgba(254,240,138,0.7)] scale-110'
                          : 'bg-[#0f172a] border-2 border-dashed border-[#a78bfa]/50 text-slate-400'
                        : isActive
                        ? 'bg-[#1e1b4b] border border-[#c4b5fd] shadow-[0_0_10px_rgba(196,181,253,0.5)]'
                        : 'bg-[#0a0f20] border border-[#334155]'
                    }
                  `}
                >
                  {isToday ? (
                    <span className="text-xs leading-none">🌕</span>
                  ) : isActive ? (
                    <span className="text-[11px] leading-none">{moonPhaseGlyphs[index]}</span>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#334155]" />
                  )}
                </div>

                <span
                  className={`text-[9px] font-sans tracking-wide uppercase ${
                    isToday ? 'text-[#fef08a] font-bold' : isActive ? 'text-[#c4b5fd]' : 'text-slate-500'
                  }`}
                >
                  {isToday ? 'TODAY' : `D-${nodeCount - 1 - index}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-[#a78bfa]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Longest Orbit: <strong className="text-white font-medium">{longestStreak} days</strong></span>
          </span>
          <span className="text-[#c4b5fd]/90 text-[11px]">
            {streak === 0 ? 'Complete today’s rituals to ignite your moon streak.' : 'Complete every daily ritual to preserve your cosmic alignment.'}
          </span>
        </div>
      )}
    </div>
  );
};

export const WebStreakVisualizer = MoonStreakVisualizer;
