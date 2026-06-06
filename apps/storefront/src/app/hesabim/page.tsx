'use client';
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      void router.push('/giris');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <p style={{ color: 'var(--color-text)' }}>Yükleniyor...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--color-text)' }}
      >
        Hesabım
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Menü */}
        <div
          className="rounded-xl p-6 h-fit"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <p
            className="font-medium mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            {user.name ?? user.email}
          </p>
          <p
            className="text-sm mb-6 opacity-60"
            style={{ color: 'var(--color-text)' }}
          >
            {user.email}
          </p>
          <nav className="space-y-2">
            <Link
              href="/hesabim"
              className="block py-2 text-sm font-medium transition hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Genel Bilgiler
            </Link>
            <Link
              href="/hesabim/siparisler"
              className="block py-2 text-sm transition hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              Siparişlerim
            </Link>
            <Link
              href="/hesabim/adresler"
              className="block py-2 text-sm transition hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              Adreslerim
            </Link>
            <button
              onClick={logout}
              className="block py-2 text-sm transition hover:opacity-70 text-red-500"
            >
              Çıkış Yap
            </button>
          </nav>
        </div>

        {/* Sağ İçerik */}
        <div className="md:col-span-2">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <h2
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Genel Bilgiler
            </h2>
            <div className="space-y-3">
              <div>
                <p
                  className="text-sm opacity-60"
                  style={{ color: 'var(--color-text)' }}
                >
                  Ad Soyad
                </p>
                <p
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user.name ?? '-'}
                </p>
              </div>
              <div>
                <p
                  className="text-sm opacity-60"
                  style={{ color: 'var(--color-text)' }}
                >
                  E-posta
                </p>
                <p
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
