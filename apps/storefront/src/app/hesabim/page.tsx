'use client';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AccountPage() {
  const { user, logout, isLoading, token } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
    }
  }, [user?.name]); // sadece user.name değişince çalışsın

  useEffect(() => {
    if (!isLoading && !user) {
      void router.push('/giris');
    }
    if (user) {
      setName(user.name ?? '');
    }
  }, [user, isLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-api-key': API_KEY ?? '',
      },
      body: JSON.stringify({ name, phone }),
    });
    // name'i local state'de de güncelle
    setName(name);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

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
              className="block py-2 text-sm text-red-500 transition hover:opacity-70"
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
              className="font-semibold mb-6"
              style={{ color: 'var(--color-text)' }}
            >
              Genel Bilgiler
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
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
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    borderColor: 'var(--color-primary)',
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
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border outline-none opacity-50"
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
                  Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: saved ? '#16a34a' : 'var(--color-primary)',
                  color: 'var(--color-background)',
                }}
              >
                {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
