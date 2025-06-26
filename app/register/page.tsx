// app/register/page.tsx

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Yeni Hesap Oluştur
        </h1>
        <form className="space-y-6">
          {/* Ad Soyad Alanı */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input id="name" name="name" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          {/* E-posta Alanı */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta Adresi
            </label>
            <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          {/* Şifre Alanı */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          {/* Buton */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Üye Ol
            </button>
          </div>
        </form>
        
        {/* Giriş Yapma Linki */}
        <p className="text-sm text-center text-gray-600">
          Zaten bir hesabın var mı?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}