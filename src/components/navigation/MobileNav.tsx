import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  User,
  Bot,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'TODAY', label: 'HUB', icon: Compass },
    { id: 'ASSISTANT', label: 'LUNI', icon: Bot },
    { id: 'MISSIONS', label: 'QUESTS', icon: Target },
    { id: 'HABITS', label: 'RITUALS', icon: CheckCircle },
    { id: 'TRACKING', label: 'STAR LOG', icon: Calendar },
    { id: 'REWARDS', label: 'MARKET', icon: Sparkles },
    { id: 'ASCEND', label: 'EVOLVE', icon: TrendingUp },
    { id: 'PROFILE', label: 'UNIVERSE', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#070b1a]/95 backdrop-blur-xl border-t border-[#a78bfa]/20 px-1 py-1 select-none safe-area-pb">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-w-[44px] cursor-pointer
                ${
                  isActive
                    ? 'text-[#fef08a] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-[#fef08a]' : 'text-[#c4b5fd]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a]" />
                )}
              </div>
              <span className="text-[8px] font-sans tracking-tight mt-1 uppercase whitespace-nowrap font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
