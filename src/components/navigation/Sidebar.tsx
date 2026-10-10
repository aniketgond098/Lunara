import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  User,
  Volume2,
  VolumeX,
  Bot,
  Calendar,
  CheckCircle,
  Moon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { LunaraLogo } from '../ui/LunaraLogo';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, toggleSound } = useApp();

  const navItems: {
    id: ActiveTab;
    label: string;
    glyph: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'TODAY', label: 'MOON HUB', glyph: '🌕', icon: Compass },
    { id: 'ASSISTANT', label: 'LUNI AI', glyph: '✨', icon: Bot, badge: 'GUIDE' },
    { id: 'MISSIONS', label: 'QUESTS', glyph: '✦', icon: Target },
    { id: 'HABITS', label: 'RITUALS', glyph: '✧', icon: CheckCircle },
    { id: 'TRACKING', label: 'STAR LOG', glyph: '☽', icon: Calendar },
    { id: 'REWARDS', label: 'CELESTIAL MARKET', glyph: '💎', icon: Sparkles },
    { id: 'ASCEND', label: 'EVOLUTION', glyph: '↗', icon: TrendingUp, badge: `RANK ${profile.rank}` },
    { id: 'PROFILE', label: 'MY UNIVERSE', glyph: '◎', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#070b1a]/95 border-r border-[#a78bfa]/20 fixed top-0 bottom-0 left-0 h-screen h-[100dvh] justify-between select-none z-30 shrink-0 backdrop-blur-xl">
      {/* Top Header & Logo */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-7 pb-6 flex items-center shrink-0">
          <LunaraLogo size="md" showText={true} />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 font-['Cinzel',serif] overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer rounded-xl
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2e1065]/80 to-[#1e1b4b]/60 border border-[#c4b5fd]/40 text-white shadow-[0_0_20px_rgba(167,139,250,0.18)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${isActive ? 'text-[#fef08a]' : 'opacity-60 text-[#c4b5fd]'}`}>
                    {item.glyph}
                  </span>
                  <span className="font-['Cinzel',serif] tracking-[0.16em] uppercase">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#1e1b4b] text-[#c4b5fd] border border-[#a78bfa]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User ID Block & Audio Toggle */}
      <div className="p-5 mt-auto border-t border-[#a78bfa]/15 flex flex-col gap-3 shrink-0 bg-[#060918]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2e1065] to-[#0a0e24] border border-[#a78bfa]/50 flex items-center justify-center font-bold text-xs text-[#fef08a] shrink-0 shadow-[0_0_12px_rgba(167,139,250,0.25)] font-['Cinzel',serif]">
              {profile.rank}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#c4b5fd]/80 font-sans tracking-wider uppercase font-medium">STARGAZER</p>
              <p className="text-sm text-white font-medium truncate tracking-wide font-['Cinzel',serif]">{profile.username}</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-[#c4b5fd] transition-colors border border-transparent hover:border-[#a78bfa]/30 cursor-pointer"
            title={profile.soundEnabled ? 'Mute Celestial Audio' : 'Unmute Celestial Audio'}
            aria-label="Toggle Sound"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#c4b5fd]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
