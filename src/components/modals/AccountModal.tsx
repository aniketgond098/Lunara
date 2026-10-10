import React, { useState } from 'react';
import { User, Mail, LogOut, Database, X, Sparkles, Check } from 'lucide-react';
import { authService } from '../../services/authService';
import { UserProfile } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: UserProfile;
  syncStatus: 'SYNCED' | 'SYNCING' | 'OFFLINE' | 'LOCAL';
  onSignOut: () => void;
  onOpenConfig: () => void;
  onUpdateUsername: (newName: string) => Promise<void>;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  syncStatus,
  onSignOut,
  onOpenConfig,
  onUpdateUsername,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveUsername = async () => {
    if (!username.trim() || username.trim() === profile.username) return;
    setIsSaving(true);
    try {
      await onUpdateUsername(username.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090d24] border border-[#a78bfa]/35 shadow-[0_0_50px_rgba(167,139,250,0.2)] overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#a78bfa]/20 bg-gradient-to-r from-[#181136] via-[#090d22] to-[#1a1236] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e1065] border border-[#a78bfa]/40 text-[#fef08a] shadow-[0_0_15px_rgba(167,139,250,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['Cinzel',serif]">
                YOUR ACCOUNT
              </h2>
              <p className="text-xs text-[#c4b5fd]">
                Active Lunara Stargazer Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status Badge */}
          <div className="p-3.5 rounded-2xl bg-[#0e1330] border border-[#a78bfa]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <div>
                <p className="font-semibold text-white">Active &amp; Connected</p>
                <p className="text-[10px] text-slate-400">Your habits and milestones are automatically preserved</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-[11px] uppercase font-bold tracking-wider mb-1.5 font-['Cinzel',serif]">
                  EMAIL ADDRESS
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#0e1330] border border-[#a78bfa]/25 text-white">
                  <Mail className="w-4 h-4 text-[#c4b5fd]" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] uppercase font-bold tracking-wider mb-1.5 font-['Cinzel',serif]">
                  STARGAZER NAME
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0e1330] border border-[#a78bfa]/30 text-white focus:border-[#c4b5fd] focus:outline-none text-xs"
                  />
                  <button
                    onClick={handleSaveUsername}
                    disabled={isSaving || username === profile.username}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-bold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer font-['Cinzel',serif] text-xs shrink-0"
                  >
                    {isSaving ? 'SAVING...' : savedSuccess ? 'SAVED!' : 'SAVE'}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#a78bfa]/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#c4b5fd]" />
                  <span>Cloud Database Settings</span>
                </button>

                <button
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer font-['Cinzel',serif] text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-300 text-xs">
                You are currently exploring in guest mode. Sign in to sync your journey across all devices.
              </p>
              <button
                onClick={onSignOut}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-bold uppercase tracking-wider font-['Cinzel',serif] text-xs cursor-pointer shadow-md"
              >
                SIGN IN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
