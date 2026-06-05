import Link from 'next/link';
import { getCategories, getTenantSettings } from '@/lib/api';
import type { Category } from '@/lib/types';
import CartIcon from '@/components/CartIcon';
import NavMenu from '@/components/NavMenu';
import MobileMenu from '@/components/MobileMenu';

export default async function Header() {
  const [categories, settings] = await Promise.all([
    getCategories() as Promise<Category[]>,
    getTenantSettings(),
  ]);

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
          <Link
            href="/"
            className="font-bold text-xl"
            style={{ color: 'var(--color-primary)' }}
          >
            Bearandroo
          </Link>

          <NavMenu
            categories={categories}
            headerLinks={(settings?.headerLinks as never) ?? null}
          />
          <MobileMenu
            categories={categories}
            headerLinks={(settings?.headerLinks as never) ?? null}
          />
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
