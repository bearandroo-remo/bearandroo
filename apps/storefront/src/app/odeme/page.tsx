'use client';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [step, setStep] = useState<'address' | 'summary' | 'payment'>(
    'address',
  );
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-api-key': API_KEY ?? '',
  };

  useEffect(() => {
    if (!user) {
      void router.push('/giris?redirect=/odeme');
      return;
    }
    if (items.length === 0 && !orderPlaced) {
      void router.push('/sepet');
      return;
    }
    void loadAddresses();
  }, [user, items, orderPlaced]);

  const loadAddresses = async () => {
    const res = await fetch(`${API_URL}/addresses`, { headers });
    if (res.ok) {
      const data = (await res.json()) as Address[];
      setAddresses(data);
      const def = data.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def.id);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setLoading(true);

    const orderData = {
      customerName: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
      customerEmail: user!.email,
      customerPhone: selectedAddress.phone,
      shippingAddress: selectedAddress.address,
      shippingCity: selectedAddress.city,
      shippingDistrict: selectedAddress.district,
      shippingZip: selectedAddress.zip,
      items: items.map((item) => ({
        variantId: item.variantId,
        productId: item.productId,
        name: item.productName,
        sku: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      setOrderPlaced(true); // önce state'i set et
      clearCart(); // sonra sepeti temizle
    }
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-6">✓</div>
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Siparişiniz Alındı!
        </h1>
        <p className="mb-8 opacity-70" style={{ color: 'var(--color-text)' }}>
          Siparişiniz başarıyla oluşturuldu. E-posta adresinize bilgilendirme
          yapılacaktır.
        </p>
        <button
          onClick={() => router.push('/hesabim/siparisler')}
          className="px-8 py-3 rounded-xl font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          Siparişlerimi Gör
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--color-text)' }}
      >
        Sipariş Ver
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol - Adres ve Ödeme */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adım 1 - Adres Seçimi */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <h2
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Teslimat Adresi
            </h2>

            {addresses.length === 0 ? (
              <div>
                <p
                  className="text-sm mb-4 opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  Kayıtlı adresiniz yok.
                </p>
                <button
                  onClick={() => router.push('/hesabim/adresler')}
                  className="text-sm font-medium transition hover:opacity-70"
                  style={{ color: 'var(--color-primary)' }}
                >
                  + Adres Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex gap-3 p-4 rounded-xl cursor-pointer transition"
                    style={{
                      backgroundColor:
                        selectedAddressId === addr.id
                          ? 'var(--color-background)'
                          : 'transparent',
                      border: `2px solid ${selectedAddressId === addr.id ? 'var(--color-primary)' : 'transparent'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {addr.title}
                      </p>
                      <p
                        className="text-sm opacity-70"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {addr.firstName} {addr.lastName} — {addr.phone}
                      </p>
                      <p
                        className="text-sm opacity-70"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {addr.address}, {addr.district} {addr.city} {addr.zip}
                      </p>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => router.push('/hesabim/adresler')}
                  className="text-sm font-medium transition hover:opacity-70"
                  style={{ color: 'var(--color-primary)' }}
                >
                  + Yeni Adres Ekle
                </button>
              </div>
            )}
          </div>

          {/* Adım 2 - Ödeme (şimdilik mock) */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <h2
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Ödeme
            </h2>
            <p
              className="text-sm opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              Ödeme sistemi yakında entegre edilecektir.
            </p>
          </div>
        </div>

        {/* Sağ - Sipariş Özeti */}
        <div
          className="rounded-xl p-6 h-fit"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <h2
            className="font-semibold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Sipariş Özeti
          </h2>

          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {item.productName}
                  </p>
                  <p
                    className="text-xs opacity-60"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {Object.entries(item.variantAttributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {item.quantity} × {item.price.toFixed(2)} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="border-t pt-4 space-y-2"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div
              className="flex justify-between text-sm opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              <span>Ara Toplam</span>
              <span>{totalPrice.toFixed(2)} ₺</span>
            </div>
            <div
              className="flex justify-between text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              <span className="opacity-70">Kargo</span>
              <span className="text-green-600">Ücretsiz</span>
            </div>
            <div
              className="flex justify-between font-bold text-lg pt-2"
              style={{ color: 'var(--color-text)' }}
            >
              <span>Toplam</span>
              <span style={{ color: 'var(--color-primary)' }}>
                {totalPrice.toFixed(2)} ₺
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId || loading}
            className="w-full mt-6 py-4 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
          >
            {loading ? 'İşleniyor...' : 'Siparişi Onayla'}
          </button>
        </div>
      </div>
    </main>
  );
}
