import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-secondary)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marka */}
          <div>
            <h3
              className="font-bold text-lg mb-4"
              style={{ color: 'var(--color-background)' }}
            >
              Bearandroo
            </h3>
            <p className="text-sm leading-relaxed opacity-80">
              Kaliteli tekstil ürünleri ile stilinizi tamamlayın.
            </p>
          </div>

          {/* Linkler */}
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: 'var(--color-background)' }}
            >
              Hızlı Linkler
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/kategori" className="hover:opacity-100 transition">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/sepet" className="hover:opacity-100 transition">
                  Sepet
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: 'var(--color-background)' }}
            >
              İletişim
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>info@bearandroo.com.tr</li>
              <li>bearandroo.com.tr</li>
            </ul>
          </div>
        </div>

        <div
          className="border-t mt-8 pt-8 text-center text-sm opacity-60"
          style={{ borderColor: 'var(--color-secondary)' }}
        >
          <p>© 2026 Bearandroo. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
