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

export default function MobileMenu({ categories, headerLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const mainCategories = categories.filter((c) => !c.parentId);

  const links: HeaderLink[] =
    headerLinks && headerLinks.length > 0
      ? headerLinks
      : mainCategories.map((c) => ({
          label: c.name,
          type: 'category' as const,
          slug: c.slug,
          badge: undefined,
          highlight: false,
        }));

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 transition hover:opacity-70"
        style={{ color: 'var(--color-text)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 top-16"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      {open && (
        <div
          className="fixed top-16 left-0 right-0 z-50 shadow-lg overflow-y-auto max-h-[80vh]"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          {links.map((link, index) => {
            const category =
              link.type === 'category'
                ? mainCategories.find((c) => c.slug === link.slug)
                : null;
            const children = category
              ? categories.filter((c) => c.parentId === category.id)
              : [];

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
                style={{ borderBottom: '1px solid var(--color-secondary)' }}
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-medium"
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

                  {children.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category?.id
                            ? null
                            : (category?.id ?? null),
                        )
                      }
                      style={{ color: 'var(--color-text)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            expandedCategory === category?.id
                              ? 'M5 15l7-7 7 7'
                              : 'M19 9l-7 7-7-7'
                          }
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Alt Kategoriler */}
                {children.length > 0 && expandedCategory === category?.id && (
                  <div style={{ backgroundColor: 'var(--color-secondary)' }}>
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/kategori/${child.slug}`}
                        onClick={() => setOpen(false)}
                        className="block px-10 py-3 text-sm transition hover:opacity-70"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
