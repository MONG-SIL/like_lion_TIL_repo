import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const MIN_PASSWORD_LENGTH = 8;

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  signUp: (credentials: AuthCredentials) => Promise<AuthResult>;
  signIn: (credentials: AuthCredentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateAuthCredentials(
  credentials: AuthCredentials,
  mode: 'login' | 'signup'
): AuthResult {
  const email = normalizeEmail(credentials.email);
  const password = credentials.password;

  if (!email) {
    return { ok: false, error: '이메일을 입력해 주세요.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: '올바른 이메일 형식을 입력해 주세요.' };
  }

  if (!password) {
    return { ok: false, error: '비밀번호를 입력해 주세요.' };
  }

  if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`,
    };
  }

  return { ok: true };
}

function mapAuthError(message: string, mode: 'login' | 'signup'): string {
  const lower = message.toLowerCase();

  if (mode === 'signup' && (lower.includes('already registered') || lower.includes('already exists'))) {
    return '이미 가입된 이메일입니다.';
  }

  if (mode === 'login' && (lower.includes('invalid login credentials') || lower.includes('invalid credentials'))) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }

  if (lower.includes('email rate limit exceeded')) {
    return '이메일 발송 한도를 초과했습니다. Supabase 대시보드에서 Confirm email 옵션을 끄거나 잠시 후 다시 시도해 주세요.';
  }

  return message;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function initSession(): Promise<void> {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      setUser(error ? null : (data.session?.user ?? null));
      setLoading(false);
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp({ email, password }: AuthCredentials): Promise<AuthResult> {
    const validation = validateAuthCredentials({ email, password }, 'signup');
    if (!validation.ok) {
      return validation;
    }

    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      return { ok: false, error: mapAuthError(error.message, 'signup') };
    }

    return { ok: true };
  }

  async function signIn({ email, password }: AuthCredentials): Promise<AuthResult> {
    const validation = validateAuthCredentials({ email, password }, 'login');
    if (!validation.ok) {
      return validation;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      return { ok: false, error: mapAuthError(error.message, 'login') };
    }

    return { ok: true };
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    userEmail: user?.email ?? '',
    signUp,
    signIn,
    signOut,
  };
}
