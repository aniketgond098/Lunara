import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Edit2,
  Moon,
  Star,
  ShieldCheck,
  Database,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RankBadge } from '../ui/RankBadge';
import { RANK_CONFIG } from '../../config/progression';
import { formatReadableDate } from '../../utils/date';
import { DailyRecord } from '../../types';
import { ConfirmModal } from '../modals/ConfirmModal';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { CelestialIcon } from '../ui/CelestialIcon';

export const ProfileView: React.FC = () => {
  const {
    user,
    syncStatus,
    setAuthModalOpen,
    setAccountModalOpen,
    setSupabaseConfigModalOpen,
    profile,
    updateProfile,
    missions,
    habits,
    dailyRecords,
    purchases,
    toggleSound,
    resetAllData,
    reinitializeOperative,
    resetTestProgression,
    exportData,
    importData,
    addNotification,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (profile.username) {
      setUsername(profile.username);
    }
  }, [profile.username]);

  const rankInfo = RANK_CONFIG[profile.rank];

  // Quantitative lifetime aggregations
  const allRecords = Object.values(dailyRecords) as DailyRecord[];
  const totalDaysTracked = Object.keys(dailyRecords).length;
  const totalPerfectDays = allRecords.filter((r) => r.isPerfectDay).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    updateProfile({ username: username.trim() });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = exportData();
    navigator.clipboard.writeText(data);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
    addNotification('Star Data Exported', 'Celestial telemetry copied to clipboard.', 'SYSTEM');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const success = importData(importText.trim());
    if (success) {
      setShowImportBox(false);
      setImportText('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>PERSONAL UNIVERSE · CELESTIAL IDENTITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            MY UNIVERSE
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Your sacred sanctuary, constellation milestones, and lifelong consistency archives.
          </p>
        </div>

        {/* Account / Sign In Trigger */}
        <button
          onClick={() => {
            if (!user) setAuthModalOpen(true);
            else setAccountModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#090d24] border border-[#a78bfa]/30 text-xs text-slate-300 hover:text-white hover:border-[#c4b5fd] transition-all cursor-pointer font-sans"
        >
          {user ? (
            <Database className="w-3.5 h-3.5 text-[#c4b5fd]" />
          ) : (
            <User className="w-3.5 h-3.5 text-[#fef08a]" />
          )}
          <span>{user ? 'Account Settings' : 'Sign In'}</span>
        </button>
      </div>

      {/* 2. Premium Celestial Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121638] via-[#090d22] to-[#1c1236] border border-[#a78bfa]/30 shadow-2xl relative overflow-hidden">
        {/* Ambient Moon Halo */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-[#c4b5fd]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left w-full">
          {/* Avatar Orb */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#7c3aed] via-[#ec4899] to-[#fef08a] p-1 shadow-[0_0_30px_rgba(167,139,250,0.35)]">
              <div className="w-full h-full rounded-full bg-[#090d24] flex items-center justify-center font-bold text-3xl sm:text-4xl text-[#fef08a] font-['Cinzel',serif]">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'L'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1">
              <RankBadge rank={profile.rank} size="sm" glow={true} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 justify-center md:justify-start w-full">
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#1e1b4b] border border-[#c4b5fd] text-sm text-white focus:outline-none font-['Cinzel',serif]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#7c3aed] text-white text-xs font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center md:justify-start gap-3 w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif] tracking-wide text-center md:text-left">
                    {profile.username || 'Stargazer'}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-[#c4b5fd] font-medium font-sans text-center md:text-left">
              Constellation Rank {profile.rank} · {rankInfo.codename}
            </p>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed text-center md:text-left mx-auto md:mx-0">
              {rankInfo.lore}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 font-sans">
              <span>Member Since: <strong className="text-white">{formatReadableDate(profile.joinedDate)}</strong></span>
              <span>·</span>
              <span>Last Active: <strong className="text-white">{formatReadableDate(profile.lastActiveDate)}</strong></span>
            </div>
          </div>
        </div>

        {/* Lifetime Telemetry Ribbon */}
        <div className="mt-8 pt-6 border-t border-[#a78bfa]/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-[#090d24]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">TOTAL STARDUST XP</span>
            <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
              {profile.totalXP.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#090d24]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-[#fde047] uppercase font-semibold">LUNAR GEMS BALANCE</span>
            <p className="text-xl font-bold text-[#fde047] font-['Cinzel',serif] mt-1 flex items-center justify-center gap-1.5">
              <LunarGemIcon size={16} glow={false} />
              {profile.currentEssence.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#090d24]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-[#c4b5fd] uppercase font-semibold">MAX MOON STREAK</span>
            <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1 flex items-center justify-center gap-1">
              <Moon className="w-4 h-4 text-[#fbbf24]" />
              {profile.longestStreak} Days
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#090d24]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-[#f472b6] uppercase font-semibold">FULL MOON DAYS</span>
            <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
              {totalPerfectDays} Days
            </p>
          </div>
        </div>
      </div>

      {/* 3. Celestial Disciplines (RPG Stats) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-[#fef08a]" />
          <span>ASTRAL DISCIPLINES & VIRTUES</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {Object.entries(profile.rpgStats || {}).map(([stat, val]) => (
            <div
              key={stat}
              className="p-4 rounded-2xl bg-[#0e1330] border border-[#a78bfa]/20 text-center flex flex-col justify-between"
            >
              <span className="text-[10px] text-[#c4b5fd] uppercase font-semibold tracking-wider font-['Cinzel',serif]">
                {stat}
              </span>
              <p className="text-2xl font-bold text-white font-['Cinzel',serif] my-2">
                {val}
              </p>
              <div className="w-full h-1.5 rounded-full bg-[#1e1b4b] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#fef08a]"
                  style={{ width: `${Math.min(100, (Number(val) || 0) * 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Data Management & Celestial Archive */}
      <div className="p-6 rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider">
          CELESTIAL ARCHIVE & EXPORT
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] border border-[#a78bfa]/30 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#c4b5fd]" />
            <span>{copiedNotification ? 'Copied to Clipboard!' : 'Export Stardust Data'}</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] border border-[#a78bfa]/30 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#fef08a]" />
            <span>Import Data Backup</span>
          </button>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2e1022] hover:bg-[#3d122b] border border-[#f472b6]/30 text-[#f472b6] text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Universe Data</span>
          </button>
        </div>

        {showImportBox && (
          <form onSubmit={handleImportSubmit} className="pt-3 space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON payload here..."
              className="w-full h-24 p-3 rounded-xl bg-[#060918] border border-[#a78bfa]/30 text-xs text-white focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-semibold"
            >
              Restore Archive
            </button>
          </form>
        )}
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Universe"
        message="Are you sure you want to restore factory stardust settings? All local rituals, quests, and transactions will be cleared."
        confirmLabel="Reset Universe"
        onConfirm={() => {
          resetAllData();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
