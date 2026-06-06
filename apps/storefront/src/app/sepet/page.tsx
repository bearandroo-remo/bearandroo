'use client';
export const runtime = 'edge';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();

  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <main
        className="max-w-6xl mx-auto px-6 py-16 text-center"
        style={{ color: 'var(--color-text)' }}
      >
        <h1 className="text-2xl font-bold mb-4">Sepetiniz boş</h1>
        <p className="mb-8 opacity-60">
          Alışverişe başlamak için ürünleri inceleyin.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-xl font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          Alışverişe Başla
        </Link>
      </main>
    );
  }

  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ color: 'var(--color-text)' }}
    >
      <h1 className="text-2xl font-bold mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ürünler */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="rounded-xl p-4 flex gap-4"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-secondary)',
              }}
            >
              {item.imageUrl && (
                <div
                  className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <Link
                  href={`/urun/${item.productSlug}`}
                  className="font-medium hover:underline"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.productName}
                </Link>
                <p className="text-sm mt-1 opacity-60">
                  {Object.entries(item.variantAttributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
                <p
                  className="font-semibold mt-1"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {item.price.toFixed(2)} ₺
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80"
                    style={{
                      border: '1px solid var(--color-secondary)',
                      color: 'var(--color-text)',
                    }}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80"
                    style={{
                      border: '1px solid var(--color-secondary)',
                      color: 'var(--color-text)',
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div
          className="rounded-xl p-6 h-fit"
          style={{
            backgroundColor: 'var(--color-secondary)',
            border: '1px solid var(--color-secondary)',
          }}
        >
          <h2
            className="font-bold text-lg mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Sipariş Özeti
          </h2>
          <div className="flex justify-between mb-2 opacity-70">
            <span>Ara Toplam</span>
            <span>{totalPrice.toFixed(2)} ₺</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="opacity-70">Kargo</span>
            <span className="text-green-600">Ücretsiz</span>
          </div>
          <div
            className="border-t pt-4 flex justify-between font-bold text-lg mb-6"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span>Toplam</span>
            <span style={{ color: 'var(--color-primary)' }}>
              {totalPrice.toFixed(2)} ₺
            </span>
          </div>
          <button
            onClick={() => router.push('/odeme')}
            className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
          >
            Ödemeye Geç
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm opacity-50 hover:opacity-80 transition"
            style={{ color: 'var(--color-text)' }}
          >
            Sepeti Temizle
          </button>
        </div>
      </div>
    </main>
  );
}
