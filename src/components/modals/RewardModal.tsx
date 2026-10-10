import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Reward } from '../../types';
import { CELESTIAL_ITEM_REGISTRY, CelestialMarketBadge } from '../ui/CelestialMarketBadge';
import { LunarGemIcon } from '../ui/LunarGemDisplay';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rewardData: Omit<Reward, 'id' | 'createdAt'>) => void;
  initialReward?: Reward | null;
}

const CELESTIAL_OPTIONS = Object.keys(CELESTIAL_ITEM_REGISTRY);

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialReward,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [essenceCost, setEssenceCost] = useState(150);
  const [icon, setIcon] = useState('NEURAL_SIM');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialReward) {
      setName(initialReward.name);
      setDescription(initialReward.description || '');
      setEssenceCost(initialReward.essenceCost);
      setIcon(initialReward.icon || 'NEURAL_SIM');
      setIsActive(initialReward.isActive);
    } else {
      setName('');
      setDescription('');
      setEssenceCost(150);
      setIcon('NEURAL_SIM');
      setIsActive(true);
    }
  }, [initialReward, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim().toUpperCase(),
      description: description.trim() || undefined,
      essenceCost: Math.max(10, Number(essenceCost) || 100),
      icon,
      isActive,
    });
    onClose();
  };

  const selectedItem = CELESTIAL_ITEM_REGISTRY[icon] || CELESTIAL_ITEM_REGISTRY.NEURAL_SIM;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReward ? 'EDIT CELESTIAL BOUNTY' : 'CREATE CELESTIAL BOUNTY'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Bounty Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ARTISAN TEA & READING SANCTUARY"
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
            placeholder="Describe your peaceful recharge or celebratory treat..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Lunar Gems Cost
          </label>
          <div className="relative">
            <input
              type="number"
              min="10"
              max="10000"
              step="10"
              value={essenceCost}
              onChange={(e) => setEssenceCost(Number(e.target.value))}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white font-['Cinzel',serif] text-sm font-semibold"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LunarGemIcon size={16} glow={false} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2 uppercase font-['Cinzel',serif]">
            Celestial Archetype Emblem
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CELESTIAL_OPTIONS.map((key) => {
              const item = CELESTIAL_ITEM_REGISTRY[key];
              const isSelected = icon === key;
              return (
                <div
                  key={key}
                  onClick={() => setIcon(key)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 text-center ${
                    isSelected
                      ? 'bg-[#20153f] border-[#fef08a] shadow-[0_0_15px_rgba(254,240,138,0.25)]'
                      : 'bg-[#121638] border-[#a78bfa]/20 hover:border-[#a78bfa]/40'
                  }`}
                >
                  <CelestialMarketBadge iconKey={key} size="sm" />
                  <span className="text-[10px] font-semibold text-white truncate max-w-full font-['Cinzel',serif]">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#a78bfa]/20">
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
            {initialReward ? 'Save Bounty' : 'Add to Market'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
