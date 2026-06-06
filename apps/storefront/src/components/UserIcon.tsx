'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UserIcon() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/hesabim"
          className="text-sm font-medium transition hover:opacity-70"
          style={{ color: 'var(--color-text)' }}
        >
          {user.name ?? user.email}
        </Link>
        <button
          onClick={logout}
          className="text-sm transition hover:opacity-70"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/giris"
      className="text-sm font-medium transition hover:opacity-70"
      style={{ color: 'var(--color-text)' }}
    >
      Giriş Yap
    </Link>
  );
}
