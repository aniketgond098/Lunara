import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  X,
  Database,
  User,
  Sparkles,
  Moon,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LunaraLogo } from '../ui/LunaraLogo';
import { getLevelProgress } from '../../config/progression';
import { LunarGemIcon } from '../ui/LunarGemDisplay';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const {
    user,
    syncStatus,
    isSupabaseReady,
    profile,
    notifications,
    markNotificationRead,
    clearNotifications,
    toggleSound,
    setActiveTab,
    setAuthModalOpen,
    setAccountModalOpen,
    setSupabaseConfigModalOpen,
    hasSecretKeyError,
    isMissingTablesError,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { level, currentLevelXP, nextLevelXP, progressPercent } = getLevelProgress(profile.totalXP);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full box-border border-b border-[#a78bfa]/20 px-3 sm:px-8 py-2 sm:py-3 min-h-[3.75rem] sm:min-h-[4.5rem] flex items-center justify-between bg-[#050814]/90 backdrop-blur-md select-none overflow-x-clip">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2 sm:gap-4 min-w-0">
        {/* Left: Mobile Logo or Desktop Celestial Stats */}
        <div className="flex items-center gap-2 sm:gap-8 min-w-0 shrink-0">
          <div className="lg:hidden shrink-0">
            <LunaraLogo size="sm" showText={true} />
          </div>

          <div className="hidden sm:flex items-center gap-6 lg:gap-8 font-sans">
            {/* Account / Sign In Pill */}
            {!user ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2e1065] to-[#1e1b4b] hover:from-[#3b1580] hover:to-[#282463] border border-[#c4b5fd]/40 text-white transition-all text-xs font-medium shadow-[0_0_12px_rgba(167,139,250,0.2)] cursor-pointer"
                title="Sign in with your email and password"
              >
                <User className="w-3.5 h-3.5 text-[#fef08a]" />
                <span className="font-['Cinzel',serif] tracking-wider">SIGN IN</span>
              </button>
            ) : (
              <div
                onClick={() => setAccountModalOpen(true)}
                className="cursor-pointer group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0e1330] border border-[#a78bfa]/25 hover:border-[#c4b5fd]/60 transition-all"
                title="Click to view Account Settings"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <div className="text-left">
                  <p className="text-[9px] text-[#c4b5fd] font-semibold uppercase tracking-wider font-['Cinzel',serif]">
                    LOGGED IN
                  </p>
                  <p className="text-xs font-medium text-white truncate max-w-[130px]">
                    {user.email || profile.username}
                  </p>
                </div>
              </div>
            )}

            {/* Level & Stardust XP Quick Peek */}
            <div
              onClick={() => setActiveTab('ASCEND')}
              className="cursor-pointer group hidden md:block"
              title="Click to view Evolution progress"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white font-['Cinzel',serif]">
                  LEVEL {level}
                </span>
                <span className="text-[10px] text-[#c4b5fd] font-sans">
                  {currentLevelXP}/{nextLevelXP} XP
                </span>
              </div>
              <div className="w-28 h-1.5 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/25 overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#fef08a] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Gems, Moon Streak, Notifications, Audio */}
        <div className="flex items-center gap-1.5 sm:gap-3 font-sans shrink-0">
          {/* Mobile Login Button when not logged in */}
          {!user && (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#2e1065] to-[#1e1b4b] border border-[#c4b5fd]/40 text-white text-[10px] font-['Cinzel',serif] cursor-pointer shrink-0"
              title="Sign in with your email and password"
            >
              <User className="w-3 h-3 text-[#fef08a]" />
              <span>SIGN IN</span>
            </button>
          )}

          {/* Luni AI Quick Launch (Desktop/Tablet) */}
          <button
            onClick={() => setActiveTab('ASSISTANT')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#2e1065]/70 to-[#1e1b4b]/70 hover:from-[#3b1580] hover:to-[#282463] border border-[#c4b5fd]/40 text-white transition-all shadow-[0_0_10px_rgba(167,139,250,0.18)] cursor-pointer text-[10px] font-medium shrink-0"
            title="Open Luni Celestial AI Guide"
          >
            <Bot className="w-2.5 h-2.5 text-[#fef08a]" />
            <span className="font-['Cinzel',serif] tracking-wider">LUNI AI</span>
          </button>

          {/* Lunar Gems Display Badge */}
          <button
            onClick={() => setActiveTab('REWARDS')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#0e1330] hover:bg-[#161d48] border border-[#fbbf24]/30 hover:border-[#fbbf24]/60 transition-all text-[11px] sm:text-xs text-white cursor-pointer shrink-0"
            title="Lunar Gems Balance - Click to open Celestial Market"
          >
            <LunarGemIcon size={13} glow={false} />
            <span className="font-semibold">{profile.currentEssence.toLocaleString()}</span>
          </button>

          {/* Moon Streak Quick Badge */}
          <button
            onClick={() => setActiveTab('TRACKING')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1330] hover:bg-[#161d48] border border-[#c4b5fd]/30 hover:border-[#c4b5fd]/60 transition-all text-xs text-[#c4b5fd] cursor-pointer shrink-0"
            title="Moon Streak - Click to view Star Log"
          >
            <Moon className="w-3.5 h-3.5 text-[#fef08a] fill-[#fef08a]/30" />
            <span className="font-medium text-white">{profile.currentStreak}d</span>
          </button>

          {/* Audio Button */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-[#a78bfa]/20 cursor-pointer shrink-0"
            title={profile.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            aria-label="Toggle Audio"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c4b5fd]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-[#a78bfa]/20 cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-2xl bg-[#090d24]/95 border border-[#a78bfa]/30 backdrop-blur-xl shadow-2xl z-50 p-4 font-sans text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#a78bfa]/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#fef08a]" />
                    <span className="font-semibold text-white tracking-wider font-['Cinzel',serif]">
                      CELESTIAL CHRONICLES
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[10px] text-slate-400 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No celestial notices at this time.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          n.read
                            ? 'bg-transparent border-[#1e293b]/50 text-slate-400'
                            : 'bg-[#151a3d] border-[#a78bfa]/30 text-white shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-white font-['Cinzel',serif]">{n.title}</span>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c4b5fd]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Trigger */}
          <button
            onClick={() => setActiveTab('PROFILE')}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="My Universe Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#ec4899] p-0.5 shadow-[0_0_10px_rgba(167,139,250,0.3)]">
              <div className="w-full h-full rounded-full bg-[#090d24] flex items-center justify-center font-bold text-xs text-[#c4b5fd] font-['Cinzel',serif]">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'L'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
