'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface HeaderLink {
  label: string;
  type: 'category' | 'collection' | 'brand' | 'custom';
  slug?: string;
  url?: string;
  badge?: string;
  highlight?: boolean;
}

interface Props {
  categories: Category[];
  headerLinks?: HeaderLink[] | null;
}

export default function NavMenu({ categories, headerLinks }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const mainCategories = categories.filter((c) => !c.parentId);

  // headerLinks varsa ondan render et
  if (headerLinks && headerLinks.length > 0) {
    return (
      <nav className="hidden md:flex items-center gap-6 relative">
        {headerLinks.map((link, index) => {
          // Kategori tipinde ise dropdown ekle
          const category =
            link.type === 'category'
              ? mainCategories.find((c) => c.slug === link.slug)
              : null;
          const children = category
            ? categories.filter((c) => c.parentId === category.id)
            : [];
          const isActive = activeCategory === (link.slug ?? String(index));

          const href =
            link.type === 'custom'
              ? (link.url ?? '/')
              : link.type === 'category'
                ? `/kategori/${link.slug}`
                : link.type === 'collection'
                  ? `/koleksiyon/${link.slug}`
                  : `/marka/${link.slug}`;

          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveCategory(link.slug ?? String(index))}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={href}
                className="text-sm font-medium transition hover:opacity-70 py-4 flex items-center gap-1"
                style={{
                  color: link.highlight
                    ? 'var(--color-accent)'
                    : 'var(--color-text)',
                }}
              >
                {link.label}
                {link.badge && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-background)',
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>

              {children.length > 0 && isActive && (
                <div
                  className="absolute top-full left-0 rounded-xl shadow-lg py-2 min-w-40 z-50"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-secondary)',
                  }}
                >
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/kategori/${child.slug}`}
                      className="block px-4 py-2 text-sm transition hover:opacity-70"
                      style={{ color: 'var(--color-text)' }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          'var(--color-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          'transparent';
                      }}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  // headerLinks yoksa default kategorileri göster
  return (
    <nav className="hidden md:flex items-center gap-6 relative">
      {mainCategories.map((cat: Category) => {
        const children = categories.filter((c) => c.parentId === cat.id);
        const isActive = activeCategory === cat.id;

        return (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => setActiveCategory(cat.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              href={`/kategori/${cat.slug}`}
              className="text-sm font-medium transition hover:opacity-70 py-4 block"
              style={{ color: 'var(--color-text)' }}
            >
              {cat.name}
            </Link>

            {children.length > 0 && isActive && (
              <div
                className="absolute top-full left-0 rounded-xl shadow-lg py-2 min-w-40 z-50"
                style={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-secondary)',
                }}
              >
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/kategori/${child.slug}`}
                    className="block px-4 py-2 text-sm transition hover:opacity-70"
                    style={{ color: 'var(--color-text)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        'var(--color-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        'transparent';
                    }}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
