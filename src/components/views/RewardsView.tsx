import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  ShoppingBag,
  History,
  CheckCircle2,
  Edit2,
  Trash2,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RewardModal } from '../modals/RewardModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Reward } from '../../types';
import { formatTimeHUD, formatReadableDate } from '../../utils/date';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { CelestialMarketBadge, resolveCelestialItem } from '../ui/CelestialMarketBadge';
import { CelestialIcon } from '../ui/CelestialIcon';

export const RewardsView: React.FC = () => {
  const {
    profile,
    rewards,
    purchases,
    essenceTransactions,
    purchaseReward,
    createReward,
    updateReward,
    deleteReward,
    setSpideyCoins,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MARKET' | 'LEDGER'>('MARKET');
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'EARNED' | 'SPENT'>('ALL');
  const [purchasePulseId, setPurchasePulseId] = useState<string | null>(null);

  const handleEdit = (reward: Reward, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleDelete = (reward: Reward, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingReward(reward);
  };

  const handleConfirmDelete = () => {
    if (deletingReward) {
      deleteReward(deletingReward.id);
      setDeletingReward(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingReward(null);
    setIsModalOpen(true);
  };

  const handlePurchase = (reward: Reward) => {
    if (profile.currentEssence >= reward.essenceCost) {
      setPurchasePulseId(reward.id);
      setTimeout(() => setPurchasePulseId(null), 1200);
      purchaseReward(reward.id);
    }
  };

  const activeRewards = rewards.filter((r) => r.isActive);

  const filteredTransactions = essenceTransactions.filter((tx) => {
    if (ledgerFilter === 'EARNED') return tx.amount > 0;
    if (ledgerFilter === 'SPENT') return tx.amount < 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 lg:pb-8 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a78bfa]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#c4b5fd] font-medium tracking-widest uppercase font-['Cinzel',serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>SACRED RECHARGE · MERIT & BOUNTY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white uppercase font-['Cinzel',serif] tracking-wider mt-1">
            CELESTIAL MARKET
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Exchange your hard-earned Lunar Gems for rejuvenating rewards and restful sanctuaries.
          </p>
        </div>

        {/* Balance Card & Add Button */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-[#090d24] border border-[#fbbf24]/30 flex items-center gap-2.5 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <LunarGemIcon size={22} glow={true} />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase font-semibold text-[10px]">
                LUNAR GEMS
              </span>
              <span className="text-base font-bold text-white font-['Cinzel',serif] leading-tight">
                {profile.currentEssence.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all cursor-pointer font-['Cinzel',serif] tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>CUSTOM BOUNTY</span>
          </button>
        </div>
      </div>

      {/* 2. Market Tabs: SANCTUARY MARKET vs GEM LEDGER */}
      <div className="flex items-center justify-between gap-4 border-b border-[#a78bfa]/15">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider font-['Cinzel',serif] border-b-2 transition-all cursor-pointer ${
              activeTab === 'MARKET'
                ? 'border-[#c4b5fd] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Celestial Sanctuaries ({activeRewards.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider font-['Cinzel',serif] border-b-2 transition-all cursor-pointer ${
              activeTab === 'LEDGER'
                ? 'border-[#c4b5fd] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              <span>Gems Ledger ({essenceTransactions.length})</span>
            </span>
          </button>
        </div>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'MARKET' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeRewards.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-3xl border border-dashed border-[#a78bfa]/25 bg-[#070b1a]/50 text-slate-400 space-y-3">
              <CelestialIcon size={44} glow={true} className="mx-auto" />
              <h3 className="text-sm font-semibold text-white font-['Cinzel',serif]">MARKET RESTING</h3>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                No active rewards found. Create custom bounties like your favorite book, tea time, or film night.
              </p>
            </div>
          ) : (
            activeRewards.map((reward) => {
              const itemConfig = resolveCelestialItem(reward.icon);
              const canAfford = profile.currentEssence >= reward.essenceCost;
              const isPulsing = purchasePulseId === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden bg-[#090d24]/90 hover:bg-[#0e1438] ${
                    isPulsing
                      ? 'border-[#34d399] shadow-[0_0_30px_rgba(52,211,153,0.35)] scale-[1.02]'
                      : 'border-[#a78bfa]/25 hover:border-[#a78bfa]/60 shadow-lg'
                  }`}
                >
                  {/* Top Item Badge & Controls */}
                  <div className="flex items-start justify-between gap-3">
                    <CelestialMarketBadge iconKey={reward.icon} size="md" showCategory={false} />

                    <div className="flex items-center gap-1.5 opacity-100 sm:opacity-80 sm:hover:opacity-100">
                      <button
                        onClick={(e) => handleEdit(reward, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Reward"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(reward, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Delete Reward"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Lore */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#c4b5fd]/80 font-semibold font-sans">
                      {itemConfig.celestialLabel}
                    </span>
                    <h3 className="text-base font-semibold text-white tracking-wide font-['Cinzel',serif]">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {reward.description || itemConfig.description}
                    </p>
                  </div>

                  {/* Price & Claim Button */}
                  <div className="pt-4 border-t border-[#a78bfa]/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <LunarGemIcon size={18} glow={false} />
                      <span className="text-lg font-bold text-white font-['Cinzel',serif]">
                        {reward.essenceCost.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-sans">Gems</span>
                    </div>

                    <button
                      onClick={() => handlePurchase(reward)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-['Cinzel',serif] tracking-wider flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white shadow-[0_0_15px_rgba(167,139,250,0.3)] hover:scale-105 active:scale-95'
                          : 'bg-[#151933] border border-[#334155] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>CLAIM BOUNTY</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>LOCKED</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* LEDGER VIEW */
        <div className="space-y-4">
          {/* Filter segment */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#090d22] border border-[#a78bfa]/20 w-fit">
            <button
              onClick={() => setLedgerFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                ledgerFilter === 'ALL' ? 'bg-[#2e1065] text-[#fef08a]' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setLedgerFilter('EARNED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                ledgerFilter === 'EARNED' ? 'bg-[#2e1065] text-[#34d399]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gems Gathered
            </button>
            <button
              onClick={() => setLedgerFilter('SPENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                ledgerFilter === 'SPENT' ? 'bg-[#2e1065] text-[#f472b6]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gems Redeemed
            </button>
          </div>

          <div className="rounded-2xl border border-[#a78bfa]/25 bg-[#090d22]/85 overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No ledger transactions recorded yet. Complete rituals and quests to accumulate Lunar Gems!
              </div>
            ) : (
              <div className="divide-y divide-[#a78bfa]/10">
                {filteredTransactions.map((tx) => {
                  const isEarned = tx.amount > 0;
                  return (
                    <div
                      key={tx.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isEarned
                              ? 'bg-[#064e3b]/50 text-[#34d399] border border-[#059669]/40'
                              : 'bg-[#831843]/50 text-[#f472b6] border border-[#db2777]/40'
                          }`}
                        >
                          {isEarned ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">{tx.description}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatReadableDate(tx.date)} · {formatTimeHUD(tx.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-['Cinzel',serif] font-bold text-sm">
                        <LunarGemIcon size={14} glow={false} />
                        <span className={isEarned ? 'text-[#34d399]' : 'text-[#f472b6]'}>
                          {isEarned ? `+${tx.amount}` : tx.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <RewardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReward(null);
        }}
        initialReward={editingReward}
        onSave={(data) => {
          if (editingReward) {
            updateReward(editingReward.id, data);
          } else {
            createReward(data);
          }
          setIsModalOpen(false);
          setEditingReward(null);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deletingReward)}
        onClose={() => setDeletingReward(null)}
        title="Release Bounty"
        message={`Are you sure you wish to release "${deletingReward?.name}" from the market?`}
        confirmLabel="Release Bounty"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingReward(null)}
      />
    </div>
  );
};
