import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Moon,
  Calendar,
  CheckCircle2,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateString, formatReadableDate, parseDateString } from '../../utils/date';
import { DailyRecord } from '../../types';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { CelestialIcon } from '../ui/CelestialIcon';

export const TrackingView: React.FC = () => {
  const { dailyRecords, todayDate, missions, habits, profile } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayDate);
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean; record?: DailyRecord }> = [];

  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    const dateStr = formatDateString(d);
    calendarDays.push({
      dateStr,
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      record: dailyRecords[dateStr],
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d);
    const dateStr = formatDateString(dObj);
    calendarDays.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      record: dailyRecords[dateStr],
    });
  }

  // Next month padding to fill grid
  const remainingSlots = 42 - calendarDays.length;
  for (let d = 1; d <= remainingSlots; d++) {
    const dObj = new Date(year, month + 1, d);
    const dateStr = formatDateString(dObj);
    calendarDays.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      record: dailyRecords[dateStr],
    });
  }

  const selectedRecord = dailyRecords[selectedDateStr];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Calculate month stats
  const allRecordedDays = Object.values(dailyRecords) as DailyRecord[];
  const totalDaysTracked = allRecordedDays.length;
  const perfectDaysCount = allRecordedDays.filter((r) => r.isPerfectDay).length;
  const monthDaysWithRecords = calendarDays.filter((d) => d.isCurrentMonth && d.record);
  const monthPerfectDays = monthDaysWithRecords.filter((d) => d.record?.isPerfectDay).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <Calendar className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>CELESTIAL CHRONOLOGY · ASTRAL ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            STAR LOG
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Your sacred timeline of fulfilled rituals, completed quests, and full moon alignments.
          </p>
        </div>

        <button
          onClick={jumpToToday}
          className="px-4 py-2 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] border border-[#a78bfa]/30 text-white text-xs font-semibold transition-all cursor-pointer font-['Cinzel',serif] tracking-wider"
        >
          Return to Today
        </button>
      </div>

      {/* 2. Top Analytics Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090d24]/85 border border-[#a78bfa]/25">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">TOTAL DAYS LOGGED</span>
          <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
            {totalDaysTracked}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d24]/85 border border-[#a78bfa]/25">
          <span className="text-[10px] text-[#fef08a] uppercase font-semibold">FULL MOON DAYS</span>
          <p className="text-xl font-bold text-[#fef08a] font-['Cinzel',serif] mt-1 flex items-center gap-1.5">
            <Moon className="w-4 h-4" />
            {perfectDaysCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d24]/85 border border-[#a78bfa]/25">
          <span className="text-[10px] text-[#c4b5fd] uppercase font-semibold">THIS MONTH ALIGNED</span>
          <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1">
            {monthPerfectDays} <span className="text-xs text-slate-400 font-normal">/ {monthDaysWithRecords.length} recorded</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d24]/85 border border-[#a78bfa]/25">
          <span className="text-[10px] text-[#f472b6] uppercase font-semibold">ACTIVE MOON STREAK</span>
          <p className="text-xl font-bold text-white font-['Cinzel',serif] mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            {profile.currentStreak} Days
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Celestial Calendar (Left) & Day Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CELESTIAL CALENDAR (2 Cols on lg) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 shadow-xl space-y-4">
          {/* Calendar Navigation Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white font-['Cinzel',serif] tracking-wider">
              {monthName} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-[#1e1b4b] hover:bg-[#2e1065] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#c4b5fd]/80 py-2 border-b border-[#a78bfa]/15 font-['Cinzel',serif]">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {calendarDays.map((d, index) => {
              const isSelected = d.dateStr === selectedDateStr;
              const isToday = d.dateStr === todayDate;
              const hasRecord = Boolean(d.record);
              const isPerfect = d.record?.isPerfectDay;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDateStr(d.dateStr)}
                  className={`min-h-[64px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    !d.isCurrentMonth
                      ? 'opacity-30 border-transparent hover:opacity-50'
                      : isSelected
                      ? 'bg-[#20153f] border-[#fef08a] shadow-[0_0_15px_rgba(254,240,138,0.25)]'
                      : isPerfect
                      ? 'bg-[#141b3d]/90 border-[#c4b5fd]/40 hover:border-[#c4b5fd]'
                      : hasRecord
                      ? 'bg-[#0f1430]/70 border-[#334155]/60 hover:border-slate-500'
                      : 'bg-[#070a1c]/60 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'text-[#fef08a] font-bold'
                          : isSelected
                          ? 'text-white'
                          : 'text-slate-300'
                      }`}
                    >
                      {d.dayNumber}
                    </span>

                    {isPerfect && (
                      <span className="text-[10px]" title="Full Moon Perfect Day">
                        🌕
                      </span>
                    )}
                  </div>

                  {hasRecord && (
                    <div className="flex items-center gap-1 text-[9px] text-[#c4b5fd]">
                      <span>+{d.record?.xpEarned || 0} XP</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY INSPECTOR PANEL (Right Col) */}
        <div className="p-6 rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 shadow-xl space-y-5">
          <div className="border-b border-[#a78bfa]/20 pb-4">
            <span className="text-[10px] text-[#c4b5fd] uppercase tracking-wider font-semibold">
              SELECTED ORBIT
            </span>
            <h3 className="text-lg font-bold text-white font-['Cinzel',serif] mt-0.5">
              {formatReadableDate(selectedDateStr)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {selectedDateStr === todayDate ? '★ Current Active Day' : 'Archived Celestial Day'}
            </p>
          </div>

          {/* Record Details */}
          {!selectedRecord ? (
            <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-[#a78bfa]/20 bg-[#060918]/40">
              No activity recorded in the star charts for this day.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Day Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#0f1430] border border-[#a78bfa]/20">
                  <span className="text-[10px] text-slate-400">STARDUST XP</span>
                  <p className="text-base font-bold text-[#c4b5fd] font-['Cinzel',serif] mt-0.5">
                    +{selectedRecord.xpEarned}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#0f1430] border border-[#fbbf24]/20">
                  <span className="text-[10px] text-slate-400">LUNAR GEMS</span>
                  <p className="text-base font-bold text-[#fde047] font-['Cinzel',serif] mt-0.5 flex items-center gap-1">
                    <LunarGemIcon size={12} glow={false} />
                    +{selectedRecord.essenceEarned}
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  selectedRecord.isPerfectDay
                    ? 'bg-[#19244d] border-[#34d399]/40 text-[#34d399]'
                    : 'bg-[#131738] border-[#a78bfa]/30 text-slate-300'
                }`}
              >
                {selectedRecord.isPerfectDay ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                    <span className="font-semibold font-['Cinzel',serif]">FULL MOON PERFECT DAY</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-[#c4b5fd]" />
                    <span>In-Progress / Partial Day</span>
                  </>
                )}
              </div>

              {/* Completed Items Counts */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between p-2.5 rounded-xl bg-[#0f1430]/60 border border-slate-800">
                  <span>Completed Rituals:</span>
                  <strong className="text-white">{selectedRecord.completedHabitIds.length}</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-[#0f1430]/60 border border-slate-800">
                  <span>Completed Quests:</span>
                  <strong className="text-white">{selectedRecord.completedMissionIds.length}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
