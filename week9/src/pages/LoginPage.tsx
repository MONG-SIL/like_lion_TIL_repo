import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import type { UseAuthReturn } from '../hooks/useAuth';

interface LoginPageProps {
  auth: UseAuthReturn;
}

export default function LoginPage({ auth }: LoginPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (auth.loading) {
    return (
      <p className="loading-state" aria-live="polite">
        인증 상태를 확인하는 중...
      </p>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(credentials: { email: string; password: string }) {
    const result = mode === 'signup' ? await auth.signUp(credentials) : await auth.signIn(credentials);

    if (result.ok) {
      navigate('/', { replace: true });
    }

    return result;
  }

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <h1 className="auth-page__logo">Lion Track</h1>
        <p className="auth-page__lead">아기사자 명단을 관리하려면 로그인하세요</p>
      </div>

      <main className="auth-page__main">
        <AuthForm mode={mode} onSubmit={handleSubmit} onModeChange={setMode} />
      </main>
    </div>
  );
}
