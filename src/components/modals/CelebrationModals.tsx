import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { RankBadge } from '../ui/RankBadge';
import { RankTier } from '../../types';
import { Sparkles, Trophy, Award, Moon, Star } from 'lucide-react';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { RANK_CONFIG } from '../../config/progression';

export const CelebrationModals: React.FC = () => {
  const { celebration, closeCelebration } = useApp();

  useEffect(() => {
    if (!celebration.type) return;

    if (celebration.type === 'RANK_UP') {
      // Celestial firework confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#c4b5fd', '#fef08a', '#f472b6', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 80,
          origin: { x: 0 },
          colors: ['#c4b5fd', '#fef08a'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 80,
          origin: { x: 1 },
          colors: ['#c4b5fd', '#f472b6'],
        });
      }, 250);
    } else if (celebration.type === 'LEVEL_UP' || celebration.type === 'PERFECT_DAY') {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#c4b5fd', '#fef08a', '#ffffff', '#ec4899'],
      });
    }
  }, [celebration]);

  if (!celebration.type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCelebration}
          className="fixed inset-0 bg-[#040612]/85 backdrop-blur-xl"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
          className="relative w-full max-w-md bg-[#090d24] border-2 border-[#a78bfa]/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(167,139,250,0.3)] z-10 font-sans"
        >
          {/* Subtle Corner Starlight Nodes */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c4b5fd] shadow-[0_0_6px_#c4b5fd]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a]" />

          {/* 1. LEVEL UP CELEBRATION */}
          {celebration.type === 'LEVEL_UP' && (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2e1065] border border-[#c4b5fd] text-[#fef08a] mb-4 shadow-[0_0_25px_rgba(167,139,250,0.4)]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <p className="text-xs text-[#c4b5fd] font-semibold tracking-[0.2em] uppercase mb-1 font-['Cinzel',serif]">
                ASTRAL ASCENSION
              </p>
              <h2 className="text-2xl font-bold text-white uppercase font-['Cinzel',serif] tracking-wider mb-2">
                LEVEL ADVANCED
              </h2>

              <div className="my-6 py-4 px-6 rounded-2xl bg-[#121638] border border-[#a78bfa]/30 flex items-center justify-center gap-4">
                <span className="text-2xl font-semibold text-slate-400 font-['Cinzel',serif]">
                  LVL {(celebration.data as { oldLevel: number; newLevel: number })?.oldLevel || 1}
                </span>
                <span className="text-[#fef08a] text-xl font-bold">→</span>
                <span className="text-3xl font-bold text-[#c4b5fd] drop-shadow-[0_0_12px_rgba(196,181,253,0.8)] font-['Cinzel',serif]">
                  LVL {(celebration.data as { oldLevel: number; newLevel: number })?.newLevel || 2}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                Your dedication radiates brighter across the cosmos. You've earned a bounty of <strong>+50 Lunar Gems</strong>!
              </p>

              <button
                onClick={closeCelebration}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:scale-[1.02] active:scale-95 transition-all font-['Cinzel',serif] tracking-wider"
              >
                EMBRACE YOUR GROWTH
              </button>
            </div>
          )}

          {/* 2. RANK UP CELEBRATION */}
          {celebration.type === 'RANK_UP' && (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2e1d09] border border-[#fbbf24] text-[#fbbf24] mb-4 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
                <Star className="w-8 h-8 fill-[#fbbf24] animate-spin" />
              </div>

              <p className="text-xs text-[#fbbf24] font-semibold tracking-[0.2em] uppercase mb-1 font-['Cinzel',serif]">
                CONSTELLATION ASCENSION
              </p>
              <h2 className="text-2xl font-bold text-white uppercase font-['Cinzel',serif] tracking-wider mb-2">
                NEW CONSTELLATION RANK
              </h2>

              <div className="my-6 p-4 rounded-2xl bg-[#121638] border border-[#fbbf24]/40 flex flex-col items-center gap-2">
                <RankBadge
                  rank={(celebration.data as { newRank: RankTier })?.newRank || 'D'}
                  size="hero"
                  glow={true}
                />
                <span className="text-base font-bold text-white font-['Cinzel',serif] mt-1">
                  {RANK_CONFIG[(celebration.data as { newRank: RankTier })?.newRank || 'D']?.codename}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                You have fulfilled <strong>180 days</strong> of dedicated discipline. You receive a grand ascension bounty of <strong>+500 Lunar Gems</strong>!
              </p>

              <button
                onClick={closeCelebration}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white text-xs font-semibold shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-[1.02] active:scale-95 transition-all font-['Cinzel',serif] tracking-wider"
              >
                CLAIM CONSTELLATION ASCENSION
              </button>
            </div>
          )}

          {/* 3. PERFECT DAY CELEBRATION */}
          {celebration.type === 'PERFECT_DAY' && (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e1b4b] border border-[#c4b5fd] text-[#fef08a] mb-4 shadow-[0_0_25px_rgba(196,181,253,0.4)]">
                <Moon className="w-8 h-8 fill-[#fef08a] animate-pulse" />
              </div>

              <p className="text-xs text-[#c4b5fd] font-semibold tracking-[0.2em] uppercase mb-1 font-['Cinzel',serif]">
                FULL MOON HARMONY
              </p>
              <h2 className="text-2xl font-bold text-white uppercase font-['Cinzel',serif] tracking-wider mb-2">
                FULL MOON DAY ACHIEVED
              </h2>

              <div className="my-6 py-4 px-6 rounded-2xl bg-[#121638] border border-[#a78bfa]/30 flex flex-col items-center gap-1">
                <span className="text-3xl">🌕</span>
                <span className="text-sm font-semibold text-[#fef08a] font-['Cinzel',serif] mt-1">
                  100% Objectives Aligned
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                Every active required quest and daily ritual is complete. You receive <strong>+100 Stardust XP</strong> and <strong>+100 Lunar Gems</strong>!
              </p>

              <button
                onClick={closeCelebration}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:scale-[1.02] active:scale-95 transition-all font-['Cinzel',serif] tracking-wider"
              >
                SAVOR THE HARMONY
              </button>
            </div>
          )}

          {/* 4. PURCHASE CELEBRATION */}
          {celebration.type === 'PURCHASE' && (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2e1d09] border border-[#fbbf24] text-[#fbbf24] mb-4 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                <LunarGemIcon size={32} glow={true} />
              </div>

              <p className="text-xs text-[#fbbf24] font-semibold tracking-[0.2em] uppercase mb-1 font-['Cinzel',serif]">
                CELESTIAL MARKET
              </p>
              <h2 className="text-2xl font-bold text-white uppercase font-['Cinzel',serif] tracking-wider mb-2">
                BOUNTY UNLOCKED
              </h2>

              <div className="my-6 py-4 px-6 rounded-2xl bg-[#121638] border border-[#a78bfa]/30">
                <p className="text-base font-semibold text-white font-['Cinzel',serif]">
                  {(celebration.data as { rewardName: string })?.rewardName || 'Celestial Sanctuary'}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                You’ve earned this sacred recharge through consistent discipline. Enjoy every moment guilt-free!
              </p>

              <button
                onClick={closeCelebration}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white text-xs font-semibold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] active:scale-95 transition-all font-['Cinzel',serif] tracking-wider"
              >
                ENJOY YOUR SANCTUARY
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
