import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Moon,
  Star,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssistantMessage } from '../../types';
import { LuniAvatar } from '../ui/LuniAvatar';
import { LunarGemIcon } from '../ui/LunarGemDisplay';
import { compileUserContext, askWebby } from '../../services/assistantService';
import { getMissionDate } from '../../utils/date';

const STORAGE_KEY = 'lunara_luni_chat_history';

export const LuniAssistantView: React.FC = () => {
  const {
    profile,
    missions,
    habits,
    dailyRecords,
    todayDate,
    toggleMissionCompletion,
    toggleHabitCompletion,
    setActiveTab,
  } = useApp();

  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
    return [
      {
        id: 'initial-welcome',
        role: 'model',
        text: `✨ **Greetings, ${profile.username || 'Stargazer'}! I'm Luni!** 🌙\n\nI'm your celestial guide and companion in Lunara. I keep watch over your daily schedule, track what you've accomplished today, protect your moon streaks, and help you grow into your next chapter!\n\nAsk me anything! For example:\n• *"What did I accomplish today?"*\n• *"What rituals and quests are left on my schedule?"*\n• *"Am I on track for a Full Moon Day?"*\n• *"How much Stardust XP and Lunar Gems can I still gather today?"*`,
        timestamp: Date.now(),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'happy'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compile full real-time telemetry snapshot
  const userContext = compileUserContext(profile, missions, habits, dailyRecords, todayDate);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat:', e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);
    setAvatarState('thinking');

    try {
      const reply = await askWebby(text, messages, userContext);

      const botMsg: AssistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setAvatarState('happy');
      setTimeout(() => setAvatarState('idle'), 3000);

      // Voice synthesis if user has voice enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        speakText(reply);
      }
    } catch {
      const errorMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "The celestial links are cloudy at this moment, Stargazer. Please try again shortly!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setAvatarState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.25;
      utterance.rate = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const initialMsg: AssistantMessage = {
      id: `welcome-${Date.now()}`,
      role: 'model',
      text: `✨ **Chat history renewed!** How can I support your orbit today, ${profile.username || 'Stargazer'}?`,
      timestamp: Date.now(),
    };
    setMessages([initialMsg]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Quick Prompt Chips
  const quickPrompts = [
    { label: '✦ What did I accomplish today?', query: 'What did I accomplish today so far?' },
    { label: '☽ What is left on my schedule?', query: "What rituals and quests are still left on today's schedule?" },
    { label: '🌕 Am I on track for a Full Moon Day?', query: 'Am I on track for a Full Moon Perfect Day today?' },
    { label: '💎 Remaining Stardust XP & Gems', query: 'How much Stardust XP and Lunar Gems can I still earn today?' },
    { label: '✧ Inspire my next chapter', query: 'Give me inspirational guidance to grow into my next chapter today.' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans w-full min-w-0 overflow-x-hidden">
      {/* 1. HERO CELESTIAL ASSISTANT BANNER */}
      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1b1036] via-[#090d22] to-[#1e153a] border border-[#c4b5fd]/30 shadow-2xl relative overflow-hidden">
        {/* Soft Aura */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#c4b5fd]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <LuniAvatar size="lg" state={avatarState} showBadge={true} />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#c4b5fd] uppercase tracking-widest font-semibold font-['Cinzel',serif]">
                  CELESTIAL INTELLIGENCE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              </div>

              <h1 className="text-xl sm:text-3xl font-bold text-white font-['Cinzel',serif] tracking-wider">
                LUNI · YOUR CELESTIAL GUIDE
              </h1>

              <p className="text-xs text-slate-300 font-sans max-w-md">
                Live orbit tracking with full knowledge of your daily rituals, active quests, and moon streak.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (voiceEnabled) window.speechSynthesis?.cancel();
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`p-2 sm:p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                voiceEnabled
                  ? 'bg-[#2e1065] border-[#c4b5fd] text-[#fef08a] shadow-[0_0_12px_rgba(167,139,250,0.3)]'
                  : 'bg-[#0f1430] border-[#334155] text-slate-400 hover:text-white'
              }`}
              title={voiceEnabled ? 'Mute Luni Voice' : 'Enable Luni Voice Read Aloud'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="font-sans font-medium text-[11px]">
                {voiceEnabled ? 'Voice On' : 'Voice Off'}
              </span>
            </button>

            <button
              onClick={handleClearHistory}
              className="p-2 sm:p-2.5 rounded-xl bg-[#0f1430] border border-[#334155] text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer text-xs"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Daily Telemetry Pills */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#a78bfa]/20 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-slate-400 font-sans uppercase">TODAY'S OBJECTIVES</span>
            <p className="text-xs sm:text-sm font-semibold text-white font-['Cinzel',serif] mt-0.5">
              {userContext.todaySummary.completedCount} / {userContext.todaySummary.totalObjectives} Done
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-slate-400 font-sans uppercase">PENDING RITUALS</span>
            <p className="text-xs sm:text-sm font-semibold text-[#c4b5fd] font-['Cinzel',serif] mt-0.5">
              {userContext.dailyProtocols.pending.length} Remaining
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/20">
            <span className="text-[10px] text-slate-400 font-sans uppercase">PENDING QUESTS</span>
            <p className="text-xs sm:text-sm font-semibold text-[#c4b5fd] font-['Cinzel',serif] mt-0.5">
              {userContext.missions.pending.length} Remaining
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0d122d]/80 border border-[#fbbf24]/20">
            <span className="text-[10px] text-[#fef08a] font-sans uppercase">GATHERED TODAY</span>
            <p className="text-xs sm:text-sm font-semibold text-white font-['Cinzel',serif] mt-0.5 flex items-center gap-1.5">
              <span>+{userContext.todaySummary.xpEarnedToday} XP</span>
              <span className="text-slate-600">·</span>
              <span className="text-[#fde047] flex items-center gap-0.5">
                <LunarGemIcon size={12} glow={false} />
                +{userContext.todaySummary.essenceEarnedToday}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. QUICK PROMPT CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full min-w-0">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            disabled={isLoading}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-[#090d24]/90 border border-[#a78bfa]/25 hover:border-[#c4b5fd] text-xs text-[#c4b5fd] hover:text-white transition-all whitespace-nowrap cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50 shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 3. MAIN CHAT WINDOW */}
      <div className="rounded-3xl bg-[#090d24]/90 border border-[#a78bfa]/25 shadow-2xl overflow-hidden flex flex-col h-[480px] sm:h-[560px] max-h-[75vh] w-full min-w-0">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-1">
                    <LuniAvatar size="sm" state="idle" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] px-4 sm:px-5 py-3 sm:py-4 rounded-3xl leading-relaxed text-xs sm:text-sm whitespace-pre-wrap break-words relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white shadow-lg rounded-br-none'
                      : 'bg-[#121638] border border-[#a78bfa]/25 text-[#f1f5f9] rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}

                  {/* Copy & TTS actions on hover */}
                  {!isUser && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#a78bfa]/15 text-xs text-slate-400 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#34d399]" />
                            <span className="text-[#34d399]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-white flex items-center gap-1 transition-colors ml-2"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Read Aloud</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2e1065] border border-[#a78bfa]/40 flex items-center justify-center font-bold text-xs text-[#fef08a] shrink-0 font-['Cinzel',serif] mt-1">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs sm:text-sm pl-1">
              <LuniAvatar size="sm" state="thinking" />
              <div className="px-3.5 py-2.5 rounded-2xl bg-[#121638] border border-[#a78bfa]/20 text-[#c4b5fd] italic">
                Luni is consulting the starlight records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with zero-overflow mobile flex layout */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 sm:p-4 bg-[#0a0e28] border-t border-[#a78bfa]/20 flex items-center gap-2 sm:gap-3 shrink-0 w-full min-w-0 box-border overflow-hidden"
        >
          <div className="relative flex-1 min-w-0 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Luni anything..."
              className="w-full min-w-0 bg-[#12163a] border border-[#a78bfa]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="shrink-0 w-9 h-9 sm:w-auto sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(167,139,250,0.3)] disabled:opacity-40 transition-all cursor-pointer font-['Cinzel',serif] tracking-wider text-xs active:scale-95"
            title="Send Message"
            aria-label="Send Message"
          >
            <span className="hidden sm:inline">SEND</span>
            <Send className="w-3.5 h-3.5 shrink-0" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const WebbyAssistantView = LuniAssistantView;
