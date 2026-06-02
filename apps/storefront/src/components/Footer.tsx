import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marka */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Bearandroo</h3>
            <p className="text-sm leading-relaxed">
              Kaliteli tekstil ürünleri ile stilinizi tamamlayın.
            </p>
          </div>

          {/* Linkler */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/kategori" className="hover:text-white transition">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/sepet" className="hover:text-white transition">
                  Sepet
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li>info@bearandroo.com.tr</li>
              <li>bearandroo.com.tr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2026 Bearandroo. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
