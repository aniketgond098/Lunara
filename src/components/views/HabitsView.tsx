import React, { useState } from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Moon,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HabitModal } from '../modals/HabitModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Habit } from '../../types';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { CelestialIcon } from '../ui/CelestialIcon';

export const HabitsView: React.FC = () => {
  const {
    habits,
    dailyRecords,
    todayDate,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  } = useApp();

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [starBurstId, setStarBurstId] = useState<string | null>(null);

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

  const handleEdit = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingHabit(habit);
  };

  const handleConfirmDelete = () => {
    if (deletingHabit) {
      deleteHabit(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  const handleTogglePause = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation();
    updateHabit(habit.id, { isActive: !habit.isActive });
  };

  const handleOpenCreate = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleToggleRitual = (habitId: string) => {
    const isCompleted = todayRecord.completedHabitIds.includes(habitId);
    if (!isCompleted) {
      setStarBurstId(habitId);
      setTimeout(() => setStarBurstId(null), 1000);
    }
    toggleHabitCompletion(habitId);
  };

  const activeCount = habits.filter((h) => h.isActive).length;
  const completedTodayCount = todayRecord.completedHabitIds.length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak), 0) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>CELESTIAL REPETITION · SACRED MOMENTUM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            DAILY RITUALS
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Every completed ritual lights up a star point in your constellation.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all cursor-pointer font-['Cinzel',serif] tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>NEW RITUAL</span>
        </button>
      </div>

      {/* 2. Constellation Orbit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#090d22]/85 border border-[#a78bfa]/25 backdrop-blur-md">
          <span className="text-[10px] text-[#c4b5fd] uppercase tracking-wider font-semibold">
            TODAY'S RITUAL STARS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white font-['Cinzel',serif]">
              {completedTodayCount}
            </span>
            <span className="text-xs text-slate-400">/ {activeCount} ALIGNED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {activeCount > 0 && completedTodayCount === activeCount
              ? '✨ Full constellation alignment achieved today.'
              : 'Complete every daily ritual to preserve your moon streak.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d22]/85 border border-[#a78bfa]/25 backdrop-blur-md">
          <span className="text-[10px] text-[#fef08a] uppercase tracking-wider font-semibold">
            PEAK RITUAL ORBIT
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#fef08a] font-['Cinzel',serif]">
              {maxStreak}
            </span>
            <span className="text-xs text-slate-400">DAYS CONSECUTIVE</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Longest single ritual streak preserved in your star charts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d22]/85 border border-[#a78bfa]/25 backdrop-blur-md">
          <span className="text-[10px] text-[#f472b6] uppercase tracking-wider font-semibold">
            ACTIVE RITUALS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white font-['Cinzel',serif]">
              {habits.length}
            </span>
            <span className="text-xs text-slate-400">TOTAL ESTABLISHED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {habits.filter((h) => !h.isActive).length} currently resting in cosmic pause.
          </p>
        </div>
      </div>

      {/* 3. Rituals Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-3xl border border-dashed border-[#a78bfa]/25 bg-[#070b1a]/50 text-slate-400 space-y-3">
            <CelestialIcon size={44} glow={true} className="mx-auto" />
            <h3 className="text-sm font-semibold text-white font-['Cinzel',serif]">NO RITUALS CREATED YET</h3>
            <p className="text-xs max-w-md mx-auto leading-relaxed">
              Cultivate daily rituals for meditation, movement, hydration, or deep study to build your Moon Streak and earn Stardust XP.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2e1065] border border-[#c4b5fd]/40 text-white text-xs font-semibold hover:bg-[#3b1580] transition-colors"
            >
              Begin Your First Ritual
            </button>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = todayRecord.completedHabitIds.includes(habit.id);
            const isBursting = starBurstId === habit.id;

            return (
              <div
                key={habit.id}
                onClick={() => handleToggleRitual(habit.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer group ${
                  !habit.isActive
                    ? 'bg-[#080b18]/60 border-slate-800 opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-br from-[#161d42]/90 to-[#090d24] border-[#a78bfa]/50 shadow-[0_0_20px_rgba(167,139,250,0.15)]'
                    : 'bg-[#090d22]/85 hover:bg-[#0f1538] border-[#a78bfa]/20 hover:border-[#a78bfa]/50 shadow-md'
                }`}
              >
                {/* Subtle Starlight Activation Burst */}
                {isBursting && (
                  <div className="absolute inset-0 bg-[#8b5cf6]/15 pointer-events-none animate-ping rounded-2xl" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Star Activation Checkpoint */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-tr from-[#8b5cf6] to-[#f472b6] text-white shadow-[0_0_14px_#c4b5fd] scale-105'
                          : 'border-2 border-slate-600 group-hover:border-[#c4b5fd] text-transparent'
                      }`}
                    >
                      <Star className={`w-4 h-4 fill-white ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-semibold truncate tracking-wide font-['Cinzel',serif] ${
                            isCompleted ? 'text-white' : 'text-slate-100'
                          }`}
                        >
                          {habit.name}
                        </h3>
                        {!habit.isActive && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-sans">
                            PAUSED
                          </span>
                        )}
                      </div>

                      {habit.description && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {habit.description}
                        </p>
                      )}

                      {/* Streak & Yield Footer */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-[#fef08a] font-medium font-sans">
                          <Moon className="w-3.5 h-3.5 text-[#fbbf24]" />
                          <span>{habit.currentStreak} day streak</span>
                        </span>

                        <span className="text-slate-600">·</span>

                        <span className="text-[#c4b5fd] font-medium">
                          +{habit.xpReward} Stardust XP
                        </span>

                        <span className="text-slate-600">·</span>

                        <span className="text-[#fde047] font-medium flex items-center gap-1">
                          <LunarGemIcon size={11} glow={false} />
                          +{habit.essenceReward} Gems
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit, Pause, Delete) */}
                  <div className="flex items-center gap-1 text-slate-400 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 shrink-0">
                    <button
                      onClick={(e) => handleTogglePause(habit, e)}
                      className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title={habit.isActive ? 'Pause Ritual' : 'Resume Ritual'}
                    >
                      {habit.isActive ? (
                        <PauseCircle className="w-4 h-4 text-slate-400 hover:text-amber-400" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-[#34d399]" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleEdit(habit, e)}
                      className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Ritual"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(habit, e)}
                      className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Delete Ritual"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        initialHabit={editingHabit}
        onSave={(data) => {
          if (editingHabit) {
            updateHabit(editingHabit.id, data);
          } else {
            createHabit(data);
          }
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deletingHabit)}
        onClose={() => setDeletingHabit(null)}
        title="Release Ritual"
        message={`Are you sure you wish to release "${deletingHabit?.name}"? Its stardust history will be preserved.`}
        confirmLabel="Release Ritual"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingHabit(null)}
      />
    </div>
  );
};
