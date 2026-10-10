import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Mission, Priority } from '../../types';
import { BASE_REWARDS } from '../../config/progression';
import { Trash2, Calendar, Sparkles } from 'lucide-react';
import { LunarGemIcon } from '../ui/LunarGemDisplay';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (missionData: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
  initialMission?: Mission | null;
  targetDate?: string;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialMission,
  targetDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [xpReward, setXpReward] = useState(BASE_REWARDS.missionXP);
  const [essenceReward, setEssenceReward] = useState(BASE_REWARDS.missionEssence);
  const [isRequired, setIsRequired] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialMission) {
      setTitle(initialMission.title);
      setDescription(initialMission.description || '');
      setPriority(initialMission.priority);
      setXpReward(initialMission.xpReward);
      setEssenceReward(initialMission.essenceReward);
      setIsRequired(initialMission.isRequired);
      setIsActive(initialMission.isActive);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setXpReward(BASE_REWARDS.missionXP);
      setEssenceReward(BASE_REWARDS.missionEssence);
      setIsRequired(true);
      setIsActive(true);
    }
  }, [initialMission, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      xpReward: Number(xpReward) || BASE_REWARDS.missionXP,
      essenceReward: Number(essenceReward) || BASE_REWARDS.missionEssence,
      isRequired,
      isActive,
      date: initialMission?.date || targetDate,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMission ? 'EDIT CELESTIAL QUEST' : 'CREATE CELESTIAL QUEST'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Quest Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep Sanctuary Focus Block"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key notes, scope of work, or reflection intentions..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
              Priority Tier
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white focus:outline-none"
            >
              <option value="LOW">Low (Flexible)</option>
              <option value="MEDIUM">Medium (Standard)</option>
              <option value="HIGH">High (Essential)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
              Core Directive
            </label>
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded border-slate-700 text-[#8b5cf6] focus:ring-0 w-4 h-4"
                />
                <span className="text-slate-300">Required for Full Moon</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 uppercase font-['Cinzel',serif]">
              Stardust XP Yield
            </label>
            <input
              type="number"
              min="5"
              max="200"
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
              max="200"
              value={essenceReward}
              onChange={(e) => setEssenceReward(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#121638] border border-[#a78bfa]/30 text-white"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#a78bfa]/20">
          {initialMission && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(initialMission.id)}
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
              {initialMission ? 'Save Changes' : 'Confirm Quest'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
