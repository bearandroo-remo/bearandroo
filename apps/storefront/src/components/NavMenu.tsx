'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export default function NavMenu({ categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const mainCategories = categories.filter((c) => !c.parentId);

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

            {/* Dropdown */}
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
                    style={{
                      color: 'var(--color-text)',
                      backgroundColor: 'transparent',
                    }}
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
