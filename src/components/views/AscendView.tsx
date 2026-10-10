import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Award,
  Lock,
  CheckCircle2,
  Star,
  Moon,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RankBadge } from '../ui/RankBadge';
import { RANK_CONFIG, RANK_ORDER, getRankProgress, getLevelProgress } from '../../config/progression';
import { CelestialIcon } from '../ui/CelestialIcon';

export const AscendView: React.FC = () => {
  const { profile } = useApp();

  const rankProgress = getRankProgress(profile.totalSuccessfulDays ?? profile.consistencyDaysCompleted ?? 0);
  const currentRankInfo = RANK_CONFIG[profile.rank];
  const nextRankInfo = rankProgress.nextRank ? RANK_CONFIG[rankProgress.nextRank] : null;
  const { level, currentLevelXP, nextLevelXP, progressPercent: xpPercent } = getLevelProgress(profile.totalXP);

  // Reverse ladder: Top is SSS, Bottom is E
  const reversedRanks = [...RANK_ORDER].reverse();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <TrendingUp className="w-4 h-4 text-[#fbbf24]" />
            <span>CONSTELLATION ASCENSION · SACRED EVOLUTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            CELESTIAL EVOLUTION
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Grow through increasingly radiant constellations through steady, daily discipline.
          </p>
        </div>
      </div>

      {/* 2. Core Philosophy: Stardust XP vs Consistency Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#1e1b4b] text-[#c4b5fd] border border-[#a78bfa]/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider">
                STARDUST XP = ASTRAL LEVEL (DAILY MOMENTUM)
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                Stardust XP measures daily ritual and quest completions. Astral levels advance frequently, unlocking Lunar Gem bonuses and reflecting short-term momentum.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#090d24]/90 border border-[#fbbf24]/25 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#2e1d09] text-[#fde047] border border-[#fbbf24]/30 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider">
                SUCCESSFUL DAYS = CONSTELLATION RANK (LONG-TERM MASTERY)
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                <strong>1 Calendar Day with all Core Directives & Rituals complete = +1 Day towards Constellation Rank.</strong> Advancing each tier requires <strong>180 disciplined days</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Evolution Milestone Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121638] via-[#090d22] to-[#1c1236] border border-[#a78bfa]/30 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Current Rank */}
          <div className="flex items-center gap-4">
            <RankBadge rank={profile.rank} size="hero" glow={true} />
            <div>
              <span className="text-[10px] text-[#c4b5fd] uppercase tracking-wider font-semibold">
                ACTIVE CONSTELLATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] tracking-wide mt-0.5">
                {currentRankInfo.codename}
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-1">
                {currentRankInfo.description}
              </p>
            </div>
          </div>

          {/* Progress Bar & Counter */}
          <div className="space-y-2 lg:col-span-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-slate-300 font-medium">
                {rankProgress.isMaxRank ? 'Supreme Constellation Achieved' : `Progress to ${nextRankInfo?.codename || 'Next Rank'}`}
              </span>
              <span className="text-[#fef08a] font-bold font-['Cinzel',serif]">
                {rankProgress.successfulDaysForCurrentRank} / {rankProgress.requiredSuccessfulDaysForCurrentRank} DAYS ({rankProgress.progressPercent}%)
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#0a0e24] border border-[#a78bfa]/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#c4b5fd] to-[#fef08a] rounded-full transition-all duration-700 shadow-[0_0_12px_#c4b5fd]"
                style={{ width: `${rankProgress.progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-sans pt-1">
              <span>Total Lifetime Days: <strong className="text-white">{rankProgress.totalSuccessfulDays}</strong></span>
              {!rankProgress.isMaxRank && (
                <span>Days Remaining: <strong className="text-[#c4b5fd]">{rankProgress.daysRemaining} days</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Constellation Ladder (E to SSS) */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-[#fef08a]" />
          <span>CONSTELLATION ASCENSION LADDER</span>
        </h3>

        <div className="space-y-3">
          {reversedRanks.map((tier) => {
            const info = RANK_CONFIG[tier];
            const isCurrent = profile.rank === tier;
            const isUnlocked = RANK_ORDER.indexOf(profile.rank) >= RANK_ORDER.indexOf(tier);

            return (
              <div
                key={tier}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#20143d] via-[#101438] to-[#1c1236] border-[#fef08a]/60 shadow-[0_0_25px_rgba(254,240,138,0.2)]'
                    : isUnlocked
                    ? 'bg-[#090d24]/90 border-[#a78bfa]/30 text-white'
                    : 'bg-[#060816]/70 border-[#1e293b]/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <RankBadge rank={tier} size="md" glow={isCurrent} />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white font-['Cinzel',serif] tracking-wide">
                        {info.codename}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({info.name})
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fef08a] text-[#1e1b4b] font-bold font-sans">
                          YOU ARE HERE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      {info.lore}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <span className="text-slate-400 font-sans">
                    {info.requiredDaysPerTier} Days / Tier
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[#34d399] font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aligned</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Lock className="w-4 h-4" />
                      <span>Ascending</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
