import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Database } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { CelestialBackground } from './components/ui/CelestialBackground';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';

// Views
import { TodayView } from './components/views/TodayView';
import { MissionsView } from './components/views/MissionsView';
import { HabitsView } from './components/views/HabitsView';
import { TrackingView } from './components/views/TrackingView';
import { RewardsView } from './components/views/RewardsView';
import { AscendView } from './components/views/AscendView';
import { ProfileView } from './components/views/ProfileView';
import { LuniAssistantView } from './components/views/LuniAssistantView';
import { LuniFloatingWidget } from './components/ui/LuniFloatingWidget';

// Modals
import { CelebrationModals } from './components/modals/CelebrationModals';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuthTerminal } from './components/auth/AuthTerminal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';
import { AccountModal } from './components/modals/AccountModal';
import { MigrationPromptModal } from './components/modals/MigrationPromptModal';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    profile,
    user,
    syncStatus,
    authModalOpen,
    setAuthModalOpen,
    supabaseConfigModalOpen,
    setSupabaseConfigModalOpen,
    accountModalOpen,
    setAccountModalOpen,
    migrationModalOpen,
    setMigrationModalOpen,
    importLocalDataToCloud,
    dismissMigration,
    signOut,
    updateProfile,
    refreshCloudData,
    reloadAuthAndConfig,
    hasSecretKeyError,
    isMissingTablesError,
    checkMissingTables,
  } = useApp();

  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [isMigrating, setIsMigrating] = React.useState(false);

  React.useEffect(() => {
    // Only prompt for stargazer name once on very first launch if not configured
    const hasSeenOnboarding =
      localStorage.getItem('lunara_onboarding_completed') ||
      localStorage.getItem('web_ascend_onboarding_completed');
    if (!hasSeenOnboarding && (profile.username === 'OPERATIVE' || profile.username === 'STARGAZER') && profile.totalXP === 0 && !user) {
      setIsOnboardingOpen(true);
    }
  }, [profile.username, profile.totalXP, user]);

  const handleImport = async () => {
    setIsMigrating(true);
    try {
      await importLocalDataToCloud();
    } finally {
      setIsMigrating(false);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'TODAY':
        return <TodayView />;
      case 'MISSIONS':
        return <MissionsView />;
      case 'HABITS':
        return <HabitsView />;
      case 'TRACKING':
        return <TrackingView />;
      case 'REWARDS':
        return <RewardsView />;
      case 'ASCEND':
        return <AscendView />;
      case 'PROFILE':
        return <ProfileView />;
      case 'ASSISTANT':
        return <LuniAssistantView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="relative h-screen h-[100dvh] bg-[#050814] text-slate-200 flex flex-col selection:bg-[#a78bfa]/40 selection:text-white font-sans antialiased overflow-hidden">
      {/* Celestial Ambient Cosmos Background */}
      <CelestialBackground />

      {/* Main Container Layout */}
      <div className="relative z-10 flex h-full w-full overflow-hidden">
        {/* Desktop Sidebar (Left - Fixed) */}
        <Sidebar />

        {/* Content Area (Right - Only Section Scrollable) */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64 h-full overflow-y-auto overflow-x-hidden">
          {/* Top Celestial Header */}
          <Header />

          {/* View Container with Transitions */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Celestial Sanctuary Footer */}
          <footer className="h-12 border-t border-[#a78bfa]/15 px-4 sm:px-8 flex items-center justify-between text-[10px] text-slate-400 font-sans uppercase tracking-widest bg-[#060918]/90 shrink-0 mt-auto">
            <span className="font-['Cinzel',serif] tracking-wider text-slate-300">LUNARA · Grow Into Your Next Chapter</span>
            <span className="text-[#c4b5fd]/80">Persistent Celestial Sync · All Rights Reserved</span>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Persistent Luni AI Floating Companion */}
      <LuniFloatingWidget />

      {/* Global Modals & Celebrations */}
      <CelebrationModals />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          localStorage.setItem('lunara_onboarding_completed', 'true');
          setIsOnboardingOpen(false);
        }}
      />

      {/* Supabase Authentication Terminal */}
      <AuthTerminal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenConfig={() => {
          setAuthModalOpen(false);
          setSupabaseConfigModalOpen(true);
        }}
        onContinueDemo={() => setAuthModalOpen(false)}
      />

      {/* Supabase Configuration & SQL Schema Modal */}
      <SupabaseConfigModal
        isOpen={supabaseConfigModalOpen}
        onClose={() => setSupabaseConfigModalOpen(false)}
        onConfigChanged={() => {
          reloadAuthAndConfig();
        }}
      />

      {/* Operative Account Settings Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={user}
        profile={profile}
        syncStatus={syncStatus}
        onSignOut={signOut}
        onOpenConfig={() => {
          setAccountModalOpen(false);
          setSupabaseConfigModalOpen(true);
        }}
        onUpdateUsername={async (newName) => {
          await updateProfile({ username: newName });
        }}
      />

      {/* Local Storage Migration Prompt Modal */}
      <MigrationPromptModal
        isOpen={migrationModalOpen}
        onImport={handleImport}
        onStartFresh={dismissMigration}
        importing={isMigrating}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
