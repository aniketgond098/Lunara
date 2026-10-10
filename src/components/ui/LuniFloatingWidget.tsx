import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Maximize2,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LuniAvatar } from './LuniAvatar';
import { compileUserContext, askWebby } from '../../services/assistantService';
import { AssistantMessage } from '../../types';

export const LuniFloatingWidget: React.FC = () => {
  const {
    profile,
    missions,
    habits,
    dailyRecords,
    todayDate,
    activeTab,
    setActiveTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `✨ **Greetings, ${profile.username || 'Stargazer'}!**\n\nI’m **Luni**, your celestial guide. Ask me about your rituals, quests, or today’s moon streak! 🌙`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'happy'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Don't render floating launcher if already on ASSISTANT full tab
  if (activeTab === 'ASSISTANT') return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setAvatarState('thinking');

    try {
      const userContext = compileUserContext(profile, missions, habits, dailyRecords, todayDate);
      const reply = await askWebby(text, messages, userContext);

      const botMsg: AssistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setAvatarState('happy');
      setTimeout(() => setAvatarState('idle'), 2500);
    } catch {
      const errorMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "The celestial link flickered softly. Let's try again in a moment, Stargazer!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setAvatarState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-3 sm:right-5 z-40 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#1e1b4b] border border-[#c4b5fd]/35 text-white shadow-[0_2px_14px_rgba(167,139,250,0.22)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Open Luni AI Celestial Guide"
          aria-label="Open Luni AI Celestial Guide"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-[#a78bfa]/15 blur-sm group-hover:bg-[#a78bfa]/30 transition-colors -z-10" />

          <div className="scale-[0.82] origin-center -my-0.5">
            <LuniAvatar size="xs" state="idle" showBadge={true} />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-wider font-['Cinzel',serif] text-white flex items-center gap-0.5 leading-tight">
              <span>LUNI</span>
              <Sparkles className="w-2 h-2 text-[#fef08a]" />
            </span>
            <span className="text-[7px] sm:text-[7.5px] text-[#c4b5fd]/90 font-sans leading-none">Celestial Guide</span>
          </div>
        </button>
      )}

      {/* Pop-up Compact Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col rounded-3xl bg-[#090d22]/95 border border-[#a78bfa]/30 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(167,139,250,0.2)] overflow-hidden font-sans">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#1e1b4b] via-[#141238] to-[#1e1b4b] border-b border-[#a78bfa]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <LuniAvatar size="sm" state={avatarState} showBadge={true} />
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wider font-['Cinzel',serif] flex items-center gap-1">
                  <span>LUNI AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                </h3>
                <p className="text-[10px] text-[#c4b5fd]">Celestial Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab('ASSISTANT');
                }}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                title="Open Fullscreen Hub"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="shrink-0 mt-1">
                    <LuniAvatar size="sm" state="idle" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap break-words ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md rounded-br-none'
                      : 'bg-[#141838] border border-[#a78bfa]/20 text-[#f1f5f9] rounded-bl-none shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-2">
                <LuniAvatar size="sm" state="thinking" />
                <span className="text-[#c4b5fd] italic">Consulting the stars...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 border-t border-[#a78bfa]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-[#090d22]">
            <button
              onClick={() => handleSendMessage('What rituals do I have left today?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/30 text-[#c4b5fd] hover:text-white whitespace-nowrap"
            >
              Today's Rituals
            </button>
            <button
              onClick={() => handleSendMessage('What did I accomplish today?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/30 text-[#c4b5fd] hover:text-white whitespace-nowrap"
            >
              Today's Progress
            </button>
            <button
              onClick={() => handleSendMessage('Am I on track for a Full Moon day?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e1b4b] border border-[#a78bfa]/30 text-[#c4b5fd] hover:text-white whitespace-nowrap"
            >
              Full Moon Status
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0a0e28] border-t border-[#a78bfa]/20 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Luni anything..."
              className="flex-1 bg-[#12163a] border border-[#a78bfa]/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#c4b5fd]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export const WebbyFloatingWidget = LuniFloatingWidget;
