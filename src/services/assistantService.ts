import { AssistantMessage, DailyRecord, Habit, Mission, UserProfile } from '../types';
import { formatReadableDate, getMissionDate } from '../utils/date';

export interface UserScheduleContext {
  todayDate: string;
  formattedDate: string;
  currentTimeString: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  operative: {
    username: string;
    level: number;
    rank: string;
    totalXP: number;
    currentEssence: number;
    currentStreak: number;
    longestStreak: number;
    totalSuccessfulDays: number;
    rpgStats: Record<string, number>;
  };
  todaySummary: {
    totalObjectives: number;
    completedCount: number;
    pendingCount: number;
    completionPercentage: number;
    xpEarnedToday: number;
    essenceEarnedToday: number;
    isPerfectDayAchieved: boolean;
    remainingPotentialXP: number;
    remainingPotentialEssence: number;
    status: string;
  };
  missions: {
    completed: Array<{
      id: string;
      title: string;
      priority: string;
      xpReward: number;
      essenceReward: number;
      isRequired: boolean;
    }>;
    pending: Array<{
      id: string;
      title: string;
      priority: string;
      xpReward: number;
      essenceReward: number;
      isRequired: boolean;
    }>;
  };
  dailyProtocols: {
    completed: Array<{
      id: string;
      name: string;
      currentStreak: number;
      xpReward: number;
      essenceReward: number;
    }>;
    pending: Array<{
      id: string;
      name: string;
      currentStreak: number;
      xpReward: number;
      essenceReward: number;
    }>;
  };
  recentHistorySummary: {
    totalRecordedDays: number;
    recentDays: Array<{
      date: string;
      status: string;
      isSuccessfulDay: boolean;
      xpEarned: number;
    }>;
  };
}

export function compileUserContext(
  profile: UserProfile,
  missions: Mission[],
  habits: Habit[],
  dailyRecords: Record<string, DailyRecord>,
  todayDate: string
): UserScheduleContext {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay =
    hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : hour < 21 ? 'Evening' : 'Night';

  const todayRecord = dailyRecords[todayDate] || {
    date: todayDate,
    completedMissionIds: [],
    completedHabitIds: [],
    isSuccessfulDay: false,
    isPerfectDay: false,
    xpEarned: 0,
    essenceEarned: 0,
    totalRequiredMissions: 0,
    totalActiveHabits: 0,
    status: 'IN_PROGRESS',
  };

  const activeTodayMissions = missions.filter(
    (m) => m.isActive && getMissionDate(m) === todayDate
  );
  const activeHabits = habits.filter((h) => h.isActive);

  const completedMissions = activeTodayMissions.filter((m) =>
    todayRecord.completedMissionIds.includes(m.id)
  );
  const pendingMissions = activeTodayMissions.filter(
    (m) => !todayRecord.completedMissionIds.includes(m.id)
  );

  const completedHabits = activeHabits.filter((h) =>
    todayRecord.completedHabitIds.includes(h.id)
  );
  const pendingHabits = activeHabits.filter(
    (h) => !todayRecord.completedHabitIds.includes(h.id)
  );

  const totalObjectives = activeTodayMissions.length + activeHabits.length;
  const completedCount = completedMissions.length + completedHabits.length;
  const pendingCount = pendingMissions.length + pendingHabits.length;
  const completionPercentage =
    totalObjectives > 0 ? Math.round((completedCount / totalObjectives) * 100) : 0;

  const remainingPotentialXP =
    pendingMissions.reduce((acc, m) => acc + m.xpReward, 0) +
    pendingHabits.reduce((acc, h) => acc + h.xpReward, 0);

  const remainingPotentialEssence =
    pendingMissions.reduce((acc, m) => acc + m.essenceReward, 0) +
    pendingHabits.reduce((acc, h) => acc + h.essenceReward, 0);

  // Past 5 recorded days
  const pastDaysList = Object.values(dailyRecords)
    .filter((r) => r.date !== todayDate)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((r) => ({
      date: r.date,
      status: r.status,
      isSuccessfulDay: Boolean(r.isSuccessfulDay || r.isPerfectDay),
      xpEarned: r.xpEarned || 0,
    }));

  return {
    todayDate,
    formattedDate: formatReadableDate(todayDate),
    currentTimeString: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeOfDay,
    operative: {
      username: profile.username || 'Operative',
      level: profile.level,
      rank: profile.rank,
      totalXP: profile.totalXP,
      currentEssence: profile.currentEssence,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      totalSuccessfulDays: profile.totalSuccessfulDays ?? profile.consistencyDaysCompleted ?? 0,
      rpgStats: profile.rpgStats,
    },
    todaySummary: {
      totalObjectives,
      completedCount,
      pendingCount,
      completionPercentage,
      xpEarnedToday: todayRecord.xpEarned,
      essenceEarnedToday: todayRecord.essenceEarned,
      isPerfectDayAchieved: Boolean(todayRecord.isPerfectDay || todayRecord.isSuccessfulDay),
      remainingPotentialXP,
      remainingPotentialEssence,
      status: todayRecord.status,
    },
    missions: {
      completed: completedMissions.map((m) => ({
        id: m.id,
        title: m.title,
        priority: m.priority,
        xpReward: m.xpReward,
        essenceReward: m.essenceReward,
        isRequired: m.isRequired,
      })),
      pending: pendingMissions.map((m) => ({
        id: m.id,
        title: m.title,
        priority: m.priority,
        xpReward: m.xpReward,
        essenceReward: m.essenceReward,
        isRequired: m.isRequired,
      })),
    },
    dailyProtocols: {
      completed: completedHabits.map((h) => ({
        id: h.id,
        name: h.name,
        currentStreak: h.currentStreak,
        xpReward: h.xpReward,
        essenceReward: h.essenceReward,
      })),
      pending: pendingHabits.map((h) => ({
        id: h.id,
        name: h.name,
        currentStreak: h.currentStreak,
        xpReward: h.xpReward,
        essenceReward: h.essenceReward,
      })),
    },
    recentHistorySummary: {
      totalRecordedDays: Object.keys(dailyRecords).length,
      recentDays: pastDaysList,
    },
  };
}

export async function askWebby(
  message: string,
  chatHistory: AssistantMessage[],
  context: UserScheduleContext
): Promise<string> {
  try {
    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chatHistory: chatHistory.map((m) => ({
          role: m.role,
          text: m.text,
        })),
        userContext: context,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.warn('Webby API request failed, generating intelligent local fallback:', error);
    return generateLocalFallbackResponse(message, context);
  }
}

/**
 * Intelligent client-side fallback if network is temporarily disconnected,
 * ensuring the user still gets immediate, exact answers about their day!
 */
function generateLocalFallbackResponse(query: string, ctx: UserScheduleContext): string {
  const lower = query.toLowerCase();

  if (lower.includes('what did i do') || lower.includes('done today') || lower.includes('accomplish')) {
    const { completedCount, xpEarnedToday, essenceEarnedToday } = ctx.todaySummary;
    const completedMissions = ctx.missions.completed;
    const completedHabits = ctx.dailyProtocols.completed;

    if (completedCount === 0) {
      return `🌙 **Luni Starlight Report:**\n\nGreetings, **${ctx.operative.username}**! You haven't checked off any rituals or quests yet today (${ctx.formattedDate}).\n\nYou currently have **${ctx.todaySummary.pendingCount} objectives** waiting in your orbit. Let's begin one sacred ritual to ignite today's star! ✨`;
    }

    let report = `🌙 **Here is what you have accomplished today, ${ctx.operative.username}!**\n\n`;
    report += `✨ **Total Objectives Aligned:** ${completedCount} / ${ctx.todaySummary.totalObjectives} (${ctx.todaySummary.completionPercentage}%)\n`;
    report += `✦ **Bounty Gathered Today:** +${xpEarnedToday} Stardust XP | +${essenceEarnedToday} Lunar Gems 💎\n\n`;

    if (completedMissions.length > 0) {
      report += `**✦ Completed Quests:**\n`;
      completedMissions.forEach((m) => {
        report += `• ✦ **${m.title}** (+${m.xpReward} XP, +${m.essenceReward} Gems)\n`;
      });
      report += `\n`;
    }

    if (completedHabits.length > 0) {
      report += `**✧ Daily Rituals Maintained:**\n`;
      completedHabits.forEach((h) => {
        report += `• ✧ **${h.name}** (🌙 ${h.currentStreak} day streak!)\n`;
      });
      report += `\n`;
    }

    report += `Grow into your next chapter with grace and dedication! 🌸✨`;
    return report;
  }

  if (lower.includes('schedule') || lower.includes('left') || lower.includes('pending') || lower.includes('remaining') || lower.includes('to do')) {
    const pendingM = ctx.missions.pending;
    const pendingH = ctx.dailyProtocols.pending;

    if (pendingM.length === 0 && pendingH.length === 0) {
      return `🌕 **FULL MOON HARMONY ACHIEVED!**\n\nYou have completed 100% of your celestial objectives today! 🌟 You have aligned your Full Moon status. Rest peacefully or explore the Celestial Market with your ${ctx.operative.currentEssence} Lunar Gems! 💎✨`;
    }

    let report = `📋 **Here is what remains on your celestial schedule today:**\n\n`;
    if (pendingM.length > 0) {
      report += `**✦ Pending Quests (${pendingM.length}):**\n`;
      pendingM.forEach((m) => {
        report += `• ⏳ **${m.title}** [${m.priority} Priority] (+${m.xpReward} XP)\n`;
      });
      report += `\n`;
    }

    if (pendingH.length > 0) {
      report += `**✧ Remaining Daily Rituals (${pendingH.length}):**\n`;
      pendingH.forEach((h) => {
        report += `• ⏳ **${h.name}** (Preserve Moon Streak: 🌙 ${h.currentStreak} days)\n`;
      });
      report += `\n`;
    }

    report += `✨ **Available Rewards Upon Completion:** +${ctx.todaySummary.remainingPotentialXP} Stardust XP | +${ctx.todaySummary.remainingPotentialEssence} Lunar Gems 💎! You've got this, Stargazer! 🌙`;
    return report;
  }

  if (lower.includes('perfect day') || lower.includes('on track') || lower.includes('full moon')) {
    if (ctx.todaySummary.isPerfectDayAchieved) {
      return `🌕 **YES! You have already achieved a FULL MOON PERFECT DAY!** 🌕\n\nAll core quests and daily rituals are aligned. You are currently on a **${ctx.operative.currentStreak} day moon streak**! Beautiful work! ✨`;
    }
    const remaining = ctx.todaySummary.pendingCount;
    return `🌙 **Full Moon Day Orbit Assessment:**\n\nYou need **${remaining} more objective${remaining === 1 ? '' : 's'}** completed to trigger today's Full Moon alignment! Complete all pending quests and rituals before midnight to preserve your moon streak (🌙 ${ctx.operative.currentStreak} days). ✨`;
  }

  // General helpful overview
  return `✨ **Luni Celestial Guide Online!**\n\nGreetings, **${ctx.operative.username}**! Here is your quick routine briefing:\n\n• **Status:** ${ctx.todaySummary.completedCount}/${ctx.todaySummary.totalObjectives} Completed (${ctx.todaySummary.completionPercentage}%)\n• **Today's Bounty:** +${ctx.todaySummary.xpEarnedToday} XP | +${ctx.todaySummary.essenceEarnedToday} Lunar Gems\n• **Constellation Rank:** ${ctx.operative.rank} (Level ${ctx.operative.level})\n• **Moon Streak:** 🌙 ${ctx.operative.currentStreak} Days\n\nAsk me anything! For example: *"What did I do today?"*, *"What's left on my schedule?"*, or *"Am I on track for a Full Moon Day?"* 🌸✨`;
}
