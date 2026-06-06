'use client';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  sku: string;
}

interface Order {
  id: string;
  status: string;
  totalPrice: string;
  createdAt: string;
  customerName: string;
  shippingCity: string;
  items: OrderItem[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: '#F59E0B' },
  CONFIRMED: { label: 'Onaylandı', color: '#3B82F6' },
  PROCESSING: { label: 'Hazırlanıyor', color: '#8B5CF6' },
  SHIPPED: { label: 'Kargoda', color: '#06B6D4' },
  DELIVERED: { label: 'Teslim Edildi', color: '#10B981' },
  CANCELLED: { label: 'İptal', color: '#EF4444' },
  REFUNDED: { label: 'İade', color: '#6B7280' },
};

export default function OrdersPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    if (!isLoading && !user) void router.push('/giris');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) void loadOrders();
  }, [token]);

  const loadOrders = async () => {
    const res = await fetch(`${API_URL}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': API_KEY ?? '',
      },
    });
    if (res.ok) setOrders((await res.json()) as Order[]);
    setFetching(false);
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
              className="block py-2 text-sm font-medium transition hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
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
          </nav>
        </div>

        {/* Sağ İçerik */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
            Siparişlerim
          </h2>

          {fetching ? (
            <p
              className="text-sm opacity-60"
              style={{ color: 'var(--color-text)' }}
            >
              Yükleniyor...
            </p>
          ) : orders.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <p
                className="opacity-60 mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                Henüz sipariş yok.
              </p>
              <Link
                href="/"
                className="text-sm font-medium transition hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p
                      className="text-xs opacity-50 mb-1"
                      style={{ color: 'var(--color-text)' }}
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p
                      className="text-sm opacity-70"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: statusLabels[order.status]?.color + '20',
                      color: statusLabels[order.status]?.color,
                    }}
                  >
                    {statusLabels[order.status]?.label ?? order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <p
                      key={item.id}
                      className="text-sm opacity-70"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div
                  className="flex justify-between items-center border-t pt-3"
                  style={{ borderColor: 'var(--color-accent)' }}
                >
                  <p
                    className="text-sm opacity-60"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {order.shippingCity}
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {parseFloat(order.totalPrice).toFixed(2)} ₺
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
