import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Key,
  RefreshCw,
  X,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Terminal,
  PlusCircle,
  LogOut,
  Moon,
  ArrowRight,
} from 'lucide-react';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
  setManualSupabaseConfig,
  clearManualSupabaseConfig,
  isSecretApiKey,
  hasSecretKeyConfigured,
  getApiKeyRole,
} from '../../lib/supabase';
import { supabaseService } from '../../services/supabaseService';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
  initialTab?: 'CONFIG' | 'SQL' | 'NEW_PROJECT';
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
  initialTab = 'CONFIG',
}) => {
  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY || '');
  const [copied, setCopied] = useState(false);
  const [copiedQuickFix, setCopiedQuickFix] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'failed';
    isMissingTables?: boolean;
    error?: string;
  }>({ status: 'idle' });
  const [activeTab, setActiveTab] = useState<'CONFIG' | 'SQL' | 'NEW_PROJECT'>(initialTab);

  if (!isOpen) return null;

  const isSecretKeyPresent = isSecretApiKey(anonKey);
  const detectedKeyRole = getApiKeyRole(anonKey);

  // Derive direct Supabase SQL editor & API keys URL
  const projectRefMatch = url.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  const projectRef = projectRefMatch ? projectRefMatch[1] : null;
  const supabaseSqlEditorUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : 'https://supabase.com/dashboard/project/_/sql/new';
  const supabaseApiKeysUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/settings/api`
    : 'https://supabase.com/dashboard/project/_/settings/api';

  const handleSave = () => {
    if (isSecretKeyPresent) {
      setTestResult({
        status: 'failed',
        error: 'Forbidden: You entered a secret "service_role" key. Supabase blocks secret keys in browsers. Please use the public "anon" key.',
      });
      return;
    }

    if (url.trim() && anonKey.trim()) {
      const res = setManualSupabaseConfig(url, anonKey);
      if (!res.success) {
        setTestResult({ status: 'failed', error: res.error });
        return;
      }
      if (onConfigChanged) onConfigChanged();
      handleTestConnection();
    }
  };

  const handleClear = () => {
    clearManualSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({ status: 'idle' });
    if (onConfigChanged) onConfigChanged();
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing' });
    const res = await supabaseService.testConnection(url, anonKey);
    if (res.ok) {
      setTestResult({ status: 'success' });
      if (onConfigChanged) onConfigChanged();
    } else if (res.isMissingTables) {
      setTestResult({
        status: 'failed',
        isMissingTables: true,
        error: res.error,
      });
    } else {
      setTestResult({
        status: 'failed',
        isMissingTables: false,
        error: res.error,
      });
    }
  };

  const sqlSchemaText = `-- ============================================================================
-- LUNARA // SUPABASE POSTGRESQL SCHEMA & AUTOMATION TRIGGER
-- Paste this script into Supabase SQL Editor and click RUN
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    username TEXT NOT NULL DEFAULT 'STARGAZER',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    avatar_icon TEXT DEFAULT 'CelestialIcon',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. MISSIONS (Directives & Celestial Quests)
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    xp_reward INTEGER NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    spidey_coin_reward INTEGER NOT NULL DEFAULT 20 CHECK (spidey_coin_reward >= 0),
    required BOOLEAN NOT NULL DEFAULT true,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. MISSION COMPLETIONS
CREATE TABLE IF NOT EXISTS public.mission_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
    completion_date TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reward_granted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_mission_completion UNIQUE(user_id, mission_id, completion_date)
);

-- 4. HABITS (Daily Celestial Rituals)
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    frequency TEXT NOT NULL DEFAULT 'DAILY',
    xp_reward INTEGER NOT NULL DEFAULT 35 CHECK (xp_reward >= 0),
    spidey_coin_reward INTEGER NOT NULL DEFAULT 15 CHECK (spidey_coin_reward >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. HABIT COMPLETIONS
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    completion_date TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reward_granted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_habit_completion UNIQUE(user_id, habit_id, completion_date)
);

-- 6. DAILY PROGRESS (Moon Hub Orbit Record)
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date TEXT NOT NULL,
    required_missions_completed INTEGER NOT NULL DEFAULT 0,
    required_missions_total INTEGER NOT NULL DEFAULT 0,
    habits_completed INTEGER NOT NULL DEFAULT 0,
    habits_total INTEGER NOT NULL DEFAULT 0,
    completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    is_successful_day BOOLEAN NOT NULL DEFAULT false,
    is_perfect_day BOOLEAN NOT NULL DEFAULT false,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    spidey_coins_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_daily_progress UNIQUE(user_id, date)
);

-- 7. XP TRANSACTIONS (Stardust XP)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT DEFAULT NULL,
    transaction_date TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. SPIDEY COIN TRANSACTIONS (Lunar Gems)
CREATE TABLE IF NOT EXISTS public.spidey_coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT DEFAULT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. LEVEL PROGRESSION (Evolution)
CREATE TABLE IF NOT EXISTS public.level_progression (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_level INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. RANK PROGRESSION (Constellation Rank)
CREATE TABLE IF NOT EXISTS public.rank_progression (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_rank TEXT NOT NULL DEFAULT 'E',
    successful_days_for_current_rank INTEGER NOT NULL DEFAULT 0,
    required_successful_days INTEGER NOT NULL DEFAULT 180,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. REWARDS (Celestial Market)
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    cost INTEGER NOT NULL CHECK (cost >= 0),
    icon TEXT NOT NULL DEFAULT 'Sparkles',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. REWARD PURCHASES
CREATE TABLE IF NOT EXISTS public.reward_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
    cost INTEGER NOT NULL,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. NOTIFICATIONS (Celestial Chronicles)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'SYSTEM',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spidey_coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- IDEMPOTENT RLS POLICIES (Safe to re-run anytime)
DROP POLICY IF EXISTS "user_profiles" ON public.profiles;
CREATE POLICY "user_profiles" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_missions" ON public.missions;
CREATE POLICY "user_missions" ON public.missions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_mission_comps" ON public.mission_completions;
CREATE POLICY "user_mission_comps" ON public.mission_completions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_habits" ON public.habits;
CREATE POLICY "user_habits" ON public.habits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_habit_comps" ON public.habit_completions;
CREATE POLICY "user_habit_comps" ON public.habit_completions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_daily_prog" ON public.daily_progress;
CREATE POLICY "user_daily_prog" ON public.daily_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_xp_tx" ON public.xp_transactions;
CREATE POLICY "user_xp_tx" ON public.xp_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_coin_tx" ON public.spidey_coin_transactions;
CREATE POLICY "user_coin_tx" ON public.spidey_coin_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_level_prog" ON public.level_progression;
CREATE POLICY "user_level_prog" ON public.level_progression FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_rank_prog" ON public.rank_progression;
CREATE POLICY "user_rank_prog" ON public.rank_progression FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_rewards" ON public.rewards;
CREATE POLICY "user_rewards" ON public.rewards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_purchases" ON public.reward_purchases;
CREATE POLICY "user_purchases" ON public.reward_purchases FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_notifs" ON public.notifications;
CREATE POLICY "user_notifs" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- USER SETUP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID := NEW.id;
    v_username TEXT;
BEGIN
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', 'STARGAZER');

    INSERT INTO public.profiles (user_id, username, avatar_icon)
    VALUES (v_user_id, v_username, 'CelestialIcon')
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.level_progression (user_id, current_level)
    VALUES (v_user_id, 1)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.rank_progression (user_id, current_rank, successful_days_for_current_rank, required_successful_days)
    VALUES (v_user_id, 'E', 0, 180)
    ON CONFLICT (user_id) DO NOTHING;

    -- Starter LUNARA Celestial Quests
    INSERT INTO public.missions (user_id, title, description, priority, xp_reward, spidey_coin_reward, required, active)
    VALUES 
        (v_user_id, 'Sacred Awakening & Hydration', 'Nourish your physical vessel with fresh mineral water.', 'HIGH', 40, 20, true, true),
        (v_user_id, 'Mindful Movement & Posture', 'Execute 30 minutes of gentle yoga or kinetic alignment.', 'HIGH', 80, 35, true, true),
        (v_user_id, 'Deep Focus Creative Sanctuary', 'Complete 90 uninterrupted minutes toward your next chapter.', 'HIGH', 100, 40, true, true),
        (v_user_id, 'Starlight Evening Wind-Down', 'Gentle mobility and digital sunset to prepare for restorative sleep.', 'MEDIUM', 30, 15, false, true)
    ON CONFLICT DO NOTHING;

    -- Starter LUNARA Daily Rituals
    INSERT INTO public.habits (user_id, name, description, frequency, xp_reward, spidey_coin_reward, active)
    VALUES
        (v_user_id, 'Pure Wholesome Nourishment', 'Honor your physical sanctuary with clean organic fuel.', 'DAILY', 35, 15, true),
        (v_user_id, 'Evening Sanctuary Reset', 'Gently cleanse desk and prepare tomorrow’s rituals under the night sky.', 'DAILY', 25, 10, true),
        (v_user_id, 'Restorative Deep Sleep (8 Hours)', 'Align your body with natural circadian rhythms.', 'DAILY', 40, 20, true)
    ON CONFLICT DO NOTHING;

    -- Starter LUNARA Celestial Market Rewards
    INSERT INTO public.rewards (user_id, name, description, cost, icon, active)
    VALUES
        (v_user_id, 'Sanctuary Spa Evening', 'Warm herbal bath, candles, and serene relaxation.', 250, 'Sparkles', true),
        (v_user_id, 'Cozy Fiction & Reading Retreat', 'Two guilt-free hours lost in an inspiring novel.', 200, 'BookOpen', true),
        (v_user_id, 'New Celestial Decor Item', 'Treat your sanctuary to a magical starlight piece.', 600, 'Star', true),
        (v_user_id, 'Full Moon Serenity Day', 'A peaceful day devoted to complete relaxation and renewal.', 400, 'Moon', true)
    ON CONFLICT DO NOTHING;

    -- Welcome Notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
        v_user_id, 
        'SANCTUARY ONLINE', 
        'Welcome to Lunara, ' || v_username || '. Your celestial journey begins at Constellation Rank E. Complete your daily rituals and quests to grow into your next chapter.', 
        'SYSTEM'
    )
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: automatically fires on auth.users sign-up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();

-- ============================================================================
-- 14. API PERMISSIONS & POSTGREST SCHEMA CACHE RELOAD
-- ============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Force PostgREST to immediately refresh its in-memory schema cache
NOTIFY pgrst, 'reload schema';
`;

  const quickFixSql = `-- ============================================================================
-- QUICK FIX: GRANT PERMISSIONS & RELOAD SCHEMA CACHE (Run in SQL Editor)
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Instantly refresh Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyQuickFix = () => {
    navigator.clipboard.writeText(quickFixSql);
    setCopiedQuickFix(true);
    setTimeout(() => setCopiedQuickFix(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090d24] border border-[#a78bfa]/35 shadow-[0_0_60px_rgba(167,139,250,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#a78bfa]/20 bg-gradient-to-r from-[#181136] via-[#090d22] to-[#1a1236]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e1065] border border-[#a78bfa]/30 text-[#fef08a] shadow-[0_0_15px_rgba(167,139,250,0.3)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-['Cinzel',serif]">
                SUPABASE DATABASE INTEGRATION
              </h2>
              <p className="text-xs text-[#c4b5fd] font-sans">
                Persistent PostgreSQL Source of Truth & Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#a78bfa]/20 px-4 sm:px-6 bg-[#060918] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`py-3 px-3.5 sm:px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CONFIG'
                ? 'border-[#a78bfa] text-[#fef08a] bg-[#8b5cf6]/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CONNECTION CONFIG
          </button>
          <button
            onClick={() => setActiveTab('NEW_PROJECT')}
            className={`py-3 px-3.5 sm:px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'NEW_PROJECT'
                ? 'border-[#34d399] text-[#34d399] bg-[#10b981]/10'
                : 'border-transparent text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#34d399]" />
            <span>CREATE NEW DATABASE</span>
          </button>
          <button
            onClick={() => setActiveTab('SQL')}
            className={`py-3 px-3.5 sm:px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'SQL'
                ? 'border-[#a78bfa] text-[#fef08a] bg-[#8b5cf6]/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SQL SCHEMA SCRIPT
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs font-sans">
          {activeTab === 'NEW_PROJECT' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#064e3b]/40 via-[#0d1f38]/50 to-[#2e1065]/40 border border-[#34d399]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#34d399] font-bold text-sm font-['Cinzel',serif]">
                  <Sparkles className="w-4 h-4 text-[#fef08a]" />
                  <span>HOW TO CREATE A DEDICATED DATABASE FOR LUNARA</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  Follow these 3 simple steps to create a clean, brand-new Supabase PostgreSQL database for LUNARA.
                  It is 100% free and takes under 60 seconds!
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>CREATE YOUR NEW SUPABASE PROJECT</span>
                  </span>
                  <a
                    href="https://database.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <span>Open database.new</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-300">
                  Open <code className="text-[#34d399] font-mono bg-black/40 px-1 py-0.5 rounded">database.new</code> in a new tab, choose a name like <strong>Lunara</strong>, set a secure database password, and create the project.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/25 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>RUN THE LUNARA SQL SCHEMA</span>
                  </span>
                  <button
                    onClick={copySql}
                    className="px-3 py-1.5 rounded-xl bg-[#2e1065] hover:bg-[#3b1580] text-[#fef08a] border border-[#a78bfa]/40 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY 1-CLICK SQL SCRIPT'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  In your new project dashboard, open the <strong>SQL Editor</strong> on the left sidebar, paste the copied script, and click <strong className="text-[#34d399]">RUN</strong>. This creates all tables, rituals, quests, and auth triggers automatically!
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#0d122d]/80 border border-[#a78bfa]/25 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>CONNECT TO LUNARA</span>
                </span>
                <p className="text-xs text-slate-300">
                  In your Supabase project, go to <strong>Project Settings &rarr; API</strong>.
                  Copy the <strong>Project URL</strong> and <strong>anon (public) Key</strong>, then click below to enter them into LUNARA:
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleClear();
                      setActiveTab('CONFIG');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(167,139,250,0.3)] font-['Cinzel',serif] tracking-wider"
                  >
                    <span>Enter New Credentials Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'CONFIG' ? (
            <>
              {/* Secret Key Alert Banner if detected */}
              {isSecretKeyPresent && (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/60 text-red-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
                    <span>FORBIDDEN: SECRET API KEY DETECTED</span>
                  </div>
                  <p className="text-xs text-red-300 leading-relaxed font-sans">
                    You entered Supabase's <code className="bg-black/60 px-1.5 py-0.5 rounded text-red-400 font-bold font-mono">service_role</code> secret key.
                    Supabase blocks secret keys in browsers. Please use the public <code className="text-emerald-300 font-bold font-mono">anon</code> key.
                  </p>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-[#121638]/90 border border-[#a78bfa]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#c4b5fd] font-bold font-['Cinzel',serif]">
                    <ShieldCheck className="w-4 h-4 text-[#fef08a]" />
                    <span>CURRENT CLOUD DATABASE STATUS</span>
                  </div>
                  {isSupabaseConfigured() && (
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Disconnect previous database to connect a new one"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect Previous Database</span>
                    </button>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {isSupabaseConfigured() ? (
                    <span className="text-[#34d399] font-medium">
                      ✦ CONNECTED: Supabase PostgreSQL cloud is active. To switch to a new database project, click "Disconnect Previous Database" above or enter your new credentials below.
                    </span>
                  ) : hasSecretKeyConfigured() ? (
                    <span className="text-red-400 font-bold">
                      SECRET KEY CONFLICT: Replace the service_role key with your public anon key below.
                    </span>
                  ) : (
                    <span className="text-[#fef08a]">
                      CREDENTIALS PENDING: Enter your new Supabase Project URL and Anon Public Key below, or click the "CREATE NEW DATABASE" tab above.
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1.5 uppercase font-bold tracking-wider font-['Cinzel',serif]">
                    SUPABASE PROJECT URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0f1430] border border-[#a78bfa]/30 text-white font-mono text-xs focus:border-[#c4b5fd] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-300 text-[11px] uppercase font-bold tracking-wider font-['Cinzel',serif]">
                      SUPABASE ANON (PUBLIC) KEY
                    </label>
                    <div className="flex items-center gap-2">
                      <a
                        href={supabaseApiKeysUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#c4b5fd] hover:text-white underline font-sans flex items-center gap-1"
                      >
                        <span>Find in Supabase Dashboard</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={anonKey}
                      onChange={(e) => setAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className={`w-full px-4 py-2.5 pr-20 rounded-xl bg-[#0f1430] border font-mono text-xs focus:outline-none transition-colors ${
                        isSecretKeyPresent
                          ? 'border-red-500 text-red-300 focus:border-red-400 bg-red-950/20'
                          : detectedKeyRole === 'anon'
                          ? 'border-[#34d399]/80 text-emerald-200 focus:border-[#34d399]'
                          : 'border-[#a78bfa]/30 text-white focus:border-[#c4b5fd]'
                      }`}
                    />
                    {anonKey && (
                      <button
                        type="button"
                        onClick={() => setAnonKey('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] bg-[#1e1b4b] hover:bg-[#2e1065] text-[#c4b5fd] border border-[#a78bfa]/30 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Real-time key role indicator */}
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    {detectedKeyRole === 'service_role' && (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Forbidden: This is the "service_role" secret key. Please replace with the "anon" public key.</span>
                      </span>
                    )}
                    {detectedKeyRole === 'anon' && (
                      <span className="text-[#34d399] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                        <span>Valid format: Public "anon" key recognized.</span>
                      </span>
                    )}
                    {(detectedKeyRole === 'unknown' || detectedKeyRole === 'empty') && (
                      <span className="text-slate-400 text-[10px]">
                        Copy the <strong className="text-[#fef08a]">anon public</strong> key from Supabase &rarr; Project Settings &rarr; API.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {testResult.status === 'success' && (
                <div className="flex items-center gap-2 text-[#34d399] bg-[#064e3b]/30 border border-[#34d399]/40 p-3.5 rounded-2xl">
                  <Check className="w-4 h-4 shrink-0 text-[#34d399]" />
                  <span>Connection Verified! Supabase PostgreSQL database is reachable.</span>
                </div>
              )}

              {testResult.status === 'failed' && (
                testResult.isMissingTables ||
                testResult.error?.includes('profiles') ||
                testResult.error?.includes('schema cache') ||
                testResult.error?.includes('relation') ? (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/60 text-amber-200 space-y-3 font-sans">
                    <div className="flex items-center gap-2 text-[#fef08a] font-bold text-xs sm:text-sm font-['Cinzel',serif]">
                      <Sparkles className="w-4 h-4 shrink-0 text-[#fef08a] animate-pulse" />
                      <span>API CREDENTIALS CONNECTED! POSTGREST SCHEMA CACHE REFRESH NEEDED</span>
                    </div>

                    <p className="text-[11px] text-amber-300/90 leading-relaxed">
                      Your Supabase credentials are valid! If you already executed the script and saw <code className="bg-black/60 px-1 py-0.5 rounded text-emerald-300 font-bold font-mono">Success. No rows returned</code>, PostgreSQL created the tables, but Supabase&apos;s REST API needs to reload its schema cache.
                    </p>

                    {/* Quick Fix Box */}
                    <div className="p-3 bg-[#064e3b]/30 rounded-xl border border-[#34d399]/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-[#34d399] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[#34d399]" />
                          <span>Quick Fix: Reload Cache & Grants</span>
                        </span>
                        <button
                          onClick={copyQuickFix}
                          className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-pointer shrink-0"
                        >
                          {copiedQuickFix ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedQuickFix ? 'QUICK FIX COPIED!' : 'COPY 3-LINE QUICK FIX'}</span>
                        </button>
                      </div>
                      <pre className="p-2 bg-black/60 rounded-lg text-[10px] text-emerald-300 font-mono overflow-x-auto border border-emerald-500/20">
{`GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';`}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActiveTab('SQL')}
                        className="text-[11px] text-[#c4b5fd] hover:text-white underline transition-colors cursor-pointer"
                      >
                        Inspect raw SQL code &rarr;
                      </button>
                      <button
                        onClick={handleTestConnection}
                        disabled={testResult.status === 'testing'}
                        className="px-4 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testResult.status === 'testing' ? 'animate-spin' : ''}`} />
                        <span>RE-TEST TABLES NOW</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 text-rose-400 bg-rose-950/25 border border-rose-500/40 p-3.5 rounded-2xl">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold">Connection Check Failed</div>
                      <div className="text-[11px] text-rose-300 leading-relaxed font-sans">
                        {testResult.error || 'Please verify that your Project URL and Anon Key are correct.'}
                      </div>
                    </div>
                  </div>
                )
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={testResult.status === 'testing' || !url}
                    className="px-3.5 py-2 rounded-xl bg-[#121638] hover:bg-[#1a204d] text-slate-200 border border-[#a78bfa]/30 flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testResult.status === 'testing' ? 'animate-spin' : ''}`} />
                    <span>TEST LINK</span>
                  </button>
                  {(url || anonKey) && (
                    <button
                      onClick={handleClear}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors cursor-pointer text-xs"
                    >
                      RESET
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  disabled={!url || !anonKey || isSecretKeyPresent}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-semibold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] disabled:opacity-50 cursor-pointer font-['Cinzel',serif] text-xs"
                >
                  SAVE & SYNC
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-white text-xs font-bold font-['Cinzel',serif]">
                    LUNARA DATABASE SCHEMA & AUTOMATION TRIGGER
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Provisions all 13 celestial tables, rituals, quests, and user profile initialization triggers.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={supabaseSqlEditorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#121638] hover:bg-[#1b214d] text-[#c4b5fd] border border-[#a78bfa]/30 flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <span>Open SQL Editor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={copySql}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white flex items-center gap-1.5 transition-colors shrink-0 font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED' : 'COPY SQL SCRIPT'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-2xl border border-[#a78bfa]/20 max-h-72 overflow-y-auto">
                <pre className="text-[10px] leading-relaxed text-slate-300 font-mono">
                  {sqlSchemaText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
