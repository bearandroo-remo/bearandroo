import Link from 'next/link';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/types';
import CartIcon from '@/components/CartIcon';

export default async function Header() {
  const categories = (await getCategories()) as Category[];
  const mainCategories = categories.filter((c) => !c.parentId);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-gray-900">
            Bearandroo
          </Link>

          {/* Kategoriler */}
          <nav className="hidden md:flex items-center gap-6">
            {mainCategories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition"
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
