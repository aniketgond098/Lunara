import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Habit } from '../../types';
import { BASE_REWARDS } from '../../config/progression';
import { Trash2, Sparkles, Moon } from 'lucide-react';
import { LunarGemIcon } from '../ui/LunarGemDisplay';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak'>) => void;
  onDelete?: (id: string) => void;
  initialHabit?: Habit | null;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(BASE_REWARDS.habitXP);
  const [essenceReward, setEssenceReward] = useState(BASE_REWARDS.habitEssence);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setXpReward(initialHabit.xpReward);
      setEssenceReward(initialHabit.essenceReward);
      setIsActive(initialHabit.isActive);
    } else {
      setName('');
      setDescription('');
      setXpReward(BASE_REWARDS.habitXP);
      setEssenceReward(BASE_REWARDS.habitEssence);
      setIsActive(true);
    }
  }, [initialHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      xpReward: Number(xpReward) || BASE_REWARDS.habitXP,
      essenceReward: Number(essenceReward) || BASE_REWARDS.habitEssence,
      isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialHabit ? 'EDIT CELESTIAL RITUAL' : 'ESTABLISH DAILY RITUAL'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Ritual Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Sunlight & Gratitude"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Description / Intention (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this ritual anchors your daily peace..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
              Stardust XP Yield
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
              Lunar Gems Yield
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={essenceReward}
              onChange={(e) => setEssenceReward(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-700 text-[#8b5cf6] focus:ring-0 w-4 h-4"
            />
            <span className="text-slate-300 font-medium">
              Active in Daily Orbit (Contributes to Moon Streak)
            </span>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#a78bfa]/20">
          {initialHabit && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(initialHabit.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Release</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold font-['Cinzel',serif] shadow-[0_0_15px_rgba(167,139,250,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              {initialHabit ? 'Save Ritual' : 'Align Ritual'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
