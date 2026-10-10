import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Database,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useApp } from '../../context/AppContext';

interface AuthTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConfig?: () => void;
  onContinueDemo?: () => void;
}

type AuthMode = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';

export const AuthTerminal: React.FC<AuthTerminalProps> = ({
  isOpen,
  onClose,
  onOpenConfig,
}) => {
  const { setUserAndSync, updateProfile } = useApp();
  const [mode, setMode] = useState<AuthMode>('SIGN_IN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'SIGN_IN') {
        const result = await authService.signIn(cleanEmail, password);
        if (!result.success || !result.user) {
          setErrorMsg(result.error || 'Invalid email or password. Please try again.');
          return;
        }

        if (setUserAndSync) {
          await setUserAndSync(result.user);
        }

        const displayName = result.user.user_metadata?.username || 'Stargazer';
        setSuccessMsg(`Welcome back, ${displayName}! Syncing your journey...`);
        setTimeout(() => {
          onClose();
        }, 600);
      } else if (mode === 'SIGN_UP') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          return;
        }

        const displayName = username.trim() || 'Stargazer';
        const result = await authService.signUp(cleanEmail, password, displayName);

        if (!result.success || !result.user) {
          setErrorMsg(result.error || 'Could not create account. Please try again.');
          return;
        }

        if (setUserAndSync) {
          await setUserAndSync(result.user);
        }
        if (updateProfile && displayName) {
          await updateProfile({ username: displayName });
        }

        setSuccessMsg(`Account created! Welcome to Lunara, ${displayName}.`);
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch (err: any) {
      console.warn('Authentication error:', err);
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090d24] border border-[#a78bfa]/35 shadow-[0_0_50px_rgba(167,139,250,0.25)] overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#a78bfa]/20 bg-gradient-to-r from-[#181136] via-[#090d22] to-[#1a1236] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2e1065] border border-[#a78bfa]/40 flex items-center justify-center text-[#fef08a] shadow-[0_0_15px_rgba(167,139,250,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['Cinzel',serif] flex items-center gap-2">
                <span>LUNARA ACCOUNT</span>
              </h2>
              <p className="text-xs text-[#c4b5fd]">
                {mode === 'SIGN_IN' ? 'Sign in to access your saved journey' : 'Create an account to save your habits'}
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

        {/* Mode Switcher */}
        <div className="flex border-b border-[#a78bfa]/20 bg-[#060918]">
          <button
            type="button"
            onClick={() => {
              setMode('SIGN_IN');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider font-['Cinzel',serif] border-b-2 transition-all cursor-pointer ${
              mode === 'SIGN_IN'
                ? 'border-[#c4b5fd] text-white bg-[#1e1b4b]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGN_UP');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider font-['Cinzel',serif] border-b-2 transition-all cursor-pointer ${
              mode === 'SIGN_UP'
                ? 'border-[#c4b5fd] text-white bg-[#1e1b4b]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs leading-relaxed flex-1">
                <span>{errorMsg}</span>
                {mode === 'SIGN_IN' && errorMsg.includes('CREATE ACCOUNT') && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('SIGN_UP');
                      setErrorMsg(null);
                    }}
                    className="mt-1.5 block text-[#fef08a] hover:underline font-medium"
                  >
                    Switch to Create Account &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div className="text-xs leading-relaxed">{successMsg}</div>
            </div>
          )}

          {mode === 'SIGN_UP' && (
            <div>
              <label className="block text-slate-300 text-[11px] uppercase font-bold tracking-wider mb-1.5 font-['Cinzel',serif]">
                YOUR NAME (OPTIONAL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Luna, Orion, Alex"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0e1330] border border-[#a78bfa]/30 text-white placeholder:text-slate-500 focus:border-[#c4b5fd] focus:outline-none text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-[11px] uppercase font-bold tracking-wider mb-1.5 font-['Cinzel',serif]">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0e1330] border border-[#a78bfa]/30 text-white placeholder:text-slate-500 focus:border-[#c4b5fd] focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 text-[11px] uppercase font-bold tracking-wider font-['Cinzel',serif]">
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0e1330] border border-[#a78bfa]/30 text-white placeholder:text-slate-500 focus:border-[#c4b5fd] focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white font-bold tracking-wider uppercase font-['Cinzel',serif] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all disabled:opacity-50 cursor-pointer text-xs"
          >
            {loading ? (
              <span>{mode === 'SIGN_IN' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}</span>
            ) : mode === 'SIGN_IN' ? (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle Helper */}
          <div className="pt-2 text-center text-slate-400 text-xs">
            {mode === 'SIGN_IN' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('SIGN_UP');
                    setErrorMsg(null);
                  }}
                  className="text-[#fef08a] hover:underline font-medium"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('SIGN_IN');
                    setErrorMsg(null);
                  }}
                  className="text-[#fef08a] hover:underline font-medium"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          {/* Optional subtle advanced configuration */}
          {onOpenConfig && (
            <div className="pt-3 border-t border-[#a78bfa]/15 flex items-center justify-center">
              <button
                type="button"
                onClick={onOpenConfig}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Database className="w-3 h-3" />
                <span>Advanced Database Settings</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
