'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, Variant, ProductImage } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] ?? null,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const variantImages = selectedVariant
    ? product.images.filter((i) => i.variantId === selectedVariant.id)
    : [];

  const displayImages =
    variantImages.length > 0
      ? [
          ...product.images.filter((i) => i.variantId === null),
          ...variantImages,
        ]
      : product.images;

  const currentImage = displayImages[selectedImageIndex] ?? displayImages[0];

  const price = selectedVariant ? parseFloat(selectedVariant.price) : null;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  const attributeKeys = Array.from(
    new Set(product.variants.flatMap((v) => Object.keys(v.attributes))),
  );

  const handleAttributeSelect = (key: string, value: string) => {
    const currentAttributes = selectedVariant?.attributes ?? {};
    const newAttributes = { ...currentAttributes, [key]: value };

    const newVariant = product.variants.find((v) =>
      Object.entries(newAttributes).every(
        ([k, val]) => v.attributes[k] === val,
      ),
    );



    if (newVariant) {
      setSelectedVariant(newVariant);
      setSelectedImageIndex(0);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const mainImage = displayImages[0];
    addItem(
      product,
      selectedVariant,
      mainImage?.thumbUrl ?? mainImage?.url ?? null,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Resimler */}
      <div>
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Resim yok
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image: ProductImage, index: number) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${
                index === selectedImageIndex
                  ? 'border-gray-900'
                  : 'border-transparent'
              }`}
            >
              <Image
                src={image.thumbUrl ?? image.url}
                alt={product.name}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Bilgileri */}
      <div>
        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>

        {price !== null && (
          <p className="text-2xl font-semibold text-gray-900 mb-6">
            {price.toFixed(2)} ₺
          </p>
        )}

        {product.description && (
          <p className="text-gray-600 mb-8">{product.description}</p>
        )}

        {attributeKeys.map((key) => {
          const values = Array.from(
            new Set(
              product.variants.map((v) => v.attributes[key]).filter(Boolean),
            ),
          );

          return (
            <div key={key} className="mb-6">
              <h3 className="font-semibold mb-3 capitalize">
                {key}:{' '}
                <span className="font-normal text-gray-600">
                  {selectedVariant?.attributes[key] ?? ''}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selectedVariant?.attributes[key] === value;
                  const isAvailable = product.variants.some(
                    (v) => v.attributes[key] === value && v.stock > 0,
                  );

                  return (
                    <button
                      key={value}
                      onClick={() => handleAttributeSelect(key, value)}
                      disabled={!isAvailable}
                      className={`border rounded-lg px-4 py-2 text-sm transition ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : isAvailable
                            ? 'border-gray-300 hover:border-gray-900'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {selectedVariant && (
          <p
            className={`text-sm mb-4 ${inStock ? 'text-green-600' : 'text-red-500'}`}
          >
            {inStock
              ? `Stokta var (${selectedVariant.stock} adet)`
              : 'Stokta yok'}
          </p>
        )}
        <button
          disabled={!inStock || added}
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-xl font-semibold transition ${
            added
              ? 'bg-green-600 text-white'
              : inStock
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {added ? '✓ Sepete Eklendi' : inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
}
