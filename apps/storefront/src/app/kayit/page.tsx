'use client';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      router.push('/hesabim');
    } catch {
      setError('Kayıt sırasında bir hata oluştu.');
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
        Kayıt Ol
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Ad Soyad
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            minLength={6}
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
          {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <p
        className="mt-6 text-center text-sm"
        style={{ color: 'var(--color-text)', opacity: 0.7 }}
      >
        Zaten hesabın var mı?{' '}
        <Link href="/giris" style={{ color: 'var(--color-primary)' }}>
          Giriş Yap
        </Link>
      </p>
    </main>
  );
}
