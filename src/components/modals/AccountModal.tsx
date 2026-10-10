import React, { useState } from 'react';
import { User, Mail, Shield, Key, LogOut, Database, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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
  const [resetSent, setResetSent] = useState(false);

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

  const handleSendReset = async () => {
    if (!user?.email) return;
    try {
      await supabase.auth.resetPasswordForEmail(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090d24] border border-[#a78bfa]/35 shadow-[0_0_50px_rgba(167,139,250,0.2)] overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#a78bfa]/20 bg-gradient-to-r from-[#181136] via-[#090d22] to-[#1a1236] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e1065] border border-[#a78bfa]/30 text-[#fef08a] shadow-[0_0_15px_rgba(167,139,250,0.3)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['Cinzel',serif]">
                STARGAZER ACCOUNT & DATABASE
              </h2>
              <p className="text-xs text-[#c4b5fd]">
                Supabase Identity & Database Sync
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
          {/* Cloud Sync Badge */}
          <div className="p-4 rounded-2xl bg-[#0d122d]/90 border border-[#a78bfa]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                syncStatus === 'SYNCED' ? 'bg-[#34d399] shadow-[0_0_8px_#34d399]' :
                syncStatus === 'SYNCING' ? 'bg-amber-400 animate-ping' :
                syncStatus === 'OFFLINE' ? 'bg-rose-500' : 'bg-[#818cf8]'
              }`} />
              <div>
                <span className="font-bold text-white uppercase font-['Cinzel',serif]">
                  DATABASE: {syncStatus}
                </span>
                <p className="text-[10px] text-slate-300">
                  {user ? 'Supabase PostgreSQL Cloud Active' : 'Local Sandbox Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenConfig}
              className="px-3 py-1.5 rounded-xl bg-[#2e1065] hover:bg-[#3b1580] border border-[#a78bfa]/40 text-[#fef08a] transition-colors text-xs flex items-center justify-center gap-1.5 font-medium cursor-pointer shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Switch / Setup Database</span>
            </button>
          </div>

          {/* User Details */}
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 font-['Cinzel',serif]">
                  AUTHENTICATED EMAIL
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0f1430] border border-[#a78bfa]/25 text-slate-200">
                  <Mail className="w-4 h-4 text-[#c4b5fd]" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 font-['Cinzel',serif]">
                  STARGAZER USER ID (UUID)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0f1430] border border-[#a78bfa]/25 text-slate-400 text-[11px] font-mono truncate">
                  <Shield className="w-4 h-4 text-[#c4b5fd] shrink-0" />
                  <span className="truncate">{user.id}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 font-['Cinzel',serif]">
                  STARGAZER CODENAME
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0f1430] border border-[#a78bfa]/30 text-white focus:border-[#c4b5fd] focus:outline-none text-xs"
                  />
                  <button
                    onClick={handleSaveUsername}
                    disabled={isSaving || username === profile.username}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-bold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer font-['Cinzel',serif] text-xs"
                  >
                    {isSaving ? 'SAVING...' : savedSuccess ? 'SAVED!' : 'UPDATE'}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#a78bfa]/20 flex items-center justify-between">
                <button
                  onClick={handleSendReset}
                  disabled={resetSent}
                  className="text-[#c4b5fd] hover:text-white underline text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{resetSent ? 'Password reset link sent!' : 'Send password reset email'}</span>
                </button>

                <button
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer font-['Cinzel',serif] text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/25 space-y-3">
              <p className="text-slate-300">
                You are currently previewing in offline/demo mode without an authenticated cloud account.
              </p>
              <button
                onClick={onSignOut} // this re-opens auth
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-bold uppercase tracking-wider font-['Cinzel',serif] text-xs cursor-pointer shadow-md"
              >
                SIGN IN / CREATE SUPABASE ACCOUNT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
