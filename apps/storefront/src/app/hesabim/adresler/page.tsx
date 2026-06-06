'use client';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  zip?: string;
  isDefault: boolean;
}

const emptyForm = {
  title: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  zip: '',
  isDefault: false,
};

export default function AddressesPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-api-key': API_KEY ?? '',
  };

  useEffect(() => {
    if (!isLoading && !user) void router.push('/giris');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) void loadAddresses();
  }, [token]);

  const loadAddresses = async () => {
    const res = await fetch(`${API_URL}/addresses`, { headers });
    if (res.ok) setAddresses((await res.json()) as Address[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await fetch(`${API_URL}/addresses/${editingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_URL}/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
    }
    await loadAddresses();
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district ?? '',
      zip: address.zip ?? '',
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/addresses/${id}`, { method: 'DELETE', headers });
    await loadAddresses();
  };

  if (isLoading || !user) return null;

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
              className="block py-2 text-sm transition hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
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
              className="block py-2 text-sm font-medium transition hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Adreslerim
            </Link>
          </nav>
        </div>

        {/* Sağ İçerik */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2
              className="font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Adreslerim
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-background)',
              }}
            >
              + Yeni Adres
            </button>
          </div>

          {/* Adres Listesi */}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className="font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {addr.title}
                    {addr.isDefault && (
                      <span
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-background)',
                        }}
                      >
                        Varsayılan
                      </span>
                    )}
                  </p>
                  <p
                    className="text-sm mt-1 opacity-70"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p
                    className="text-sm opacity-70"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {addr.address}
                  </p>
                  <p
                    className="text-sm opacity-70"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {addr.district} {addr.city} {addr.zip}
                  </p>
                  <p
                    className="text-sm opacity-70"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {addr.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-sm transition hover:opacity-70"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-500 hover:opacity-70 transition"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showForm && (
            <p
              className="opacity-60 text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              Henüz adres eklenmemiş.
            </p>
          )}

          {/* Adres Formu */}
          {showForm && (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                {editingId ? 'Adresi Düzenle' : 'Yeni Adres'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  pInputText
                  placeholder="Adres başlığı (Ev, İş...)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Ad"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <input
                    placeholder="Soyad"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <input
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                />
                <textarea
                  placeholder="Adres"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    placeholder="İlçe"
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <input
                    placeholder="Şehir"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <input
                    placeholder="Posta Kodu"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <label
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) =>
                      setForm({ ...form, isDefault: e.target.checked })
                    }
                  />
                  Varsayılan adres olarak ayarla
                </label>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-background)',
                    }}
                  >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-70"
                    style={{
                      backgroundColor: 'var(--color-secondary)',
                      color: 'var(--color-text)',
                    }}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
