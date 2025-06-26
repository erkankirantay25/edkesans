
import Link from 'next/link';

const profileNavLinks = [
  { name: 'Genel Bakış', href: '/profile' },
  { name: 'Siparişlerim', href: '/profile/orders' },
  { name: 'Adreslerim', href: '/profile/addresses' },
  { name: 'Hesap Bilgileri', href: '/profile/account' },
  { name: 'Favorilerim', href: '/profile/favorites' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sol Menü (Sidebar) */}
        <aside className="w-full md:w-1/4">
          <h2 className="text-xl font-bold mb-4">Hesabım</h2>
          <nav className="flex flex-col space-y-2">
            {profileNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                {link.name}
              </Link>
            ))}
            <button className="px-4 py-2 text-left text-red-600 rounded-md hover:bg-red-50">
              Çıkış Yap
            </button>
          </nav>
        </aside>

        {/* Sağ İçerik Alanı */}
        <main className="w-full md:w-3/4">
          {children} {/* Burası, aktif sayfaya göre değişecek olan içerik */}
        </main>
      </div>
    </div>
  );
}