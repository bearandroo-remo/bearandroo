'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sepetiniz boş</h1>
        <p className="text-gray-500 mb-8">
          Alışverişe başlamak için ürünleri inceleyin.
        </p>
        <Link
          href="/"
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Alışverişe Başla
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ürünler */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
            >
              {item.imageUrl && (
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {Object.entries(item.variantAttributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
                <p className="font-semibold mt-1">{item.price.toFixed(2)} ₺</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Sipariş Özeti</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Ara Toplam</span>
            <span>{totalPrice.toFixed(2)} ₺</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-gray-600">Kargo</span>
            <span className="text-green-600">Ücretsiz</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
            <span>Toplam</span>
            <span>{totalPrice.toFixed(2)} ₺</span>
          </div>
          <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition">
            Ödemeye Geç
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Sepeti Temizle
          </button>
        </div>
      </div>
    </main>
  );
}
