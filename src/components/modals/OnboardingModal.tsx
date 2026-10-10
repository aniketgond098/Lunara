import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { LunaraLogo } from '../ui/LunaraLogo';
import { Sparkles, ArrowRight, X, Moon, Star } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { initializeProfile } = useApp();
  const [step, setStep] = useState<'INPUT' | 'CONFIRMATION'>('INPUT');
  const [codename, setCodename] = useState('');
  const [usePreset, setUsePreset] = useState(true);

  if (!isOpen) return null;

  const handleDismiss = () => {
    localStorage.setItem('lunara_onboarding_completed', 'true');
    onClose();
  };

  const handleBegin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim()) return;
    localStorage.setItem('lunara_onboarding_completed', 'true');
    initializeProfile(codename.trim(), usePreset);
    setStep('CONFIRMATION');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/95 backdrop-blur-xl font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#090d24] border-2 border-[#a78bfa]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(167,139,250,0.2)] relative text-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <LunaraLogo size="hero" showText={true} className="justify-center mb-3" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/30 text-xs text-[#c4b5fd]">
            <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>WELCOME TO YOUR PERSONAL UNIVERSE</span>
          </div>
        </div>

        {step === 'INPUT' ? (
          <form onSubmit={handleBegin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-['Cinzel',serif] mb-2">
                STARGAZER NAME
              </label>
              <input
                type="text"
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                placeholder="Enter your name (e.g. Selena, Aurora, Lyra)..."
                className="w-full px-4 py-3 rounded-2xl bg-[#121638] border border-[#a78bfa]/30 text-sm text-white focus:outline-none focus:border-[#c4b5fd] transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0e1230] border border-[#a78bfa]/20 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePreset}
                  onChange={(e) => setUsePreset(e.target.checked)}
                  className="rounded border-slate-700 text-[#8b5cf6] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-white font-medium">
                  Initialize with Starter Celestial Rituals & Quests
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                Includes gentle morning gratitude, mindful hydration, deep focus blocks, and peaceful moon sleep.
              </p>
            </div>

            <button
              type="submit"
              disabled={!codename.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all cursor-pointer font-['Cinzel',serif] tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>ENTER YOUR UNIVERSE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-[#1e1b4b] border border-[#c4b5fd] text-[#fef08a] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(196,181,253,0.4)]">
              <Moon className="w-8 h-8 fill-[#fef08a]" />
            </div>

            <h3 className="text-xl font-bold text-white font-['Cinzel',serif] tracking-wider">
              ALIGNMENT COMPLETE
            </h3>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Welcome, <strong>{codename}</strong>. Your star charts are prepared. Complete your rituals daily to preserve your Moon Streak and elevate your Constellation Rank.
            </p>

            <button
              onClick={handleDismiss}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] font-['Cinzel',serif] tracking-wider cursor-pointer"
            >
              BEGIN YOUR FIRST DAY
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
