import { RankTier, Reward, Mission, Habit } from '../types';

export interface BaseRewardConfig {
  missionXP: number;
  missionEssence: number;
  habitXP: number;
  habitEssence: number;
  perfectDayXP: number;
  perfectDayEssence: number;
  levelUpEssence: number;
  rankUpEssence: number;
}

export const BASE_REWARDS: BaseRewardConfig = {
  missionXP: 20,
  missionEssence: 20,
  habitXP: 15,
  habitEssence: 15,
  perfectDayXP: 100,
  perfectDayEssence: 100,
  levelUpEssence: 50,
  rankUpEssence: 500,
};

export interface RankInfo {
  tier: RankTier;
  name: string;
  codename: string;
  order: number;
  requiredDaysPerTier: number;
  color: string;
  accentColor: string;
  glowColor: string;
  description: string;
  lore: string;
}

export const RANK_ORDER: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const RANK_CONFIG: Record<RankTier, RankInfo> = {
  E: {
    tier: 'E',
    name: 'Rank E',
    codename: 'Stardust Initiate',
    order: 0,
    requiredDaysPerTier: 180,
    color: '#cbd5e1',
    accentColor: '#94a3b8',
    glowColor: 'rgba(203, 213, 225, 0.35)',
    description: 'Initial celestial alignment. Establishing your foundational daily rituals.',
    lore: 'Every constellation begins with a single stardust spark. Learn the rhythm of your inner orbit.',
  },
  D: {
    tier: 'D',
    name: 'Rank D',
    codename: 'Crescent Wayfarer',
    order: 1,
    requiredDaysPerTier: 180,
    color: '#c4b5fd',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(196, 181, 253, 0.4)',
    description: 'Rituals anchoring into natural orbit. Resistance softens into quiet grace.',
    lore: 'Like the gentle waxing crescent, your daily commitments begin to illuminate the dark.',
  },
  C: {
    tier: 'C',
    name: 'Rank C',
    codename: 'Astral Weaver',
    order: 2,
    requiredDaysPerTier: 180,
    color: '#38bdf8',
    accentColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    description: 'Harmonious daily momentum. Quests fulfilled with serenity and precision.',
    lore: 'You no longer wait for fleeting inspiration; your astral tide carries you forward.',
  },
  B: {
    tier: 'B',
    name: 'Rank B',
    codename: 'Starlight Champion',
    order: 3,
    requiredDaysPerTier: 180,
    color: '#818cf8',
    accentColor: '#4f46e5',
    glowColor: 'rgba(129, 140, 248, 0.45)',
    description: 'Profound celestial resilience. Immune to external tides and distractions.',
    lore: 'Your starlight forms clear lines across the night. Obstacles are merely stepping stones between stars.',
  },
  A: {
    tier: 'A',
    name: 'Rank A',
    codename: 'Lunar Luminary',
    order: 4,
    requiredDaysPerTier: 180,
    color: '#fbbf24',
    accentColor: '#d97706',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    description: 'Master of daily execution. Consistency radiates like the golden harvest moon.',
    lore: 'Few reach this elevation. Your discipline is an aura that brings calm and focus to everything you touch.',
  },
  S: {
    tier: 'S',
    name: 'Rank S',
    codename: 'Celestial Sovereign',
    order: 5,
    requiredDaysPerTier: 180,
    color: '#f472b6',
    accentColor: '#db2777',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    description: 'Elite harmony. Deep focus across all domains of your personal universe.',
    lore: 'The apex of poise and fortitude. You shape your next chapter with unwavering intention.',
  },
  SS: {
    tier: 'SS',
    name: 'Rank SS',
    codename: 'Eclipse Ascendant',
    order: 6,
    requiredDaysPerTier: 180,
    color: '#e879f9',
    accentColor: '#c026d3',
    glowColor: 'rgba(232, 121, 249, 0.55)',
    description: 'Transcendent mastery. Years of serene, unbroken celestial devotion.',
    lore: 'Time bends to your rituals. You walk in an eternal flow state beneath the starry canopy.',
  },
  SSS: {
    tier: 'SSS',
    name: 'Rank SSS',
    codename: 'Supreme Architect',
    order: 7,
    requiredDaysPerTier: 180,
    color: '#c084fc',
    accentColor: '#9333ea',
    glowColor: 'rgba(192, 132, 252, 0.65)',
    description: 'Cosmic perfection. The ultimate realization of human potential and grace.',
    lore: 'You are the architect of your universe. Every constellation glows in supreme harmony.',
  },
};

/**
 * Calculates XP threshold required to complete a given level.
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 150;
  return Math.floor(120 * Math.pow(level, 1.15) + 30);
}

/**
 * Calculates current level and progress from total Stardust XP.
 */
export function getLevelProgress(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  let level = 1;
  let remainingXP = Math.max(0, totalXP);
  
  while (true) {
    const needed = getXPRequiredForLevel(level);
    if (remainingXP < needed) {
      const progressPercent = Math.min(100, Math.round((remainingXP / needed) * 100));
      return {
        level,
        currentLevelXP: remainingXP,
        nextLevelXP: needed,
        progressPercent,
      };
    }
    remainingXP -= needed;
    level++;
  }
}

export const REQUIRED_DAYS_PER_TIER = 180;

/**
 * Calculates Constellation Rank progression from total consistency days.
 */
export function getRankProgress(
  totalSuccessfulDays: number,
  daysPerTier: number = REQUIRED_DAYS_PER_TIER
): {
  currentRank: RankTier;
  nextRank: RankTier | null;
  successfulDaysForCurrentRank: number;
  requiredSuccessfulDaysForCurrentRank: number;
  daysInCurrentRank: number;
  daysNeededForNextRank: number;
  daysRemaining: number;
  progressPercent: number;
  isMaxRank: boolean;
  totalSuccessfulDays: number;
} {
  const safeDays = Math.max(0, Math.floor(totalSuccessfulDays || 0));
  const currentTierIndex = Math.min(
    RANK_ORDER.length - 1,
    Math.floor(safeDays / daysPerTier)
  );
  
  const currentRank = RANK_ORDER[currentTierIndex];
  const isMaxRank = currentTierIndex >= RANK_ORDER.length - 1;
  const nextRank = isMaxRank ? null : RANK_ORDER[currentTierIndex + 1];
  
  const successfulDaysForCurrentRank = isMaxRank 
    ? daysPerTier 
    : safeDays % daysPerTier;
    
  const requiredSuccessfulDaysForCurrentRank = daysPerTier;
  const daysRemaining = isMaxRank ? 0 : requiredSuccessfulDaysForCurrentRank - successfulDaysForCurrentRank;
  const progressPercent = isMaxRank 
    ? 100 
    : Math.min(100, Math.round((successfulDaysForCurrentRank / requiredSuccessfulDaysForCurrentRank) * 100));

  return {
    currentRank,
    nextRank,
    successfulDaysForCurrentRank,
    requiredSuccessfulDaysForCurrentRank,
    daysInCurrentRank: successfulDaysForCurrentRank,
    daysNeededForNextRank: requiredSuccessfulDaysForCurrentRank,
    daysRemaining,
    progressPercent,
    isMaxRank,
    totalSuccessfulDays: safeDays,
  };
}

/**
 * Evaluates whether a calendar day is a SUCCESSFUL CONSISTENCY DAY (Full Moon Day).
 */
export function isSuccessfulConsistencyDay(
  completedMissionIds: string[],
  completedHabitIds: string[],
  activeMissions: Mission[],
  activeHabits: Habit[]
): boolean {
  const requiredMissions = activeMissions.filter((m) => m.isActive && m.isRequired);
  const dailyHabits = activeHabits.filter((h) => h.isActive);

  if (requiredMissions.length === 0 && dailyHabits.length === 0) {
    return false;
  }

  const allRequiredMissionsDone = requiredMissions.every((m) =>
    completedMissionIds.includes(m.id)
  );

  const allHabitsDone = dailyHabits.every((h) =>
    completedHabitIds.includes(h.id)
  );

  return allRequiredMissionsDone && allHabitsDone;
}

export const DEFAULT_REWARDS: Omit<Reward, 'id' | 'createdAt'>[] = [
  {
    name: '30-MIN STARLIT SANCTUARY',
    description: 'Immersive creative time, reading, or reflective stargazing with zero guilt.',
    essenceCost: 100,
    icon: 'NEURAL_SIM',
    isActive: true,
    isDefault: true,
  },
  {
    name: 'CELESTIAL ELIXIR & TREAT',
    description: 'Artisan tea, specialty coffee, or a wholesome delicacy to nourish your spirit.',
    essenceCost: 150,
    icon: 'BIO_RATION',
    isActive: true,
    isDefault: true,
  },
  {
    name: 'MOONLIT CINEMA NIGHT',
    description: 'Inspiring film, documentary, or cozy series episode with zero distractions.',
    essenceCost: 250,
    icon: 'HOLO_SCREEN',
    isActive: true,
    isDefault: true,
  },
  {
    name: 'CREATIVE ASTRAL JOURNEY',
    description: 'Paint, write, compose, or game after clearing today’s sacred rituals.',
    essenceCost: 300,
    icon: 'TACTICAL_ARCADE',
    isActive: true,
    isDefault: true,
  },
  {
    name: 'CELESTIAL HARVEST FEAST',
    description: 'A luxurious dinner out or thoughtfully prepared meal celebrating your growth.',
    essenceCost: 500,
    icon: 'STARK_FEAST',
    isActive: true,
    isDefault: true,
  },
  {
    name: 'FULL MOON SERENITY DAY',
    description: 'A completely clear schedule. Freedom to wander, rest, and deeply recharge.',
    essenceCost: 750,
    icon: 'RECHARGE_CYCLE',
    isActive: true,
    isDefault: true,
  },
];

export const STARTER_MISSIONS: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Deep Sanctuary Focus Block',
    description: 'Immerse for 90 minutes of dedicated work with quiet poise and zero notifications.',
    priority: 'HIGH',
    xpReward: 30,
    essenceReward: 25,
    isRequired: true,
    isActive: true,
  },
  {
    title: 'Movement & Body Vitality',
    description: 'Pilates, yoga, strength movement, or an invigorating walk under the open sky.',
    priority: 'HIGH',
    xpReward: 25,
    essenceReward: 20,
    isRequired: true,
    isActive: true,
  },
  {
    title: 'Skill Mastery & Creative Flow',
    description: 'Practice your craft, write, program, or study challenging material.',
    priority: 'MEDIUM',
    xpReward: 25,
    essenceReward: 20,
    isRequired: true,
    isActive: true,
  },
  {
    title: 'Evening Reflection & Sanctuary Reset',
    description: 'Tidy your space, record gratitude in your journal, and prepare tomorrow’s intentions.',
    priority: 'LOW',
    xpReward: 15,
    essenceReward: 10,
    isRequired: false,
    isActive: true,
  },
];

export const STARTER_HABITS: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak'>[] = [
  {
    name: 'Morning Light & Gratitude',
    description: 'Greet the dawn with deep breaths and three quiet things you are thankful for.',
    xpReward: 15,
    essenceReward: 15,
    isActive: true,
  },
  {
    name: 'Pure Hydration (2.5L+)',
    description: 'Nourish your body throughout the day with fresh water and gentle herbal infusions.',
    xpReward: 10,
    essenceReward: 10,
    isActive: true,
  },
  {
    name: 'Wisdom Reading (20 mins)',
    description: 'Read enriching non-fiction, philosophy, poetry, or literature.',
    xpReward: 15,
    essenceReward: 15,
    isActive: true,
  },
  {
    name: 'Mindfulness & Inner Stillness',
    description: '10 minutes of gentle meditation, breathwork, or centering presence.',
    xpReward: 15,
    essenceReward: 10,
    isActive: true,
  },
  {
    name: 'Peaceful Moon Sleep',
    description: 'Screens dimmed by bedtime for 8 restorative hours of deep, restful slumber.',
    xpReward: 20,
    essenceReward: 15,
    isActive: true,
  },
];
