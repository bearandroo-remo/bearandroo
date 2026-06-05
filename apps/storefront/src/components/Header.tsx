import Link from 'next/link';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/types';
import CartIcon from '@/components/CartIcon';
import NavMenu from '@/components/NavMenu';

export default async function Header() {
  const categories = (await getCategories()) as Category[];

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

          {/* Nav Menu */}
          <NavMenu categories={categories} />

          {/* Sepet */}
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
