import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from './supabaseService';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    [key: string]: any;
  };
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  message?: string;
}

const LOCAL_ACCOUNTS_KEY = 'lunara_local_accounts_v1';
const ACTIVE_SESSION_KEY = 'lunara_active_session_v1';

// Helper to hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(password + '_lunara_salt');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  // Basic fallback if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${hash}`;
}

interface StoredAccount {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  createdAt: number;
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

export const authService = {
  /**
   * Get the currently logged-in user from active session
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    // 1. Check Supabase session first if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          };
        }
      } catch (err) {
        console.warn('Supabase getSession notice:', err);
      }
    }

    // 2. Check local active session
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}

    return null;
  },

  /**
   * Sign In with Email & Password
   */
  async signIn(emailInput: string, passwordInput: string): Promise<AuthResult> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;

    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    // Attempt Supabase sign in if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && (data.session?.user || data.user)) {
          const u = data.session?.user || data.user;
          const authUser: AuthUser = {
            id: u.id,
            email: u.email || email,
            user_metadata: u.user_metadata,
          };
          localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
          return { success: true, user: authUser };
        }

        // If Supabase gave invalid credentials, check if they exist in local storage or return friendly message
        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials')) {
            // Check local fallback accounts
            const localAccounts = getStoredAccounts();
            const hashed = await hashPassword(password);
            const found = localAccounts.find((a) => a.email.toLowerCase() === email);
            if (found && found.passwordHash === hashed) {
              const authUser: AuthUser = {
                id: found.id,
                email: found.email,
                user_metadata: { username: found.username },
              };
              localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
              return { success: true, user: authUser };
            }
            return {
              success: false,
              error: 'Incorrect email or password. If you haven’t created an account yet, click "CREATE ACCOUNT" above.',
            };
          } else if (msg.includes('email not confirmed')) {
            return {
              success: false,
              error: 'Please verify your email address to log in, or switch to Create Account.',
            };
          } else {
            // Other network or server issue, try local account
            const localAccounts = getStoredAccounts();
            const hashed = await hashPassword(password);
            const found = localAccounts.find((a) => a.email.toLowerCase() === email);
            if (found && found.passwordHash === hashed) {
              const authUser: AuthUser = {
                id: found.id,
                email: found.email,
                user_metadata: { username: found.username },
              };
              localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
              return { success: true, user: authUser };
            }
            return { success: false, error: error.message };
          }
        }
      } catch (err: any) {
        console.warn('Supabase signIn catch:', err);
      }
    }

    // Fallback: Local Account authentication (no Supabase needed or Supabase offline)
    const localAccounts = getStoredAccounts();
    const hashed = await hashPassword(password);
    const existing = localAccounts.find((a) => a.email.toLowerCase() === email);

    if (!existing) {
      return {
        success: false,
        error: 'No account found with this email. Click "CREATE ACCOUNT" to register your account.',
      };
    }

    if (existing.passwordHash !== hashed) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    const authUser: AuthUser = {
      id: existing.id,
      email: existing.email,
      user_metadata: { username: existing.username },
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
    return { success: true, user: authUser };
  },

  /**
   * Create Account with Email & Password
   */
  async signUp(emailInput: string, passwordInput: string, usernameInput?: string): Promise<AuthResult> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;
    const username = (usernameInput && usernameInput.trim()) || 'STARGAZER';

    if (!email || !password) {
      return { success: false, error: 'Please enter both an email and password.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Save to local accounts registry first so credentials always work seamlessly
    const localAccounts = getStoredAccounts();
    const existingIndex = localAccounts.findIndex((a) => a.email.toLowerCase() === email);
    const hashed = await hashPassword(password);

    let localId = existingIndex >= 0 ? localAccounts[existingIndex].id : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (existingIndex >= 0) {
      // Update existing local password
      localAccounts[existingIndex].passwordHash = hashed;
      localAccounts[existingIndex].username = username;
    } else {
      localAccounts.push({
        id: localId,
        email,
        passwordHash: hashed,
        username,
        createdAt: Date.now(),
      });
    }
    saveStoredAccounts(localAccounts);

    const localUser: AuthUser = {
      id: localId,
      email,
      user_metadata: { username },
    };

    // If Supabase is configured, also register on Supabase cloud
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('user already registered')) {
            // Already on Supabase, sign them in with this password
            return this.signIn(email, password);
          }
          console.warn('Supabase signUp notice:', error.message);
        } else if (data.user) {
          try {
            await supabaseService.initializeNewUser(data.user.id, username);
          } catch {}

          const activeUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            user_metadata: { username },
          };
          localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeUser));
          return {
            success: true,
            user: activeUser,
            message: !data.session ? 'Account registered! (Verification email sent)' : undefined,
          };
        }
      } catch (err) {
        console.warn('Supabase signUp error, continuing with local session:', err);
      }
    }

    // Active session stored locally
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(localUser));
    return { success: true, user: localUser };
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
  },
};
