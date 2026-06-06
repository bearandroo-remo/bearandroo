'use client';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/hesabim');
    } catch {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--color-text)' }}
      >
        Giriş Yap
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border outline-none transition"
            style={{
              borderColor: 'var(--color-secondary)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border outline-none transition"
            style={{
              borderColor: 'var(--color-secondary)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <p
        className="mt-6 text-center text-sm"
        style={{ color: 'var(--color-text)', opacity: 0.7 }}
      >
        Hesabın yok mu?{' '}
        <Link href="/kayit" style={{ color: 'var(--color-primary)' }}>
          Kayıt Ol
        </Link>
      </p>
    </main>
  );
}
