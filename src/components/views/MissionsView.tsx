import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Edit2,
  Trash2,
  Target,
  Sparkles,
  Calendar,
  Clock,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MissionModal } from '../modals/MissionModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Mission, Priority } from '../../types';
import { formatReadableDate, getMissionDate } from '../../utils/date';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { CelestialIcon } from '../ui/CelestialIcon';

export const MissionsView: React.FC = () => {
  const {
    missions,
    dailyRecords,
    todayDate,
    createMission,
    updateMission,
    deleteMission,
    toggleMissionCompletion,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'TODAY' | 'ALL'>('TODAY');
  const [filterType, setFilterType] = useState<'ALL' | 'HIGH' | 'DAILY_CORE' | 'SECONDARY' | 'COMPLETED'>('ALL');
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [deletingMission, setDeletingMission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const todayMissions = missions.filter((m) => getMissionDate(m) === todayDate);
  const activeTodayMissions = todayMissions.filter((m) => m.isActive);

  const scopeBaseList = scope === 'TODAY' ? activeTodayMissions : missions;

  const filteredMissions = scopeBaseList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const isDone = todayRecord.completedMissionIds.includes(m.id);

    if (filterType === 'HIGH') return m.priority === 'HIGH';
    if (filterType === 'DAILY_CORE') return m.isRequired;
    if (filterType === 'SECONDARY') return !m.isRequired && m.priority !== 'HIGH';
    if (filterType === 'COMPLETED') return isDone;

    return true;
  });

  const handleEdit = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMission(mission);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingMission(mission);
  };

  const handleConfirmDelete = () => {
    if (deletingMission) {
      deleteMission(deletingMission.id);
      setDeletingMission(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingMission(null);
    setIsModalOpen(true);
  };

  const priorityColors = {
    HIGH: 'text-[#f472b6] bg-[#2a1322] border-[#f472b6]/40',
    MEDIUM: 'text-[#c4b5fd] bg-[#1e1b4b] border-[#a78bfa]/40',
    LOW: 'text-slate-400 bg-slate-800/80 border-slate-700',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <Target className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>DAILY OBJECTIVES · EXPEDITIONS OF THE MIND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            CELESTIAL QUESTS
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Clear purposeful missions to earn Stardust XP and Lunar Gems.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all cursor-pointer font-['Cinzel',serif] tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>NEW QUEST</span>
        </button>
      </div>

      {/* 2. Search & Segmented Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-sans">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quests by title or focus..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090d22]/90 border border-[#a78bfa]/25 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
          />
        </div>

        {/* Scope and Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Segment */}
          <div className="flex items-center p-1 rounded-xl bg-[#090d22] border border-[#a78bfa]/20">
            <button
              onClick={() => setScope('TODAY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                scope === 'TODAY'
                  ? 'bg-[#2e1065] text-[#fef08a] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setScope('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                scope === 'ALL'
                  ? 'bg-[#2e1065] text-[#fef08a] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Quests
            </button>
          </div>

          {/* Filter Type */}
          <div className="flex items-center p-1 rounded-xl bg-[#090d22] border border-[#a78bfa]/20 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                filterType === 'ALL' ? 'bg-[#1e1b4b] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('DAILY_CORE')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                filterType === 'DAILY_CORE' ? 'bg-[#1e1b4b] text-[#fef08a] font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Core
            </button>
            <button
              onClick={() => setFilterType('HIGH')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                filterType === 'HIGH' ? 'bg-[#1e1b4b] text-[#f472b6] font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setFilterType('COMPLETED')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                filterType === 'COMPLETED' ? 'bg-[#1e1b4b] text-[#34d399] font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* 3. Celestial Quests List */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-[#a78bfa]/25 bg-[#070b1a]/50 text-slate-400 space-y-3">
            <CelestialIcon size={44} glow={true} className="mx-auto" />
            <h3 className="text-sm font-semibold text-white font-['Cinzel',serif]">NO QUESTS FOUND</h3>
            <p className="text-xs max-w-md mx-auto leading-relaxed">
              No quests match your selected parameters. Set your focus for today and light up your star path.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2e1065] border border-[#c4b5fd]/40 text-white text-xs font-semibold hover:bg-[#3b1580] transition-colors"
            >
              Embark on a Quest
            </button>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isCompleted = todayRecord.completedMissionIds.includes(mission.id);

            return (
              <div
                key={mission.id}
                onClick={() => toggleMissionCompletion(mission.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group ${
                  isCompleted
                    ? 'bg-[#131a3d]/70 border-[#a78bfa]/40 text-slate-400'
                    : 'bg-[#090d22]/85 hover:bg-[#0f1538] border-[#a78bfa]/20 hover:border-[#a78bfa]/50 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Completion Orb */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] text-white shadow-[0_0_12px_#c4b5fd]'
                        : 'border-2 border-slate-600 group-hover:border-[#c4b5fd]'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm font-semibold truncate tracking-wide font-['Cinzel',serif] ${
                          isCompleted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {mission.title}
                      </h3>

                      {mission.isRequired && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#2e1065] text-[#fef08a] font-semibold border border-[#a78bfa]/30 font-sans">
                          Core Directive
                        </span>
                      )}

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border font-sans ${
                          priorityColors[mission.priority] || priorityColors.MEDIUM
                        }`}
                      >
                        {mission.priority}
                      </span>
                    </div>

                    {mission.description && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1 leading-relaxed">
                        {mission.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="text-[#c4b5fd] font-medium">
                        +{mission.xpReward} Stardust XP
                      </span>
                      <span>·</span>
                      <span className="text-[#fde047] font-medium flex items-center gap-1">
                        <LunarGemIcon size={12} glow={false} />
                        +{mission.essenceReward} Gems
                      </span>
                      {mission.date && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {mission.date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1.5 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 shrink-0">
                  <button
                    onClick={(e) => handleEdit(mission, e)}
                    className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-slate-400"
                    title="Edit Quest"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(mission, e)}
                    className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer text-slate-400"
                    title="Release Quest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <MissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMission(null);
        }}
        initialMission={editingMission}
        onSave={(data) => {
          if (editingMission) {
            updateMission(editingMission.id, data);
          } else {
            createMission(data);
          }
          setIsModalOpen(false);
          setEditingMission(null);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deletingMission)}
        onClose={() => setDeletingMission(null)}
        title="Release Quest"
        message={`Are you sure you wish to release "${deletingMission?.title}"?`}
        confirmLabel="Release Quest"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMission(null)}
      />
    </div>
  );
};
