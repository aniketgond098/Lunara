import React from 'react';
import {
  Sparkles,
  Coffee,
  Film,
  Compass,
  Utensils,
  Moon,
  Heart,
  BookOpen,
  Headphones,
  Feather,
  Sun,
  Flame,
  Star,
} from 'lucide-react';
import { CelestialIcon } from './CelestialIcon';

export interface CelestialItemConfig {
  id: string;
  name: string;
  category: 'SANCTUARY' | 'VITALITY' | 'LEISURE' | 'EVOLUTION' | 'FOCUS' | 'GEAR' | 'UPGRADE';
  celestialLabel: string;
  techLabel?: string;
  color: string;
  accentColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
}

export const CELESTIAL_ITEM_REGISTRY: Record<string, CelestialItemConfig> = {
  NEURAL_SIM: {
    id: 'NEURAL_SIM',
    name: 'Starlit Sanctuary',
    category: 'SANCTUARY',
    celestialLabel: 'SANCTUARY // 30M',
    techLabel: 'SANCTUARY // 30M',
    color: '#c4b5fd',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(196, 181, 253, 0.4)',
    icon: Sparkles,
    description: 'Immersive reflective retreat, creative reading, or quiet wonder.',
  },
  BIO_RATION: {
    id: 'BIO_RATION',
    name: 'Celestial Elixir & Treat',
    category: 'VITALITY',
    celestialLabel: 'NOURISHMENT',
    techLabel: 'NOURISHMENT',
    color: '#fbbf24',
    accentColor: '#d97706',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    icon: Coffee,
    description: 'Artisan tea, specialty infusion, or wholesome confection.',
  },
  HOLO_SCREEN: {
    id: 'HOLO_SCREEN',
    name: 'Moonlit Cinema Night',
    category: 'LEISURE',
    celestialLabel: 'CINEMATIC ORBIT',
    techLabel: 'CINEMATIC ORBIT',
    color: '#f472b6',
    accentColor: '#db2777',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    icon: Film,
    description: 'Uninterrupted inspiring film or narrative series under the stars.',
  },
  TACTICAL_ARCADE: {
    id: 'TACTICAL_ARCADE',
    name: 'Creative Astral Journey',
    category: 'LEISURE',
    celestialLabel: 'CREATIVE FLOW',
    techLabel: 'CREATIVE FLOW',
    color: '#a78bfa',
    accentColor: '#7c3aed',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    icon: Feather,
    description: 'Deep artistic flow, writing, composing, or relaxed gaming.',
  },
  STARK_FEAST: {
    id: 'STARK_FEAST',
    name: 'Celestial Harvest Feast',
    category: 'VITALITY',
    celestialLabel: 'CELEBRATION DINING',
    techLabel: 'CELEBRATION DINING',
    color: '#f59e0b',
    accentColor: '#b45309',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: Utensils,
    description: 'A celebrated luxury dinner or feast honoring your dedication.',
  },
  RECHARGE_CYCLE: {
    id: 'RECHARGE_CYCLE',
    name: 'Full Moon Serenity Day',
    category: 'SANCTUARY',
    celestialLabel: 'TOTAL RENEWAL',
    techLabel: 'TOTAL RENEWAL',
    color: '#60a5fa',
    accentColor: '#2563eb',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    icon: Moon,
    description: 'Complete freedom from obligations to rest and revitalize.',
  },
};

export const SPIDEY_GEAR_REGISTRY = CELESTIAL_ITEM_REGISTRY;

export function resolveCelestialItem(iconKey: string): CelestialItemConfig {
  return CELESTIAL_ITEM_REGISTRY[iconKey] || CELESTIAL_ITEM_REGISTRY.NEURAL_SIM;
}

export const resolveSpideyGear = resolveCelestialItem;

interface CelestialMarketBadgeProps {
  iconKey: string;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
  className?: string;
}

export const CelestialMarketBadge: React.FC<CelestialMarketBadgeProps> = ({
  iconKey,
  size = 'md',
  showCategory = false,
  className = '',
}) => {
  const item = resolveCelestialItem(iconKey);
  const Icon = item.icon;

  const boxSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`relative ${boxSizes[size]} rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105`}
        style={{
          backgroundColor: '#0a0e24',
          border: `1.5px solid ${item.color}`,
          boxShadow: `0 0 14px ${item.glowColor}`,
          color: item.color,
        }}
      >
        <Icon size={iconSizes[size]} />
      </div>

      {showCategory && (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-white tracking-wide font-['Cinzel',serif]">
            {item.name}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-[#c4b5fd]/80 font-sans">
            {item.celestialLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export const SpideyMarketBadge = CelestialMarketBadge;
