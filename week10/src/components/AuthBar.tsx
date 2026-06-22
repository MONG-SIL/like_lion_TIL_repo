interface AuthBarProps {
  userEmail: string;
  onSignOut: () => Promise<void>;
}

export default function AuthBar({ userEmail, onSignOut }: AuthBarProps) {
  return (
    <div className="auth-bar auth-bar--inline" aria-label="사용자 인증 상태">
      <p className="auth-bar__email" aria-live="polite">
        {userEmail}
      </p>
      <button type="button" className="btn" onClick={() => void onSignOut()}>
        로그아웃
      </button>
    </div>
  );
}
