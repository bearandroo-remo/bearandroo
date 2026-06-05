import Link from 'next/link';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/types';
import CartIcon from '@/components/CartIcon';

export default async function Header() {
  const categories = (await getCategories()) as Category[];
  const mainCategories = categories.filter((c) => !c.parentId);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-secondary)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl"
            style={{ color: 'var(--color-primary)' }}
          >
            Bearandroo
          </Link>

          {/* Kategoriler */}
          <nav className="hidden md:flex items-center gap-6">
            {mainCategories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="text-sm font-medium transition hover:opacity-70"
                style={{ color: 'var(--color-text)' }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Sepet */}
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
