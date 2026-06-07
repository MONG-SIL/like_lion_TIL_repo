import { useState, type FormEvent } from 'react';
import type { AuthCredentials, AuthResult } from '../hooks/useAuth';
import { validateAuthCredentials } from '../hooks/useAuth';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (credentials: AuthCredentials) => Promise<AuthResult>;
  onModeChange: (mode: AuthMode) => void;
}

export default function AuthForm({ mode, onSubmit, onModeChange }: AuthFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isSignup = mode === 'signup';
  const title = isSignup ? '회원가입' : '로그인';
  const submitLabel = isSignup ? '회원가입' : '로그인';

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');

    const credentials: AuthCredentials = { email, password };
    const validation = validateAuthCredentials(credentials, mode);
    if (!validation.ok) {
      setError(validation.error ?? '입력값을 확인해 주세요.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(credentials);
      if (!result.ok) {
        setError(result.error ?? '요청에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSwitchMode(nextMode: AuthMode): void {
    setError('');
    setConfirmPassword('');
    onModeChange(nextMode);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} aria-labelledby="auth-form-title">
      <h2 id="auth-form-title" className="auth-form__title">
        {title}
      </h2>

      <label className="field">
        <span className="field__label">이메일</span>
        <input
          className="field__input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span className="field__label">비밀번호</span>
        <input
          className="field__input"
          type="password"
          name="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          placeholder="8자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={isSignup ? 8 : undefined}
        />
      </label>

      {isSignup ? (
        <label className="field">
          <span className="field__label">비밀번호 확인</span>
          <input
            className="field__input"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="비밀번호 재입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
      ) : null}

      {error ? (
        <p className="auth-form__error" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : submitLabel}
      </button>

      <p className="auth-form__switch">
        {isSignup ? (
          <>
            이미 계정이 있으신가요?{' '}
            <button type="button" className="auth-form__link" onClick={() => handleSwitchMode('login')}>
              로그인
            </button>
          </>
        ) : (
          <>
            계정이 없으신가요?{' '}
            <button type="button" className="auth-form__link" onClick={() => handleSwitchMode('signup')}>
              회원가입
            </button>
          </>
        )}
      </p>
    </form>
  );
}
