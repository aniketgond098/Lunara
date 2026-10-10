import React from 'react';
import { UploadCloud, CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';

interface MigrationPromptModalProps {
  isOpen: boolean;
  onImport: () => void;
  onStartFresh: () => void;
  importing: boolean;
}

export const MigrationPromptModal: React.FC<MigrationPromptModalProps> = ({
  isOpen,
  onImport,
  onStartFresh,
  importing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090D24] border border-[#a78bfa]/40 shadow-[0_0_50px_rgba(167,139,250,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#a78bfa]/20 bg-[#070b1a] flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#2e1065] border border-[#a78bfa]/40 text-[#fef08a]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white uppercase tracking-wider font-['Cinzel',serif]">
              LOCAL STAR DATA DETECTED
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Synchronize Device Records to Celestial Cloud
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            We discovered existing stargazer records stored in your browser's local cache.
            Since <strong className="text-white">Supabase PostgreSQL is your permanent celestial home</strong>, you can migrate your existing rituals, quests, and Lunar Gems into your cloud account.
          </p>

          <div className="p-4 rounded-2xl bg-[#0e1330] border border-[#a78bfa]/20 space-y-2 text-[11px]">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Preserves your custom rituals, quests, and moon streak</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transfers your gathered Stardust XP and Lunar Gems</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stores your constellation permanently across all your devices</span>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onImport}
              disabled={importing}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-semibold text-xs transition-all shadow-[0_0_20px_rgba(167,139,250,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer font-['Cinzel',serif] tracking-wider"
            >
              {importing ? (
                <span>Synchronizing to Celestial Cloud...</span>
              ) : (
                <>
                  <span>MIGRATE TO CLOUD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={onStartFresh}
              disabled={importing}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#121638] hover:bg-[#1a204d] text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
