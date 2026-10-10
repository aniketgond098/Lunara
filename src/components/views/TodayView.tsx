import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Clock,
  Edit2,
  Trash2,
  Bot,
  Moon,
  Sun,
  Star,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MissionModal } from '../modals/MissionModal';
import { HabitModal } from '../modals/HabitModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { formatReadableDate, getMissionDate } from '../../utils/date';
import { getRankProgress, RANK_CONFIG, RANK_ORDER, getLevelProgress } from '../../config/progression';
import { Mission, Habit } from '../../types';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { MoonStreakVisualizer } from '../ui/MoonStreakVisualizer';
import { MoonPhaseIndicator } from '../ui/MoonPhaseIndicator';
import { CelestialIcon } from '../ui/CelestialIcon';
import { LuniAvatar } from '../ui/LuniAvatar';

export const TodayView: React.FC = () => {
  const {
    profile,
    missions,
    habits,
    dailyRecords,
    todayDate,
    toggleMissionCompletion,
    toggleHabitCompletion,
    createMission,
    updateMission,
    deleteMission,
    createHabit,
    updateHabit,
    deleteHabit,
    setActiveTab,
  } = useApp();

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [deletingMission, setDeletingMission] = useState<Mission | null>(null);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const [activeStarActivationId, setActiveStarActivationId] = useState<string | null>(null);

  const todayRecord = dailyRecords[todayDate] || {
    date: todayDate,
    completedMissionIds: [],
    completedHabitIds: [],
    isPerfectDay: false,
    xpEarned: 0,
    essenceEarned: 0,
    totalRequiredMissions: 0,
    totalActiveHabits: 0,
    status: 'IN_PROGRESS',
  };

  const activeMissions = missions.filter(
    (m) => m.isActive && getMissionDate(m) === todayDate
  );
  const activeHabits = habits.filter((h) => h.isActive);

  const totalObjectives = activeMissions.length + activeHabits.length;
  const completedObjectives =
    todayRecord.completedMissionIds.filter((id) => activeMissions.some((m) => m.id === id)).length +
    todayRecord.completedHabitIds.filter((id) => activeHabits.some((h) => h.id === id)).length;

  const unresolvedCount = totalObjectives - completedObjectives;
  const progressPercent = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

  const rankProgress = getRankProgress(profile.totalSuccessfulDays ?? profile.consistencyDaysCompleted ?? 0);
  const rankConfig = RANK_CONFIG[profile.rank];
  const { level, currentLevelXP, nextLevelXP, progressPercent: xpPercent } = getLevelProgress(profile.totalXP);

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Handle celestial ritual toggle with star activation effect
  const handleHabitClick = (habitId: string) => {
    const isCurrentlyDone = todayRecord.completedHabitIds.includes(habitId);
    if (!isCurrentlyDone) {
      setActiveStarActivationId(habitId);
      setTimeout(() => setActiveStarActivationId(null), 1000);
    }
    toggleHabitCompletion(habitId);
  };

  // Handle celestial quest toggle
  const handleMissionClick = (missionId: string) => {
    const isCurrentlyDone = todayRecord.completedMissionIds.includes(missionId);
    if (!isCurrentlyDone) {
      setActiveStarActivationId(missionId);
      setTimeout(() => setActiveStarActivationId(null), 1000);
    }
    toggleMissionCompletion(missionId);
  };

  // Potential rewards available today
  const potentialXP =
    activeMissions
      .filter((m) => !todayRecord.completedMissionIds.includes(m.id))
      .reduce((sum, m) => sum + m.xpReward, 0) +
    activeHabits
      .filter((h) => !todayRecord.completedHabitIds.includes(h.id))
      .reduce((sum, h) => sum + h.xpReward, 0);

  const potentialGems =
    activeMissions
      .filter((m) => !todayRecord.completedMissionIds.includes(m.id))
      .reduce((sum, m) => sum + m.essenceReward, 0) +
    activeHabits
      .filter((h) => !todayRecord.completedHabitIds.includes(h.id))
      .reduce((sum, h) => sum + h.essenceReward, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans relative">
      {/* Dynamic Animated Star Activation Overlay */}
      {activeStarActivationId && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[#8b5cf6]/10 backdrop-blur-[1px] animate-pulse" />
          <div className="relative flex flex-col items-center">
            <CelestialIcon size={56} glow={true} className="animate-bounce" />
            <span className="text-xs font-semibold text-[#fef08a] mt-2 px-4 py-1.5 rounded-full bg-[#090d24] border border-[#a78bfa]/50 shadow-[0_0_25px_rgba(196,181,253,0.5)] font-['Cinzel',serif] tracking-wider">
              STAR ALIGNED ✦ RITUAL COMPLETED
            </span>
          </div>
        </div>
      )}

      {/* 1. CELESTIAL MOON HUB HERO HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121638] via-[#090d22] to-[#1c1236] border border-[#a78bfa]/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Soft Starlight Background Elements */}
        <div className="absolute -right-8 -top-8 w-72 h-72 opacity-[0.08] pointer-events-none">
          <svg viewBox="0 0 100 100" className="stroke-white fill-none">
            <circle cx="50" cy="50" r="14" />
            <circle cx="50" cy="50" r="28" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="42" />
            <line x1="50" y1="2" x2="50" y2="98" strokeDasharray="2 3" />
            <line x1="2" y1="50" x2="98" y2="50" strokeDasharray="2 3" />
          </svg>
        </div>

        {/* Ambient Moonbeam Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#c4b5fd]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-[#34d399] animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-[#c4b5fd] font-semibold uppercase tracking-widest font-['Cinzel',serif]">
                MOON HUB
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-white font-medium font-sans">
                {formatReadableDate(todayDate)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-wide font-['Cinzel',serif] leading-tight">
              {timeGreeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4b5fd] via-[#fbcfe8] to-[#fef08a]">{profile.username || 'Stargazer'}</span>
            </h1>

            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-1 font-sans">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/40 text-[#c4b5fd] font-medium">
                Level {level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2e1065] border border-[#c4b5fd]/40 text-[#fef08a] font-medium">
                Rank {profile.rank} · {rankConfig.codename}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">
                Next Rank in <strong className="text-[#fef08a]">{rankProgress.daysRemaining} days</strong>
              </span>
            </p>
          </div>

          {/* Quick Celestial Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
            {/* Lunar Gems */}
            <div
              onClick={() => setActiveTab('REWARDS')}
              className="p-3.5 rounded-2xl bg-[#0d122d]/80 border border-[#fbbf24]/30 hover:border-[#fbbf24]/60 cursor-pointer transition-all shadow-[0_0_15px_rgba(251,191,36,0.08)] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#fde047] uppercase font-semibold">
                <LunarGemIcon size={14} glow={false} />
                <span>LUNAR GEMS</span>
              </div>
              <div className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
                {profile.currentEssence.toLocaleString()}
              </div>
            </div>

            {/* Moon Streak */}
            <div
              onClick={() => setActiveTab('TRACKING')}
              className="p-3.5 rounded-2xl bg-[#0d122d]/80 border border-[#c4b5fd]/30 hover:border-[#c4b5fd]/60 cursor-pointer transition-all shadow-[0_0_15px_rgba(196,181,253,0.08)] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-1 text-[10px] text-[#c4b5fd] uppercase font-semibold">
                <Moon className="w-3.5 h-3.5 text-[#fef08a]" />
                <span>MOON STREAK</span>
              </div>
              <div className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
                {profile.currentStreak} <span className="text-xs text-[#c4b5fd] font-normal">DAYS</span>
              </div>
            </div>

            {/* Daily Objectives Done */}
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/25">
              <div className="flex items-center gap-1 text-[10px] text-slate-300 uppercase font-semibold">
                <Star className="w-3.5 h-3.5 text-[#fef08a]" />
                <span>RITUALS & QUESTS</span>
              </div>
              <div className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
                {completedObjectives} / {totalObjectives}{' '}
                <span className="text-xs text-[#c4b5fd] font-normal">({progressPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stardust XP Progress Bar Inside Hero Header */}
        <div className="mt-6 pt-5 border-t border-[#a78bfa]/20 grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Stardust XP to Level {level + 1}</span>
              <span className="text-[#c4b5fd] font-semibold">
                {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full h-2 bg-[#090d22] border border-[#a78bfa]/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#c4b5fd] to-[#fef08a] shadow-[0_0_12px_#c4b5fd] transition-all duration-500 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Potential Yield Callout */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-300">
            <span>UNCLAIMED TODAY:</span>
            <span className="text-[#c4b5fd] font-semibold">+{potentialXP} XP</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#fef08a] font-semibold flex items-center gap-1">
              <LunarGemIcon size={12} glow={false} />
              +{potentialGems} GEMS
            </span>
          </div>
        </div>
      </div>

      {/* 2. LUNI AI COMPANION PROMPT BANNER */}
      <div
        onClick={() => setActiveTab('ASSISTANT')}
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1b1036] via-[#101438] to-[#1e153a] border border-[#c4b5fd]/30 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-[#c4b5fd]/60 transition-all shadow-[0_4px_25px_rgba(167,139,250,0.12)] group"
      >
        <div className="flex items-center gap-3.5">
          <LuniAvatar size="md" state="idle" showBadge={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-wider font-['Cinzel',serif]">
                LUNI · YOUR CELESTIAL GUIDE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#2e1065] text-[#fef08a] text-[10px] font-semibold border border-[#a78bfa]/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {unresolvedCount === 0
                ? "✨ Full Moon harmony! All today's rituals and quests are complete. Grow into your next chapter!"
                : `🌙 You have ${unresolvedCount} celestial objective${unresolvedCount === 1 ? '' : 's'} remaining today. Ask me for guidance!`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#c4b5fd] group-hover:text-white transition-colors">
          <span>Open Sanctuary Chat</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#fef08a]" />
        </div>
      </div>

      {/* 3. MOON PHASE INDICATOR & STREAK CYCLE */}
      <MoonPhaseIndicator streak={profile.currentStreak} />

      {/* 4. MOON STREAK VISUALIZER */}
      <MoonStreakVisualizer streak={profile.currentStreak} longestStreak={profile.longestStreak} />

      {/* 5. MAIN SECTIONS: DAILY RITUALS (LEFT) & ACTIVE QUESTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: DAILY RITUALS */}
        <div className="p-6 rounded-3xl bg-[#090d22]/85 border border-[#a78bfa]/25 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#2e1065] text-[#c4b5fd] border border-[#a78bfa]/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider font-['Cinzel',serif]">
                  DAILY RITUALS
                </h3>
                <p className="text-[11px] text-slate-400">
                  {todayRecord.completedHabitIds.length} of {activeHabits.length} rituals completed today
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingHabit(null);
                setIsHabitModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] border border-[#a78bfa]/30 text-xs text-[#c4b5fd] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ritual</span>
            </button>
          </div>

          <div className="space-y-2.5 mt-2">
            {activeHabits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-[#a78bfa]/20 bg-[#060918]/40">
                No active daily rituals. Add your first sacred ritual to start your moon streak!
              </div>
            ) : (
              activeHabits.map((habit) => {
                const isCompleted = todayRecord.completedHabitIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleHabitClick(habit.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
                      isCompleted
                        ? 'bg-[#151c3d]/60 border-[#a78bfa]/40 text-slate-300'
                        : 'bg-[#0d122d]/70 hover:bg-[#12193b] border-[#1e293b] text-white hover:border-[#a78bfa]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#8b5cf6] text-white shadow-[0_0_10px_#8b5cf6]'
                            : 'border-2 border-slate-600 group-hover:border-[#c4b5fd]'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-medium truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {habit.name}
                        </p>
                        {habit.description && (
                          <p className="text-[10px] text-slate-400 truncate">{habit.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#c4b5fd] font-medium px-2 py-0.5 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/25">
                        +{habit.xpReward} XP
                      </span>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHabit(habit);
                            setIsHabitModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Edit Ritual"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingHabit(habit);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Delete Ritual"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE QUESTS */}
        <div className="p-6 rounded-3xl bg-[#090d22]/85 border border-[#a78bfa]/25 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#2e1065] text-[#fef08a] border border-[#a78bfa]/30">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider font-['Cinzel',serif]">
                  TODAY'S QUESTS
                </h3>
                <p className="text-[11px] text-slate-400">
                  {todayRecord.completedMissionIds.length} of {activeMissions.length} quests completed
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingMission(null);
                setIsMissionModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] border border-[#a78bfa]/30 text-xs text-[#c4b5fd] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Quest</span>
            </button>
          </div>

          <div className="space-y-2.5 mt-2">
            {activeMissions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-[#a78bfa]/20 bg-[#060918]/40">
                No active quests for today. Add a quest or deep focus block to earn Stardust XP!
              </div>
            ) : (
              activeMissions.map((mission) => {
                const isCompleted = todayRecord.completedMissionIds.includes(mission.id);
                return (
                  <div
                    key={mission.id}
                    onClick={() => handleMissionClick(mission.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
                      isCompleted
                        ? 'bg-[#151c3d]/60 border-[#a78bfa]/40 text-slate-300'
                        : 'bg-[#0d122d]/70 hover:bg-[#12193b] border-[#1e293b] text-white hover:border-[#a78bfa]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#8b5cf6] text-white shadow-[0_0_10px_#8b5cf6]'
                            : 'border-2 border-slate-600 group-hover:border-[#c4b5fd]'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-medium truncate ${
                              isCompleted ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {mission.title}
                          </p>
                          {mission.isRequired && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#3b1580] text-[#fef08a] font-medium">
                              Core
                            </span>
                          )}
                        </div>
                        {mission.description && (
                          <p className="text-[10px] text-slate-400 truncate">{mission.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#fde047] font-medium px-2 py-0.5 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/25 flex items-center gap-1">
                        <LunarGemIcon size={10} glow={false} />
                        +{mission.essenceReward}
                      </span>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMission(mission);
                            setIsMissionModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Edit Quest"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingMission(mission);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Delete Quest"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={() => {
          setIsMissionModalOpen(false);
          setEditingMission(null);
        }}
        initialMission={editingMission}
        onSave={(data) => {
          if (editingMission) {
            updateMission(editingMission.id, data);
          } else {
            createMission(data);
          }
          setIsMissionModalOpen(false);
          setEditingMission(null);
        }}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        initialHabit={editingHabit}
        onSave={(data) => {
          if (editingHabit) {
            updateHabit(editingHabit.id, data);
          } else {
            createHabit(data);
          }
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deletingMission)}
        onClose={() => setDeletingMission(null)}
        title="Release Quest"
        message={`Are you sure you wish to release "${deletingMission?.title}"?`}
        confirmLabel="Release Quest"
        onConfirm={() => {
          if (deletingMission) deleteMission(deletingMission.id);
          setDeletingMission(null);
        }}
        onCancel={() => setDeletingMission(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingHabit)}
        onClose={() => setDeletingHabit(null)}
        title="Release Ritual"
        message={`Are you sure you wish to release "${deletingHabit?.name}"? Streak history will be archived.`}
        confirmLabel="Release Ritual"
        onConfirm={() => {
          if (deletingHabit) deleteHabit(deletingHabit.id);
          setDeletingHabit(null);
        }}
        onCancel={() => setDeletingHabit(null)}
      />
    </div>
  );
};
